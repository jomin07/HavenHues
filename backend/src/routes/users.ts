import express from "express";
import { check } from "express-validator";
import { getAllHotels, getCurrentUser, getProfile, register,requestPasswordReset,resendOTP,resetPassword,updateUser,verifyOTP } from "../controllers/userController";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser);

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

router.post("/request-password-reset", [
    check("email", "Email is required").isEmail()
], requestPasswordReset);

router.post("/reset-password", [
    check("token", "Token is required").not().isEmpty(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6 })
], resetPassword);

router.get("/profile", [
], getProfile);
router.put('/update', updateUser);

router.get("/hotels", [
], getAllHotels);

export default router;
