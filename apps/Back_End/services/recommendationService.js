import { recommendationMap, categorySeeds, commonSynonyms } from "../utils/recommendationMap.js";

const normalize = (s = "") =>
  String(s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (s = "") => {
  const n = normalize(s);
  return n ? n.split(" ").filter(Boolean) : [];
};

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

function tokenMatchesToken(t1, t2) {
  if (!t1 || !t2) return false;
  if (t1 === t2) return true;
  if (t1.startsWith(t2) || t2.startsWith(t1)) return true;
  const lev = levenshtein(t1, t2);
  const maxLen = Math.max(t1.length, t2.length);
  if (maxLen <= 4) return lev <= 1;
  return lev <= Math.floor(maxLen * 0.25);
}

function expandWithSynonyms(tokens = []) {
  const s = new Set(tokens);
  const tokenStr = tokens.join(" ");
  Object.keys(commonSynonyms).forEach((k) => {
    const syns = commonSynonyms[k] || [];
    syns.forEach((syn) => {
      const synTokens = tokenize(syn);
      synTokens.forEach((st) => {
        tokens.forEach((t) => {
          if (tokenMatchesToken(st, t) || tokenMatchesToken(t, st) || st.includes(t) || t.includes(st)) {
            synTokens.forEach((x) => s.add(x));
          }
        });
      });
    });
  });
  return Array.from(s);
}

function scoreKeyForQuery(key, queryTokens, queryRawTokens) {
  const keyTokens = tokenize(key);
  let score = 0;
  keyTokens.forEach((kt) => {
    queryRawTokens.forEach((qt) => {
      if (tokenMatchesToken(kt, qt)) score += 4;
      else if (kt.includes(qt) || qt.includes(kt)) score += 2;
    });
  });
  queryTokens.forEach((qt) => {
    keyTokens.forEach((kt) => {
      const lev = levenshtein(qt, kt);
      const len = Math.max(qt.length, kt.length);
      if (len > 0) {
        const sim = 1 - lev / len;
        score += Math.max(0, sim) * 1.5;
      }
    });
  });
  return score;
}

function rankCandidateKeys(query, category) {
  const qtokens = tokenize(query);
  const rawTokens = qtokens.slice();
  const expanded = expandWithSynonyms(qtokens);
  expanded.forEach((t) => rawTokens.push(t));
  const keys = Object.keys(recommendationMap);
  const scores = keys.map((k) => ({ key: k, score: scoreKeyForQuery(k, expanded, rawTokens) }));
  if (category && categorySeeds[category]) {
    categorySeeds[category].forEach((seed) => {
      const idx = scores.findIndex((s) => s.key === seed);
      if (idx === -1) scores.push({ key: seed, score: 1.5 });
      else scores[idx].score += 2;
    });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores.filter((s) => s.score > 0.5).map((s) => s.key);
}

export async function getRecommendations(productName, category = null, limit = 6) {
  if (!productName || !String(productName).trim()) return [];
  const q = normalize(productName);
  const candidateKeys = rankCandidateKeys(q, category);
  const suggestions = [];
  candidateKeys.forEach((key) => {
    const arr = recommendationMap[key] || [];
    arr.forEach((it) => {
      if (!suggestions.includes(it)) suggestions.push(it);
    });
    if (suggestions.length >= limit) return;
  });
  if (suggestions.length < limit) {
    const fallback = Object.values(recommendationMap).flat();
    for (const it of fallback) {
      if (suggestions.length >= limit) break;
      if (!suggestions.includes(it)) suggestions.push(it);
    }
  }
  return suggestions.slice(0, limit);
}

export default { getRecommendations };
