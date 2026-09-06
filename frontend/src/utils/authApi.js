import { getApiBaseUrl } from "../constants/config";

function mapUser(row) {
  if (!row) return null;
  const { password_hash: _passwordHash, ...safe } = row;
  return {
    username: safe.username,
    gender: safe.gender,
    age: Number(safe.age),
    weight: Number(safe.weight),
    height: Number(safe.height),
    tdee: safe.tdee != null ? Number(safe.tdee) : undefined,
    bmr: safe.bmr != null ? Number(safe.bmr) : undefined,
  };
}

function parseApiError(data, fallback) {
  const detail = data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  return fallback;
}

export async function loginUser(username, password) {
  const res = await fetch(`${getApiBaseUrl()}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseApiError(data, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));
  }
  return mapUser(data);
}

export async function registerUser(payload) {
  const res = await fetch(`${getApiBaseUrl()}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = parseApiError(data, "ไม่สามารถสมัครสมาชิกได้");
    if (/duplicate|already exists|1062/i.test(message)) {
      throw new Error("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
    }
    throw new Error(message);
  }
  return data;
}
