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

const isLocalDevHost = (hostname) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.endsWith(".local");

/** URL ที่แชร์ให้ผู้ใช้สแกน QR / กดลิงก์ (ตั้ง REACT_APP_PUBLIC_URL บน Vercel) */
export const getPublicAppUrl = () => {
  if (process.env.REACT_APP_PUBLIC_URL) {
    return process.env.REACT_APP_PUBLIC_URL.replace(/\/$/, "");
  }
  if (typeof window === "undefined") return "";

  const { protocol, hostname, origin, port } = window.location;
  if (isLocalDevHost(hostname)) return "";

  if (protocol === "https:") return origin;

  if (/^192\.168\.\d+\.\d+$/.test(hostname) || /^10\.\d+\.\d+\.\d+$/.test(hostname)) {
    return port ? `${protocol}//${hostname}:${port}` : origin;
  }

  return "";
};

export const canSharePublicAppLink = () => Boolean(getPublicAppUrl());

export const isWifiOnlyShareUrl = (url) => {
  if (!url) return false;
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "https:" && protocol !== "http:") return false;
    return (
      /^192\.168\.\d+\.\d+$/.test(hostname) ||
      /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname)
    );
  } catch {
    return false;
  }
};

/** @deprecated use getApiBaseUrl() for runtime hostname */
export const API_BASE_URL = typeof window !== "undefined" ? resolveApiBaseUrl() : "http://127.0.0.1:8000";

/** Full-bleed healthy food photo for glass UI backgrounds */
export const LOGIN_FOOD_BG = `${process.env.PUBLIC_URL || ""}/login-food-bg.jpg`;

export const MAIN_BG_DARK = "#121212";
export const SIDEBAR_BG_DARK = "#0F172A";
