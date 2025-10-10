import Product from "../models/Product.js";
import Order from "../models/Order.js";
import ChatSession from "../models/ChatSession.js";
import mongoose from "mongoose";
import { recommendationMap } from "../utils/recommendationMap.js";

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

async function findProductsByFuzzyName(name, brandFilter, categoryFilter, limit = 12) {
  try {
    const cleaned = cleanupText(name);
    if (!cleaned) return [];
    const words = cleaned.split(/\s+/).filter(Boolean);
    if (!words.length) return [];

    const regex = new RegExp(words.join(".*"), "i");
    const query = { name: regex };
    if (brandFilter) query.brand = brandFilter;
    if (categoryFilter) query.category = categoryFilter;
    let prods = await Product.find(query).limit(limit).lean();
    if (prods.length) return prods;

    const or = words.slice(0, 6).map((w) => ({ name: { $regex: w, $options: "i" } }));
    const q = { $or: or };
    if (brandFilter) q.brand = brandFilter;
    if (categoryFilter) q.category = categoryFilter;
    prods = await Product.find(q).limit(limit).lean();
    return prods;
  } catch (err) {
    console.error("findProductsByFuzzyName error:", err);
    return [];
  }
}

async function getTrendingProducts({ category, brand, limit = 8 } = {}) {
  try {
    const match = {};
    if (brand) match["items.brand"] = brand;
    if (category) match["items.category"] = category;

    const agg = [
      { $unwind: "$items" },
      {
        $addFields: {
          productRef: {
            $cond: [{ $ifNull: ["$items._id", false] }, "$items._id", "$items.productId"],
          },
        },
      },
      { $match: match },
      { $group: { _id: "$productRef", totalQty: { $sum: "$items.quantity" } } },
      { $sort: { totalQty: -1 } },
      { $limit: limit },
    ];

    const rows = await Order.aggregate(agg);
    const ids = rows
      .map((r) => (r && r._id != null ? toObjectIdSafe(r._id) : null))
      .filter(Boolean);

    if (!ids.length) return [];

    const products = await Product.find({ _id: { $in: ids }, ...(category ? { category } : {}) }).lean();
    const byId = products.reduce((acc, p) => {
      acc[p._id.toString()] = p;
      return acc;
    }, {});
    return rows.map((r) => byId[String(r._id)]).filter(Boolean);
  } catch (err) {
    console.error("getTrendingProducts error:", err);
    return [];
  }
}

async function getRecentProducts({ category, brand, limit = 8 } = {}) {
  try {
    const q = {};
    if (category) q.category = category;
    if (brand) q.brand = brand;
    return await Product.find(q).sort({ createdAt: -1 }).limit(limit).lean();
  } catch (err) {
    console.error("getRecentProducts error:", err);
    return [];
  }
}

async function getReorderOptionsForRetailer(retailerId, { months = 1, limit = 12 } = {}) {
  try {
    if (!retailerId) return [];
    const since = new Date();
    since.setMonth(since.getMonth() - months);
    const orders = await Order.find({ buyer: retailerId, createdAt: { $gte: since } }).lean();
    const tally = {};
    (orders || []).forEach((o) => {
      (o.items || []).forEach((it) => {
        const id = (it._id && it._id.toString && it._id.toString()) || (it.productId && it.productId.toString());
        if (!id) return;
        tally[id] = (tally[id] || 0) + (it.quantity || 1);
      });
    });
    const ids = Object.keys(tally).sort((a, b) => tally[b] - tally[a]).slice(0, limit);
    if (!ids.length) return [];
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const byId = products.reduce((acc, p) => ((acc[p._id.toString()] = p), acc), {});
    return ids.map((id) => byId[id]).filter(Boolean);
  } catch (err) {
    console.error("getReorderOptionsForRetailer error:", err);
    return [];
  }
}

async function appendToSession(sessionId, role, text, meta = {}) {
  try {
    if (!sessionId) sessionId = `s_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({ sessionId, messages: [] });
    }
    session.messages.push({ role, text, meta });
    await session.save();
    return session;
  } catch (err) {
    console.error("appendToSession error:", err);
    return null;
  }
}

async function getSession(sessionId) {
  try {
    return await ChatSession.findOne({ sessionId }).lean();
  } catch (err) {
    console.error("getSession error:", err);
    return null;
  }
}

async function clearSession(sessionId) {
  try {
    return await ChatSession.findOneAndDelete({ sessionId });
  } catch (err) {
    console.error("clearSession error:", err);
    return null;
  }
}

const synonyms = {
  sharwani: "sherwani",
  sharwaniy: "sherwani",
  paijama: "pyjama",
  pajama: "pyjama",
  dupattaa: "dupatta",
  jutti: "jooti",
  kurta: "kurta",
  shalwar: "pyjama",
  maggi: "maggi",
};

function applySynonymsToText(t) {
  let out = t;
  Object.keys(synonyms).forEach((k) => {
    const re = new RegExp(`\\b${k}\\b`, "gi");
    out = out.replace(re, synonyms[k]);
  });
  return out;
}

function filterByUserCategory(products, user) {
  if (!user || !user.category) return products || [];
  return (products || []).filter((p) => String(p.category || "").toLowerCase() === String(user.category || "").toLowerCase());
}

async function getSmartRecommendationsForMessage(message, { user } = {}) {
  try {
    const raw = (message || "").toString();
    const cleaned = cleanupText(raw);
    if (!cleaned) return { type: "none", products: [] };

    const normalized = applySynonymsToText(cleaned);

    // If user explicitly asked "show/find/display/list/give me ..." then prefer direct fuzzy search
    const explicitShowMatch = raw.match(/\b(show|show me|find|display|list|give me|what is|what are)\b\s*(.*)/i);
    if (explicitShowMatch && explicitShowMatch[2]) {
      const targetPhrase = explicitShowMatch[2].trim();
      if (targetPhrase) {
        const products = await findProductsByFuzzyName(targetPhrase, undefined, user?.category, 20);
        const filtered = filterByUserCategory(products, user);
        if (filtered && filtered.length) return { type: "search", products: filtered.slice(0, 12) };
        // if explicit search doesn't find anything, continue to other logic (map/fuzzy/trending)
      }
    }

    async function resolveTargetProducts(phrase) {
      const p = applySynonymsToText(phrase);
      const candidates = await findProductsByFuzzyName(p, undefined, user?.category, 20);
      return filterByUserCategory(candidates, user);
    }

    async function sortProductsByOrderCount(products) {
      try {
        if (!products || products.length === 0) return products;
        const ids = products.map((p) => (p && p._id ? toObjectIdSafe(p._id) : null)).filter(Boolean);
        if (!ids.length) return products;
        const agg = [
          { $unwind: "$items" },
          { $match: { "items._id": { $in: ids } } },
          { $group: { _id: "$items._id", totalQty: { $sum: "$items.quantity" } } },
        ];
        const rows = await Order.aggregate(agg);
        const counts = {};
        (rows || []).forEach((r) => {
          counts[String(r._id)] = r.totalQty || 0;
        });
        products.sort((a, b) => (counts[b._id?.toString()] || 0) - (counts[a._id?.toString()] || 0));
        return filterByUserCategory(products, user);
      } catch (err) {
        console.error("sortProductsByOrderCount error:", err);
        return filterByUserCategory(products, user);
      }
    }

    function extractTargetAfterIntent(intentPattern, src) {
      const re = new RegExp(intentPattern, "i");
      return src.replace(re, "").trim();
    }

    // Trending with optional target: "trending sherwani"
    if (/\btrending\b|\bpopular\b|\bmost ordered\b|\btop sellers\b|\btop sold\b/.test(normalized)) {
      const target = extractTargetAfterIntent("\\b(trending|popular|most ordered|top sellers|top sold)\\b", normalized);
      if (target) {
        const resolved = await resolveTargetProducts(target);
        if (resolved.length) {
          const sorted = await sortProductsByOrderCount(resolved);
          return { type: "trending-target", products: sorted.slice(0, 12) };
        }
      }
      const products = await getTrendingProducts({ category: user?.category, brand: undefined, limit: 8 });
      return { type: "trending", products: filterByUserCategory(products, user) };
    }

    // Recent / latest with optional target
    if (/\brecent\b|\bnew\b|\brecently added\b|\blatest\b/.test(normalized)) {
      const target = extractTargetAfterIntent("\\b(recent|new|recently added|latest)\\b", normalized);
      if (target) {
        const resolved = await resolveTargetProducts(target);
        if (resolved.length) {
          resolved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          return { type: "recent-target", products: filterByUserCategory(resolved.slice(0, 12), user) };
        }
      }
      const products = await getRecentProducts({ category: user?.category, brand: undefined, limit: 8 });
      return { type: "recent", products: filterByUserCategory(products, user) };
    }

    // Reorder intent
    if (/\breorder\b|\bre-stock\b|\brestock\b|\blast month\b|reorder my|re-order/.test(normalized)) {
      const target = extractTargetAfterIntent("\\b(reorder|re-stock|restock|re-order|reorder my|last month)\\b", normalized);
      if (target) {
        const resolved = await resolveTargetProducts(target);
        if (resolved.length) {
          const productIds = resolved.map((p) => p._id.toString());
          const since = new Date();
          since.setMonth(since.getMonth() - 1);
          const orders = await Order.find({ buyer: user?._id, createdAt: { $gte: since } }).lean();
          const tally = {};
          (orders || []).forEach((o) =>
            (o.items || []).forEach((it) => {
              const pid = (it._id || it.productId || "").toString();
              if (!pid) return;
              if (productIds.includes(pid)) tally[pid] = (tally[pid] || 0) + (it.quantity || 0);
            })
          );
          const matched = resolved.filter((p) => tally[p._id.toString()] > 0);
          return { type: "reorder-target", products: filterByUserCategory(matched.slice(0, 12), user) };
        }
      }
      const products = await getReorderOptionsForRetailer(user?._id, { months: 1, limit: 12 });
      return { type: "reorder", products: filterByUserCategory(products, user) };
    }

    // Use recommendationMap if it matches keywords in message
    const tokens = new Set(normalized.split(/\s+/).filter(Boolean));
    const hits = new Set();
    for (const keyRaw of Object.keys(recommendationMap || {})) {
      const key = String(keyRaw).toLowerCase();
      const keyTokens = key.split(/\s+/).filter(Boolean);
      const anyTokenPresent = keyTokens.some((t) => tokens.has(t));
      const substringPresent = normalized.includes(key);
      if (anyTokenPresent || substringPresent) {
        (recommendationMap[key] || []).forEach((r) => hits.add(r));
      }
    }

    if (hits.size > 0) {
      const names = Array.from(hits);
      const foundProducts = [];
      for (const nm of names) {
        const prods = await findProductsByFuzzyName(nm, undefined, user?.category, 6);
        prods.forEach((p) => {
          if (!foundProducts.find((fp) => String(fp._id) === String(p._id))) foundProducts.push(p);
        });
        if (foundProducts.length >= 12) break;
      }
      return { type: "map", products: filterByUserCategory(foundProducts.slice(0, 12), user) };
    }

    // Fallback fuzzy search across the whole message
    const fuzzy = await findProductsByFuzzyName(normalized, undefined, user?.category, 12);
    if (fuzzy && fuzzy.length) return { type: "search", products: filterByUserCategory(fuzzy, user) };

    return { type: "none", products: [] };
  } catch (err) {
    console.error("getSmartRecommendationsForMessage error:", err);
    return { type: "none", products: [] };
  }
}

// Exports (single clean block)
export {
  findProductsByFuzzyName,
  getTrendingProducts,
  getRecentProducts,
  getReorderOptionsForRetailer,
  appendToSession,
  getSession,
  clearSession,
  getSmartRecommendationsForMessage,
};

export default {
  findProductsByFuzzyName,
  getTrendingProducts,
  getRecentProducts,
  getReorderOptionsForRetailer,
  appendToSession,
  getSession,
  clearSession,
  getSmartRecommendationsForMessage,
};
