import {
  buildArchiveEntry,
  getTodayKey,
  getYesterdayKey,
  normalizeDateKey,
  toDateKey,
  upsertHistoryEntry,
} from "./dailyArchive";
import { EMPTY_MEALS } from "./userStorage";

function emptyMeals() {
  return { ...EMPTY_MEALS, "มื้อเช้า": [], "มื้อกลางวัน": [], "มื้อเย็น": [] };
}

function hasDailyLogs(dailyMeals, activities) {
  const hasMeals = Object.values(dailyMeals || {}).some((items) => items?.length > 0);
  return hasMeals || (activities || []).length > 0;
}

export function itemDateKey(item) {
  if (item?.loggedAt) {
    const parsed = new Date(item.loggedAt);
    if (!Number.isNaN(parsed.getTime())) return toDateKey(parsed);
  }
  if (item?.loggedDate) return normalizeDateKey(item.loggedDate);
  return "";
}

function resolveItemDate(item, today, last) {
  const key = itemDateKey(item);
  if (key) return key;
  if (last && last !== today) return last;
  return today;
}

export function applyDailyArchive({ lastDate, user, dailyMeals, historyData, activities }) {
  const today = getTodayKey();
  const last = normalizeDateKey(lastDate);
  let nextHistory = historyData || [];
  const todayMeals = emptyMeals();
  const todayActs = [];
  const buckets = new Map();

  const bucketFor = (dateKey) => {
    if (!buckets.has(dateKey)) {
      buckets.set(dateKey, { dailyMeals: emptyMeals(), activities: [] });
    }
    return buckets.get(dateKey);
  };

  Object.entries(dailyMeals || {}).forEach(([meal, items]) => {
    (items || []).forEach((item) => {
      const dateKey = resolveItemDate(item, today, last);
      if (dateKey === today) {
        if (!todayMeals[meal]) todayMeals[meal] = [];
        todayMeals[meal].push(item);
        return;
      }
      const bucket = bucketFor(dateKey);
      if (!bucket.dailyMeals[meal]) bucket.dailyMeals[meal] = [];
      bucket.dailyMeals[meal].push(item);
    });
  });

  (activities || []).forEach((item) => {
    const dateKey = resolveItemDate(item, today, last);
    if (dateKey === today) {
      todayActs.push(item);
      return;
    }
    bucketFor(dateKey).activities.push(item);
  });

  buckets.forEach((bucket, dateKey) => {
    if (!hasDailyLogs(bucket.dailyMeals, bucket.activities)) return;
    const archivedEntry = buildArchiveEntry({
      dateKey: dateKey || last || getYesterdayKey(),
      weight: user?.weight,
      dailyMeals: bucket.dailyMeals,
      activities: bucket.activities,
    });
    if (archivedEntry) {
      nextHistory = upsertHistoryEntry(nextHistory, archivedEntry);
    }
  });

  return {
    user,
    dailyMeals: todayMeals,
    historyData: nextHistory,
    activities: todayActs,
    lastDate: today,
    rolledOver: buckets.size > 0,
  };
}
