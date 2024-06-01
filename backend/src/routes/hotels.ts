import express from "express";
import { getHotelDetails, getSearchResults } from "../controllers/hotelController";
import { param } from "express-validator"

const router = express.Router();

router.get("/search", getSearchResults);

router.get("/:id",[
    param("id").notEmpty().withMessage("Hotel ID is required")
], getHotelDetails);

export default router;
