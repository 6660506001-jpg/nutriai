import { Colors } from "../constants/colors";
import { mealIsFullyUnverified, getUnverifiedMealItems } from "./foodEstimator";
import { estimateMealGI } from "./mealGiEstimate";

export const MEAL_TYPES = ["มื้อเช้า", "มื้อกลางวัน", "มื้อเย็น"];

const MEAL_CAL_RATIO = {
  "มื้อเช้า": { min: 0.2, max: 0.32 },
  "มื้อกลางวัน": { min: 0.3, max: 0.42 },
  "มื้อเย็น": { min: 0.25, max: 0.38 },
};

const sumMeal = (mealList) => mealList.reduce(
  (acc, food) => ({
    cal: acc.cal + (Number(food.calories) || 0),
    p: acc.p + (Number(food.protein) || 0),
    c: acc.c + (Number(food.carbs) || 0),
    f: acc.f + (Number(food.fat) || 0),
    count: acc.count + 1,
  }),
  { cal: 0, p: 0, c: 0, f: 0, count: 0 },
);

export const analyzeMealSection = (mealList, mealType, tdee) => {
  if (!mealList.length || !tdee) return null;

  const totals = sumMeal(mealList);
  const ratio = MEAL_CAL_RATIO[mealType] || { min: 0.28, max: 0.35 };
  const calMin = Math.round(tdee * ratio.min);
  const calMax = Math.round(tdee * ratio.max);
  const unverifiedItems = getUnverifiedMealItems(mealList);

  if (mealIsFullyUnverified(mealList)) {
    return {
      status: "ข้อมูลไม่แน่นอน",
      shortStatus: "ยังไม่ยืนยัน",
      nutritionUnverified: true,
      color: Colors.textGray,
      totals,
      target: { min: calMin, max: calMax },
      headline: `บันทึก ${totals.count} รายการ · ข้อมูลโภชนาการยังไม่แน่นอน`,
      advice: "เลือกเมนูจากฐานข้อมูลเพื่อรับคำแนะนำที่แม่นยำ",
    };
  }

  let status;
  let headline;
  if (totals.cal < calMin * 0.75) {
    status = "พลังงานต่ำ";
    const underBy = Math.max(0, calMin - totals.cal);
    headline = underBy > 0
      ? `กินน้อยกว่าเป้ามื้อ ~${underBy} kcal (เป้า ${calMin}–${calMax} kcal)`
      : `พลังงานต่ำกว่าเกณฑ์ (${calMin}–${calMax} kcal)`;
  } else if (totals.cal > calMax * 1.15) {
    status = "พลังงานสูง";
    const overBy = Math.max(0, totals.cal - calMax);
    headline = overBy > 0
      ? `กินเกินเป้ามื้อ ~${overBy} kcal (เป้า ${calMin}–${calMax} kcal)`
      : `กินเยอะกว่าเกณฑ์ (${calMin}–${calMax} kcal)`;
  } else {
    status = "พลังงานพอดี";
    headline = `อยู่ในเป้ามื้อนี้ · ${totals.cal} kcal (เป้า ${calMin}–${calMax} kcal)`;
  }

  const fatCalPct = totals.cal > 0 ? (totals.f * 9) / totals.cal : 0;
  const isMainMeal = totals.cal >= 380;
  const proteinMin = isMainMeal ? 12 : 15;
  let advice;
  if (totals.p < proteinMin) {
    advice = isMainMeal
      ? "มื้อหลักครบพลังงานแล้ว — เติมโปรตีนเสริม (ไข่/ถั่ว/โยเกิร์ต) ได้ในมื้อถัดไป"
      : "โปรตีนในมื้อนี้ยังน้อย — เพิ่มไข่ นม ไก่ หรือถั่วในมื้อถัดไป";
  } else if (fatCalPct > 0.42) {
    advice = "ไขมันในมื้อนี้ค่อนข้างสูง — ลดของทอดและน้ำมันในมื้อถัดไป";
  } else if (totals.p >= 20 && fatCalPct <= 0.35) {
    advice = "สัดส่วนสารอาหารในมื้อนี้ดี — รักษาแบบนี้ในมื้ออื่นได้";
  } else if (totals.cal > 550 && totals.c > totals.p * 2) {
    advice = "คาร์บสูงเมื่อเทียบโปรตีน — ลดแป้งเล็กน้อยและเติมโปรตีน/ผัก";
  } else {
    advice = "เพิ่มผักใบเขียวเพื่อกากใยและความอิ่ม";
  }

  const color = (() => {
    if (status === "พลังงานสูง") return Colors.warning;
    if (status === "พลังงานต่ำ") return Colors.danger;
    if (totals.p >= 20) return Colors.success;
    return Colors.accent;
  })();

  return {
    status,
    shortStatus: status.replace("พลังงาน", ""),
    color,
    totals,
    target: { min: calMin, max: calMax },
    headline,
    advice: unverifiedItems.length > 0
      ? `${unverifiedItems.length} รายการเป็นค่าประมาณ (${unverifiedItems.map((item) => item.baseName || item.name).join(", ")}) · ${advice}`
      : advice,
    partialUnverified: unverifiedItems.length > 0,
    unverifiedItems,
    gi: estimateMealGI(mealList, totals),
  };
};

export const analyzeDailyWeightTrend = ({ tdee, netCal, loggedCount }) => {
  if (loggedCount !== 3 || !tdee) return null;

  const deficit = Number(tdee) - Number(netCal);
  const diff = Math.round(Math.abs(deficit));

  if (deficit >= 200) {
    return {
      trend: "ลด",
      label: "แนวโน้มลดน้ำหนัก",
      color: Colors.success,
      headline: `ขาดดุล ~${diff} kcal จาก TDEE`,
      detail: "กินน้อยกว่าที่ใช้สม่ำเสมอ → ร่างกายใช้ไขมันสำรอง",
      note: deficit >= 400 ? "อย่าลดแคลหนักเกินไป ต้องได้โปรตีนและผักครบ" : "ต้องทำซ้ำหลายวันถึงจะเห็นผล",
    };
  }

  if (deficit <= -150) {
    return {
      trend: "เพิ่ม",
      label: "แนวโน้มเพิ่มน้ำหนัก",
      color: Colors.warning,
      headline: `เกินดุล ~${diff} kcal จาก TDEE`,
      detail: "กินมากกว่าที่ใช้สม่ำเสมอ → ส่วนเกินมักเก็บเป็นไขมัน",
      note: "พรุ่งนี้ลดของหวาน/ของทอด หรือขยับตัวเพิ่ม",
    };
  }

  return {
    trend: "คงที่",
    label: "น้ำหนักน่าจะคงที่",
    color: Colors.accent,
    headline: `ใกล้ TDEE (ต่าง ~${diff} kcal)`,
    detail: "แคลวันนี้อยู่ในเกณฑ์รักษาน้ำหนัก",
    note: "อยากลดน้ำหนัก → ลดแคลเล็กน้อยหรือออกกำลังเพิ่ม",
  };
};

export const analyzeThreeMealsSummary = (dailyMeals, { tdee, activityCals = 0, activities = [] }) => {
  const sumActivityCalsForMeal = (mealType) =>
    (activities || [])
      .filter((activity) => activity.mealPeriod === mealType)
      .reduce((sum, activity) => sum + (Number(activity.calories) || 0), 0);

  const perMeal = {};
  let totalCal = 0;
  let loggedCount = 0;
  const heavyMeals = [];
  const lightMeals = [];
  const emptyMeals = [];

  MEAL_TYPES.forEach((type) => {
    const list = dailyMeals[type] || [];
    const mealActivityCals = sumActivityCalsForMeal(type);
    const analysis = analyzeMealSection(list, type, tdee);

    if (analysis) {
      perMeal[type] = {
        ...analysis,
        activityCals: mealActivityCals,
        netCal: analysis.totals.cal - mealActivityCals,
      };
    } else if (mealActivityCals > 0) {
      const ratio = MEAL_CAL_RATIO[type] || { min: 0.28, max: 0.35 };
      perMeal[type] = {
        status: "เผาแคล",
        shortStatus: "เผาแล้ว",
        color: Colors.success,
        totals: { cal: 0, p: 0, c: 0, f: 0, count: 0 },
        target: { min: Math.round(tdee * ratio.min), max: Math.round(tdee * ratio.max) },
        activityCals: mealActivityCals,
        netCal: -mealActivityCals,
        headline: `เผา ${mealActivityCals} kcal จากกิจกรรม`,
        advice: "",
      };
    } else {
      perMeal[type] = null;
    }

    if (!list.length) {
      emptyMeals.push(type);
      return;
    }
    loggedCount += 1;
    totalCal += analysis.totals.cal;
    if (!analysis.nutritionUnverified) {
      if (analysis.status === "พลังงานสูง") heavyMeals.push(type);
      if (analysis.status === "พลังงานต่ำ") lightMeals.push(type);
    }
  });

  if (!loggedCount) {
    return {
      perMeal,
      overall: {
        status: "ยังไม่บันทึก",
        color: Colors.textGray,
        headline: "ยังไม่มีข้อมูลมื้อใดวันนี้",
        advice: "เริ่มบันทึกจากมื้อที่กินแล้ว ระบบจะสรุปคำแนะนำให้อัตโนมัติ",
        nextStep: "บันทึกมื้อแรกเพื่อรับคำแนะนำเฉพาะบุคคล",
        loggedCount: 0,
        emptyMeals: [...MEAL_TYPES],
        totalCal: 0,
        remaining: tdee,
        pct: 0,
      },
    };
  }

  const netCal = totalCal - activityCals;
  const remaining = (Number(tdee) || 0) - netCal;
  const pct = tdee > 0 ? Math.round((netCal / tdee) * 100) : 0;

  let status;
  let color;
  let headline;
  let advice;
  let nextStep;

  if (emptyMeals.length > 0) {
    if (remaining > 0) {
      headline = `${loggedCount}/3 มื้อ · เหลือ ~${Math.round(remaining)} kcal`;
      advice = heavyMeals.length
        ? `${heavyMeals.join(", ")} หนักไป — ${emptyMeals.join(", ")} ควรเบา`
        : `ยังขาด ${emptyMeals.join(", ")}`;
      nextStep = `${emptyMeals[0]} ~${Math.round(remaining / emptyMeals.length)} kcal`;
    } else {
      headline = `${loggedCount}/3 มื้อ · ถึง/เกินเป้าแล้ว`;
      advice = heavyMeals.length
        ? `${heavyMeals.join(", ")} หนักไป — มื้อที่เหลือเบามาก`
        : "มื้อที่เหลือเลือกของเบาๆ";
      nextStep = `${emptyMeals.join(", ")}: ผัก / ไข่ต้ม / โปรตีนเบา`;
    }
    status = remaining > 200 ? "กำลังดำเนิน" : remaining > 0 ? "ใกล้เป้า" : "ถึงเป้า";
    color = remaining > 200 ? Colors.accent : remaining > 0 ? Colors.warning : Colors.success;
  } else if (remaining > 150) {
    headline = `ครบ 3 มื้อ · เหลือ ~${Math.round(remaining)} kcal`;
    advice = lightMeals.length
      ? `${lightMeals.join(", ")} ต่ำไป — อาจหิวเร็ว`
      : heavyMeals.length
        ? `${heavyMeals.join(", ")} สูงไป`
        : "สัดส่วนโดยรวมดี";
    nextStep = "ของว่าง: โยเกิร์ต / ผลไม้ / ถั่วคั่ว";
    status = "ใกล้เป้า";
    color = Colors.accent;
  } else if (remaining >= -100 && remaining <= 150) {
    headline = "ครบ 3 มื้อ · อยู่ในเป้า";
    advice = heavyMeals.length && lightMeals.length
      ? `${heavyMeals.join(", ")} สูง · ${lightMeals.join(", ")} ต่ำ`
      : heavyMeals.length
        ? `${heavyMeals.join(", ")} สูงกว่าเกณฑ์`
        : "สัดส่วนดี รักษาแบบนี้";
    nextStep = "พรุ่งนี้: โปรตีน + ผัก + น้ำ 2 ลิตร";
    status = "สมดุล";
    color = Colors.success;
  } else {
    headline = `ครบ 3 มื้อ · เกิน ~${Math.abs(Math.round(remaining))} kcal`;
    advice = heavyMeals.length
      ? `${heavyMeals.join(", ")} มีสัดส่วนสูง`
      : "รวมแล้วเกินเป้า";
    nextStep = "พรุ่งนี้: ลดขนม/เครื่องดื่ม หรือออกกำลังเพิ่ม";
    status = "เกินเป้า";
    color = Colors.warning;
  }

  const weightTrend = analyzeDailyWeightTrend({
    tdee,
    netCal,
    loggedCount,
  });

  return {
    perMeal,
    overall: {
      status,
      color,
      headline,
      advice,
      nextStep,
      loggedCount,
      emptyMeals,
      totalCal,
      foodCals: totalCal,
      activityCals,
      remaining: Math.round(remaining),
      pct,
      netCal: Math.round(netCal),
      weightTrend,
    },
  };
};

export const buildActiveMealAdviceView = (mealType, analysis, reward, overall, tdee) => {
  const ratio = MEAL_CAL_RATIO[mealType] || { min: 0.28, max: 0.35 };
  const targetMin = Math.round((Number(tdee) || 0) * ratio.min);
  const targetMax = Math.round((Number(tdee) || 0) * ratio.max);
  const fallbackTarget = { min: targetMin, max: targetMax };

  const buildIncompleteLine = () => {
    if (!overall || overall.loggedCount >= 3) return null;
    if (overall.loggedCount === 0) return null;
    const missing = (overall.emptyMeals || []).join(", ");
    if (missing) {
      return `ยังไม่ครบ ${overall.loggedCount}/3 มื้อ · ขาด ${missing} · ${overall.nextStep || overall.advice || ""}`;
    }
    return overall.headline || null;
  };

  if (analysis?.activityCals > 0 && !analysis?.totals?.count) {
    return {
      tone: "ok",
      accent: Colors.success,
      badge: analysis.shortStatus || "เผาแล้ว",
      verdict: analysis.headline || `เผา ${analysis.activityCals} kcal ในช่วงนี้`,
      headline: null,
      tip: "ยังไม่มีอาหารในมื้อนี้ — บันทึกเมนูเมื่อกิน",
      macroLine: null,
      dailyLine: buildIncompleteLine(),
      gi: null,
      reward: null,
      cal: 0,
      target: fallbackTarget,
    };
  }

  if (!analysis || !analysis.totals?.count) {
    let tip = `เป้ามื้อนี้ ~${targetMin}–${targetMax} kcal — ค้นหาเมนูด้านล่างแล้วกด +`;
    const incompleteLine = buildIncompleteLine();
    if (incompleteLine) {
      tip = incompleteLine;
    } else if (overall?.loggedCount > 0 && overall.remaining != null) {
      if (overall.remaining > 100) {
        tip = `วันนี้เหลือ ~${overall.remaining} kcal · ${overall.nextStep || overall.advice || tip}`;
      } else if (overall.remaining < -50) {
        tip = `วันนี้เกินเป้า ~${Math.abs(overall.remaining)} kcal — มื้อนี้ควรเบามาก`;
      } else {
        tip = `วันนี้ใกล้/ถึงเป้าแล้ว — มื้อนี้เลือกของเบาๆ`;
      }
    }

    return {
      tone: "empty",
      accent: Colors.textGray,
      badge: "รอบันทึก",
      verdict: `ยังไม่มีอาหารใน${mealType}`,
      headline: `เป้า ${targetMin}–${targetMax} kcal`,
      tip,
      cal: 0,
      target: fallbackTarget,
      reward: null,
      gi: null,
    };
  }

  const { totals, headline, advice, gi, status } = analysis;
  const target = analysis.target || fallbackTarget;
  const { min, max } = target;
  const cal = totals.cal;

  let verdict;
  let tone;
  let accent;

  if (analysis.nutritionUnverified) {
    verdict = "ข้อมูลโภชนาการยังไม่แน่นอน";
    tone = "neutral";
    accent = Colors.textGray;
  } else if (status === "พลังงานสูง") {
    const overBy = Math.max(0, cal - max);
    verdict = overBy > 0 ? `คุณกินเกินเป้ามื้อ ~${overBy} kcal` : "คุณกินเยอะกว่าเกณฑ์มื้อนี้";
    tone = "over";
    accent = Colors.warning;
  } else if (status === "พลังงานต่ำ") {
    const underBy = Math.max(0, min - cal);
    verdict = underBy > 0 ? `คุณกินน้อยกว่าเป้ามื้อ ~${underBy} kcal` : "มื้อนี้พลังงานต่ำกว่าเกณฑ์";
    tone = "under";
    accent = Colors.danger;
  } else {
    verdict = "มื้อนี้อยู่ในเป้า — ดีแล้ว";
    tone = "ok";
    accent = Colors.success;
  }

  const proteinMin = cal >= 380 ? 12 : 15;
  const proteinNote = totals.p < proteinMin ? ` · เป้าโปรตีน ≥${proteinMin}g` : "";
  const macroLine = `โปรตีน ${Math.round(totals.p)}g · ไขมัน ${Math.round(totals.f)}g · คาร์บ ${Math.round(totals.c)}g${proteinNote}`;

  let dailyLine = buildIncompleteLine();
  if (!dailyLine && overall && overall.loggedCount > 0 && overall.remaining != null) {
    if (overall.remaining > 100) {
      dailyLine = `ทั้งวันเหลือ ~${overall.remaining} kcal · ${overall.nextStep || "วางแผนมื้อถัดไป"}`;
    } else if (overall.remaining >= -50) {
      dailyLine = "ทั้งวันใกล้/ถึงเป้าแล้ว — มื้อถัดไปควรเบา";
    } else {
      dailyLine = `ทั้งวันเกินเป้า ~${Math.abs(overall.remaining)} kcal — ลดของหวาน/ทอดในมื้อถัดไป`;
    }
  }

  if (analysis.activityCals > 0) {
    dailyLine = dailyLine
      ? `${dailyLine} · เผา ${analysis.activityCals} kcal ในช่วงนี้`
      : `เผา ${analysis.activityCals} kcal จากกิจกรรมในช่วงนี้`;
  }

  return {
    tone,
    accent,
    badge: reward?.badge || analysis.shortStatus || status,
    verdict,
    headline,
    tip: advice,
    macroLine,
    dailyLine,
    gi,
    reward,
    cal,
    target,
  };
};
