import { getRecommendations } from "../services/recommendationService.js";

export const getProductRecommendations = async (req, res) => {
  const { productName } = req.params;
  try {
    const suggestions = await getRecommendations(productName);
    res.json({ recommendations: suggestions });
  } catch (err) {
    console.error("Recommendation error:", err.message);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};