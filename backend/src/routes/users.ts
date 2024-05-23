import express from "express";
import { check } from "express-validator";
import { register,resendOTP,verifyOTP } from "../controllers/userController";

const router = express.Router();

router.post("/register", [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
    check("mobile", "Invalid Mobile Number").matches(/^\d{10}$/),
], register);

router.post("/verify-otp", [
    check("email", "Email is required").isEmail(),
    check("otp", "OTP is required").isString(),
], verifyOTP);

router.post("/resend-otp", [
    check("email", "Email is required").isEmail(),
], resendOTP);

export default router;
