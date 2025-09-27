import express from "express";
import { placeOrder } from "../controllers/orderControllers.js";
const router = express.Router();

router.post("/", placeOrder); // /api/orders
export default router;