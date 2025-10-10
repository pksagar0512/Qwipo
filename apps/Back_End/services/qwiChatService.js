import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ChatSession from "../models/ChatSession.js";
import mongoose from "mongoose";
import { recommendationMap } from "../utils/recommendationMap.js";

// --------------------- Utility Functions ---------------------
function cleanupText(t) {
  return (t || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
}

function toObjectIdSafe(id) {
  try {
    if (!id) return null;
    if (
      typeof id === "object" &&
      (id._bsontype === "ObjectID" ||
        id._bsontype === "ObjectId" ||
        (id.constructor && id.constructor.name === "ObjectId"))
    )
      return id;
    return new mongoose.Types.ObjectId(String(id));
  } catch {
    return null;
  }
}

function getUserCategory(user) {
  if (!user) return undefined;
  return user.category || user.retailerType || user.retailer_type || undefined;
}

function filterByUserCategory(products, user) {
  const cat = getUserCategory(user);
  if (!cat) return products || [];
  return (products || []).filter(
    (p) =>
      String(p.category || "").toLowerCase() === String(cat).toLowerCase()
  );
}

// --------------------- Database Queries ---------------------
async function findProductsByFuzzyName(name, brandFilter, categoryFilter, limit = 12) {
  const cleaned = cleanupText(name);
  if (!cleaned) return [];
  const regex = new RegExp(cleaned.split(/\s+/).join(".*"), "i");
  const query = { name: regex };
  if (brandFilter) query.brand = brandFilter;
  if (categoryFilter) query.category = categoryFilter;
  return await Product.find(query).limit(limit).lean();
}

async function getTrendingProducts({ category, limit = 8 }) {
  const match = {};
  if (category) match["items.category"] = category;

  const agg = [
    { $unwind: "$items" },
    { $match: match },
    {
      $group: { _id: "$items._id", totalQty: { $sum: "$items.quantity" } },
    },
    { $sort: { totalQty: -1 } },
    { $limit: limit },
  ];
  const rows = await Order.aggregate(agg);
  const ids = rows.map((r) => toObjectIdSafe(r._id)).filter(Boolean);
  const products = await Product.find({ _id: { $in: ids } }).lean();
  return filterByUserCategory(products, { category });
}

async function getRecentProducts({ category, limit = 8 }) {
  const q = {};
  if (category) q.category = category;
  return await Product.find(q).sort({ createdAt: -1 }).limit(limit).lean();
}

async function getReorderOptionsForRetailer(retailerId, months = 1) {
  const since = new Date();
  since.setMonth(since.getMonth() - months);
  const orders = await Order.find({ buyer: retailerId, createdAt: { $gte: since } }).lean();
  const tally = {};
  orders.forEach((o) =>
    (o.items || []).forEach((it) => {
      const id = it._id?.toString() || it.productId?.toString();
      if (!id) return;
      tally[id] = (tally[id] || 0) + (it.quantity || 1);
    })
  );
  const ids = Object.keys(tally);
  const products = await Product.find({ _id: { $in: ids } }).lean();
  return products;
}

// --------------------- ChatSession Helpers ---------------------
async function appendToSession(sessionId, role, text, meta = {}) {
  if (!sessionId)
    sessionId = `s_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  let session = await ChatSession.findOne({ sessionId });
  if (!session) session = await ChatSession.create({ sessionId, messages: [] });
  session.messages.push({ role, text, meta });
  await session.save();
  return session;
}

async function getSession(sessionId) {
  return await ChatSession.findOne({ sessionId }).lean();
}

// --------------------- Main Smart Recommendation Logic ---------------------
export async function getSmartRecommendationsForMessage(message, { user, sessionId } = {}) {
  const text = cleanupText(message);
  if (!text) return { type: "none", products: [], reply: "Can you clarify what you’re looking for?" };

  const userCat = getUserCategory(user);
  const session = await getSession(sessionId);

  // Context retention
  let lastQuery = session?.messages?.slice(-1)[0]?.text || "";

  // Handle “reorder” intent
  if (/reorder|re-order|restock/.test(text)) {
    const products = await getReorderOptionsForRetailer(user?._id);
    return { type: "reorder", products, reply: "Here are your most reordered items." };
  }

  // Handle “trending” intent
  if (/trending|popular|most ordered|top sellers/.test(text)) {
    const [mostOrdered, recent] = await Promise.all([
      getTrendingProducts({ category: userCat, limit: 10 }),
      getRecentProducts({ category: userCat, limit: 10 }),
    ]);
    const seen = new Set();
    const combined = [...mostOrdered, ...recent].filter((p) => {
      if (!p || !p._id) return false;
      const id = p._id.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    return {
      type: "trending-combined",
      products: combined,
      reply: "These are the trending and newly added products in your category.",
    };
  }

  // Handle “alternatives” intent
  if (/alternative|similar|cheaper|lower price/.test(text)) {
    const match = text.match(/for (.+)$/);
    const target = match ? match[1] : lastQuery || text;
    const baseProds = await findProductsByFuzzyName(target, undefined, userCat);
    if (!baseProds.length) return { type: "none", products: [], reply: "Couldn't find alternatives right now." };
    const price = baseProds[0].price || 0;
    const cheaper = await Product.find({
      category: userCat,
      price: { $lt: price },
    })
      .sort({ price: -1 })
      .limit(8)
      .lean();
    return { type: "alternatives", products: cheaper, reply: "Here are some affordable alternatives." };
  }

  // RecommendationMap logic
  for (const [key, values] of Object.entries(recommendationMap)) {
    if (text.includes(key)) {
      const found = [];
      for (const v of values) {
        const res = await findProductsByFuzzyName(v, undefined, userCat);
        found.push(...res);
      }
      return {
        type: "map",
        products: found.slice(0, 12),
        reply: "You might also like these related items.",
      };
    }
  }

  // Default: fuzzy product search
  const prods = await findProductsByFuzzyName(text, undefined, userCat, 12);
  if (prods.length)
    return {
      type: "search",
      products: prods,
      reply: "Here’s what I found:",
    };

  return { type: "none", products: [], reply: "Sorry, I couldn’t find anything for that." };
}

// --------------------- Exports ---------------------
export {
  findProductsByFuzzyName,
  getTrendingProducts,
  getRecentProducts,
  getReorderOptionsForRetailer,
  appendToSession,
  getSession,
};
