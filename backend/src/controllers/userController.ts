import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTP, storeOTP, verifyOtp } from "../utils/otp";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/resetPassword";
import bcrypt from "bcryptjs";
import Hotel from "../models/hotel";

export const getCurrentUser = async(req: Request, res: Response) =>{
    const userID = req.userID;

    try {
        const user = await User.findById(userID).select("-password");
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching User Details"})
    }
}

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
        await user.save();

        const otp = generateOTP();
        storeOTP(user.email, otp); // Store OTP in memory
        await sendOTP(user.email, otp); // Send OTP via email
        
        return res.status(200).send({ message: "OTP sent to your email address", email: user.email });
        
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
                { userID: user.id },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1d" }
            );

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000,
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
        storeOTP(user.email, otp); // Store OTP in memory
        await sendOTP(user.email, otp); // Send OTP via email

        return res.status(200).send({ message: "OTP resent to your email address", email: user.email });
        
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
        if(!user){
            return res.status(400).json({ message: "User not found" })
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save();

        await sendResetPasswordEmail(email, token);

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong!" });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    const { token, password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        let securePassword = await bcrypt.hash(password, 8); 
        user.resetPasswordToken = '';
        user.resetPasswordExpires = null;
        await User.findByIdAndUpdate({_id: user._id},{$set: {password: securePassword}});

        await user.save();

        res.status(200).json({ message: "Password has been reset" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong!" });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userID: string };
        const userID = decodedToken.userID;

        const user = await User.findById(userID).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateUser = async ( req: Request, res: Response ) =>{
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userID: string };
        const userID = decodedToken.userID;

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
                }
            },
            { new: true }
        );

        res.status(200).json();
    } catch (error) {
        console.log(error);
        
    }
}

export const getAllHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
};