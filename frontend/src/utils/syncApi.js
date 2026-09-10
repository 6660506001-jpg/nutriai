import { getApiBaseUrl } from "../constants/config";

function parseError(data, fallback) {
  const detail = data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  return fallback;
}

export async function loadUserDataFromCloud(username, password) {
  const res = await fetch(`${getApiBaseUrl()}/api/user-data/load`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseError(data, "โหลดข้อมูลจาก cloud ไม่สำเร็จ"));
  }
  return data;
}

export async function saveUserDataToCloud(username, password, payload) {
  const res = await fetch(`${getApiBaseUrl()}/api/user-data/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseError(data, "บันทึกข้อมูลขึ้น cloud ไม่สำเร็จ"));
  }
  return data;
}
