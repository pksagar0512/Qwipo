import express from "express";
import {
  addProduct,
  getProductsByManufacturer,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", protect, addProduct);

router.get("/me", protect, getProductsByManufacturer);

router.get("/", async (req, res) => {
  const { brand } = req.query;
  try {
    const products = await Product.find({ brand });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

export default router;