import express from "express";
import { getProductRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/:productName", getProductRecommendations);

export default router;