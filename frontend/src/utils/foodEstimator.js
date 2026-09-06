import { getApiBaseUrl } from "../constants/config";
import { formatPortionNote, parsePortion, scaleNutrition, stripPortionSuffix } from "./portionParser";
import { parseFoodTextLocally } from "./nlpFoodParser";

const DEFAULT_NUTRITION = { calories: 450, protein: 20, carbs: 52, fat: 16 };
const THAI_FOODS_URL = `${process.env.PUBLIC_URL || ""}/data/thai_foods.json`;

let thaiFoodsCache = null;
let aliasIndexCache = null;

const normalize = (text) => String(text || "").trim().toLowerCase().replace(/\s+/g, " ");

const similarity = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) {
    return 0.82 + (Math.min(a.length, b.length) / Math.max(a.length, b.length)) * 0.18;
  }

  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[a.length][b.length];
  return 1 - distance / Math.max(a.length, b.length);
};

export const loadThaiFoods = async () => {
  if (thaiFoodsCache) return thaiFoodsCache;
  try {
    const res = await fetch(THAI_FOODS_URL);
    if (!res.ok) return [];
    thaiFoodsCache = await res.json();
    return thaiFoodsCache;
  } catch {
    return [];
  }
};

const buildAliasIndex = (foods) => {
  if (aliasIndexCache) return aliasIndexCache;
  aliasIndexCache = foods
    .flatMap((item) => item.names.map((alias) => ({ alias, aliasNorm: normalize(alias), item })))
    .sort((a, b) => b.alias.length - a.alias.length);
  return aliasIndexCache;
};

const thaiFoodToSearchResult = (item, matchedAlias) => ({
  name: matchedAlias,
  baseName: item.names[0],
  calories: item.calories,
  protein: item.protein,
  carbs: item.carbs,
  fat: item.fat,
  defaultServingGrams: item.defaultServingGrams,
  defaultServingLabel: item.defaultServingLabel,
  per100g: item.per100g,
  category: item.category,
});

export const searchThaiFoods = async (query, limit = 12) => {
  const norm = normalize(query);
  if (!norm) return [];

  const foods = await loadThaiFoods();
  const scored = [];
  const seen = new Set();

  foods.forEach((item) => {
    const primary = item.names[0];
    if (seen.has(primary)) return;

    let bestAlias = null;
    let bestScore = 0;

    item.names.forEach((alias) => {
      const aliasNorm = normalize(alias);
      if (aliasNorm === norm) {
        bestAlias = alias;
        bestScore = 1;
        return;
      }
      const score = similarity(norm, aliasNorm);
      if (score > bestScore) {
        bestScore = score;
        bestAlias = alias;
      }
    });

    if (bestAlias && bestScore >= 0.55) {
      seen.add(primary);
      scored.push({ score: bestScore, result: thaiFoodToSearchResult(item, bestAlias) });
    }
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => ({ ...row.result, _searchScore: row.score }));
};

const GENERIC_RICE_ALIASES = new Set(["ข้าวเปล่า", "ข้าวสวย"]);
const RICE_DISH_MARKERS = ["ยำ", "ผัด", "ราด", "มัน", "ซอย", "ต้ม", "หมก", "คลุก"];

const isGenericRiceMismatch = (queryNorm, matchedAlias, score) => {
  if (!GENERIC_RICE_ALIASES.has(matchedAlias)) return false;
  if (!RICE_DISH_MARKERS.some((marker) => queryNorm.includes(marker))) return false;
  return score < 0.95;
};

export const matchThaiFoodLocally = async (name) => {
  const portion = parsePortion(name);
  const cleanName = portion.foodName;
  const norm = normalize(cleanName);
  if (!norm) return null;

  const foods = await loadThaiFoods();
  const index = buildAliasIndex(foods);

  let best = null;
  let bestScore = 0;

  index.forEach((row) => {
    if (row.aliasNorm === norm) {
      best = { item: row.item, score: 1, matchedAlias: row.alias };
      bestScore = 1;
      return;
    }

    const score = similarity(norm, row.aliasNorm);
    if (score > bestScore) {
      bestScore = score;
      best = { item: row.item, score, matchedAlias: row.alias };
    }
  });

  if (best && bestScore >= 0.72 && !isGenericRiceMismatch(norm, best.matchedAlias, bestScore)) {
    return { ...best, portion };
  }
  return null;
};

const YUM_SALAD_EXCLUDES = ["ต้มยำ", "ข้าวยำ", "ก๋วยเตี๋ยวต้มยำ"];

const estimateYumSaladLocally = (name) => {
  const portion = parsePortion(name);
  const norm = normalize(portion.foodName);
  if (!norm) return null;
  if (YUM_SALAD_EXCLUDES.some((marker) => norm.includes(marker))) return null;
  if (!(/^ยำ/.test(norm) || norm.includes("ลาบ") || norm.includes("แซ่บ"))) return null;

  let nutrition = { calories: 280, protein: 20, carbs: 12, fat: 16 };
  if (norm.includes("กุ้ง") || norm.includes("ทะเล")) {
    nutrition = { calories: 220, protein: 18, carbs: 14, fat: 10 };
  } else if (norm.includes("หมู") || norm.includes("คอหมู")) {
    nutrition = { calories: 310, protein: 20, carbs: 10, fat: 22 };
  } else if (norm.includes("ไก่") || norm.includes("แซ่บ")) {
    nutrition = { calories: 285, protein: 22, carbs: 12, fat: 16 };
  }

  return {
    name: portion.originalName,
    ...nutrition,
    estimated: true,
    estimateSource: "nlp_parse_local",
    matchedReference: "ประมาณจากเมนูยำ/ลาบ",
  };
};

export const estimateFoodLocally = async (name) => {
  const portion = parsePortion(name);
  const thaiMatch = await matchThaiFoodLocally(name);

  if (thaiMatch) {
    const scaled = scaleNutrition(thaiMatch.item, thaiMatch.portion || portion, thaiMatch.item);
    const portionNote = formatPortionNote(thaiMatch.portion || portion);
    return {
      name: portion.originalName,
      baseName: thaiMatch.matchedAlias,
      category: thaiMatch.item.category,
      defaultServingGrams: thaiMatch.item.defaultServingGrams,
      defaultServingLabel: thaiMatch.item.defaultServingLabel,
      ...scaled,
      estimated: true,
      estimateSource: "thai_reference_local",
      matchedReference: portionNote ? `${thaiMatch.matchedAlias} · ${portionNote}` : thaiMatch.matchedAlias,
      portionNote,
    };
  }

  const nlpParsed = await parseFoodTextLocally(name, async (foodName) => matchThaiFoodLocally(foodName));
  if (nlpParsed) {
    const scaled = scaleNutrition(nlpParsed, portion);
    const portionNote = formatPortionNote(portion);
    return {
      ...nlpParsed,
      name: portion.originalName,
      baseName: nlpParsed.dishLabel || portion.foodName || portion.originalName,
      ...scaled,
      portionNote,
    };
  }

  const yumEstimate = estimateYumSaladLocally(name);
  if (yumEstimate) {
    const scaled = scaleNutrition(yumEstimate, portion);
    const portionNote = formatPortionNote(portion);
    return {
      ...yumEstimate,
      ...scaled,
      portionNote,
    };
  }

  return {
    name: portion.originalName,
    ...DEFAULT_NUTRITION,
    estimated: true,
    estimateSource: "rule_local",
  };
};

export const estimateCustomFood = async (name) => {
  const cleanName = String(name || "").trim();
  if (!cleanName) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/foods/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cleanName }),
    });
    if (res.ok) {
      const data = await res.json();
      return { ...data, custom: true };
    }
  } catch (err) {
    console.warn("Food estimate API unavailable, using local reference:", err);
  }

  return { ...(await estimateFoodLocally(cleanName)), custom: true };
};

export const isGenericFoodEstimate = (estimate) => {
  const source = estimate?.estimateSource;
  return source === "rule_local"
    || source === "rule"
    || source === "rule_default";
};

export const canSaveFoodEntry = (food) => {
  if (!food) return false;
  if (food.id != null) return true;
  const name = food.baseName || stripPortionSuffix(food.name) || food.name || "";
  if (looksLikeInvalidFoodName(name)) return false;
  if (isGenericFoodEstimate(food)) {
    return food.nutritionUnverified === true && Number(food.calories) > 0;
  }
  return isVerifiedFoodEntry(food);
};

export const canEstimateCustomFood = (estimate, name) => {
  if (!estimate) return false;
  const portion = parsePortion(name);
  const baseName = portion.foodName || name;
  const entry = { ...estimate, name, baseName };
  if (canSaveFoodEntry(entry)) return true;
  if (isGenericFoodEstimate(entry) && Number(entry.calories) > 0 && !looksLikeInvalidFoodName(baseName)) {
    return true;
  }
  return false;
};

export const prepareCustomFoodEstimate = (estimate, name) => {
  const portion = parsePortion(name);
  const baseName = portion.foodName || name;
  const entry = { ...estimate, name, baseName };
  if (isGenericFoodEstimate(entry)) {
    return {
      ...entry,
      nutritionUnverified: true,
      matchedReference: entry.matchedReference || "ประมาณคร่าวๆ — ปรับปริมาณได้ใน modal",
    };
  }
  return entry;
};

const INVALID_FOOD_NAME_CHARS = /[(){}[\]<>@#$%^&*+=|\\;:"/?!~`]/;

export const looksLikeInvalidFoodName = (name) => {
  const text = String(name || "").trim();
  if (text.length < 2) return true;
  if (INVALID_FOOD_NAME_CHARS.test(text)) return true;

  const thaiChars = (text.match(/[\u0E00-\u0E7F]/g) || []).length;
  const thaiRatio = thaiChars / text.replace(/\s/g, "").length;
  const latinOnly = /^[a-zA-Z0-9\s\-'.]+$/;

  if (thaiChars === 0 && !latinOnly.test(text)) return true;
  if (thaiChars > 0 && thaiRatio < 0.55) return true;

  const thaiOnly = text.replace(/[^\u0E00-\u0E7F]/g, "");
  if (thaiOnly.length >= 4) {
    const hasVowel = /[\u0E30-\u0E3A\u0E40-\u0E4E]/.test(thaiOnly);
    const longConsonantRun = /[\u0E01-\u0E2E]{5,}/.test(thaiOnly);
    if (!hasVowel && longConsonantRun) return true;
  }

  return false;
};

const VERIFIED_ESTIMATE_SOURCES = new Set([
  "thai_reference",
  "thai_reference_local",
  "database",
  "database_fuzzy",
  "nlp_parse",
  "nlp_parse_local",
  "calorieninjas",
  "llm_parse",
]);

export const isVerifiedFoodEntry = (food) => {
  if (!food) return false;
  if (food.id != null) return true;
  if (food.nutritionVerified === true) return true;
  const source = food.estimateSource;
  if (source && VERIFIED_ESTIMATE_SOURCES.has(source)) return true;
  if (!source && !food.custom && !food.estimated) {
    return Number(food.calories) > 0;
  }
  return false;
};

export const isUnverifiedFoodEntry = (food) => {
  if (!food) return false;
  if (food.nutritionUnverified === true) return true;
  if (isVerifiedFoodEntry(food)) return false;
  return Boolean(food.custom || food.estimated || isGenericFoodEstimate(food));
};

export const getUnverifiedMealItems = (mealList) =>
  (mealList || []).filter(isUnverifiedFoodEntry);

export const mealHasUnverifiedNutrition = (mealList) =>
  getUnverifiedMealItems(mealList).length > 0;

export const mealIsFullyUnverified = (mealList) => {
  const list = mealList || [];
  return list.length > 0 && list.every(isUnverifiedFoodEntry);
};

export const getEstimateSourceLabel = (source) => {
  if (source === "thai_reference" || source === "thai_reference_local") return "อ้างอิงเมนูไทย";
  if (source === "nlp_parse" || source === "nlp_parse_local") return "AI แกะวัตถุดิบ (NLP)";
  if (source === "llm_parse") return "AI แกะวัตถุดิบ (LLM)";
  if (source === "database" || source === "database_fuzzy") return "อ้างอิงฐานข้อมูล";
  if (source === "calorieninjas") return "อ้างอิง CalorieNinjas";
  if (source === "rule" || source === "rule_default") return "ประมาณจากชื่อเมนู";
  return "ประมาณการ";
};
