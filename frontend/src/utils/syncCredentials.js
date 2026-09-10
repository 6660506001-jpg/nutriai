const prefix = "nutri_sync_pw__";

export function setSyncPassword(username, password) {
  if (!username || !password) return;
  try {
    sessionStorage.setItem(`${prefix}${encodeURIComponent(username)}`, password);
  } catch {
    /* ignore quota */
  }
}

export function getSyncPassword(username) {
  if (!username) return "";
  try {
    return sessionStorage.getItem(`${prefix}${encodeURIComponent(username)}`) || "";
  } catch {
    return "";
  }
}

export function clearSyncPassword(username) {
  if (!username) return;
  try {
    sessionStorage.removeItem(`${prefix}${encodeURIComponent(username)}`);
  } catch {
    /* ignore */
  }
}
