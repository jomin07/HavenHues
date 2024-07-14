import express from "express";
import multer from "multer";
import { body } from "express-validator";
import {
  createHotel,
  getHotelBookings,
  getHotelDetails,
  getHotels,
  handleCancellation,
  updateHotelDetails,
} from "../controllers/myHotelController";
import verifyToken from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
    body("extraBedCount")
      .optional()
      .isNumeric()
      .withMessage("Extra bed count must be a number"),
    body("extraBedCharge")
      .optional()
      .isNumeric()
      .withMessage("Extra bed charge must be a number"),
  ],
  upload.array("imageFiles", 6),
  createHotel
);

router.get("/", verifyToken, getHotels);

router.get("/:id", verifyToken, getHotelDetails);

router.put(
  "/:hotelID",
  verifyToken,
  upload.array("imageFiles"),
  updateHotelDetails
);

router.get("/:hotelId/bookings", getHotelBookings);

router.post("/handle-cancellation", handleCancellation);

export default router;
