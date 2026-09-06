export const hasMacroFields = (item) =>
  item?.protein != null || item?.carbs != null || item?.fat != null;

const normalizeQuery = (query) => String(query || "").trim().toLowerCase();

export const matchesQuery = (item, query) => {
  const term = normalizeQuery(query);
  if (!term) return false;
  const name = String(item?.name || "").trim().toLowerCase();
  return name.includes(term);
};

export const isLikelyFoodItem = (item) =>
  hasMacroFields(item)
  || item?.category === "fruit"
  || item?.category === "drink"
  || item?.defaultServingGrams != null
  || item?.defaultServingLabel != null
  || item?.per100g != null
  || item?.baseName != null;

export const isLikelyActivityItem = (item) =>
  item
  && !isLikelyFoodItem(item)
  && item.calories != null
  && String(item.name || "").trim().length > 0;

export const tagSearchResults = (items, resultType) =>
  (Array.isArray(items) ? items : []).map((item) => ({ ...item, _resultType: resultType }));

const MIN_FUZZY_FOOD_SCORE = 0.58;

export const filterFoodResults = (items, query) => {
  const term = normalizeQuery(query);
  if (!term) return [];

  return (Array.isArray(items) ? items : [])
    .filter((item) => isLikelyFoodItem(item) || hasMacroFields(item))
    .filter((item) => {
      if (matchesQuery(item, query)) return true;
      const score = Number(item._searchScore);
      return Number.isFinite(score) && score >= MIN_FUZZY_FOOD_SCORE;
    });
};

export const filterActivityResults = (items, query) =>
  (Array.isArray(items) ? items : [])
    .filter(isLikelyActivityItem)
    .filter((item) => matchesQuery(item, query));

export const mergeActivityResults = (primary, secondary) => {
  const seen = new Set();
  return [...primary, ...secondary].filter((item) => {
    const key = String(item?.id || item?.name || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
