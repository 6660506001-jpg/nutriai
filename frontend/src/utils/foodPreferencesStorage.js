export const getFoodPrefsSetupKey = (username) =>
  `nutri_food_prefs_done__${encodeURIComponent(username || "guest")}`;

export const hasCompletedFoodPrefsSetup = (username) =>
  localStorage.getItem(getFoodPrefsSetupKey(username)) === "1";

export const markFoodPrefsSetupDone = (username) => {
  if (!username) return;
  localStorage.setItem(getFoodPrefsSetupKey(username), "1");
};
