import express from "express";
import {
  addProduct,
  getProductsByManufacturer,
  getProductsByRetailerCategory,
  getBrandsByCategory,
} from "../controllers/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/me", protect, getProductsByManufacturer);
router.get("/retailer-products", protect, getProductsByRetailerCategory);

router.get("/brand/:brandName", async (req, res) => {
  try {
    const { brandName } = req.params;
    const products = await Product.find({ brand: brandName });
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch brand products:", err.message);
    res.status(500).json({ message: "Failed to fetch brand products" });
  }
});

// NEW: brands list by category (manufacturers)
router.get("/brands/category/:category", protect, getBrandsByCategory);

// generic fetch with ?brand= query (keeps compatibility)
router.get("/", async (req, res) => {
  const { brand } = req.query;
  try {
    const products = brand ? await Product.find({ brand }) : await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

export default router;
