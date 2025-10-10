import express from "express";
import { placeOrder, getMyOrders } from "../controllers/orderControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Protect the route so req.user is available
router.post("/", protect, placeOrder);

// ✅ Optional: View past orders
router.get("/my-orders", protect, getMyOrders);

export default router;