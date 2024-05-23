import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTP, storeOTP, verifyOtp } from "../utils/otp";

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
        return res.status(200).send({ message: "OTP sent to your email address" });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong!" });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    console.log('Request Body:', req.body); // Log the incoming request body
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
