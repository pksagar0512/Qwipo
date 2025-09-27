import User from "../models/User.js";

export const getBrandsByCategory = async (req, res) => {
  const { category } = req.query;
  console.log("🔍 Incoming category:", category);

  try {
    const brands = await User.find({
      role: "manufacturer",
      category: category,
    }).select("brandName category");

    console.log("✅ Brands found:", brands);
    res.json(brands);
  } catch (err) {
    console.error("❌ Brand fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};