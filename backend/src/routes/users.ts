import express from "express";
import { check } from "express-validator";
import { register } from "../controllers/userController";

const router = express.Router();

router.post("/register", [
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
    check("mobile", "Invalid Mobile Number").matches(/^\d{10}$/),
], register);

export default router;
