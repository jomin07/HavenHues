import express from "express";
import verifyToken from "../middleware/auth";
import { getAllMessages, sendMessage } from "../controllers/messageController";

const router = express.Router();

router.route("/:chatId").get(verifyToken, getAllMessages);
router.route("/").post(verifyToken, sendMessage);

export default router;
