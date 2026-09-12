import { EMPTY_MEALS } from "./userStorage";

export function sessionHasDailyLogs({ dailyMeals, activities }) {
  const meals = dailyMeals || EMPTY_MEALS;
  const hasMeals = Object.values(meals).some((items) => items?.length > 0);
  const hasActs = (activities || []).length > 0;
  return hasMeals || hasActs;
}

export function sessionHasLogData({ dailyMeals, activities, historyData }) {
  const hasHistory = (historyData || []).length > 0;
  return sessionHasDailyLogs({ dailyMeals, activities }) || hasHistory;
}

export function packCloudPayload({ dailyMeals, activities, historyData, lastDate, user }) {
  return {
    dailyMeals: dailyMeals || { ...EMPTY_MEALS },
    activities: activities || [],
    historyData: historyData || [],
    lastDate: lastDate || null,
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
    user: {
      ...serverUser,
      ...(extras.foodPreferences ? { foodPreferences: extras.foodPreferences } : {}),
      ...(extras.profileImage ? { profileImage: extras.profileImage } : {}),
    },
  };
}

/** Pick newer snapshot when both local and cloud have logs. */
export function resolveSessionOnLogin(localSession, cloudResult, serverUser) {
  const cloudApplied = applyCloudPayload(cloudResult?.payload, serverUser);
  const localHas = sessionHasLogData(localSession);
  const cloudHas = cloudApplied && sessionHasLogData(cloudApplied);

  if (!cloudHas && !localHas) {
    return { session: localSession, uploadLocal: false };
  }

  if (cloudHas && !localHas) {
    return { session: cloudApplied, uploadLocal: false };
  }

  if (!cloudHas && localHas) {
    return { session: localSession, uploadLocal: true };
  }

  const localTs = Number(localSession.syncUpdatedAt) || 0;
  const cloudTs = cloudResult?.updated_at
    ? new Date(cloudResult.updated_at).getTime()
    : 0;

  if (cloudTs >= localTs) {
    return { session: cloudApplied, uploadLocal: false };
  }
  return { session: localSession, uploadLocal: true };
}
