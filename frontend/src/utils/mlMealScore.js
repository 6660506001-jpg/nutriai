import { getApiBaseUrl } from "../constants/config";

const MODEL_LABELS = {
  rf: "Random Forest",
  svm: "SVM",
  gb: "Gradient Boosting",
};

export async function scoreMenusWithMl(menus = [], remainingCal = 0) {
  if (!Array.isArray(menus) || menus.length === 0) return menus;

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/ml/score-menus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        remainingCal,
        menus: menus.map((menu) => ({
          name: menu.name,
          calories: menu.calories,
          protein: menu.protein,
          carbs: menu.carbs,
          fat: menu.fat,
        })),
      }),
    });
    if (!response.ok) return menus;
    const data = await response.json();
    const byName = new Map((data.items || []).map((item) => [item.name, item.ml]));

    return menus.map((menu) => {
      const ml = byName.get(menu.name);
      if (!ml?.ensemble) return menu;
      const suitable = ml.ensemble.suitable === true;
      const agree = Number(ml.ensemble.agreeCount) || 0;
      return {
        ...menu,
        ml,
        mlSuitable: suitable,
        matchNote: suitable
          ? `${menu.matchNote || "เหมาะกับมื้อนี้"} · โมเดล ${agree}/3 เห็นว่าเหมาะสม`
          : menu.matchNote,
      };
    }).sort((a, b) => Number(b.mlSuitable) - Number(a.mlSuitable));
  } catch {
    return menus;
  }
}

export const mlModelLabels = MODEL_LABELS;
