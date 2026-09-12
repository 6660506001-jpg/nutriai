import { getTodayKey } from "./dailyArchive";

export { getTodayKey };

export const MEAL_ORDER = ["มื้อเช้า", "มื้อกลางวัน", "มื้อเย็น"];

export const MEAL_WINDOWS = {
  "มื้อเช้า": {
    short: "เช้า",
    rangeLabel: "04:00–10:59 น.",
    uxNote: "เผื่อคนที่ตื่นเช้ามาก หรือกินเช้าสาย",
  },
  "มื้อกลางวัน": {
    short: "กลางวัน",
    rangeLabel: "11:00–15:59 น.",
    uxNote: "ครอบคลุมช่วงเที่ยงและบ่าย",
  },
  "มื้อเย็น": {
    short: "เย็น/ว่าง",
    rangeLabel: "16:00–03:59 น.",
    uxNote: "รวมมื้อค่ำและมื้อดึก",
  },
};

/** เลือกมื้อตามเวลา — เช้า 04:00–10:59 / กลางวัน 11:00–15:59 / เย็น–ว่าง 16:00–03:59 */
export const getMealPeriodByTime = (date = new Date()) => {
  const hour = date.getHours();
  if (hour >= 4 && hour < 11) return "มื้อเช้า";
  if (hour >= 11 && hour < 16) return "มื้อกลางวัน";
  return "มื้อเย็น";
};

export const getMealShort = (mealType) =>
  MEAL_WINDOWS[mealType]?.short
  || String(mealType || "").replace("มื้อ", "")
  || "—";

export const getMealAutoHint = (mealType, date = new Date()) => {
  const meta = MEAL_WINDOWS[mealType];
  if (!meta) return "";
  const prefix = getMealPeriodByTime(date) === mealType
    ? "ระบบเลือกให้อัตโนมัติ"
    : getMealShort(mealType);
  return `${prefix} · ${meta.rangeLabel} · ${meta.uxNote}`;
};

export const formatTodayLabel = (date = new Date()) =>
  date.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatLogTime = (loggedAt) => {
  if (!loggedAt) return "—";
  const parsed = new Date(loggedAt);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
};

export const formatNowTime = () =>
  new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

export const stampLogMeta = (entry, mealPeriod) => {
  const now = new Date();
  return {
    ...entry,
    loggedAt: entry?.loggedAt || now.toISOString(),
    loggedDate: entry?.loggedDate || getTodayKey(),
    mealPeriod: entry?.mealPeriod || mealPeriod,
  };
};

export const sumCalories = (items) =>
  (Array.isArray(items) ? items : []).reduce(
    (sum, item) => sum + (Number(item?.calories) || 0),
    0,
  );

export const mealTotalsFromDaily = (dailyMeals) =>
  MEAL_ORDER.reduce((acc, mealType) => {
    acc[mealType] = sumCalories(dailyMeals?.[mealType]);
    return acc;
  }, {});
