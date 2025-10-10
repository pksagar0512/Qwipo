import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { handleQwiChat } from "../controllers/qwiChatController.js";

const router = express.Router();

// protect so req.user (and category) is available
router.post("/", protect, handleQwiChat);

export default router;
