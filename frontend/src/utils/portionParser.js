import { getTodayKey } from "./dailyArchive";
import { isUnverifiedFoodEntry } from "./foodEstimator";
import {
  applyDrinkSweetness,
  getDrinkSweetnessOption,
  isDrinkFood,
  isFruitFood,
  supportsDrinkSweetness,
} from "./drinkSweetness";

const THAI_NUMBER_WORDS = {
  หนึ่ง: 1,
  สอง: 2,
  สาม: 3,
  สี่: 4,
  ห้า: 5,
  ครึ่ง: 0.5,
  เค้า: 0.5,
};

export const FOOD_PORTION_TYPES = [
  { id: "plate", label: "จาน", hint: "เลือกขนาดจาน" },
  { id: "piece", label: "ลูก", hint: "ระบุจำนวน" },
  { id: "tbsp", label: "ทัพพี", hint: "1 ทัพพี ≈ 80g" },
  { id: "gram", label: "กรัม (g)", hint: "ระบุน้ำหนัก" },
];

export const PLATE_SIZE_OPTIONS = [
  { id: "small", label: "เล็ก", grams: 100 },
  { id: "normal", label: "ปกติ", grams: 150 },
  { id: "large", label: "พิเศษ", grams: 220 },
];

export const DRINK_PORTION_TYPES = [
  { id: "glass", label: "แก้ว", hint: "เลือกขนาดแก้ว" },
];

const buildGlassSizeOptions = (normalGrams) => {
  const normal = Math.max(1, Number(normalGrams) || 300);
  return [
    { id: "small", label: "เล็ก", grams: Math.round(normal * 0.67) },
    { id: "normal", label: "ปกติ", grams: normal },
    { id: "large", label: "พิเศษ", grams: Math.round(normal * 1.45) },
  ];
};

export const getGlassSizeOptions = (food) =>
  buildGlassSizeOptions(Number(food?.defaultServingGrams) || 300);

const PIECE_UNITS = ["ลูก", "ชิ้น", "ผล", "ฟอง", "ฝัก"];
const CUP_UNITS = ["ถ้วย", "แก้ว"];

export const stripPortionSuffix = (name) =>
  String(name || "").replace(/\s*\([^)]+\)\s*$/g, "").trim();

const parseNumber = (raw) => {
  if (raw == null) return 1;
  const token = String(raw).trim().toLowerCase();
  if (THAI_NUMBER_WORDS[token] != null) return THAI_NUMBER_WORDS[token];
  const num = Number(token);
  return Number.isFinite(num) ? num : 1;
};

export const resolveServingMeta = (food) => {
  const label = String(food?.defaultServingLabel || "").trim();
  const totalGrams = Number(food?.defaultServingGrams) || null;
  const labelMatch = label.match(
    /^(\d+(?:\.\d+)?|หนึ่ง|สอง|สาม|สี่|ห้า|ครึ่ง|เค้า)?\s*(ลูก|ชิ้น|ผล|ถ้วย|แก้ว|ฟอง|ฝัก)/,
  );

  if (labelMatch) {
    const baseCount = labelMatch[1] ? parseNumber(labelMatch[1]) : 1;
    const unit = labelMatch[2];
    const isCup = CUP_UNITS.includes(unit);
    const gramsPerUnit = totalGrams ? totalGrams / baseCount : null;
    return {
      type: isCup ? "cup" : "piece",
      unit,
      unitLabel: unit,
      baseCount,
      gramsPerUnit,
      referenceLabel: label,
      hint: totalGrams
        ? `1 ${unit} ≈ ${Math.round(gramsPerUnit || totalGrams)}g · ข้อมูลอ้างอิง ${label} (${totalGrams}g)`
        : `ข้อมูลอ้างอิง ${label}`,
    };
  }

  if (food?.category === "fruit" || isFruitFood(food)) {
    return {
      type: "piece",
      unit: "ลูก",
      unitLabel: "ลูก",
      baseCount: 1,
      gramsPerUnit: totalGrams || 120,
      referenceLabel: totalGrams ? `1 ลูก (~${totalGrams}g)` : "1 ลูก",
      hint: totalGrams ? `1 ลูก ≈ ${totalGrams}g` : "ระบุจำนวนลูก",
    };
  }

  const cleanName = stripPortionSuffix(food?.baseName || food?.name || "");
  if (/^ไข่(?:ต้ม|ลวก|ตุ๋น|ดาว|ทอด)/.test(cleanName)) {
    const gramsPerUnit = totalGrams || 50;
    return {
      type: "piece",
      unit: "ฟอง",
      unitLabel: "ฟอง",
      baseCount: 1,
      gramsPerUnit,
      referenceLabel: `1 ฟอง (~${gramsPerUnit}g)`,
      hint: `1 ฟอง ≈ ${gramsPerUnit}g`,
    };
  }

  return null;
};

export const FRUIT_PORTION_TYPES = [
  { id: "piece", label: "ลูก", hint: "ระบุจำนวน" },
  { id: "gram", label: "กรัม (g)", hint: "ระบุน้ำหนัก" },
];

export const getPortionTypesForFood = (food) => {
  if (isDrinkFood(food)) return DRINK_PORTION_TYPES;

  const meta = resolveServingMeta(food);
  const baseTypes = (food?.category === "fruit" || isFruitFood(food))
    ? FRUIT_PORTION_TYPES
    : FOOD_PORTION_TYPES;
  if (!meta) return baseTypes;

  return baseTypes.map((option) => {
    if (option.id !== "piece") return option;
    if (meta.type === "cup") {
      return { id: "cup", label: meta.unitLabel, hint: meta.hint };
    }
    return { id: "piece", label: meta.unitLabel, hint: meta.hint };
  });
};

export const isPieceBasedFood = (food) => {
  const meta = resolveServingMeta(food);
  return meta?.type === "piece" || meta?.type === "cup";
};

const UNIT_GRAMS = {
  จาน: 150,
  ทัพพี: 80,
  ทัพพจน์: 80,
  ช้อน: 15,
  ชาม: 200,
  ถ้วย: 120,
  ลูก: null,
  ชิ้น: null,
  ผล: null,
  ฟอง: null,
  ฝัก: null,
  g: null,
  ก: null,
  gram: null,
  กรัม: null,
};

export const parsePortion = (name) => {
  const original = String(name || "").trim().replace(/\s+/g, " ");
  let foodName = original;
  let multiplier = 1;
  let unit = null;
  let grams = null;

  const patterns = [
    /(\d+(?:\.\d+)?|หนึ่ง|สอง|สาม|สี่|ห้า|ครึ่ง|เค้า)\s*(จาน|ทัพพี|ทัพพจน์|ชาม|ถ้วย|ช้อน|ลูก|ชิ้น|ผล|ฟอง|ฝัก)/i,
    /(\d+(?:\.\d+)?)\s*(g|ก|gram|กรัม)\b/i,
  ];

  for (const pattern of patterns) {
    const match = original.match(pattern);
    if (!match) continue;
    multiplier = parseNumber(match[1]);
    unit = match[2].toLowerCase();
    foodName = (original.slice(0, match.index) + original.slice(match.index + match[0].length)).trim().replace(/^[, -]+|[, -]+$/g, "");
    break;
  }

  if (!unit) {
    const onePlate = original.match(/\b1\s*จาน\b/i);
    if (onePlate) {
      multiplier = 1;
      unit = "จาน";
      foodName = original.replace(/\b1\s*จาน\b/i, "").trim().replace(/^[, -]+|[, -]+$/g, "");
    }
  }

  if (unit && ["g", "ก", "gram", "กรัม"].includes(unit)) {
    grams = multiplier;
  } else if (unit && UNIT_GRAMS[unit]) {
    grams = multiplier * UNIT_GRAMS[unit];
  }

  if (!foodName) foodName = original;

  return { originalName: original, foodName, multiplier, unit, grams };
};

export const buildPortionFromSelection = ({
  type,
  amount,
  plateSize,
  servingGrams = 120,
  servingUnit = "ลูก",
  baseServingCount = 1,
}) => {
  if (type === "gram") {
    const grams = Math.max(1, Number(amount) || 100);
    return { multiplier: grams, unit: "g", grams, plateSize: null, plateLabel: null };
  }

  if (type === "piece" || type === "cup") {
    const qty = Math.max(0.5, Number(amount) || 1);
    const gramsPerUnit = Math.max(1, Number(servingGrams) / Math.max(baseServingCount, 1));
    return {
      multiplier: qty,
      unit: servingUnit,
      grams: qty * gramsPerUnit,
      baseServingCount,
      plateSize: null,
      plateLabel: null,
    };
  }

  if (type === "tbsp") {
    const qty = Math.max(0.5, Number(amount) || 1);
    return {
      multiplier: qty,
      unit: "ทัพพี",
      grams: qty * UNIT_GRAMS.ทัพพี,
      plateSize: null,
      plateLabel: null,
    };
  }

  if (type === "glass") {
    const options = buildGlassSizeOptions(servingGrams);
    const glass = options.find((option) => option.id === plateSize) || options[1];
    return {
      multiplier: 1,
      unit: "แก้ว",
      grams: glass.grams,
      glassSize: glass.id,
      glassLabel: glass.label,
      plateSize: null,
      plateLabel: null,
    };
  }

  if (type === "plate") {
    const plate = PLATE_SIZE_OPTIONS.find((option) => option.id === plateSize)
      || PLATE_SIZE_OPTIONS[1];
    return {
      multiplier: 1,
      unit: "จาน",
      grams: plate.grams,
      plateSize: plate.id,
      plateLabel: plate.label,
    };
  }

  return {
    multiplier: 1,
    unit: null,
    grams: null,
    plateSize: null,
    plateLabel: null,
  };
};

export const formatPortionLabel = (selection, servingMeta = null) => {
  if (!selection) return null;
  if (selection.type === "gram") return `${Math.round(Number(selection.amount) || 0)}g`;
  if (selection.type === "tbsp") {
    const qty = Number(selection.amount) || 1;
    const qtyText = qty === Math.floor(qty) ? Math.floor(qty) : qty;
    return `${qtyText} ทัพพี`;
  }
  if (selection.type === "piece" || selection.type === "cup") {
    const qty = Number(selection.amount) || 1;
    const qtyText = qty === Math.floor(qty) ? Math.floor(qty) : qty;
    const unit = servingMeta?.unitLabel || (selection.type === "cup" ? "ถ้วย" : "ลูก");
    return `${qtyText} ${unit}`;
  }
  if (selection.type === "plate") {
    const plate = PLATE_SIZE_OPTIONS.find((option) => option.id === selection.plateSize)
      || PLATE_SIZE_OPTIONS[1];
    return `จาน${plate.label}`;
  }
  if (selection.type === "glass") {
    const glass = buildGlassSizeOptions(selection.referenceGrams || 300)
      .find((option) => option.id === selection.plateSize)
      || buildGlassSizeOptions(selection.referenceGrams || 300)[1];
    return `แก้ว${glass.label}`;
  }
  return null;
};

export const formatPortionNote = (portion) => {
  if (portion.glassLabel) return `แก้ว${portion.glassLabel}`;
  if (portion.plateLabel) return `จาน${portion.plateLabel}`;
  if (portion.grams && portion.unit === "g") return `${Math.round(portion.grams)}g`;
  if (portion.grams) return `${Math.round(portion.grams)}g`;
  if (portion.unit) {
    const qty = portion.multiplier;
    const qtyText = qty === Math.floor(qty) ? Math.floor(qty) : qty;
    return `${qtyText} ${portion.unit}`;
  }
  return null;
};

export const buildFoodLogEntry = (food, selection) => {
  const servingMeta = resolveServingMeta(food);
  const drinkNormalGrams = isDrinkFood(food)
    ? getGlassSizeOptions(food).find((option) => option.id === "normal")?.grams || 300
    : null;
  const servingGrams = food?.defaultServingGrams || servingMeta?.gramsPerUnit || drinkNormalGrams || 120;
  const portionSelection = selection.type === "glass"
    ? { ...selection, referenceGrams: servingGrams }
    : selection;
  const portion = buildPortionFromSelection({
    ...portionSelection,
    servingGrams,
    servingUnit: servingMeta?.unit || "ลูก",
    baseServingCount: servingMeta?.baseCount || 1,
  });
  const foodForScale = drinkNormalGrams && !food?.defaultServingGrams
    ? { ...food, defaultServingGrams: drinkNormalGrams }
    : food;
  const scaledBase = scaleNutrition(foodForScale, portion, foodForScale);
  const sweetnessOption = selection.sweetness && supportsDrinkSweetness(food)
    ? getDrinkSweetnessOption(selection.sweetness)
    : null;
  const scaled = sweetnessOption
    ? applyDrinkSweetness(scaledBase, sweetnessOption.factor, food)
    : scaledBase;
  const portionLabel = formatPortionLabel(portionSelection, servingMeta);
  const portionNote = formatPortionNote(portion);
  const sweetnessLabel = sweetnessOption ? sweetnessOption.label : null;
  const baseName = food.baseName || stripPortionSuffix(food.name) || food.name;
  const nameParts = [portionLabel, sweetnessLabel].filter(Boolean);

  return {
    ...food,
    baseName,
    name: nameParts.length ? `${baseName} (${nameParts.join(" · ")})` : baseName,
    ...scaled,
    portion,
    portionSelection: selection,
    portionLabel,
    portionNote,
    sweetness: sweetnessOption?.id || null,
    sweetnessLabel,
    nutritionUnverified: isUnverifiedFoodEntry(food),
    loggedAt: new Date().toISOString(),
    loggedDate: getTodayKey(),
  };
};

export const scaleNutrition = (nutrition, portion, item = null) => {
  const base = {
    calories: Number(nutrition.calories) || 0,
    protein: Number(nutrition.protein) || 0,
    carbs: Number(nutrition.carbs) || 0,
    fat: Number(nutrition.fat) || 0,
  };

  const per100g = item?.per100g;
  const defaultServingGrams = item?.defaultServingGrams;

  let factor = 1;
  let source = base;

  if (portion.grams) {
    if (per100g) {
      factor = portion.grams / 100;
      source = per100g;
    } else if (defaultServingGrams) {
      factor = portion.grams / Number(defaultServingGrams);
      source = base;
    } else {
      factor = portion.grams / 150;
      source = base;
    }
  } else if (portion.unit && defaultServingGrams && PIECE_UNITS.includes(portion.unit)) {
    const baseCount = Number(portion.baseServingCount) || 1;
    factor = portion.multiplier / baseCount;
    source = base;
  } else if (portion.unit && defaultServingGrams && CUP_UNITS.includes(portion.unit)) {
    const baseCount = Number(portion.baseServingCount) || 1;
    factor = portion.multiplier / baseCount;
    source = base;
  } else if (portion.unit && defaultServingGrams && UNIT_GRAMS[portion.unit]) {
    const targetGrams = portion.multiplier * UNIT_GRAMS[portion.unit];
    factor = targetGrams / Number(defaultServingGrams);
    source = base;
  } else if (portion.multiplier && portion.multiplier !== 1) {
    factor = portion.multiplier;
    source = base;
  } else {
    return {
      calories: Math.round(base.calories),
      protein: Math.round(base.protein * 10) / 10,
      carbs: Math.round(base.carbs * 10) / 10,
      fat: Math.round(base.fat * 10) / 10,
    };
  }

  return {
    calories: Math.round(source.calories * factor),
    protein: Math.round(source.protein * factor * 10) / 10,
    carbs: Math.round(source.carbs * factor * 10) / 10,
    fat: Math.round(source.fat * factor * 10) / 10,
  };
};
