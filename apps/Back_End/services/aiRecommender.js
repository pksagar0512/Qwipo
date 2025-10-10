import mongoose from "mongoose";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import { recommendationMap } from "../utils/recommendationMap.js";

export const getSmartRecommendations = async (productName) => {
  if (!productName) return [];

  const key = String(productName).toLowerCase();
  const baseRecs = recommendationMap[key] || [];
  const allOrders = await Purchase.find().lean();
  const referencedIds = new Set();

  allOrders.forEach((order) => {
    if (!order.cart || !Array.isArray(order.cart)) return;
    for (const c of order.cart) {
      const prod = c.product;
      if (prod && mongoose.Types.ObjectId.isValid(prod)) {
        referencedIds.add(String(prod));
      } else if (prod && prod._id && mongoose.Types.ObjectId.isValid(prod._id)) {
        referencedIds.add(String(prod._id));
      }
    }
  });

  const idToName = {};
  if (referencedIds.size > 0) {
    const ids = Array.from(referencedIds);
    const prods = await Product.find({ _id: { $in: ids } }).select("name").lean();
    for (const p of prods) idToName[String(p._id)] = (p.name || "").toLowerCase();
  }

  const pairs = {};
  for (const order of allOrders) {
    if (!order.cart || !Array.isArray(order.cart)) continue;
    const names = [];
    for (const c of order.cart) {
      if (c && mongoose.Types.ObjectId.isValid(c.product)) {
        const nm = idToName[String(c.product)];
        if (nm) names.push(nm);
        continue;
      }
      if (c && typeof c.product === "object" && c.product !== null && c.product.name) {
        names.push(String(c.product.name).toLowerCase());
        continue;
      }
      if (c && (c.productName || c.name)) {
        const nm = String(c.productName || c.name).toLowerCase();
        names.push(nm);
        continue;
      }
      if (c && c.productId && mongoose.Types.ObjectId.isValid(c.productId)) {
        const nm = idToName[String(c.productId)];
        if (nm) names.push(nm);
      }
    }

    const uniqueNames = Array.from(new Set(names));
    for (let i = 0; i < uniqueNames.length; i++) {
      for (let j = 0; j < uniqueNames.length; j++) {
        if (i === j) continue;
        const a = uniqueNames[i];
        const b = uniqueNames[j];
        pairs[a] = pairs[a] || {};
        pairs[a][b] = (pairs[a][b] || 0) + 1;
      }
    }
  }

  const learned = pairs[key]
    ? Object.entries(pairs[key])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([prodName]) => prodName)
    : [];

  const combinedNames = [...new Set([...baseRecs.map((r) => r.toLowerCase()), ...learned])];
  if (!combinedNames.length) return [];

  const recProducts = await Product.find({
    name: { $in: combinedNames.map((n) => new RegExp(`^${escapeRegExp(n)}$`, "i")) },
  }).select("_id name price image category").lean();

  return recProducts;
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
