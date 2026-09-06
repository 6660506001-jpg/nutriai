export const getUserGuideStorageKey = (username) =>
  `nutri_guide_seen__${encodeURIComponent(username || "guest")}`;

export const hasSeenUserGuide = (username) =>
  localStorage.getItem(getUserGuideStorageKey(username)) === "1";

export const markUserGuideSeen = (username) => {
  if (!username) return;
  localStorage.setItem(getUserGuideStorageKey(username), "1");
};
