export const FOOD_LIKE_PRESETS = [
  "ไก่",
  "ปลา",
  "ทะเล",
  "ผัก",
  "ต้ม/แกง",
  "ยำ/สลัด",
  "โปรตีนสูง",
];

export const FOOD_DISLIKE_PRESETS = [
  "ทอด",
  "เผ็ด",
  "คาร์บสูง",
  "ของหวาน",
  "เค็ม",
];

/** คำที่มักใช้ตั้งแต่เริ่มใช้งาน — แพ้ / ไม่กิน */
export const FOOD_ALLERGY_PRESETS = [
  "ถั่ว",
  "นม",
  "ไข่",
  "กุ้ง",
  "ปลา",
  "ไก่",
  "ทะเล",
  "เนื้อ",
];

export const EMPTY_FOOD_PREFERENCES = { likes: [], dislikes: [] };

const normalizeMatchText = (text) => String(text || "").normalize("NFC").toLowerCase();

export const normalizePreferenceList = (raw) => {
  if (Array.isArray(raw)) {
    return [...new Set(raw.map((item) => String(item || "").trim()).filter(Boolean))];
  }
  if (typeof raw === "string") {
    return [...new Set(
      raw
        .split(/[,，;\n|]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    )];
  }
  return [];
};

export const normalizeFoodPreferences = (preferences) => ({
  likes: normalizePreferenceList(preferences?.likes),
  dislikes: normalizePreferenceList(preferences?.dislikes),
});

const expandKeyword = (keyword) => {
  const key = String(keyword || "").trim().toLowerCase();
  if (!key) return [];
  if (key.includes("ทะเล") || key.includes("ซีฟู้ด")) {
    return [key, "กุ้ง", "ปลา", "หมึก", "ทะเล"];
  }
  if (key.includes("ต้ม") || key.includes("แกง")) {
    return [key, "ต้ม", "แกง", "ซุป"];
  }
  if (key.includes("ยำ") || key.includes("สลัด")) {
    return [key, "ยำ", "สลัด", "ลาบ"];
  }
  if (key.includes("โปรตีน")) {
    return [key, "ไก่", "ปลา", "อกไก่", "ทูน่า", "ไข่"];
  }
  if (key.includes("คาร์บ")) {
    return [key, "ข้าว", "เส้น", "ก๋วย", "บะหมี่", "แป้ง"];
  }
  if (key.includes("ของหวาน") || key.includes("หวาน")) {
    return [key, "หวาน", "ชานม", "เค้ก", "ไอศกรีม", "ขนม"];
  }
  if (key.includes("เผ็ด")) {
    return [key, "เผ็ด", "พริก", "ตำ", "กะเพรา"];
  }
  if (key.includes("ทอด")) {
    return [key, "ทอด", "กรอบ", "ไก่ทอด"];
  }
  if (key.includes("ถั่ว")) {
    return [key, "ถั่ว", "ถั่วลิสง", "งา", "น้ำพริก"];
  }
  if (key.includes("นม") || key.includes("แลค")) {
    return [key, "นม", "ชีส", "ครีม", "เนย", "โยเกิร์ต", "ชานม"];
  }
  if (key.includes("ไข่")) {
    return [key, "ไข่", "ไข่เจียว", "ไข่ดาว"];
  }
  if (key.includes("เนื้อ")) {
    return [key, "เนื้อ", "สเต็ก", "เนื้อวัว", "เนื้ออ่อน"];
  }
  if (key.includes("ไก่")) {
    return [key, "ไก่", "อกไก่", "ไก่ย่าง"];
  }
  if (key.includes("กุ้ง")) {
    return [key, "กุ้ง", "กุ้งแชบบ", "กุ้งทอด", "กุ้งกุล่า", "shrimp"];
  }
  if (key.includes("หมึก")) {
    return [key, "หมึก", "ปลาหมึก", "squid"];
  }
  return [key];
};

/** รวมชื่อที่ใช้เช็คแพ้จาก string หรือรายการอาหารที่บันทึก */
export const getFoodNamesForMatching = (nameOrMenu) => {
  if (typeof nameOrMenu === "string") {
    const trimmed = nameOrMenu.trim();
    return trimmed ? [trimmed] : [];
  }
  const names = [nameOrMenu?.name, nameOrMenu?.baseName]
    .map((part) => String(part || "").trim())
    .filter(Boolean);
  return [...new Set(names)];
};

const nameContainsPart = (name, part) => {
  const normalizedName = normalizeMatchText(name);
  const normalizedPart = normalizeMatchText(part);
  return normalizedPart.length > 0 && normalizedName.includes(normalizedPart);
};

export const menuMatchesKeywords = (menu, keywords) => {
  const names = getFoodNamesForMatching(menu);
  if (!names.length || !keywords?.length) return false;
  return keywords.some((keyword) =>
    expandKeyword(keyword).some((part) =>
      names.some((name) => nameContainsPart(name, part)),
    ),
  );
};

/** คืนรายการที่ตั้งว่าแพ้/หลีกเลี่ยง ที่ match กับชื่อเมนู */
export const getMatchingAvoidanceKeywords = (nameOrMenu, preferences) => {
  const names = getFoodNamesForMatching(nameOrMenu);
  const { dislikes } = normalizeFoodPreferences(preferences);
  if (!names.length || !dislikes.length) return [];

  const matched = dislikes.filter((keyword) => menuMatchesKeywords(nameOrMenu, [keyword]));

  // เผื่อคำที่ตั้งไม่ตรง preset — สแกนชื่อเมนูกับ allergen ที่ user เลือกไว้
  dislikes.forEach((keyword) => {
    if (FOOD_ALLERGY_PRESETS.includes(keyword) && matched.includes(keyword)) return;
    if (FOOD_ALLERGY_PRESETS.includes(keyword)) {
      const hit = names.some((name) => nameContainsPart(name, keyword));
      if (hit && !matched.includes(keyword)) matched.push(keyword);
    }
  });

  return matched;
};

export const hasFoodAvoidanceConfigured = (preferences) =>
  normalizeFoodPreferences(preferences).dislikes.length > 0;

export const hasAvoidanceConflict = (nameOrMenu, preferences) =>
  getMatchingAvoidanceKeywords(nameOrMenu, preferences).length > 0;

export const appendFoodPreference = (current, type, keyword) => {
  const key = String(keyword || "").trim();
  if (!key) return normalizeFoodPreferences(current);
  const norm = normalizeFoodPreferences(current);
  const field = type === "like" ? "likes" : "dislikes";
  if (norm[field].includes(key)) return norm;
  return normalizeFoodPreferences({
    ...norm,
    [field]: [...norm[field], key],
  });
};

export const removeFoodPreference = (current, type, keyword) => {
  const key = String(keyword || "").trim();
  if (!key) return normalizeFoodPreferences(current);
  const norm = normalizeFoodPreferences(current);
  const field = type === "like" ? "likes" : "dislikes";
  return normalizeFoodPreferences({
    ...norm,
    [field]: norm[field].filter((item) => item !== key),
  });
};

export const toggleFoodPreference = (current, type, keyword) => {
  const norm = normalizeFoodPreferences(current);
  const field = type === "like" ? "likes" : "dislikes";
  const key = String(keyword || "").trim();
  if (!key) return norm;
  return norm[field].includes(key)
    ? removeFoodPreference(norm, type, key)
    : appendFoodPreference(norm, type, key);
};

export const inferDislikeKeywordFromMenu = (name) => {
  const text = String(name || "").trim();
  if (!text) return "";
  if (/ปลา/.test(text)) return "ปลา";
  if (/ไก่/.test(text)) return "ไก่";
  if (/กุ้ง|หมึก|ทะเล/.test(text)) return "ทะเล";
  if (/เป็ด/.test(text)) return "เป็ด";
  if (/ลาบ/.test(text)) return "ลาบ";
  if (/ทอด|กรอบ/.test(text)) return "ทอด";
  if (/เผ็ด|พริก/.test(text)) return "เผ็ด";
  const first = text.split(/[\s+(/]/)[0];
  return first.length >= 2 ? first : text;
};

const menuNameExcluded = (menuName, excludeNames) => {
  const name = String(menuName || "").toLowerCase();
  return (excludeNames || []).some((ex) => {
    const token = String(ex || "").trim().toLowerCase();
    if (!token) return false;
    return name.includes(token) || token.includes(name) || name === token;
  });
};

export const filterExcludedMenuNames = (menus, excludeNames) =>
  (menus || []).filter((menu) => !menuNameExcluded(menu.name, excludeNames));

export const filterMenusByPreferences = (menus, preferences) => {
  const { dislikes } = normalizeFoodPreferences(preferences);
  if (!dislikes.length) return menus;
  return (menus || []).filter((menu) => !menuMatchesKeywords(menu, dislikes));
};

export const getPreferenceScoreBoost = (menu, preferences) => {
  const { likes } = normalizeFoodPreferences(preferences);
  if (!likes.length) return 0;
  let boost = 0;
  likes.forEach((keyword) => {
    if (menuMatchesKeywords(menu, [keyword])) boost += 18;
  });
  return boost;
};

export const formatPreferencesSummary = (preferences) => {
  const { likes, dislikes } = normalizeFoodPreferences(preferences);
  const parts = [];
  if (likes.length) parts.push(`ชอบ: ${likes.slice(0, 4).join(", ")}${likes.length > 4 ? "…" : ""}`);
  if (dislikes.length) parts.push(`ไม่ชอบ: ${dislikes.slice(0, 4).join(", ")}${dislikes.length > 4 ? "…" : ""}`);
  return parts.join(" · ") || "";
};
