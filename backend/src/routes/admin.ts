import express from "express";
import { addCoupon, getCouponById, getCoupons, getUsers, toggleCouponStatus, toggleUserStatus, updateCouponById } from "../controllers/adminController";

const router = express.Router();

router.get('/coupons', getCoupons);
router.post('/coupons', addCoupon);
router.get('/coupons/:id', getCouponById);
router.put('/coupons/:id', updateCouponById);
router.put('/coupons/:id/toggle-status', toggleCouponStatus);

router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;