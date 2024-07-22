import express from "express";
import {
  applyCoupon,
  createRoomBooking,
  getAllHotels,
  getAvailableCoupons,
  getBookedDates,
  getHotelDetails,
  getPaymentIntent,
  getSearchResults,
} from "../controllers/hotelController";
import { param } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/search", getSearchResults);

router.get("/", getAllHotels);

router.get("/coupons", getAvailableCoupons);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  getHotelDetails
);

router.post("/:hotelID/bookings/payment-intent", verifyToken, getPaymentIntent);

router.post("/:hotelID/bookings/apply-coupon", verifyToken, applyCoupon);

router.post("/:hotelID/bookings/", verifyToken, createRoomBooking);

router.get("/:hotelID/booked-dates", getBookedDates);

export default router;
