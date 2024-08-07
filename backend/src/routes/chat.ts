import express from "express";
import { accessChat, fetchChats } from "../controllers/chatController";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.route("/").post(verifyToken, accessChat);
router.route("/").get(verifyToken, fetchChats);

export default router;
