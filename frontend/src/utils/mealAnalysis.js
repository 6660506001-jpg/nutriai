import { Colors } from "../constants/colors";

export const analyzeIndividualMeal = (food) => {
  const p = Number(food.protein) || 0;
  const f = Number(food.fat) || 0;
  const cal = Number(food.calories) || 0;
  if (p > 20) return { status: "ดีมาก", color: Colors.accent, comment: "โปรตีนสูง ดีต่อกล้ามเนื้อ" };
  if (f > 15 || (f * 9) > (cal * 0.4)) return { status: "ควรระวัง", color: Colors.warning, comment: "ไขมันสูง — มื้อถัดไปลดน้ำมัน/ของทอด" };
  if (cal > 550) return { status: "พลังงานสูง", color: Colors.danger, comment: "แคลสูง — ควรขยับร่างกายเพิ่ม" };
  return { status: "สมดุล", color: Colors.success, comment: "สมดุลดี — เติมผักใบเขียวเพิ่มกากใย" };
};

