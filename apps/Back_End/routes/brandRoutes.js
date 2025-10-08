import express from "express";
import { getBrandsByCategory } from "../controllers/brandControllers.js";
const router = express.Router();

router.get("/", getBrandsByCategory); 
export default router;