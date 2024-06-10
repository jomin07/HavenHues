import express from "express";
import { addCoupon, approveHotel, getCouponById, getCoupons, getHotelById, getHotels, getUsers, toggleCouponStatus, toggleHotelStatus, toggleUserStatus, updateCouponById } from "../controllers/adminController";

const router = express.Router();

router.get('/coupons', getCoupons);
router.post('/coupons', addCoupon);
router.get('/coupons/:id', getCouponById);
router.put('/coupons/:id', updateCouponById);
router.put('/coupons/:id/toggle-status', toggleCouponStatus);

router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);
router.put('/hotels/:id/toggle-status', toggleHotelStatus);
router.put('/hotels/:id/approve', approveHotel);

router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;