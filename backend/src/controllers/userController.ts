import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTP, storeOTP, verifyOtp } from "../utils/otp";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/resetPassword";
import bcrypt from "bcryptjs";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const getCurrentUser = async (req: Request, res: Response) => {
  const userID = req.userID;

  try {
    const user = await User.findById(userID).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching User Details" });
  }
};

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User(req.body);
    const referrerCode = req.body.referralCode;
    if (referrerCode) {
      const referrer = await User.findOne({ referralCode: referrerCode });
      if (referrer) {
        user.isReferred = true;
        user.wallet += 100;
        user.walletHistory.push({
          date: new Date(),
          amount: 100,
          message: "Join bonus",
        });
        referrer.wallet += 200;
        referrer.walletHistory.push({
          date: new Date(),
          amount: 200,
          message: "Referral bonus",
        });
        await referrer.save();
      } else {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    await user.save();

    const otp = generateOTP();
    storeOTP(user.email, otp);
    await sendOTP(user.email, otp);

    return res
      .status(200)
      .send({ message: "OTP sent to your email address", email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (verifyOtp(email, otp)) {
      user.isVerified = true;
      await user.save();

      const token = jwt.sign(
        { userID: user.id, role: user.isAdmin ? "admin" : "user" },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
        sameSite: "none",
      });

      return res.status(200).send({ message: "User registration successful" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    storeOTP(user.email, otp);
    await sendOTP(user.email, otp);

    return res
      .status(200)
      .send({ message: "OTP resent to your email address", email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    await sendResetPasswordEmail(email, token);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    let securePassword = await bcrypt.hash(password, 8);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { password: securePassword } }
    );

    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userID = req.userID;

    const user = await User.findById(userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const userID = req.userID;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          mobile: req.body.mobile,
        },
      },
      { new: true }
    );

    res.status(200).json();
  } catch (error) {
    console.log(error);
  }
};

export const getWallet = async (req: Request, res: Response) => {
  try {
    const userID = req.userID;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const sortedWalletHistory = user.walletHistory.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    res.json({
      wallet: user.wallet,
      walletHistory: sortedWalletHistory,
    });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword).find({
      isAdmin: false,
      _id: { $ne: req.userID },
    });
    res.send(users);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ subscriptionPlan: user.subscriptionPlan });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    if (req.method != "POST") return res.status(400);
    const { email, paymentMethod, planId, price } = req.body;

    const priceInPaisa = price * 100;

    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethod.id,
      invoice_settings: { default_payment_method: paymentMethod.id },
    });

    const product = await stripe.products.create({
      name: "Monthly subscription",
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "inr",
            product: product.id,
            unit_amount: priceInPaisa,
            recurring: {
              interval: "month",
            },
          },
        },
      ],

      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    const latestInvoice = subscription.latest_invoice;
    let client_secret: string | undefined;

    if (typeof latestInvoice === "object" && latestInvoice?.payment_intent) {
      const paymentIntent = latestInvoice.payment_intent;

      if (typeof paymentIntent === "object" && paymentIntent.client_secret) {
        client_secret = paymentIntent.client_secret;
      }
    }

    res.json({
      message: "Subscription successfully initiated",
      subscriptionId: subscription.id,
      client_secret,
      status: "success",
    });

    await User.findOneAndUpdate(
      { email },
      {
        subscriptionPlan:
          planId === "price_pro"
            ? "pro"
            : planId === "price_business"
            ? "business"
            : "basic",
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getManagerDetails = async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID).select("email");

    if (!user) {
      return res.status(404).json({ message: "Manager not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching manager details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
