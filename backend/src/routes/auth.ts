import express from "express";
import { check } from "express-validator";
import { login, validateToken, logout } from "../controllers/authController";
import verifyToken, { checkBlockedStatus } from "../middleware/auth";

const router = express.Router();

router.post(
    "/login",
    [
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
    ],
    login
);

router.get("/validate-token", verifyToken, checkBlockedStatus, validateToken);

router.post("/logout", logout);

export default router;
