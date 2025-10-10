// Back_End/controllers/recommendationController.js
import { getSmartRecommendations } from "../services/aiRecommender.js";

export const getProductRecommendations = async (req, res) => {
  const { productName } = req.params;
  try {
    const recs = await getSmartRecommendations(productName);
    res.json({ recommendations: recs });
  } catch (err) {
    console.error("Recommendation error:", err.message);
    res.status(500).json({ message: "Failed to fetch smart recommendations" });
  }
};
