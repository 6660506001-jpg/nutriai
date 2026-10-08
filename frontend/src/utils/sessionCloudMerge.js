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

const BODY_EXTRA_KEYS = ["gender", "age", "weight", "height", "tdee", "bmr", "profileUpdatedAt"];

export function packUserExtras(user) {
  if (!user) return {};
  const extras = {
    foodPreferences: user.foodPreferences,
    profileImage: user.profileImage || null,
  };
  BODY_EXTRA_KEYS.forEach((key) => {
    if (user[key] != null && user[key] !== "") extras[key] = user[key];
  });
  return extras;
}

export function applyUserExtras(serverUser, extras) {
  const next = { ...(serverUser || {}) };
  const payload = extras || {};
  if (payload.foodPreferences) next.foodPreferences = payload.foodPreferences;
  if (Object.prototype.hasOwnProperty.call(payload, "profileImage")) {
    next.profileImage = payload.profileImage || null;
  }
  BODY_EXTRA_KEYS.forEach((key) => {
    if (payload[key] != null && payload[key] !== "") next[key] = payload[key];
  });
  return next;
}

export function packCloudPayload({ dailyMeals, activities, historyData, lastDate, user, rolledOver }) {
  return {
    dailyMeals: dailyMeals || { ...EMPTY_MEALS },
    activities: activities || [],
    historyData: historyData || [],
    lastDate: lastDate || null,
    rolledOver: Boolean(rolledOver),
    userExtras: packUserExtras(user),
  };
}

export function applyCloudPayload(payload, serverUser) {
  if (!payload) return null;
  return {
    dailyMeals: payload.dailyMeals || { ...EMPTY_MEALS },
    activities: payload.activities || [],
    historyData: payload.historyData || [],
    lastDate: payload.lastDate || null,
    rolledOver: Boolean(payload.rolledOver),
    user: applyUserExtras(serverUser, payload.userExtras),
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

function mergeSessionUsers(localUser, cloudUser) {
  const localTime = Number(localUser?.profileUpdatedAt) || 0;
  const cloudTime = Number(cloudUser?.profileUpdatedAt) || 0;
  if (cloudTime >= localTime) {
    return {
      ...(localUser || {}),
      ...(cloudUser || {}),
    };
  }
  return {
    ...(cloudUser || {}),
    ...(localUser || {}),
  };
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
  const mergedUser = mergeSessionUsers(localSession?.user, cloudApplied?.user);

  if (!cloudDaily && !localDaily) {
    return {
      session: {
        ...(localSession || {}),
        historyData: mergedHistory,
        user: mergedUser,
      },
      uploadLocal: false,
    };
  }

  if (cloudDaily && !localDaily) {
    return {
      session: {
        ...cloudApplied,
        historyData: mergedHistory,
        user: mergedUser,
      },
      uploadLocal: false,
    };
  }

  if (!cloudDaily && localDaily) {
    return {
      session: {
        ...localSession,
        historyData: mergedHistory,
        user: mergedUser,
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
      user: mergedUser,
    },
    uploadLocal: true,
  };
}
