import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/brands", async (req, res) => {
  try {
    const results = await User.find({ role: "manufacturer", category: "Clothing" });
    console.log(" Brands found:", results);
    res.json(results);
  } catch (err) {
    console.error("Query failed:", err.message);
    res.status(500).json({ message: "Query failed" });
  }
});

export default router;