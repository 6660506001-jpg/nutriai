import {
  APPEARANCE_STORAGE_KEY,
  CUSTOM_PRIMARY_STORAGE_KEY,
  CUSTOM_THEME_ID,
  DARK_APPEARANCE_VARS,
  DEFAULT_APPEARANCE,
  DEFAULT_CUSTOM_PRIMARY,
  DEFAULT_THEME_ID,
  FOLLOW_DEVICE_STORAGE_KEY,
  GLASS_DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  UNSELECTED_THEME_ID,
  getThemeById,
  isGlassTheme,
  resolveThemeId,
} from '../constants/themes';

let systemMediaQuery = null;
let systemListener = null;
let onSystemChange = null;

const resolveAppearance = (appearanceMode, followDevice) => {
  if (followDevice) return 'light';
  const saved = appearanceMode || DEFAULT_APPEARANCE;
  if (saved === 'system') return 'light';
  return saved === 'dark' ? 'dark' : 'light';
};

export const getStoredThemeId = () => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(THEME_STORAGE_KEY, DEFAULT_THEME_ID);
    if (!localStorage.getItem(APPEARANCE_STORAGE_KEY)) {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, DEFAULT_APPEARANCE);
    }
    if (!localStorage.getItem(CUSTOM_PRIMARY_STORAGE_KEY)) {
      localStorage.setItem(CUSTOM_PRIMARY_STORAGE_KEY, DEFAULT_CUSTOM_PRIMARY);
    }
    return DEFAULT_THEME_ID;
  }
  return resolveThemeId(saved);
};

export const hasSelectedTheme = () => localStorage.getItem(THEME_STORAGE_KEY) != null;

export const getStoredAppearance = () => {
  const saved = localStorage.getItem(APPEARANCE_STORAGE_KEY) || DEFAULT_APPEARANCE;
  if (saved === 'system') return 'light';
  return saved === 'dark' ? 'dark' : 'light';
};

export const getStoredFollowDevice = () => false;

export const getStoredCustomPrimary = () =>
  localStorage.getItem(CUSTOM_PRIMARY_STORAGE_KEY) || DEFAULT_CUSTOM_PRIMARY;

export const applyTheme = ({
  themeId = getStoredThemeId(),
  appearanceMode = getStoredAppearance(),
  followDevice = getStoredFollowDevice(),
  customPrimary = getStoredCustomPrimary(),
} = {}) => {
  const root = document.documentElement;
  const resolvedAppearance = resolveAppearance(appearanceMode, followDevice);
  const resolvedId = resolveThemeId(themeId);
  const theme = getThemeById(resolvedId, customPrimary);

  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  if (resolvedAppearance === 'dark' && !isGlassTheme(resolvedId)) {
    Object.entries(DARK_APPEARANCE_VARS).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  root.dataset.theme = resolvedId;
  root.dataset.appearance = resolvedAppearance;
  return resolvedId;
};

export const persistThemeSettings = ({
  themeId,
  appearanceMode,
  followDevice,
  customPrimary,
}) => {
  if (themeId != null) localStorage.setItem(THEME_STORAGE_KEY, themeId);
  if (appearanceMode != null) localStorage.setItem(APPEARANCE_STORAGE_KEY, appearanceMode);
  if (followDevice != null) {
    localStorage.setItem(FOLLOW_DEVICE_STORAGE_KEY, followDevice ? '1' : '0');
  }
  if (customPrimary != null) localStorage.setItem(CUSTOM_PRIMARY_STORAGE_KEY, customPrimary);
};

export const subscribeSystemAppearance = (callback) => {
  onSystemChange = callback;
  if (!systemMediaQuery) {
    systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemListener = () => {
      if (onSystemChange) onSystemChange();
    };
    systemMediaQuery.addEventListener('change', systemListener);
  }
};

export const unsubscribeSystemAppearance = () => {
  if (systemMediaQuery && systemListener) {
    systemMediaQuery.removeEventListener('change', systemListener);
  }
  systemMediaQuery = null;
  systemListener = null;
  onSystemChange = null;
};

export const initTheme = () => {
  applyTheme({
    themeId: getStoredThemeId(),
    appearanceMode: getStoredAppearance(),
    followDevice: getStoredFollowDevice(),
    customPrimary: getStoredCustomPrimary(),
  });
};

export { CUSTOM_THEME_ID, DEFAULT_THEME_ID, GLASS_DEFAULT_THEME_ID, UNSELECTED_THEME_ID };
