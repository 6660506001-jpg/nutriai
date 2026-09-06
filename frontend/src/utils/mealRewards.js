import { MEAL_ORDER } from "./logDisplay";

const POINTS_BY_STARS = { 1: 3, 2: 6, 3: 10 };

export const scoreMealReward = (analysis) => {
  if (!analysis?.totals?.count) return null;

  if (analysis.nutritionUnverified) {
    return {
      stars: 0,
      hearts: 0,
      points: 0,
      praise: "บันทึกแล้ว — ยังประเมินโภชนาการไม่ได้",
      tip: "เลือกจากฐานข้อมูลหรือพิมพ์ชื่อเมนูที่รู้จัก",
      tone: "neutral",
      badge: "บันทึกแล้ว",
      unverified: true,
    };
  }

  const { status, totals, advice, shortStatus, target } = analysis;
  const fatCalPct = totals.cal > 0 ? (totals.f * 9) / totals.cal : 0;

  let stars = 1;
  if (status === "พลังงานพอดี" && totals.p >= 15 && fatCalPct <= 0.38) {
    stars = 3;
  } else if (status === "พลังงานพอดี" || (totals.p >= 12 && status !== "พลังงานสูง")) {
    stars = 2;
  }

  if (stars === 3 && analysis.gi?.level === "สูง") {
    stars = 2;
  }

  const points = POINTS_BY_STARS[stars];
  const hearts = stars;

  let praise;
  if (stars === 3) praise = "เยี่ยม! มื้อนี้สมดุลดีมาก";
  else if (stars === 2) praise = "ดีมาก ใกล้เป้าแล้ว";
  else if (status === "พลังงานสูง") {
    const over = target ? Math.max(0, totals.cal - target.max) : 0;
    praise = over > 0 ? `กินเกินเป้ามื้อ ~${over} kcal` : "มื้อนี้กินเยอะกว่าเกณฑ์";
  } else if (status === "พลังงานต่ำ" && totals.cal >= 380) praise = "มื้อหลักครบพลังงาน แต่โปรตีนยังน้อย";
  else if (status === "พลังงานต่ำ") {
    const under = target ? Math.max(0, target.min - totals.cal) : 0;
    praise = under > 0 ? `กินน้อยกว่าเป้า ~${under} kcal` : "มื้อนี้พลังงานต่ำ";
  } else praise = "บันทึกเรียบร้อย";

  const tip = advice || "";

  return {
    stars,
    hearts,
    points,
    praise,
    tip,
    tone: stars === 3 ? "great" : stars === 2 ? "good" : "watch",
    badge: shortStatus || status,
  };
};

export const summarizeDailyRewards = (perMeal) => {
  const mealRewards = MEAL_ORDER.map((mealType) => {
    const analysis = perMeal?.[mealType];
    const reward = analysis ? scoreMealReward(analysis) : null;
    return reward ? { mealType, ...reward } : null;
  }).filter(Boolean);

  const totalPoints = mealRewards.reduce((sum, item) => sum + item.points, 0);
  const totalHearts = mealRewards.reduce((sum, item) => sum + item.hearts, 0);
  const totalStars = mealRewards.reduce((sum, item) => sum + item.stars, 0);
  const mealCount = mealRewards.length;

  let dayPraise = "บันทึกมื้อแรกเพื่อเริ่มสะสมแต้ม";
  if (mealCount === 1) dayPraise = "เริ่มต้นดี! สะสมต่อไปเลย";
  else if (mealCount === 2) dayPraise = "ไปได้สวย อีกมื้อเดียวครบ";
  else if (mealCount === 3 && totalStars >= 7) dayPraise = "วันนี้กินดีมาก ครบทุกมื้อ!";
  else if (mealCount === 3) dayPraise = "ครบ 3 มื้อแล้ว — รักษาแบบนี้";

  return {
    mealRewards,
    totalPoints,
    totalHearts,
    totalStars,
    mealCount,
    dayPraise,
  };
};

export const renderStars = (count, max = 3) =>
  Array.from({ length: max }, (_, index) => ({
    filled: index < count,
    key: index,
  }));

export const renderHearts = (count, max = 3) =>
  Array.from({ length: max }, (_, index) => ({
    filled: index < count,
    key: index,
  }));
