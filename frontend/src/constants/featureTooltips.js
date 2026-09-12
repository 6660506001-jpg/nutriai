export const MEAL_CALORIE_DEFICIT = 105;
export const DAILY_CALORIE_DEFICIT = 315;

export const getWeightControlTarget = (tdee) => {
  const base = Number(tdee) || 0;
  if (!base) return null;
  return Math.max(1200, base - DAILY_CALORIE_DEFICIT);
};

export const FEATURE_TOOLTIPS = {
  bmi: {
    title: "BMI",
    subtitle: "Body Mass Index · ดัชนีมวลกาย",
    body: "ด่านแรกในการประเมินโครงสร้างร่างกายของคุณ เพื่อดูว่าน้ำหนักสัมพันธ์กับส่วนสูงและสัดส่วนอยู่ในเกณฑ์มาตรฐานหรือไม่",
    ranges: [
      { range: "< 18.5", label: "ผอม" },
      { range: "18.5 – 22.9", label: "ปกติ" },
      { range: "23 – 24.9", label: "ท้วม" },
      { range: "≥ 25", label: "อ้วน" },
    ],
  },
  tdee: {
    title: "เป้าหมายพลังงาน",
    subtitle: "TDEE · Total Daily Energy Expenditure",
    body: "เป้าหมายพลังงานต่อวัน คำนวณจากพลังงานที่ร่างกายใช้โดยประมาณ รวมการเผาผลาญพื้นฐานและกิจกรรม",
  },
  bmr: {
    title: "BMR",
    subtitle: "Basal Metabolic Rate",
    body: "พลังงานขั้นต่ำที่ร่างกายต้องใช้ต่อวัน ในขณะพัก",
  },
  remainingCal: {
    title: "พลังงานคงเหลือ",
    subtitle: "Remaining energy",
    body: "พลังงานที่ยังรับประทานได้วันนี้ คำนวณจากเป้าหมายพลังงาน ลบพลังงานที่ได้รับ แล้วบวกพลังงานที่เผาผลาญ",
  },
  weight: {
    title: "น้ำหนักปัจจุบัน",
    subtitle: "Current Weight",
    body: "ข้อมูลจากโปรไฟล์ของคุณ ใช้ในการคำนวณ BMI และ TDEE",
    note: "อัปเดตได้ที่หน้าโปรไฟล์",
  },
  caloricDeficit: {
    title: "เป้ากินวันนี้",
    subtitle: "Daily calorie target",
    body: "จำนวนแคลที่ควรกินทั้งวัน เพื่อลดน้ำหนักอย่างช้า ๆ และปลอดภัย คำนวณจากพลังงานที่ร่างกายใช้ (TDEE) ลบออกเล็กน้อย",
    note: "ไม่ต้องจำต่อมื้อ — ดูยอดรวมทั้งวันก็พอ",
  },
  dailyGoal: {
    title: "เป้ากินวันนี้",
    subtitle: "กินไม่เกินนี้ทั้งวัน",
    body: "ระบบคำนวณจากพลังงานที่ร่างกายใช้ต่อวัน แล้วลดลงเล็กน้อยเพื่อช่วยลดน้ำหนักโดยไม่หิวจนเกินไป",
    note: "ถ้ากินและออกกำลังกายครบแล้ว ดู「เหลือประมาณ」ใน AI มื้อถัดไป",
  },
  stars: {
    title: "คะแนนโภชนาการ (ดาว)",
    subtitle: "Rating 1–3 ดาวต่อมื้อ",
    body: "คะแนนโภชนาการคำนวณจาก: พลังงานที่เหมาะสม (40%) + สัดส่วนสารอาหารหลักครบถ้วน (40%) + ค่าดัชนีน้ำตาลต่ำ GI (20%) ยิ่งดาวเยอะ ยิ่งดีต่อสุขภาพ!",
    note: "3 ดาว = พลังงานพอดี · โปรตีนดี · GI ต่ำ",
  },
  gi: {
    title: "Glycemic Index (GI)",
    subtitle: "ดัชนีน้ำตาลในเลือด",
    body: "ประเมินจากชื่อเมนูและคาร์บในมื้อ (รวมเครื่องดื่ม) — ใช้กับดาวและคำแนะนำ ไม่ได้บวกเข้าแคลอรี่",
    note: "GI สูง → ลดดาว 3 เป็น 2 · น้ำเปล่า/ชาเขียว/กาแฟดำ ≈ 0",
  },
  history: {
    title: "ประวัติสุขภาพ",
    subtitle: "History Dashboard",
    body: "คลิกเพื่อดูแนวโน้มสุขภาพย้อนหลัง ประมวลผลพฤติกรรมการทานอาหารและน้ำหนักของคุณเพื่อเปรียบเทียบพัฒนาการในแต่ละสัปดาห์",
  },
};

export const STAT_TOOLTIPS = {
  tdee: FEATURE_TOOLTIPS.tdee,
  bmr: FEATURE_TOOLTIPS.bmr,
  weight: FEATURE_TOOLTIPS.weight,
  bmi: FEATURE_TOOLTIPS.bmi,
  remainingCal: FEATURE_TOOLTIPS.remainingCal,
};
