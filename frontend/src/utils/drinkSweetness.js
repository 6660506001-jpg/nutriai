export const DRINK_SWEETNESS_OPTIONS = [
  { id: "100", label: "หวาน 100%", factor: 1 },
  { id: "50", label: "หวาน 50%", factor: 0.5 },
  { id: "25", label: "หวาน 25%", factor: 0.25 },
  { id: "0", label: "ไม่หวาน", factor: 0 },
];

/** เมนูอาหารที่มีคำว่า "น้ำ/ชา/นม" แต่ไม่ใช่เครื่องดื่ม */
const FOOD_NOT_DRINK_PATTERN = /ก๋วยเตี๋ยว|บะหมี่|เส้น|ข้าว|แกง|ต้มยำ|เกาเหลา|โจ๊ก|สุกี|หม้อไฟ|ยำ|ผัด|ทอด|ลาบ|ส้มตำ|น้ำข้น|น้ำใส|น้ำพริก|ชาบู|ขนม|สลัด|สเต็ก|ฮ่องเฮา|ราดหน้า|พะแนง|มัสมั่น|ไข่(?:ต้ม|เจียว|ดาว|ทอด|ลวก|ตุ๋น|ข้น|เยี่ยม)|ห่อ|จาน|ทะเล(?=.*(?:ก๋วย|เส้น|ข้าว|ต้ม|แกง))/i;

/** ผลไม้สด — ห้ามจับเป็นเครื่องดื่มแม้ชื่อมี "น้ำ" (เช่น ส้มสายน้ำผึ้ง) */
const FRUIT_NAME_PATTERN = /^(?:ส้ม(?:สายน้ำ(?:ผึ้ง)?|โอ|เขียว|หวาน)?|มะม่วง|กล้วย|แตงโม|ฝรั่ง|ทุเรียน|มังคุด|องุ่น|มะละกอ|แอปเปิ้ล|สับปะรด|ลำไย|ลิ้นจี่|เงาะ|ชมพู่|ลูกพลับ|แก้วมังกร|มะขาม|น้อยหน่า|สละ|มะยม|มะเดื่อ|ขนุน|สตรอเบอร์รี่|กีวี|บลูเบอร์รี่|แคนตาลูป|มะพร้าว|มะนาว|เนื้อมะพร้าว|orange|banana|mango|papaya|apple|grape|watermelon|pineapple|durian|guava|jackfruit|strawberry|kiwi|dragon fruit|persimmon|longan|lychee|rambutan|salak|tamarind|lime|coconut meat)(?:\s|$|[·(])/i;

const DRINK_NAME_PATTERN = /(?<![\u0E00-\u0E7F])น้ำ(?:เปล่า|ดื่ม|แร่|ผลไม้|ส้ม|มะนาว|อัดลม|โสม|เกลือ|ผึ้ง|มะพร้าว)|ชา(?:ไทย|เย็น|เขียว|นม|ใต้หวัน)|ชานม|กาแฟ|โกโก้|ช็อก|bubble|boba|ไข่มุก|โซดา|frappe|latte|smoothie|milk tea|thai tea|cola|coke|pepsi|sprite|fanta|matcha|มัทฉะ|โอเลี้ย|โค้ก|100plus|red bull|กระทิงแดง|นม(?:สด|เปรี้ยว|ช็อก)|ปั่น/i;

export const isFruitFood = (food) => {
  if (!food) return false;
  if (food.category === "fruit") return true;
  const name = String(food?.baseName || food?.name || "").trim();
  return FRUIT_NAME_PATTERN.test(name);
};

export const isDrinkFood = (food) => {
  if (!food) return false;
  if (food.category === "drink") return true;
  if (isFruitFood(food)) return false;
  if (food.category && food.category !== "drink") return false;

  const name = String(food?.name || food?.baseName || "").toLowerCase();
  if (FOOD_NOT_DRINK_PATTERN.test(name)) return false;

  return DRINK_NAME_PATTERN.test(name);
};

const UNSWEETENED_DRINK_PATTERN = /น้ำเปล่า|น้ำดื่ม|น้ำแร่|water|mineral|กาแฟดำ|americano|espresso|ชาเขียว(?!.*นม)|green tea(?!.*milk)/i;

const getSugarCarbShare = (food) => {
  const name = String(food?.name || food?.baseName || "").toLowerCase();
  if (/น้ำอัดลม|โค้ก|pepsi|cola|sprite|fanta|สไปรท์/.test(name)) return 0.95;
  if (/น้ำผลไม้|น้ำส้ม|orange juice|juice/.test(name)) return 0.8;
  if (/ชาไทย|ชานม|bubble|ไข่มุก|โกโก้|ช็อก|ปั่น|frappe|น้ำผึ้ง/.test(name)) return 0.72;
  if (/กาแฟ|latte|คาปูชิโน่|มัทฉะ|matcha/.test(name)) return 0.55;
  return 0.65;
};

export const supportsDrinkSweetness = (food) => {
  if (!food) return false;

  if (!isDrinkFood(food)) return false;
  const name = String(food?.name || food?.baseName || "").toLowerCase();
  if (UNSWEETENED_DRINK_PATTERN.test(name)) return false;

  const calories = Number(food.calories) || 0;
  const carbs = Number(food.carbs) || 0;
  return calories >= 25 || carbs >= 5;
};

export const getDrinkSweetnessOption = (sweetnessId) =>
  DRINK_SWEETNESS_OPTIONS.find((option) => option.id === sweetnessId)
  || DRINK_SWEETNESS_OPTIONS[0];

export const applyDrinkSweetness = (nutrition, sweetnessFactor, food) => {
  const factor = Number(sweetnessFactor);
  if (!Number.isFinite(factor) || factor >= 1) {
    return {
      calories: Math.round(Number(nutrition.calories) || 0),
      protein: Math.round(Number(nutrition.protein) * 10) / 10 || 0,
      carbs: Math.round(Number(nutrition.carbs) * 10) / 10 || 0,
      fat: Math.round(Number(nutrition.fat) * 10) / 10 || 0,
    };
  }

  const base = {
    calories: Number(nutrition.calories) || 0,
    protein: Number(nutrition.protein) || 0,
    carbs: Number(nutrition.carbs) || 0,
    fat: Number(nutrition.fat) || 0,
  };

  const sugarShare = getSugarCarbShare(food);
  const adjustableCarbs = base.carbs * sugarShare;
  const fixedCarbs = base.carbs - adjustableCarbs;
  const carbs = fixedCarbs + adjustableCarbs * factor;

  const adjustableCal = adjustableCarbs * 4;
  const calories = base.calories - adjustableCal + adjustableCal * factor;

  const fatShare = /ชา|นม|ปั่น|frappe|โกโก้|latte/.test(String(food?.name || food?.baseName || "")) ? 0.12 : 0;
  const adjustableFat = base.fat * fatShare;
  const fat = base.fat - adjustableFat + adjustableFat * factor;

  return {
    calories: Math.round(Math.max(0, calories)),
    protein: Math.round(base.protein * 10) / 10,
    carbs: Math.round(Math.max(0, carbs) * 10) / 10,
    fat: Math.round(Math.max(0, fat) * 10) / 10,
  };
};

export const formatSweetnessLabel = (sweetnessId) =>
  getDrinkSweetnessOption(sweetnessId).label;
