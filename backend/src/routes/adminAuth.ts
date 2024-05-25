import express from "express";
import { check } from "express-validator";
import { adminLogin, adminLogout, validateAdminToken } from "../controllers/adminAuthController";
import verifyAdminToken from "../middleware/adminAuth";

const router = express.Router();

router.post(
    "/admin-login",
    [
        check("email", "Email is required").isEmail(),
        check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
    ],
    adminLogin
);

router.get("/validate-adminToken", verifyAdminToken,validateAdminToken );

router.post("/admin-logout", adminLogout);

export default router;
