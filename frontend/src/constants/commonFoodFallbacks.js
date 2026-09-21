const FOODS = [
  {
    names: ["สปาเก็ตตี", "สปาเก็ตตี้", "สปาเกตตี", "สปาเกตตี้", "spaghetti", "พาสต้า", "pasta"],
    name: "สปาเก็ตตี",
    baseName: "สปาเก็ตตี",
    calories: 450,
    protein: 14,
    carbs: 68,
    fat: 12,
    defaultServingGrams: 300,
    defaultServingLabel: "1 จาน",
  },
  {
    names: ["เกาเหลา", "เกาเหลาน้ำ", "เกาเหลาเนื้อ", "เกาเหลาหมู"],
    name: "เกาเหลา",
    baseName: "เกาเหลา",
    calories: 280,
    protein: 24,
    carbs: 10,
    fat: 16,
    defaultServingGrams: 400,
    defaultServingLabel: "1 ถ้วย",
  },
];

const fold = (value) => String(value || "").trim().toLowerCase().normalize("NFC");

export function matchCommonFoodFallbacks(query) {
  const term = fold(query);
  if (term.length < 2) return [];
  return FOODS.filter((item) => item.names.some((alias) => {
    const name = fold(alias);
    return name.includes(term) || term.includes(name) || (term.length >= 4 && name.includes(term.slice(0, 4)));
  })).map(({ names, ...food }) => food);
}
