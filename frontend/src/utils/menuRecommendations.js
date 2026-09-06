import { loadThaiFoods } from "./foodEstimator";
import { excludePorkMenus, excludePorkThaiFoodItems } from "./foodExclusions";
import { filterMenusByPreferences, filterExcludedMenuNames, getPreferenceScoreBoost } from "./foodPreferences";
import { getOutOfHomeCatalog } from "./outOfHomeMenus";

export { VENUE_MODES } from "./outOfHomeMenus";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/** เมนูคลีน/โปรตีนสูงที่คัดไว้ — ใช้เมื่อต้องการแนะนำเจาะจง */
const CURATED_LEAN_MENUS = [
  { name: "ลาบอกไก่คลีนคั่วแห้ง", calories: 240, protein: 25, carbs: 8, fat: 12, category: "lean-protein" },
  { name: "ปลานึ่งซีอิ๊ว + บรอกโคลีต้ม", calories: 220, protein: 22, carbs: 12, fat: 8, category: "lean-protein" },
  { name: "อกไก่ย่าง + สลัดผัก", calories: 250, protein: 28, carbs: 10, fat: 10, category: "lean-protein" },
  { name: "ไข่ต้ม 2 ฟอง + สลัดผัก", calories: 190, protein: 14, carbs: 8, fat: 12, category: "lean-protein" },
  { name: "โจ๊กไก่ (ครึ่งถ้วย)", calories: 200, protein: 16, carbs: 28, fat: 4, category: "light" },
  { name: "ต้มยำกุ้ง", calories: 200, protein: 16, carbs: 12, fat: 10, category: "soup" },
  { name: "แกงจืดเต้าหู้ไก่สับ", calories: 180, protein: 14, carbs: 8, fat: 10, category: "soup" },
  { name: "ยำวุ้นเส้นทะเล", calories: 220, protein: 10, carbs: 32, fat: 6, category: "salad" },
  { name: "สลัดทูน่า", calories: 260, protein: 26, carbs: 14, fat: 12, category: "salad" },
  { name: "ปลาเผา + ผักนึ่ง", calories: 280, protein: 32, carbs: 8, fat: 14, category: "lean-protein" },
];

const HEAVY_KEYWORDS = ["ทอด", "กรอบ", "มัน", "ชานม", "เค้ก", "ไอศกรีม", "พิซซ่า", "เบอร์เกอร์"];

const inferCategory = (name) => {
  if (/สลัด|ยำ|ลาบ/.test(name)) return "salad";
  if (/ต้ม|แกงจืด|ซุป/.test(name)) return "soup";
  if (/ทอด|กรอบ|ไก่ทอด|หมูทอด/.test(name)) return "fried";
  if (/ข้าวผัด|ผัดไทย|ก๋วยเตี๋ยว|บะหมี่/.test(name)) return "noodle-rice";
  if (/ไก่ย่าง|ปลาเผา|ปลานึ่ง|อกไก่|สเต็ก/.test(name)) return "lean-protein";
  return "general";
};

const flattenCatalog = (foods) =>
  excludePorkThaiFoodItems(foods || []).map((item) => ({
    name: item.names[0],
    calories: Number(item.calories) || 0,
    protein: Number(item.protein) || 0,
    carbs: Number(item.carbs) || 0,
    fat: Number(item.fat) || 0,
    category: inferCategory(item.names[0]),
  }));

const isHeavyMenu = (menu) =>
  HEAVY_KEYWORDS.some((kw) => menu.name.includes(kw)) || menu.category === "fried";

const scaleMenu = (menu, factor) => {
  const round1 = (n) => Math.round(n * 10) / 10;
  const calories = Math.round(menu.calories * factor);
  const portionLabel =
    factor < 0.92
      ? `~${Math.round(factor * 100)}% จาน`
      : factor > 1.08
        ? `~${Math.round(factor * 100)}% จาน`
        : "1 จาน";

  return {
    id: `${menu.name}-${factor.toFixed(2)}`,
    name: menu.name,
    calories,
    protein: round1(menu.protein * factor),
    carbs: round1(menu.carbs * factor),
    fat: round1(menu.fat * factor),
    portionLabel,
    source: menu.source || "database",
    category: menu.category || "general",
  };
};

const fitToCalorieWindow = (menu, calMin, calMax) => {
  if (!menu.calories || menu.calories <= 0) return null;

  const targetCal = (calMin + calMax) / 2;
  let factor = targetCal / menu.calories;
  factor = clamp(factor, 0.55, 1.35);

  let scaled = scaleMenu(menu, factor);
  if (scaled.calories >= calMin - 15 && scaled.calories <= calMax + 15) {
    return scaled;
  }

  factor = clamp(calMax / menu.calories, 0.55, 1.35);
  scaled = scaleMenu(menu, factor);
  if (scaled.calories >= calMin - 15 && scaled.calories <= calMax + 15) {
    return scaled;
  }

  factor = clamp(calMin / menu.calories, 0.55, 1.35);
  scaled = scaleMenu(menu, factor);
  if (scaled.calories >= calMin - 15 && scaled.calories <= calMax + 15) {
    return scaled;
  }

  return null;
};

const scoreMenu = (menu, targets) => {
  let score = 100;
  const targetCal = targets.targetCal || (targets.calMin + targets.calMax) / 2;

  score -= Math.abs(menu.calories - targetCal) * 0.35;

  if (targets.focusKey === "protein") {
    score += menu.protein * 4;
    score -= Math.max(0, (targets.targetProtein || 20) - menu.protein) * 6;
  } else if (targets.focusKey === "carbs") {
    score += menu.carbs * 1.5;
    score -= Math.max(0, (targets.targetCarbs || 30) - menu.carbs) * 3;
  } else if (targets.focusKey === "fat") {
    score += menu.fat * 2;
  }

  if (targets.carbsPct > 110) {
    score -= menu.carbs * 2.5;
    if (menu.carbs <= 25) score += 25;
  }

  if (targets.fatPct > 110) {
    score -= menu.fat * 2.5;
    if (menu.fat <= 12) score += 20;
  }

  if (targets.proteinPct < 85 && menu.protein >= 18) score += 18;

  if (menu.source === "curated") score += 8;
  if (menu.category === "lean-protein" || menu.category === "soup" || menu.category === "salad") score += 6;
  if (isHeavyMenu(menu)) score -= 40;

  if (targets.remainingCal <= 0 && menu.calories <= 280) score += 15;

  score += getPreferenceScoreBoost(menu, targets.foodPreferences);

  return score;
};

const pickDiverseTop3 = (scored, targets) => {
  const preferences = targets?.foodPreferences;
  const excludeNames = targets?.excludeMenuNames || [];
  const shuffle = Boolean(targets?.shuffleMenus);

  let filtered = filterMenusByPreferences(scored, preferences);
  filtered = filterExcludedMenuNames(filtered, excludeNames);

  let ranked = [...filtered];
  if (shuffle) {
    ranked = ranked
      .map((item) => ({
        ...item,
        score: item.score + Math.random() * 22,
      }))
      .sort((a, b) => b.score - a.score);
  }

  const picked = [];
  const usedNames = new Set();

  ranked.forEach((item) => {
    if (picked.length >= 3) return;
    const key = item.name.slice(0, 6);
    if (usedNames.has(key)) return;
    usedNames.add(key);
    picked.push(item);
  });

  if (picked.length < 3) {
    ranked.forEach((item) => {
      if (picked.length >= 3) return;
      if (picked.some((p) => p.id === item.id)) return;
      picked.push(item);
    });
  }

  return picked.slice(0, 3).map(({ score, category, ...menu }) => ({
    ...menu,
    matchNote: buildMatchNote(menu, score),
  }));
};

const buildMatchNote = (menu, score) => {
  if (menu.venue === "seven") return "เหมาะซื้อเซเว่น";
  if (menu.venue === "tamsung") return "เหมาะสั่งตามสั่ง";
  if (score >= 130) return "ตรงเป้ามาก";
  if (score >= 110) return "เหมาะกับมื้อนี้";
  return "ทางเลือกสมดุล";
};

const pickOutOfHomeTop3 = (catalog, targets) => {
  const calMin = targets.calMin;
  const calMax = targets.calMax;

  const scored = catalog
    .map((menu) => ({
      ...menu,
      id: `${menu.venue}-${menu.name}`,
      portionLabel: menu.orderTip || "เซ็ตแนะนำ",
      source: menu.venue,
      score: scoreMenu(
        {
          ...menu,
          calories: menu.calories,
          protein: menu.protein,
          carbs: menu.carbs,
          fat: menu.fat,
        },
        targets,
      ),
    }))
    .sort((a, b) => {
      const aInWindow = a.calories >= calMin - 30 && a.calories <= calMax + 30;
      const bInWindow = b.calories >= calMin - 30 && b.calories <= calMax + 30;
      if (aInWindow !== bInWindow) return bInWindow - aInWindow;
      return b.score - a.score;
    });

  return pickDiverseTop3(excludePorkMenus(scored), targets);
};

export const generateMenuRecommendations = async (targets, venueMode = "home") => {
  if (!targets?.canRecommend) return [];

  if (venueMode === "seven" || venueMode === "tamsung") {
    const catalog = excludePorkMenus(getOutOfHomeCatalog(venueMode));
    return pickOutOfHomeTop3(catalog, targets);
  }

  const catalog = flattenCatalog(await loadThaiFoods());
  const curated = excludePorkMenus(CURATED_LEAN_MENUS.map((m) => ({ ...m, source: "curated" })));

  const skipHeavy = targets.carbsPct > 110 || targets.fatPct > 110 || targets.remainingCal <= 0;
  const pool = [
    ...curated,
    ...catalog.filter((item) => !skipHeavy || !isHeavyMenu(item)),
  ];

  const calMin = targets.calMin;
  const calMax = targets.calMax;

  const scored = pool
    .map((menu) => {
      const scaled = fitToCalorieWindow(menu, calMin, calMax);
      if (!scaled) return null;
      return { ...scaled, score: scoreMenu(scaled, targets) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return pickDiverseTop3(excludePorkMenus(scored), targets);
};
