const INGREDIENTS_URL = `${process.env.PUBLIC_URL || ""}/data/ingredients_kb.json`;

const ADDON_KEYWORDS = [
  ["ไข่ดาว", "fried_egg"],
  ["ไข่ทอด", "fried_egg"],
  ["ไข่เจียว", "omelette"],
  ["ไข่ต้ม", "boiled_egg"],
  ["ไข่ลวก", "boiled_egg"],
  ["เพิ่มไข่", "fried_egg"],
  ["ชีส", "cheese"],
];

const PROTEIN_KEYWORDS = [
  ["ไก่", "chicken_meat"],
  ["หมู", "pork_meat"],
  ["เนื้อ", "beef_meat"],
  ["กุ้ง", "shrimp"],
  ["เต้าหู้", "tofu"],
];

const DISH_TEMPLATES = {
  krapao: {
    triggers: ["กะเพรา", "กระเพรา"],
    components: ["rice_cooked", "holy_basil", "chili_garlic", "fish_sauce", "cooking_oil"],
    defaultProtein: "chicken_meat",
  },
  fried_rice: {
    triggers: ["ข้าวผัด"],
    components: ["rice_cooked", "cooking_oil", "chili_garlic", "fish_sauce"],
    defaultProtein: "chicken_meat",
  },
  stir_fry: {
    triggers: ["ผัด"],
    components: ["rice_cooked", "mixed_vegetables", "cooking_oil", "chili_garlic"],
    defaultProtein: "chicken_meat",
  },
  yum_salad: {
    triggers: [],
    components: ["mixed_vegetables", "chili_garlic", "fish_sauce"],
    defaultProtein: "chicken_meat",
  },
};

const YUM_SALAD_EXCLUDES = ["ต้มยำ", "ข้าวยำ", "ก๋วยเตี๋ยวต้มยำ"];

const isYumSaladDish = (text) => {
  if (YUM_SALAD_EXCLUDES.some((marker) => text.includes(marker))) return false;
  return /^ยำ/.test(text) || text.includes("ลาบ") || text.includes("แซ่บ");
};

let ingredientsCache = null;
let aliasIndexCache = null;

const normalize = (text) => String(text || "").trim().toLowerCase().replace(/\s+/g, " ");

const loadIngredients = async () => {
  if (ingredientsCache) return ingredientsCache;
  try {
    const res = await fetch(INGREDIENTS_URL);
    if (!res.ok) return [];
    ingredientsCache = await res.json();
    return ingredientsCache;
  } catch {
    return [];
  }
};

const buildAliasIndex = (items) => {
  if (aliasIndexCache) return aliasIndexCache;
  aliasIndexCache = items
    .flatMap((item) => item.names.map((alias) => ({ alias, aliasNorm: normalize(alias), item })))
    .sort((a, b) => b.alias.length - a.alias.length);
  return aliasIndexCache;
};

const getIngredient = (items, id) => items.find((item) => item.id === id) || null;

const ingredientRow = (item, note) => ({
  id: item.id,
  name: item.names[0],
  servingLabel: item.servingLabel || "",
  grams: item.grams || 0,
  calories: item.calories || 0,
  protein: item.protein || 0,
  carbs: item.carbs || 0,
  fat: item.fat || 0,
  note,
});

const sumNutrition = (rows) => rows.reduce(
  (acc, row) => ({
    calories: acc.calories + (Number(row.calories) || 0),
    protein: acc.protein + (Number(row.protein) || 0),
    carbs: acc.carbs + (Number(row.carbs) || 0),
    fat: acc.fat + (Number(row.fat) || 0),
  }),
  { calories: 0, protein: 0, carbs: 0, fat: 0 }
);

const detectProtein = (text) => {
  const hit = PROTEIN_KEYWORDS.find(([keyword]) => text.includes(keyword));
  return hit ? hit[1] : null;
};

const extractAddons = (text, items) => {
  const extras = [];
  let remaining = text;
  [...ADDON_KEYWORDS]
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([keyword, ingredientId]) => {
      if (remaining.includes(keyword)) {
        const item = getIngredient(items, ingredientId);
        if (item) extras.push(ingredientRow(item, `เพิ่มจาก '${keyword}'`));
        remaining = remaining.replace(keyword, " ");
      }
    });
  return [remaining.replace(/\s+/g, " ").trim(), extras];
};

const matchTemplate = (text) => {
  if (isYumSaladDish(text)) return DISH_TEMPLATES.yum_salad;
  return Object.values(DISH_TEMPLATES).find((template) =>
    template.triggers.some((trigger) => text.includes(trigger))
  ) || null;
};

const composeFromTemplate = (text, template, items) => {
  const rows = [];
  const proteinId = detectProtein(text) || template.defaultProtein;
  template.components.forEach((componentId) => {
    const item = getIngredient(items, componentId);
    if (item) rows.push(ingredientRow(item));
  });
  const protein = getIngredient(items, proteinId);
  if (protein) rows.push(ingredientRow(protein));
  return rows;
};

export const parseFoodTextLocally = async (name, thaiMatcher) => {
  const cleanName = String(name || "").trim();
  if (!cleanName) return null;

  const items = await loadIngredients();
  if (!items.length) return null;

  const index = buildAliasIndex(items);
  const norm = normalize(cleanName);
  const [baseText, addonRows] = extractAddons(norm, items);

  let rows = [];
  let thaiMatch = null;
  if (thaiMatcher) {
    thaiMatch = await thaiMatcher(baseText || cleanName);
  }

  if (thaiMatch?.item) {
    const food = thaiMatch.item;
    rows.push({
      id: thaiMatch.matchedAlias,
      name: thaiMatch.matchedAlias,
      servingLabel: "1 จาน",
      grams: food.defaultServingGrams || 250,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      note: "ฐานเมนูไทย",
    });
  } else {
    const template = matchTemplate(baseText || norm);
    if (template) {
      rows = composeFromTemplate(baseText || norm, template, items);
    } else {
      const matchedIds = new Set();
      index.forEach((entry) => {
        if (entry.aliasNorm.length >= 2 && norm.includes(entry.aliasNorm) && !matchedIds.has(entry.item.id)) {
          matchedIds.add(entry.item.id);
          rows.push(ingredientRow(entry.item));
        }
      });
    }
  }

  rows.push(...addonRows);
  if (rows.length < 1) return null;

  const totals = sumNutrition(rows);
  return {
    name: cleanName,
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    estimated: true,
    estimateSource: "nlp_parse_local",
    matchedReference: `แกะจาก: ${rows.map((row) => row.name).slice(0, 5).join(", ")}`,
    parsedIngredients: rows,
    parseMethod: "nlp",
    dishLabel: cleanName,
  };
};
