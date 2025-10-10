import express from "express";
import { createRazorpayOrder, verifyPayment, razorpayWebhook, downloadInvoice } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import bodyParser from "body-parser";

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);

// webhook needs raw body — mount separately in server.js using bodyParser.raw
router.post("/webhook", bodyParser.raw({ type: "*/*" }), razorpayWebhook);

router.get("/invoice/:id", protect, downloadInvoice);

export default router;
