import express from "express";
import { handleQwiChat } from "../controllers/qwiChatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", protect, handleQwiChat);
export default router;
