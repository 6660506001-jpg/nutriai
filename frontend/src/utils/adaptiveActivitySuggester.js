import { FALLBACK_ACTIVITIES } from "./activityCatalog";
import { calculateActivityCalories } from "./activityCalculator";

const MACRO_OVERFLOW_THRESHOLD = 110;

const ACTIVITY_PRESETS = {
  carbs: ["walk-fast", "cycle", "aerobic", "run"],
  fat: ["walk-fast", "stairs", "run", "hiking"],
  protein: ["walk", "yoga", "stretch"],
  calories: ["walk-fast", "cycle", "run", "badminton"],
};

const roundDuration = (minutes) =>
  Math.max(10, Math.min(60, Math.round(minutes / 5) * 5));

const findMinutesToBurn = (activity, targetKcal, userWeight, intensity) => {
  const goal = Math.max(40, targetKcal);
  let best = { minutes: 25, calories: 0, diff: Infinity };

  for (let minutes = 10; minutes <= 60; minutes += 5) {
    const calories = calculateActivityCalories({
      activity,
      durationMinutes: minutes,
      intensity,
      userWeight,
    });
    const diff = Math.abs(calories - goal);
    if (calories >= goal * 0.85 && diff < best.diff) {
      best = { minutes, calories, diff };
    }
  }

  if (best.diff === Infinity) {
    for (let minutes = 10; minutes <= 60; minutes += 5) {
      const calories = calculateActivityCalories({
        activity,
        durationMinutes: minutes,
        intensity,
        userWeight,
      });
      const diff = Math.abs(calories - goal);
      if (diff < best.diff) {
        best = { minutes, calories, diff };
      }
    }
  }

  return {
    durationMinutes: roundDuration(best.minutes),
    burnCalories: best.calories,
  };
};

const pickActivity = (macroKey, severityPct) => {
  const ids = ACTIVITY_PRESETS[macroKey] || ACTIVITY_PRESETS.calories;
  const index = severityPct >= 130 ? 2 : severityPct >= 120 ? 1 : 0;
  return FALLBACK_ACTIVITIES.find((item) => item.id === ids[index])
    || FALLBACK_ACTIVITIES.find((item) => item.id === ids[0])
    || FALLBACK_ACTIVITIES[2];
};

const buildMessage = ({
  macroKey,
  macroLabel,
  overPctPoints,
  excessGrams,
  activity,
  durationMinutes,
  burnCalories,
  proteinBonusG,
}) => {
  const fmt = (n) => Math.round(Number(n) || 0);

  if (macroKey === "carbs") {
    let message = `วันนี้คาร์โบไฮเดรตของคุณเกินไป ${overPctPoints}%`;
    if (excessGrams > 0) message += ` (~${fmt(excessGrams)}g)`;
    message += ` หากคุณ${activity.name}เป็นเวลา ${durationMinutes} นาที จะช่วยเผาผลาญส่วนเกิน ~${burnCalories} kcal`;
    if (proteinBonusG > 0) {
      message += ` และช่วยเพิ่มโควตาโปรตีนในมื้อถัดไปได้อีก ~${proteinBonusG}g`;
    } else {
      message += " และช่วยดึงงบแคลกลับมาใกล้เป้า";
    }
    return message;
  }

  if (macroKey === "fat") {
    let message = `วันนี้ไขมันของคุณเกินไป ${overPctPoints}%`;
    if (excessGrams > 0) message += ` (~${fmt(excessGrams)}g)`;
    message += ` ลอง${activity.name} ${durationMinutes} นาที เพื่อเผา ~${burnCalories} kcal ส่วนเกิน`;
    if (proteinBonusG > 0) message += ` และเปิดโอกาสให้มื้อถัดไปได้โปรตีนเพิ่ม ~${proteinBonusG}g`;
    return message;
  }

  if (macroKey === "calories") {
    return `พลังงานวันนี้เกินเป้าแล้ว ลอง${activity.name} ${durationMinutes} นาที เพื่อเผา ~${burnCalories} kcal และดึงโควตากลับมา`;
  }

  return `${macroLabel}เกินเป้า ${overPctPoints}% — ${activity.name} ${durationMinutes} นาที ช่วยเผา ~${burnCalories} kcal`;
};

export const buildAdaptiveActivitySuggestion = ({
  macros,
  totalEaten,
  userWeight,
  remainingCal,
  proteinPct,
  carbsPct,
  fatPct,
}) => {
  const fmt = (n) => Math.round(Number(n) || 0);

  if (!macros?.protein || !totalEaten?.cal) {
    return { show: false };
  }

  const excessCarbsG = Math.max(0, (totalEaten.c || 0) - (macros.carbs || 0));
  const excessFatG = Math.max(0, (totalEaten.f || 0) - (macros.fat || 0));
  const excessProteinG = Math.max(0, (totalEaten.p || 0) - (macros.protein || 0));

  const overflows = [
    {
      key: "carbs",
      label: "คาร์โบไฮเดรต",
      pct: carbsPct,
      excessG: excessCarbsG,
      excessKcal: excessCarbsG * 4,
    },
    {
      key: "fat",
      label: "ไขมัน",
      pct: fatPct,
      excessG: excessFatG,
      excessKcal: excessFatG * 9,
    },
    {
      key: "protein",
      label: "โปรตีน",
      pct: proteinPct,
      excessG: excessProteinG,
      excessKcal: excessProteinG * 4,
    },
  ]
    .filter((item) => item.pct > MACRO_OVERFLOW_THRESHOLD)
    .sort((a, b) => b.pct - a.pct);

  const calorieOverflow = remainingCal < -30;

  if (!overflows.length && !calorieOverflow) {
    return { show: false };
  }

  const primary = overflows[0] || {
    key: "calories",
    label: "พลังงาน",
    pct: 100 + Math.abs(remainingCal) / 8,
    excessG: 0,
    excessKcal: Math.min(Math.abs(remainingCal), 260),
  };

  const targetBurnKcal = Math.max(
    50,
    Math.min(primary.excessKcal || Math.abs(remainingCal), 280),
  );

  const overPctPoints = Math.max(1, Math.round(primary.pct - 100));
  const intensity = primary.pct >= 125 ? "vigorous" : "moderate";
  const activity = pickActivity(primary.key, primary.pct);

  const { durationMinutes, burnCalories: roughBurn } = findMinutesToBurn(
    activity,
    targetBurnKcal,
    userWeight,
    intensity,
  );

  const burnCalories = calculateActivityCalories({
    activity,
    durationMinutes,
    intensity,
    userWeight,
  }) || roughBurn;

  const remainingProtein = (macros.protein || 0) - (totalEaten.p || 0);
  const proteinBonusG =
    proteinPct < 90 && remainingProtein > 0
      ? Math.min(fmt(remainingProtein), Math.max(8, Math.round(burnCalories / 10)))
      : 0;

  const message = buildMessage({
    macroKey: primary.key,
    macroLabel: primary.label,
    overPctPoints,
    excessGrams: primary.excessG,
    activity,
    durationMinutes,
    burnCalories,
    proteinBonusG,
  });

  return {
    show: true,
    macroKey: primary.key,
    macroLabel: primary.label,
    overPctPoints,
    excessGrams: fmt(primary.excessG),
    excessKcal: fmt(primary.excessKcal),
    activity,
    durationMinutes,
    intensity,
    burnCalories,
    proteinBonusG,
    message,
    headline:
      primary.key === "carbs"
        ? "ชดเชยคาร์บที่เกินเป้า"
        : primary.key === "fat"
          ? "ชดเชยไขมันที่เกินเป้า"
          : "ชดเชยพลังงานที่เกินเป้า",
  };
};
