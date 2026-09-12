import { stripSimulatedHistory } from "./dailyArchive";

export const EMPTY_MEALS = { "มื้อเช้า": [], "มื้อกลางวัน": [], "มื้อเย็น": [] };

const STORAGE_KEYS = {
  user: "nutri_user",
  meals: "nutri_meals",
  history: "nutri_history",
  activities: "nutri_activities",
  lastDate: "nutri_last_date",
};

const LAST_USERNAME_KEY = "nutri_last_username";

export function getLastUsername() {
  try {
    return String(localStorage.getItem(LAST_USERNAME_KEY) || "").trim();
  } catch {
    return "";
  }
}

export function setLastUsername(username) {
  const clean = String(username || "").trim();
  if (!clean) return;
  try {
    localStorage.setItem(LAST_USERNAME_KEY, clean);
  } catch {
    /* ignore quota */
  }
}

export function clearLastUsername() {
  try {
    localStorage.removeItem(LAST_USERNAME_KEY);
  } catch {
    /* ignore */
  }
}

function scopedKey(kind, username) {
  return `${STORAGE_KEYS[kind]}__${encodeURIComponent(username)}`;
}

function syncUpdatedKey(username) {
  return `nutri_sync_updated_at__${encodeURIComponent(username)}`;
}

export function getLocalSyncUpdatedAt(username) {
  const raw = localStorage.getItem(syncUpdatedKey(username));
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function touchLocalSyncUpdatedAt(username) {
  localStorage.setItem(syncUpdatedKey(username), String(Date.now()));
}

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function readHistory(username, fallback) {
  const scoped = localStorage.getItem(scopedKey("history", username));
  if (scoped != null) {
    const raw = readJson(scopedKey("history", username), fallback);
    const cleaned = stripSimulatedHistory(raw);
    if (cleaned.length !== raw.length) {
      localStorage.setItem(scopedKey("history", username), JSON.stringify(cleaned));
    }
    return cleaned;
  }

  const legacy = localStorage.getItem(STORAGE_KEYS.history);
  if (legacy == null) return fallback;

  const legacyUser = readJson(STORAGE_KEYS.user, null);
  if (legacyUser?.username !== username) return fallback;

  const cleaned = stripSimulatedHistory(readJson(STORAGE_KEYS.history, fallback));
  localStorage.setItem(scopedKey("history", username), JSON.stringify(cleaned));
  return cleaned;
}

function readScopedOrLegacy(kind, username, fallback) {
  if (kind === "history") {
    return readHistory(username, fallback);
  }

  const scoped = localStorage.getItem(scopedKey(kind, username));
  if (scoped != null) {
    return kind === "lastDate" ? scoped : readJson(scopedKey(kind, username), fallback);
  }

  const legacyKey = STORAGE_KEYS[kind];
  const legacy = localStorage.getItem(legacyKey);
  if (legacy == null) return fallback;

  const legacyUser = readJson(STORAGE_KEYS.user, null);
  if (legacyUser?.username !== username) return fallback;

  localStorage.setItem(scopedKey(kind, username), legacy);
  return kind === "lastDate" ? legacy : readJson(legacyKey, fallback);
}

export function findStoredUsername() {
  const last = getLastUsername();
  if (last) return last;
  try {
    const prefix = `${STORAGE_KEYS.user}__`;
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const user = readJson(key, null);
      if (user?.username) return String(user.username).trim();
    }
  } catch {
    /* ignore */
  }
  return "";
}

export function loadUserSession(username) {
  if (!username) {
    return {
      user: null,
      dailyMeals: { ...EMPTY_MEALS },
      historyData: [],
      activities: [],
      lastDate: null,
    };
  }

  return {
    user: readScopedOrLegacy("user", username, null),
    dailyMeals: readScopedOrLegacy("meals", username, { ...EMPTY_MEALS }),
    historyData: readHistory(username, []),
    activities: readScopedOrLegacy("activities", username, []),
    lastDate: readScopedOrLegacy("lastDate", username, null),
    syncUpdatedAt: getLocalSyncUpdatedAt(username),
  };
}

export function saveUserSession(username, { user, dailyMeals, historyData, activities, lastDate }) {
  if (!username) return;

  if (user != null) {
    localStorage.setItem(scopedKey("user", username), JSON.stringify(user));
  }
  if (dailyMeals != null) {
    localStorage.setItem(scopedKey("meals", username), JSON.stringify(dailyMeals));
  }
  if (historyData != null) {
    localStorage.setItem(
      scopedKey("history", username),
      JSON.stringify(stripSimulatedHistory(historyData)),
    );
  }
  if (activities != null) {
    localStorage.setItem(scopedKey("activities", username), JSON.stringify(activities));
  }
  if (lastDate != null) {
    localStorage.setItem(scopedKey("lastDate", username), lastDate);
  }
  setLastUsername(username);
  touchLocalSyncUpdatedAt(username);
}

/** ล้างคีย์เก่าที่ไม่แยกบัญชี — ป้องกันข้อมูลชนกันระหว่าง user */
export function clearLegacySessionKeys() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
