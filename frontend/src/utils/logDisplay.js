import { getTodayKey } from "./dailyArchive";

export { getTodayKey };

export const MEAL_ORDER = ["มื้อเช้า", "มื้อกลางวัน", "มื้อเย็น"];

export const getMealShort = (mealType) =>
  ({
    "มื้อเช้า": "เช้า",
    "มื้อกลางวัน": "กลางวัน",
    "มื้อเย็น": "เย็น",
  }[mealType] || String(mealType || "").replace("มื้อ", "") || "—");

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
