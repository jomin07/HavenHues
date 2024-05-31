import express from "express";
import { getSearchResults } from "../controllers/hotelController";

const router = express.Router();

router.get("/search", getSearchResults);

export default router;
