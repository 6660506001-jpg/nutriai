import { EMPTY_MEALS } from "./userStorage";

export function sessionHasDailyLogs({ dailyMeals, activities }) {
  const meals = dailyMeals || EMPTY_MEALS;
  const hasMeals = Object.values(meals).some((items) => items?.length > 0);
  const hasActs = (activities || []).length > 0;
  return hasMeals || hasActs;
}

export function countDailyItems({ dailyMeals, activities }) {
  const meals = Object.values(dailyMeals || {}).reduce((sum, items) => sum + (items?.length || 0), 0);
  return meals + (activities || []).length;
}

export function sessionHasLogData({ dailyMeals, activities, historyData }) {
  const hasHistory = (historyData || []).length > 0;
  return sessionHasDailyLogs({ dailyMeals, activities }) || hasHistory;
}

export function packCloudPayload({ dailyMeals, activities, historyData, lastDate, user, rolledOver }) {
  return {
    dailyMeals: dailyMeals || { ...EMPTY_MEALS },
    activities: activities || [],
    historyData: historyData || [],
    lastDate: lastDate || null,
    rolledOver: Boolean(rolledOver),
    userExtras: user
      ? {
          foodPreferences: user.foodPreferences,
          profileImage: user.profileImage,
        }
      : {},
  };
}

export function applyCloudPayload(payload, serverUser) {
  if (!payload) return null;
  const extras = payload.userExtras || {};
  return {
    dailyMeals: payload.dailyMeals || { ...EMPTY_MEALS },
    activities: payload.activities || [],
    historyData: payload.historyData || [],
    lastDate: payload.lastDate || null,
    rolledOver: Boolean(payload.rolledOver),
    user: {
      ...serverUser,
      ...(extras.foodPreferences ? { foodPreferences: extras.foodPreferences } : {}),
      ...(extras.profileImage ? { profileImage: extras.profileImage } : {}),
    },
  };
}

function itemMergeKey(item) {
  if (!item || typeof item !== "object") return "";
  if (item.id != null && String(item.id)) return `id:${item.id}`;
  return [item.name, item.loggedAt, item.calories, item.mealPeriod, item.durationMinutes]
    .map((value) => String(value ?? ""))
    .join("|");
}

function mergeItemList(primary, secondary) {
  const seen = new Set();
  const out = [];
  [...(primary || []), ...(secondary || [])].forEach((item) => {
    const key = itemMergeKey(item);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });
  return out;
}

function mergeMealMaps(primary, secondary) {
  const keys = new Set([
    ...Object.keys(EMPTY_MEALS),
    ...Object.keys(primary || {}),
    ...Object.keys(secondary || {}),
  ]);
  const merged = { ...EMPTY_MEALS };
  keys.forEach((key) => {
    merged[key] = mergeItemList(primary?.[key], secondary?.[key]);
  });
  return merged;
}

function mergeHistoryLists(primary, secondary) {
  const seen = new Set();
  const out = [];
  [...(primary || []), ...(secondary || [])].forEach((entry) => {
    const key = String(entry?.id || entry?.dateKey || "");
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(entry);
  });
  return out;
}

/** Prefer today's meals on cloud when this device has none. History alone must not win. */
export function resolveSessionOnLogin(localSession, cloudResult, serverUser) {
  const cloudApplied = applyCloudPayload(cloudResult?.payload, serverUser);
  const localDaily = sessionHasDailyLogs(localSession || {});
  const cloudDaily = Boolean(cloudApplied && sessionHasDailyLogs(cloudApplied));
  const mergedHistory = mergeHistoryLists(
    cloudApplied?.historyData,
    localSession?.historyData,
  );

  if (!cloudDaily && !localDaily) {
    return {
      session: {
        ...(localSession || {}),
        historyData: mergedHistory,
      },
      uploadLocal: false,
    };
  }

  if (cloudDaily && !localDaily) {
    return {
      session: {
        ...cloudApplied,
        historyData: mergedHistory,
      },
      uploadLocal: false,
    };
  }

  if (!cloudDaily && localDaily) {
    return {
      session: {
        ...localSession,
        historyData: mergedHistory,
      },
      uploadLocal: true,
    };
  }

  return {
    session: {
      ...cloudApplied,
      dailyMeals: mergeMealMaps(cloudApplied.dailyMeals, localSession.dailyMeals),
      activities: mergeItemList(cloudApplied.activities, localSession.activities),
      historyData: mergedHistory,
      lastDate: cloudApplied.lastDate || localSession.lastDate,
      user: {
        ...(localSession.user || {}),
        ...(cloudApplied.user || {}),
      },
    },
    uploadLocal: true,
  };
}
