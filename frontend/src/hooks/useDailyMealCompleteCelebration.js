import { useEffect, useRef, useState } from "react";
import { getTodayKey } from "../utils/dailyArchive";
import {
  buildDailyCompleteCelebration,
  getCelebrationStorageKey,
  isAllMealsLogged,
} from "../utils/dailyMealComplete";
import { playCelebrationSound } from "../utils/celebrationSound";
import { analyzeThreeMealsSummary } from "../utils/mealRecommendations";
import { summarizeDailyRewards } from "../utils/mealRewards";

export function useDailyMealCompleteCelebration(dailyMeals, username, tdee) {
  const [toast, setToast] = useState(null);
  const wasCompleteRef = useRef(isAllMealsLogged(dailyMeals));

  useEffect(() => {
    const complete = isAllMealsLogged(dailyMeals);
    const dateKey = getTodayKey();
    const storageKey = getCelebrationStorageKey(username, dateKey);

    if (!complete) {
      localStorage.removeItem(storageKey);
      wasCompleteRef.current = false;
      return;
    }

    if (complete && !wasCompleteRef.current && !localStorage.getItem(storageKey)) {
      const mealsAnalysis = analyzeThreeMealsSummary(dailyMeals, { tdee });
      const dailyRewards = summarizeDailyRewards(mealsAnalysis.perMeal);
      setToast(buildDailyCompleteCelebration(dailyRewards));
      playCelebrationSound();
      localStorage.setItem(storageKey, "1");
    }

    wasCompleteRef.current = complete;
  }, [dailyMeals, username, tdee]);

  const dismissToast = () => setToast(null);

  return { toast, dismissToast };
}
