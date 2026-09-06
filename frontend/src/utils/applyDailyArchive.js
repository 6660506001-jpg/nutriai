import {
  buildArchiveEntry,
  getTodayKey,
  recoverStaleActivities,
  upsertHistoryEntry,
} from "./dailyArchive";
import { EMPTY_MEALS } from "./userStorage";

export function applyDailyArchive({ lastDate, user, dailyMeals, historyData, activities }) {
  const today = getTodayKey();
  let nextHistory = historyData || [];
  let nextActivities = activities || [];
  let nextMeals = dailyMeals || { ...EMPTY_MEALS };

  if (lastDate && lastDate !== today) {
    const archivedEntry = buildArchiveEntry({
      dateKey: lastDate,
      weight: user?.weight,
      dailyMeals: nextMeals,
      activities: nextActivities,
    });

    if (archivedEntry) {
      nextHistory = upsertHistoryEntry(nextHistory, archivedEntry);
    }

    nextMeals = { ...EMPTY_MEALS };
    nextActivities = [];
  } else if (lastDate === today) {
    const recovery = recoverStaleActivities({
      history: nextHistory,
      activities: nextActivities,
      weight: user?.weight,
      todayKey: today,
    });

    if (recovery.changed) {
      nextHistory = recovery.history;
      nextActivities = recovery.activities;
    }
  }

  return {
    user,
    dailyMeals: nextMeals,
    historyData: nextHistory,
    activities: nextActivities,
    lastDate: today,
  };
}
