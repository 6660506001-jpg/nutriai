const HIGH_GI_KEYWORDS = [
  "ข้าว",
  "ขนม",
  "หวาน",
  "น้ำตาล",
  "ขนมปัง",
  "เส้น",
  "บะหมี่",
  "มันฝรั่ง",
  "แป้ง",
];

const LOW_GI_KEYWORDS = [
  "สลัด",
  "ผัก",
  "ยำ",
  "ถั่ว",
  "โยเกิร์ต",
  "ไข่",
  "ปลา",
  "อกไก่",
  "ทูน่า",
];

const DRINK_GI_RULES = [
  { patterns: [/น้ำเปล่า|น้ำดื่ม|น้ำแร่|water|mineral water/i], gi: 0 },
  { patterns: [/ชาเขียว(?!.*นม)|green tea(?!.*milk)/i], gi: 0 },
  { patterns: [/กาแฟดำ|americano|espresso/i], gi: 0 },
  { patterns: [/น้ำเกลือ|sport drink|gatorade|เกลือแร่/i], gi: 45 },
  { patterns: [/นมสด|fresh milk/i], gi: 30 },
  { patterns: [/โอวัลติน|chocolate milk|นมช็อก/i], gi: 45 },
  { patterns: [/น้ำส้ม|orange juice|น้ำผลไม้/i], gi: 50 },
  { patterns: [/น้ำมะพร้าว|coconut water/i], gi: 45 },
  { patterns: [/น้ำมะนาว|น้ำผึ้งมะนาว|มะนาวโซดา/i], gi: 55 },
  { patterns: [/โอเลี้ย|oishi|ชาเขียวขวด/i], gi: 40 },
  { patterns: [/100plus|กระทิงแดง|red bull|ชูกำลัง/i], gi: 70 },
  { patterns: [/น้ำอัดลม|โค้ก|coke|pepsi|cola|sprite|fanta|สไปรท์/i], gi: 68 },
  { patterns: [/ชาเย็น|ชาใต้หวัน/i], gi: 65 },
  { patterns: [/ชาไทย|thai tea/i], gi: 75 },
  { patterns: [/ชานม|bubble tea|ไข่มุก|boba/i], gi: 78 },
  { patterns: [/ชาเขียวนม|green tea milk|matcha|มัทฉะ/i], gi: 72 },
  { patterns: [/กาแฟเย็น|iced coffee|ลาเต้|latte|frappe|คาปูชิ/i], gi: 60 },
  { patterns: [/กาแฟ|coffee/i], gi: 0 },
];

const FOOD_GI_RULES = [
  { patterns: [/ข้าวเปล่า|ข้าวสวย/i], gi: 73 },
  { patterns: [/ข้าวเหนียว/i], gi: 70 },
  { patterns: [/ส้มตำ|ลาบ|ยำ/i], gi: 45 },
  { patterns: [/สลัด/i], gi: 15 },
  { patterns: [/ไข่/i], gi: 0 },
  { patterns: [/ก๋วยเตี๋ยว|บะหมี่|เส้น/i], gi: 55 },
];

const giLevelFromScore = (score) => {
  if (score <= 55) return "ต่ำ";
  if (score >= 66) return "สูง";
  return "กลาง";
};

export const estimateItemGI = (food) => {
  if (!food) return null;
  if (food.gi != null && Number.isFinite(Number(food.gi))) {
    return Math.max(0, Math.min(100, Math.round(Number(food.gi))));
  }

  const name = String(food.name || food.baseName || "").toLowerCase();
  const isDrink = food.category === "drink"
    || /(?:^|\s)(น้ำ|ชา|กาแฟ|coffee|tea|cola|pepsi|milk|โซดา|soda)(?:\s|$)/i.test(name);

  const rules = isDrink ? DRINK_GI_RULES : FOOD_GI_RULES;
  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(name))) {
      return rule.gi;
    }
  }

  if (isDrink) {
    const carbs = Number(food.carbs) || 0;
    if (carbs <= 1) return 0;
    if (carbs >= 40) return 75;
    if (carbs >= 20) return 60;
    return 45;
  }

  return null;
};

export const estimateMealGI = (mealList, totals) => {
  if (!mealList?.length || !totals?.cal) return null;

  const weightedItems = mealList
    .map((food) => {
      const gi = estimateItemGI(food);
      if (gi == null) return null;
      const carbWeight = Math.max(Number(food.carbs) || 0, 0.5);
      return { gi, weight: carbWeight };
    })
    .filter(Boolean);

  let score;
  if (weightedItems.length > 0) {
    const totalWeight = weightedItems.reduce((sum, item) => sum + item.weight, 0);
    score = weightedItems.reduce((sum, item) => sum + item.gi * item.weight, 0) / totalWeight;
  } else {
    const names = mealList.map((food) => String(food.name || "").toLowerCase()).join(" ");
    score = 55;
    if (HIGH_GI_KEYWORDS.some((keyword) => names.includes(keyword))) score += 12;
    if (LOW_GI_KEYWORDS.some((keyword) => names.includes(keyword))) score -= 10;
  }

  const carbCalPct = totals.cal > 0 ? (totals.c * 4) / totals.cal : 0;
  if (carbCalPct > 0.55) score += 8;
  if (carbCalPct < 0.35) score -= 6;

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    level: giLevelFromScore(score),
  };
};
