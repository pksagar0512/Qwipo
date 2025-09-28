import { recommendationMap } from "../utils/recommendationMap.js";
import Product from "../models/Product.js";

export const getRecommendations = async (productName) => {
  const key = productName.toLowerCase();
  const relatedNames = recommendationMap[key] || [];

  // Find products whose name matches any of the related items
  const recommendedProducts = await Product.find({
    name: { $in: relatedNames },
  });

  return recommendedProducts;
};