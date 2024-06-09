import express from "express";
import verifyToken from "../middleware/auth";
import { cancelBooking, getMyBookings } from "../controllers/myBookingsController";

const router = express.Router();

router.get("/", verifyToken, getMyBookings);

router.post("/cancel-booking", verifyToken, cancelBooking);

export default router;