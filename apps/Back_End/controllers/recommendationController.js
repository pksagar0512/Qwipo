import Product from "../models/Product.js";
import { getRecommendations } from "../services/recommendationService.js";

const normalize = (s = "") =>
  String(s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function levenshtein(a = "", b = "") {
  a = String(a); b = String(b);
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1).fill(0);
  const v1 = new Array(b.length + 1).fill(0);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

function isSameProductName(a = "", b = "") {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) {
    const maxLen = Math.max(na.length, nb.length);
    const diff = Math.abs(na.length - nb.length);
    if (diff <= Math.floor(maxLen * 0.4)) return true;
  }
  const lev = levenshtein(na, nb);
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return false;
  return lev / maxLen <= 0.25;
}

function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const getProductRecommendations = async (req, res) => {
  try {
    const { productName } = req.params;
    // frontend should send category and brand as query params, e.g. ?category=Clothing&brand=PK
    const category = req.query.category || null;
    const brand = req.query.brand || null;

    if (!productName) return res.status(400).json({ message: "Product name required" });

    const normalizedInput = normalize(productName);

    // Step 1: get suggested names (strings) from recommendation service
    const suggestedNames = await getRecommendations(productName, category || null, 12);
    if (!Array.isArray(suggestedNames) || suggestedNames.length === 0) {
      return res.json({ recommendations: [] });
    }

    // Filter out suggestions that are same as input (string-level)
    const filteredSuggestedNames = suggestedNames.filter((s) => !isSameProductName(s, normalizedInput));
    if (!filteredSuggestedNames.length) return res.json({ recommendations: [] });

    // Build strict DB filter:
    // - must match category (if provided)
    // - if brand provided, must match brand
    // - product name must match any of suggested names (use regex OR, case-insensitive)
    const nameRegexPieces = filteredSuggestedNames.map((n) => `(${escapeRegex(n)})`);
    // If nothing to search, return empty
    if (!nameRegexPieces.length) return res.json({ recommendations: [] });

    const nameRegex = new RegExp(nameRegexPieces.join("|"), "i");
    const dbFilter = { name: nameRegex };
    if (category) dbFilter.category = category;
    if (brand) dbFilter.brand = brand;

    // Query DB strictly within the filter (no cross-category/brand leakage)
    let realProducts = await Product.find(dbFilter).lean();

    // If none found and brand was specified, try relaxed brand fallback:
    // We will NOT cross categories. Only relax brand: look for same category but any brand.
    if ((!realProducts || realProducts.length === 0) && brand && category) {
      const relaxedFilter = { name: nameRegex, category };
      realProducts = await Product.find(relaxedFilter).lean();
    }

    // Remove any product that equals the input product (fuzzy)
    realProducts = (realProducts || []).filter((p) => !isSameProductName(p.name, normalizedInput));

    // Deduplicate by normalized name and preserve order according to filteredSuggestedNames
    const seen = new Set();
    const ordered = [];
    for (const s of filteredSuggestedNames) {
      for (const p of realProducts) {
        const np = normalize(p.name);
        if (seen.has(np)) continue;
        if (np.includes(normalize(s)) || normalize(s).includes(np) || isSameProductName(np, normalize(s))) {
          ordered.push(p);
          seen.add(np);
        }
      }
    }
    // append any remaining products that matched but weren't ordered
    for (const p of realProducts) {
      const np = normalize(p.name);
      if (!seen.has(np)) {
        ordered.push(p);
        seen.add(np);
      }
    }

    // Return only real available products in same category/brand (or same category if brand fallback done)
    return res.json({ recommendations: ordered });
  } catch (err) {
    console.error("Recommendation error:", err);
    return res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};
