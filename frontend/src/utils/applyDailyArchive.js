import {
  buildArchiveEntry,
  getTodayKey,
  recoverStaleActivities,
  upsertHistoryEntry,
} from "./dailyArchive";
import { EMPTY_MEALS } from "./userStorage";

function itemDateKey(item) {
  if (item?.loggedDate) return String(item.loggedDate);
  if (item?.loggedAt) {
    const parsed = new Date(item.loggedAt);
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString("en-CA");
  }
  return "";
}

function partitionMeals(dailyMeals, today) {
  const todayMeals = { ...EMPTY_MEALS };
  const oldMeals = { ...EMPTY_MEALS };
  Object.entries(dailyMeals || {}).forEach(([meal, items]) => {
    todayMeals[meal] = [];
    oldMeals[meal] = [];
    (items || []).forEach((item) => {
      if (itemDateKey(item) === today) todayMeals[meal].push(item);
      else oldMeals[meal].push(item);
    });
  });
  return { todayMeals, oldMeals };
}

function partitionActivities(activities, today) {
  const todayActs = [];
  const oldActs = [];
  (activities || []).forEach((item) => {
    if (itemDateKey(item) === today) todayActs.push(item);
    else oldActs.push(item);
  });
  return { todayActs, oldActs };
}

export function applyDailyArchive({ lastDate, user, dailyMeals, historyData, activities }) {
  const today = getTodayKey();
  let nextHistory = historyData || [];
  let nextActivities = activities || [];
  let nextMeals = dailyMeals || { ...EMPTY_MEALS };

  if (lastDate && lastDate !== today) {
    const { todayMeals, oldMeals } = partitionMeals(nextMeals, today);
    const { todayActs, oldActs } = partitionActivities(nextActivities, today);
    const archivedEntry = buildArchiveEntry({
      dateKey: lastDate,
      weight: user?.weight,
      dailyMeals: oldMeals,
      activities: oldActs,
    });

    if (archivedEntry) {
      nextHistory = upsertHistoryEntry(nextHistory, archivedEntry);
    }

    nextMeals = todayMeals;
    nextActivities = todayActs;
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
