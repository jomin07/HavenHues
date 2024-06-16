import express from "express";
import { addCoupon, approveHotel, getBookings, getCouponById, getCoupons, getHotelById, getHotels, getHotelsCount, getRevenue, getTopBookingHotels, getUsers, getUsersCount, toggleCouponStatus, toggleHotelStatus, toggleUserStatus, updateCouponById } from "../controllers/adminController";

const router = express.Router();

router.get('/users-count', getUsersCount);
router.get('/hotels-count', getHotelsCount);
router.get('/revenue', getRevenue);
router.get('/top-booking-hotels', getTopBookingHotels);


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

router.get('/bookings', getBookings);

export default router;