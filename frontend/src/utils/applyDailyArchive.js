import {
  buildArchiveEntry,
  getTodayKey,
  normalizeDateKey,
  recoverStaleActivities,
  toDateKey,
  upsertHistoryEntry,
} from "./dailyArchive";
import { EMPTY_MEALS } from "./userStorage";

function hasDailyLogs(dailyMeals, activities) {
  const hasMeals = Object.values(dailyMeals || {}).some((items) => items?.length > 0);
  return hasMeals || (activities || []).length > 0;
}

function itemDateKey(item) {
  if (item?.loggedDate) return normalizeDateKey(item.loggedDate);
  if (item?.loggedAt) {
    const parsed = new Date(item.loggedAt);
    if (!Number.isNaN(parsed.getTime())) return toDateKey(parsed);
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

function hydrateTodayFromHistory(historyData, today) {
  const entry = (historyData || []).find((day) => (
    normalizeDateKey(day?.dateKey || day?.id) === today
  ));
  if (!entry?.meals?.length) return null;

  const meals = { ...EMPTY_MEALS };
  const activities = [];
  entry.meals.forEach((item) => {
    if (item?.itemType === "activity") {
      activities.push({
        name: item.name,
        calories: item.cal,
        durationMinutes: item.durationMinutes,
        intensityLabel: item.intensityLabel,
        loggedAt: item.loggedAt,
        loggedDate: today,
        mealPeriod: item.type,
      });
      return;
    }
    const meal = meals[item?.type] ? item.type : "มื้อเย็น";
    meals[meal] = [
      ...(meals[meal] || []),
      {
        name: item.name,
        calories: item.cal,
        loggedAt: item.loggedAt,
        loggedDate: today,
        mealPeriod: meal,
      },
    ];
  });

  if (!hasDailyLogs(meals, activities)) return null;
  return { dailyMeals: meals, activities };
}

export function applyDailyArchive({ lastDate, user, dailyMeals, historyData, activities }) {
  const today = getTodayKey();
  const last = normalizeDateKey(lastDate);
  let nextHistory = historyData || [];
  let nextActivities = activities || [];
  let nextMeals = dailyMeals || { ...EMPTY_MEALS };

  if (last && last !== today) {
    const { todayMeals, oldMeals } = partitionMeals(nextMeals, today);
    const { todayActs, oldActs } = partitionActivities(nextActivities, today);
    const archivedEntry = buildArchiveEntry({
      dateKey: last,
      weight: user?.weight,
      dailyMeals: oldMeals,
      activities: oldActs,
    });

    if (archivedEntry) {
      nextHistory = upsertHistoryEntry(nextHistory, archivedEntry);
    }

    nextMeals = todayMeals;
    nextActivities = todayActs;
  } else if (last === today) {
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

  if (!hasDailyLogs(nextMeals, nextActivities)) {
    const hydrated = hydrateTodayFromHistory(nextHistory, today);
    if (hydrated) {
      nextMeals = hydrated.dailyMeals;
      nextActivities = hydrated.activities;
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
