const prefix = "nutri_sync_pw__";

function storageKey(username) {
  return `${prefix}${encodeURIComponent(username)}`;
}

export function setSyncPassword(username, password) {
  if (!username || !password) return;
  const key = storageKey(username);
  try {
    localStorage.setItem(key, password);
  } catch {
    /* ignore quota */
  }
  try {
    sessionStorage.setItem(key, password);
  } catch {
    /* ignore quota */
  }
}

export function getSyncPassword(username) {
  if (!username) return "";
  const key = storageKey(username);
  try {
    const local = localStorage.getItem(key);
    if (local) return local;
    const session = sessionStorage.getItem(key);
    if (session) {
      try {
        localStorage.setItem(key, session);
      } catch {
        /* ignore quota */
      }
      return session;
    }
  } catch {
    /* ignore */
  }
  return "";
}

export function clearSyncPassword(username) {
  if (!username) return;
  const key = storageKey(username);
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
