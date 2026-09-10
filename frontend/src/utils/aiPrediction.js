import { Colors } from "../constants/colors";

export const macroBarTone = (pct) => {
  if (pct < 85) return { track: "var(--nutri-accent-muted)", fill: Colors.success };
  if (pct <= 110) return { track: "var(--nutri-accent-muted)", fill: Colors.accent };
  if (pct <= 130) return { track: "#fde68a", fill: "#f59e0b" };
  return { track: "#fecaca", fill: Colors.danger };
};

const buildMacroSummary = ({
  proteinPct,
  carbsPct,
  fatPct,
  remainingProtein,
  remainingCarbs,
  remainingFat,
}) => {
  const fmt = (n) => Math.round(Number(n) || 0);
  const macroRows = [
    { key: "protein", label: "โปรตีน", pct: proteinPct, remaining: remainingProtein },
    { key: "carbs", label: "คาร์โบไฮเดรต", pct: carbsPct, remaining: remainingCarbs },
    { key: "fat", label: "ไขมัน", pct: fatPct, remaining: remainingFat },
  ];

  const over = macroRows.filter((row) => row.pct > 110);
  const under = macroRows.filter((row) => row.pct < 85);
  const balanced = macroRows.filter((row) => row.pct >= 85 && row.pct <= 110);

  const overText = over.map((row) => `${row.label} ${fmt(row.pct)}%`).join(" · ");
  const underText = under.map((row) => `${row.label} ${fmt(row.pct)}%`).join(" · ");

  let status = "";
  if (over.length && under.length) {
    status = `วันนี้ ${overText} เกินเป้าแล้ว แต่ ${underText} ยังไม่ครบ`;
  } else if (over.length) {
    status = `วันนี้ ${overText} เกินเป้าแล้ว`;
  } else if (under.length) {
    status = `วันนี้ ${underText} ยังไม่ถึงเป้า`;
  } else if (balanced.length === 3) {
    status = "มาโครวันนี้อยู่ในเกณฑ์ดีแล้ว";
  } else {
    status = "มาโครวันนี้ใกล้เป้าแล้ว";
  }

  let advice = "";
  if (proteinPct < 85 && (carbsPct > 110 || fatPct > 110)) {
    advice = `มื้อถัดไปเน้นโปรตีนลีน (เหลือ ~${fmt(remainingProtein)}g) + ผัก ลดของทอด น้ำมัน และของหวาน`;
  } else if (carbsPct > 110 && fatPct > 110) {
    advice = "มื้อถัดไปควรเบา ลดแป้งและไขมัน เน้นผักและโปรตีนไม่ติดมัน";
  } else if (carbsPct > 110) {
    advice = `ลดคาร์บในมื้อถัดไป (เกินเป้า ~${fmt(Math.abs(remainingCarbs))}g) เลือกข้าว/เส้นน้อยลง`;
  } else if (fatPct > 110) {
    advice = `ลดไขมันในมื้อถัดไป (เกินเป้า ~${fmt(Math.abs(remainingFat))}g) หลีกเลี่ยงของทอด`;
  } else if (proteinPct < 85) {
    advice = `เติมโปรตีนให้ครบ (เหลือ ~${fmt(remainingProtein)}g) เช่น ไก่ ปลา ไข่ โยเกิร์ตไม่หวาน`;
  } else if (proteinPct >= 85 && carbsPct <= 110 && fatPct <= 110) {
    advice = "รักษาสัดส่วนมื้อถัดไปให้ใกล้เคียงเดิม เน้นคุมแคลในช่วงที่แนะนำ";
  } else {
    advice = "มื้อถัดไปเน้นเมนูสมดุล โปรตีน + ผัก + คาร์บพอประมาณ";
  }

  return `${status} — ${advice}`;
};

/** คำแนะนำสั้นสำหรับการ์ดหน้าหลัก — อ่านง่ายบนมือถือ */
export const buildHomeDietAdviceBrief = ({
  proteinPct = 0,
  carbsPct = 0,
  fatPct = 0,
  remainingProtein = 0,
  remainingCarbs = 0,
  remainingFat = 0,
  remainingCal = 0,
  focusTitle = "",
  focusDetail = "",
  headline = "",
}) => {
  const fmt = (n) => Math.round(Number(n) || 0);
  const focus = focusTitle.replace(/^โฟกัส:\s*/u, "").trim();
  const detailShort = (focusDetail || "")
    .replace(/ยังขาดอีกประมาณ\s*/u, "ขาด ~")
    .replace(/ประมาณ\s*/u, "~");

  let lead = "";
  if (focus && detailShort) {
    lead = `${focus} ${detailShort}`;
  } else if (headline) {
    lead = headline.replace(/ประมาณ\s*/u, "~");
  } else if (focus) {
    lead = `โฟกัส${focus}`;
  }

  const tips = [];
  if (fatPct > 110) tips.push("ไขมันเกินเป้า → ลดทอด น้ำมัน ของหวาน");
  if (proteinPct < 85) tips.push(`โปรตีนยังไม่ครบ → เติม ~${fmt(remainingProtein)}g (ไก่ ปลา ไข่)`);
  else if (carbsPct > 110) tips.push(`คาร์บสูง → มื้อหน้าลดข้าว/เส้น ~${fmt(Math.abs(remainingCarbs))}g`);
  else if (remainingCal > 0 && remainingCal <= 420) tips.push(`แคลเหลือ ~${fmt(remainingCal)} kcal — กินพอดีมื้อหน้า`);
  else if (proteinPct >= 85 && carbsPct <= 110 && fatPct <= 110) tips.push("มาโครใกล้เป้า — รักษาสัดส่วนเดิม");

  if (tips.length === 0) tips.push("มื้อหน้า: โปรตีน + ผัก + คาร์บพอประมาณ");

  return {
    lead,
    tips: tips.slice(0, 2),
  };
};

const buildRecommendationTargets = ({
  tdee,
  remainingCal,
  remainingProtein,
  remainingCarbs,
  remainingFat,
  proteinPct,
  carbsPct,
  fatPct,
  macroFocusKey,
}) => {
  const fmt = (n) => Math.round(Number(n) || 0);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  if (!tdee) {
    return { canRecommend: false };
  }

  if (remainingCal <= 0) {
    const calMax = clamp(Math.round(Math.abs(remainingCal) > 150 ? 220 : 280), 120, 320);
    const calMin = clamp(calMax - 80, 100, calMax);
    return {
      canRecommend: true,
      calMin,
      calMax,
      targetCal: Math.round((calMin + calMax) / 2),
      focusKey: macroFocusKey || "protein",
      remainingProtein: fmt(remainingProtein),
      remainingCarbs: fmt(remainingCarbs),
      remainingFat: fmt(remainingFat),
      targetProtein: clamp(fmt(remainingProtein), 12, 28),
      targetCarbs: clamp(Math.min(fmt(remainingCarbs), 25), 8, 25),
      targetFat: clamp(fmt(remainingFat), 5, 15),
      proteinPct,
      carbsPct,
      fatPct,
      remainingCal,
      lightMode: true,
    };
  }

  const mealWindowMin = clamp(Math.round(remainingCal * 0.28), 220, 900);
  const mealWindowMax = clamp(Math.round(remainingCal * 0.55), mealWindowMin + 40, 1200);

  return {
    canRecommend: true,
    calMin: mealWindowMin,
    calMax: mealWindowMax,
    targetCal: Math.round((mealWindowMin + mealWindowMax) / 2),
    focusKey: macroFocusKey || "protein",
    remainingProtein: fmt(remainingProtein),
    remainingCarbs: fmt(remainingCarbs),
    remainingFat: fmt(remainingFat),
    targetProtein: clamp(fmt(remainingProtein), 15, 35),
    targetCarbs: carbsPct > 110 ? clamp(Math.min(fmt(remainingCarbs), 30), 10, 30) : clamp(fmt(remainingCarbs / 2), 20, 45),
    targetFat: fatPct > 110 ? clamp(Math.min(fmt(remainingFat), 12), 5, 12) : clamp(fmt(remainingFat / 2), 8, 18),
    proteinPct,
    carbsPct,
    fatPct,
    remainingCal,
    lightMode: false,
  };
};

export const getProfessionalPrediction = ({ tdee, foodCals, activityCals, macros, totalEaten }) => {
  const fmt = (n) => Math.round(Number(n) || 0);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const netIntake = (Number(foodCals) || 0) - (Number(activityCals) || 0);
  const remainingCal = (Number(tdee) || 0) - netIntake;

  const remainingProtein = (Number(macros.protein) || 0) - (Number(totalEaten.p) || 0);
  const remainingCarbs = (Number(macros.carbs) || 0) - (Number(totalEaten.c) || 0);
  const remainingFat = (Number(macros.fat) || 0) - (Number(totalEaten.f) || 0);

  const pct = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);
  const proteinPct = pct(totalEaten.p, macros.protein);
  const carbsPct = pct(totalEaten.c, macros.carbs);
  const fatPct = pct(totalEaten.f, macros.fat);
  const macroProgress = [
    { key: "p", label: "โปรตีน", valuePct: proteinPct, color: Colors.primary },
    { key: "c", label: "คาร์โบไฮเดรต", valuePct: carbsPct, color: Colors.carbs },
    { key: "f", label: "ไขมัน", valuePct: fatPct, color: Colors.fat }
  ];

  if (!tdee) {
    return {
      badge: "ตั้งค่าโปรไฟล์",
      title: "ยังไม่มีเป้าหมายพลังงาน (TDEE)",
      headline: "เพิ่มข้อมูลร่างกายก่อน",
      subline: "คำแนะแบบมีตัวเลขจะแม่นขึ้นมากเมื่อมี TDEE",
      chips: [],
      focusTitle: "ทำไมต้องตั้งค่า",
      focusDetail: "TDEE คือ “งบพลังงาน” รายวันที่ใช้คำนวณช่องว่างของมื้อถัดไป",
      exampleTitle: "ขั้นตอนถัดไป",
      exampleDetail: "โปรไฟล์ → กรอกอายุ/น้ำหนัก/ส่วนสูง/เพศ → กลับมาบันทึกมื้อแรก",
      macroProgress: null,
      action: "ไปที่โปรไฟล์ → บันทึกข้อมูลร่างกาย",
      actionTone: "neutral",
      recommendationTargets: { canRecommend: false },
    };
  }

  if (totalEaten.cal === 0) {
    const firstMealCalMin = clamp(Math.round(tdee * 0.22), 250, 650);
    const firstMealCalMax = clamp(Math.round(tdee * 0.35), firstMealCalMin + 50, 900);
    const firstProteinMin = clamp(Math.round(macros.protein * 0.22), 18, 45);
    const recommendationTargets = buildRecommendationTargets({
      tdee,
      remainingCal: tdee,
      remainingProtein: macros.protein,
      remainingCarbs: macros.carbs,
      remainingFat: macros.fat,
      proteinPct: 0,
      carbsPct: 0,
      fatPct: 0,
      macroFocusKey: "protein",
    });
    recommendationTargets.calMin = firstMealCalMin;
    recommendationTargets.calMax = firstMealCalMax;
    recommendationTargets.targetCal = Math.round((firstMealCalMin + firstMealCalMax) / 2);
    recommendationTargets.targetProtein = firstProteinMin;

    return {
      badge: "มื้อแรกของวัน",
      title: "ยังไม่มีข้อมูลมื้อวันนี้",
      headline: "เริ่มวันให้ครบทั้งพลังงานและโปรตีน",
      subline: `TDEE ${fmt(tdee)} kcal · สุทธิตอนนี้ ${fmt(netIntake)} kcal`,
      chips: [
        { label: "มื้อแรกแนะนำ", value: `${firstMealCalMin}–${firstMealCalMax} kcal` },
        { label: "โปรตีนเริ่มต้น", value: `~${firstProteinMin}g` },
        { label: "เป้ามาโครวันนี้", value: `P${fmt(macros.protein)} / C${fmt(macros.carbs)} / F${fmt(macros.fat)}` }
      ],
      focusTitle: "โฟกัสมื้อแรก",
      focusDetail: "เลือกเมนูที่อิ่มนาน: โปรตีน + ผัก/ใยอาหาร + คาร์บควบคุมปริมาณ",
      exampleTitle: "เมนูแนะนำ",
      exampleDetail: "กดปุ่มด้านล่างเพื่อดู 3 เมนูจริงที่คำนวณตามเป้าของคุณ",
      macroProgress: null,
      action: `ดู 3 เมนูแนะนำ ${firstMealCalMin}–${firstMealCalMax} kcal`,
      actionTone: "good",
      recommendationTargets,
    };
  }

  const overBy = remainingCal < 0 ? Math.abs(remainingCal) : 0;

  if (remainingCal <= 0) {
    const tone = overBy >= 350 ? "bad" : overBy >= 150 ? "warn" : "neutral";
    const headline = overBy >= 350
      ? `พลังงานเกินเป้าหมายประมาณ ${fmt(overBy)} kcal`
      : overBy > 0
        ? `พลังงานเกินเล็กน้อยประมาณ ${fmt(overBy)} kcal`
        : "พลังงานถึงเป้าหมายแล้ว";

    const macroHint = (() => {
      if (fatPct >= 95 && carbsPct < 85) return "ไขมันใกล้เพดาน — มื้อถัดไปลดน้ำมัน/ของทอด แล้วเติมคาร์บจากข้าวกล้อง/ธัญพืช";
      if (carbsPct >= 95 && proteinPct < 85) return "คาร์บสูงตามสัดส่วน — ลดขนม/น้ำหวาน แล้วเติมโปรตีนลีน + ผัก";
      if (proteinPct < 75) return "โปรตีนยังไม่ถึงเป้า — ถ้ายังหิวให้เลือกของเบาๆ โปรตีนสูง (ไข่ต้ม/โยเกิร์ตไม่หวาน)";
      return "มื้อถัดไปเน้นของอิ่มแต่แคลต่ำ (ผัก/ซุปใส/โปรตีนลีน)";
    })();

    const macroSummary = buildMacroSummary({
      proteinPct,
      carbsPct,
      fatPct,
      remainingProtein,
      remainingCarbs,
      remainingFat,
    });

    return {
      badge: overBy >= 350 ? "คุมเข้ม" : overBy > 0 ? "คุมเบาๆ" : "ถึงเป้า",
      title: "พลังงานวันนี้ถึง/เกินเป้า",
      headline,
      subline: `TDEE ${fmt(tdee)} kcal · สุทธิ ${fmt(netIntake)} kcal`,
      chips: [
        { label: "เหลือ (งบแคล)", value: `${fmt(remainingCal)} kcal` },
        { label: "อาหาร", value: `${fmt(foodCals)} kcal` },
        { label: "กิจกรรม", value: `${fmt(activityCals)} kcal` }
      ],
      focusTitle: "คำแนะเชิงลึก",
      focusDetail: macroHint,
      exampleTitle: "เมนูเบาแนะนำ",
      exampleDetail: "กดปุ่มด้านล่างเพื่อดู 3 เมนูเบาแคลที่ยังพอดีกับมาโคร",
      macroProgress,
      macroSummary,
      action: overBy > 0 ? "ดู 3 เมนูเบาแคลแนะนำ" : "ดู 3 เมนูคุมแคลแนะนำ",
      actionTone: tone,
      recommendationTargets: buildRecommendationTargets({
        tdee,
        remainingCal,
        remainingProtein,
        remainingCarbs,
        remainingFat,
        proteinPct,
        carbsPct,
        fatPct,
        macroFocusKey: proteinPct < 85 ? "protein" : "fiber",
      }),
    };
  }

  const mealWindowMin = clamp(Math.round(remainingCal * 0.28), 220, 900);
  const mealWindowMax = clamp(Math.round(remainingCal * 0.55), mealWindowMin + 40, 1200);

  const macroFocus = (() => {
    if (remainingProtein >= 18) return { key: "protein", label: "โปรตีน", detail: `ยังขาดอีกประมาณ ${fmt(remainingProtein)}g` };
    if (remainingCarbs >= 35) return { key: "carbs", label: "คาร์โบไฮเดรต", detail: `ยังขาดอีกประมาณ ${fmt(remainingCarbs)}g` };
    if (remainingFat >= 12) return { key: "fat", label: "ไขมัน", detail: `ยังขาดอีกประมาณ ${fmt(remainingFat)}g` };
    return { key: "fiber", label: "ใยอาหาร", detail: "มาโครใกล้ครบแล้ว — เสริมผัก/ถั่วเพื่อความอิ่มและระบบย่อย" };
  })();

  const balanceTone = (() => {
    if (remainingCal <= Math.max(180, tdee * 0.12)) return "good";
    if (remainingCal <= Math.max(420, tdee * 0.28)) return "warn";
    return "neutral";
  })();

  const macroSummary = buildMacroSummary({
    proteinPct,
    carbsPct,
    fatPct,
    remainingProtein,
    remainingCarbs,
    remainingFat,
  });

  return {
    badge: "มื้อถัดไป",
    title: "แนวทางจากตัวเลขวันนี้",
    headline: `เหลือประมาณ ${fmt(remainingCal)} kcal`,
    subline: `แนะนำช่วงพลังงานมื้อถัดไป ${mealWindowMin}–${mealWindowMax} kcal`,
    chips: [
      { label: "TDEE", value: `${fmt(tdee)} kcal` },
      { label: "สุทธิ", value: `${fmt(netIntake)} kcal` },
      { label: "มื้อถัดไป", value: `${mealWindowMin}–${mealWindowMax} kcal` }
    ],
    focusTitle: `โฟกัส: ${macroFocus.label}`,
    focusDetail: macroFocus.detail,
      exampleTitle: "เมนูแนะนำ",
      exampleDetail: "เลือกโหมด ทำเอง / เซเว่น / ตามสั่ง แล้วกดปุ่มด้านล่างดู 3 เมนูจริง",
    macroProgress,
    macroSummary,
    action: `ดู 3 เมนูแนะนำ ${mealWindowMin}–${mealWindowMax} kcal`,
    actionTone: balanceTone,
    recommendationTargets: buildRecommendationTargets({
      tdee,
      remainingCal,
      remainingProtein,
      remainingCarbs,
      remainingFat,
      proteinPct,
      carbsPct,
      fatPct,
      macroFocusKey: macroFocus.key,
    }),
  };
};

