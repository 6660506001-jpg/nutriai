const resolveApiBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.hostname) {
    const { hostname, protocol } = window.location;
    const isLocalHost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      /^192\.168\.\d+\.\d+$/.test(hostname) ||
      /^10\.\d+\.\d+\.\d+$/.test(hostname);

    if (isLocalHost) {
      return `http://${hostname}:8000`;
    }

    if (protocol === "https:") {
      console.warn(
        "[NutriAI] ตั้ง REACT_APP_API_BASE_URL ใน Vercel ให้ชี้ไป backend บน cloud"
      );
    }
  }
  return "http://127.0.0.1:8000";
};

export const getApiBaseUrl = () => resolveApiBaseUrl();

/** @deprecated use getApiBaseUrl() for runtime hostname */
export const API_BASE_URL = typeof window !== "undefined" ? resolveApiBaseUrl() : "http://127.0.0.1:8000";

/** Full-bleed healthy food photo for glass UI backgrounds */
export const LOGIN_FOOD_BG = `${process.env.PUBLIC_URL || ""}/login-food-bg.jpg`;

export const MAIN_BG_DARK = "#121212";
export const SIDEBAR_BG_DARK = "#0F172A";
