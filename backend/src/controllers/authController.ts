import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Check if the user is blocked
        if (user.isBlocked) {
            return res.status(401).json({ message: "Your account has been blocked. Please contact support for assistance." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { 
                userID: user.id,
                role: user.isAdmin ? "admin" : "user"
            },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        res.status(200).json({ userID: user._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};

export const validateToken = (req: Request, res: Response) => {
    res.status(200).send({ userID: req.userID });
};

export const logout = (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });
    res.send();
};

export const google = async ( req: Request, res: Response ) => {
    const { email, name } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
            { userID: user.id,role: user.isAdmin ? "admin" : "user" },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "1d",
            }
        );
        const { password, ...rest } = user.toJSON();
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        res.status(200).json({ userID: user._id });
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          firstName:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          lastName:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          mobile: "9874563215",
          password: hashedPassword,
          isVerified: true
        });
        await newUser.save();

        const token = jwt.sign(
            { userID: newUser._id, role: newUser.isAdmin ? "admin" : "user" },
            process.env.JWT_SECRET_KEY as string,
            {
                expiresIn: "1d",
            }
        );
        const { password, ...rest } = newUser.toJSON();
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });
        res.status(200).json({ userID: newUser._id });
      }
    } catch (error) {
      console.log(error);
    }
};