import { getTodayKey } from "./dailyArchive";
import { MEAL_ORDER } from "./logDisplay";

export const isAllMealsLogged = (dailyMeals) =>
  MEAL_ORDER.every((mealType) => (dailyMeals?.[mealType] || []).length > 0);

export const getCelebrationStorageKey = (username, dateKey = getTodayKey()) =>
  `nutri_all_meals_celebration__${encodeURIComponent(username || "guest")}__${dateKey}`;

export const buildDailyCompleteCelebration = (dailyRewards) => {
  const { totalStars, totalPoints, totalHearts, mealCount } = dailyRewards;

  let stars = 1;
  if (totalStars >= 7) stars = 3;
  else if (totalStars >= 4) stars = 2;

  let message = "ครบ 3 มื้อแล้ว!";
  let hint = `${totalPoints} แต้ม · ${totalHearts} ♥`;

  if (totalStars >= 8) {
    message = "ยอดเยี่ยม! ครบทุกมื้อวันนี้";
    hint = "กินสมดุลมาก — เก็บแต้มต่อไป";
  } else if (totalStars >= 5) {
    message = "ดีมาก! ครบ 3 มื้อแล้ว";
    hint = "รักษาแบบนี้พรุ่งนี้";
  } else if (mealCount === 3) {
    message = "ครบ 3 มื้อแล้ว";
    hint = "มื้อหน้าเพิ่มโปรตีน/ผัก";
  }

  return {
    stars,
    message,
    hint,
    totalPoints,
    totalHearts,
    tone: stars === 3 ? "great" : stars === 2 ? "good" : "watch",
  };
};
