import express from "express";
import { addCoupon, getCouponById, getCoupons, getUsers, toggleUserStatus } from "../controllers/adminController";

const router = express.Router();

router.get('/coupons', getCoupons);
router.post('/coupons', addCoupon);
router.get('/coupons/:id', getCouponById);

router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;