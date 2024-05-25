import express from "express";
import { getUsers, toggleUserStatus } from "../controllers/adminController";

const router = express.Router();

router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;