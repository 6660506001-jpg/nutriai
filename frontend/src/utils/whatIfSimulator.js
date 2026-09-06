import { getChartThemeColors } from "./chartTheme";
import { containsPork } from "./foodExclusions";

const MACRO_OVERFLOW = 110;
const MEAL_MACRO_OVERFLOW = 1.12;
const DRINK_ESTIMATE_OVERRIDES = [
  {
    patterns: [/ชาเขียว.*นม/, /green tea milk/i, /ชาเขียวนม/],
    food: { name: "ชาเขียวนมสด", calories: 280, protein: 4, carbs: 52, fat: 7 },
  },
  {
    patterns: [/มัทฉะ.*ลาเต/, /matcha latte/i],
    food: { name: "มัทฉะลาเต้", calories: 180, protein: 5, carbs: 22, fat: 6 },
  },
  {
    patterns: [/ชาไทย/, /thai tea/i],
    food: { name: "ชาไทยนม", calories: 300, protein: 3, carbs: 55, fat: 8 },
  },
  {
    patterns: [/กาแฟ.*นม/, /ลาเต/, /latte/i],
    food: { name: "ลาเต้", calories: 190, protein: 6, carbs: 18, fat: 8 },
  },
];

const SWAP_CATALOG = [
  {
    patterns: [/ชาเขียว/, /ชานม/, /ไข่มุก/, /bubble tea/, /ชาไทย/],
    alternative: {
      name: "มัทฉะลาเต้ไม่พิสตาชิโอ หวานน้อย 25%",
      calories: 110,
      protein: 5,
      carbs: 10,
      fat: 4,
    },
  },
  {
    patterns: [/ข้าวผัดหมู/, /กะเพราหมู/, /ผัด.*หมู/],
    alternative: {
      name: "ข้าวผัดไก่ (ไก่ล้วน) ไม่ใส่ไข่ดาว",
      calories: 250,
      protein: 20,
      carbs: 32,
      fat: 8,
    },
  },
  {
    patterns: [/ข้าวผัดไก่/, /ผัดไก่/],
    alternative: {
      name: "ข้าวราดไก่ตุ๋น (เนื้อเปล่า) + น้ำซุปใส",
      calories: 260,
      protein: 24,
      carbs: 30,
      fat: 6,
    },
  },
  {
    patterns: [/ข้าวผัด/, /ผัดไทย/, /ก๋วยเตี๋ยว/],
    alternative: {
      name: "ข้าวราดไก่ตุ๋น (เนื้อเปล่า) + น้ำซุปใส",
      calories: 260,
      protein: 24,
      carbs: 30,
      fat: 6,
    },
  },
  {
    patterns: [/ไก่ทอด/, /ทอด/],
    alternative: {
      name: "อกไก่ย่าง + สลัดผัก",
      calories: 250,
      protein: 28,
      carbs: 10,
      fat: 10,
    },
  },
  {
    patterns: [/เค้ก/, /บราวนี่/, /ขนม/, /ไอศกรีม/],
    alternative: {
      name: "โยเกิร์ตไขมันต่ำ + ผลไม้ 1 ส่วน",
      calories: 140,
      protein: 8,
      carbs: 20,
      fat: 3,
    },
  },
];

export const normalizeWhatIfQuery = (raw) =>
  String(raw || "")
    .trim()
    .replace(/^(มื้อถัดไป|อยากกิน|ถ้ากิน|ลองกิน|จะกิน)\s*/i, "")
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .trim();

export const matchDrinkOverride = (query) => {
  const text = normalizeWhatIfQuery(query);
  if (!text) return null;
  return (
    DRINK_ESTIMATE_OVERRIDES.find((row) =>
      row.patterns.some((pattern) => pattern.test(text)),
    )?.food || null
  );
};

const pct = (part, whole) => (whole > 0 ? (Number(part) / whole) * 100 : 0);

const getMealMacroTargets = (macros, recommendationTargets) => {
  if (!recommendationTargets?.canRecommend) {
    return {
      carbs: Math.round((macros.carbs || 0) * 0.35),
      fat: Math.round((macros.fat || 0) * 0.35),
      protein: Math.round((macros.protein || 0) * 0.3),
    };
  }

  return {
    carbs: recommendationTargets.targetCarbs || Math.round((macros.carbs || 0) * 0.35),
    fat: recommendationTargets.targetFat || Math.round((macros.fat || 0) * 0.35),
    protein: recommendationTargets.targetProtein || Math.round((macros.protein || 0) * 0.3),
  };
};

const buildProgressRows = (eaten, macros) => {
  const chartColors = getChartThemeColors();
  return [
    { key: "p", label: "โปรตีน", valuePct: pct(eaten.p, macros.protein), color: chartColors.primary },
    { key: "c", label: "คาร์โบไฮเดรต", valuePct: pct(eaten.c, macros.carbs), color: "#64748b" },
    { key: "f", label: "ไขมัน", valuePct: pct(eaten.f, macros.fat), color: "#94a3b8" },
  ];
};
const findSwap = (foodName) => {
  const text = normalizeWhatIfQuery(foodName);
  const rule = SWAP_CATALOG.find((row) => row.patterns.some((pattern) => pattern.test(text)));
  if (!rule || containsPork(rule.alternative?.name)) return null;
  return rule;
};

const buildWarnings = (projectedPct, mealWindow, projectedCal, proposedFood, macros, recommendationTargets) => {
  const warnings = [];
  const mealTargets = getMealMacroTargets(macros, recommendationTargets);

  if (proposedFood.carbs > mealTargets.carbs * MEAL_MACRO_OVERFLOW) {
    warnings.push({
      key: "meal-carbs",
      label: "คาร์โบไฮเดรต",
      pct: projectedPct.carbs,
      message: `คาร์บจากเมนูนี้ ~${Math.round(proposedFood.carbs)}g สูงกว่าที่แนะนำต่อมื้อ (~${mealTargets.carbs}g) — คาร์บรวมวันจะขึ้นเป็น ${Math.round(projectedPct.carbs)}%`,
    });
  }
  if (proposedFood.fat > mealTargets.fat * MEAL_MACRO_OVERFLOW) {
    warnings.push({
      key: "meal-fat",
      label: "ไขมัน",
      pct: projectedPct.fat,
      message: `ไขมันจากเมนูนี้ ~${Math.round(proposedFood.fat)}g เกินเป้ามื้อ (~${mealTargets.fat}g) — รวมวันจะอยู่ที่ ${Math.round(projectedPct.fat)}%`,
    });
  }

  if (projectedPct.carbs > MACRO_OVERFLOW) {
    warnings.push({
      key: "carbs",
      label: "คาร์โบไฮเดรต",
      pct: projectedPct.carbs,
      message: `คาร์บจะขึ้นเป็น ${Math.round(projectedPct.carbs)}% — ทะลุเป้ามื้อนี้`,
    });
  }
  if (projectedPct.fat > MACRO_OVERFLOW) {
    warnings.push({
      key: "fat",
      label: "ไขมัน",
      pct: projectedPct.fat,
      message: `ไขมันจะขึ้นเป็น ${Math.round(projectedPct.fat)}% — สูงกว่าที่แนะนำ`,
    });
  }
  if (projectedPct.protein > MACRO_OVERFLOW) {
    warnings.push({
      key: "protein",
      label: "โปรตีน",
      pct: projectedPct.protein,
      message: `โปรตีนจะสูงเกินสัดส่วน (${Math.round(projectedPct.protein)}%)`,
    });
  }

  if (mealWindow && projectedCal > mealWindow.max + 20) {
    warnings.push({
      key: "calories",
      label: "พลังงาน",
      pct: null,
      message: `แคลรวมมื้อนี้ ~${Math.round(projectedCal)} kcal เกินช่วงที่แนะนำ (${mealWindow.min}–${mealWindow.max} kcal)`,
    });
  }

  return warnings;
};

const buildSwapAdvice = ({
  proposedFood,
  alternative,
  totalEaten,
  macros,
  mealWindow,
  recommendationTargets,
}) => {
  const origProjected = {
    p: totalEaten.p + proposedFood.protein,
    c: totalEaten.c + proposedFood.carbs,
    f: totalEaten.f + proposedFood.fat,
    cal: totalEaten.cal + proposedFood.calories,
  };

  const altProjected = {
    p: totalEaten.p + alternative.protein,
    c: totalEaten.c + alternative.carbs,
    f: totalEaten.f + alternative.fat,
    cal: totalEaten.cal + alternative.calories,
  };

  const origCarbPct = pct(origProjected.c, macros.carbs);
  const altCarbPct = pct(altProjected.c, macros.carbs);
  const carbDropPct =
    proposedFood.carbs > 0
      ? Math.round((1 - alternative.carbs / proposedFood.carbs) * 100)
      : 0;

  const mealTargets = getMealMacroTargets(macros, recommendationTargets);
  const fitsMeal =
    !mealWindow ||
    (altProjected.cal <= mealWindow.max + 15 &&
      alternative.carbs <= mealTargets.carbs * MEAL_MACRO_OVERFLOW &&
      alternative.fat <= mealTargets.fat * MEAL_MACRO_OVERFLOW);

  let message = `หากเปลี่ยนเป็น "${alternative.name}"`;
  if (carbDropPct > 0) {
    message += ` คาร์บจะลดลง ~${carbDropPct}%`;
  }
  if (altCarbPct <= MACRO_OVERFLOW && origCarbPct > MACRO_OVERFLOW) {
    message += " และคาร์บรวมวันจะกลับมาอยู่ในเกณฑ์ที่ระบบแนะนำ";
  } else if (fitsMeal) {
    message += " และอยู่ในเกณฑ์ที่ระบบแนะนำมื้อนี้";
  } else if (carbDropPct >= 40) {
    message += " — ช่วยลดความเสี่ยงคาร์บเกินเป้าได้มาก";
  } else {
    message += " — ยังดีกว่าตัวเลือกเดิม";
  }

  return {
    alternative,
    message,
    carbDropPct,
    projectedWithSwap: altProjected,
    projectedPctWithSwap: {
      protein: pct(altProjected.p, macros.protein),
      carbs: altCarbPct,
      fat: pct(altProjected.f, macros.fat),
    },
  };
};

export const simulateWhatIf = ({
  totalEaten,
  macros,
  proposedFood,
  recommendationTargets,
}) => {
  if (!proposedFood || !macros?.protein) {
    return null;
  }

  const projected = {
    p: (totalEaten.p || 0) + (Number(proposedFood.protein) || 0),
    c: (totalEaten.c || 0) + (Number(proposedFood.carbs) || 0),
    f: (totalEaten.f || 0) + (Number(proposedFood.fat) || 0),
    cal: (totalEaten.cal || 0) + (Number(proposedFood.calories) || 0),
  };

  const projectedPct = {
    protein: pct(projected.p, macros.protein),
    carbs: pct(projected.c, macros.carbs),
    fat: pct(projected.f, macros.fat),
  };

  const mealWindow = recommendationTargets?.canRecommend
    ? { min: recommendationTargets.calMin, max: recommendationTargets.calMax }
    : null;

  const warnings = buildWarnings(
    projectedPct,
    mealWindow,
    projected.cal,
    proposedFood,
    macros,
    recommendationTargets,
  );
  const swapRule = findSwap(proposedFood.name);
  const swap =
    swapRule && warnings.length > 0
      ? buildSwapAdvice({
          proposedFood,
          alternative: swapRule.alternative,
          totalEaten,
          macros,
          mealWindow,
          recommendationTargets,
        })
      : null;

  const chartColors = getChartThemeColors();
  const compareRows = [
    {
      key: "p",
      label: "โปรตีน",
      currentPct: pct(totalEaten.p, macros.protein),
      projectedPct: projectedPct.protein,
      color: chartColors.primary,
    },
    {
      key: "c",
      label: "คาร์โบไฮเดรต",
      currentPct: pct(totalEaten.c, macros.carbs),
      projectedPct: projectedPct.carbs,
      color: "#64748b",
    },
    {
      key: "f",
      label: "ไขมัน",
      currentPct: pct(totalEaten.f, macros.fat),
      projectedPct: projectedPct.fat,
      color: "#94a3b8",
    },
  ];

  const isRisky = warnings.length > 0;
  const verdict = isRisky
    ? "เมนูนี้มีความเสี่ยงทำให้มาโครเกินเป้า — ดูกราฟจำลองและทางเลือกด้านล่าง"
    : "เมนูนี้อยู่ในเกณฑ์ที่พอรับได้สำหรับมื้อถัดไป";

  return {
    proposedFood,
    projected,
    projectedPct,
    currentProgress: buildProgressRows(totalEaten, macros),
    compareRows,
    warnings,
    swap,
    isRisky,
    verdict,
    tone: isRisky ? "warn" : "good",
    swapCompareRows: swap
      ? [
          {
            key: "c",
            label: "คาร์โบไฮเดรต (หลังสลับ)",
            currentPct: projectedPct.carbs,
            projectedPct: swap.projectedPctWithSwap.carbs,
            color: "#64748b",
          },
        ]
      : null,
  };
};

export { macroBarTone } from "./aiPrediction";