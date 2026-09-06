export const getTodayKey = () => new Date().toLocaleDateString("en-CA");

export const getYesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString("en-CA");
};

export const formatThaiArchiveDate = (isoDate) =>
  new Date(`${isoDate}T12:00:00`).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const buildArchiveEntry = ({ dateKey, weight, dailyMeals, activities }) => {
  const mealItems = Object.entries(dailyMeals || {}).flatMap(([type, list]) =>
    (list || []).map((item) => ({
      name: item.name,
      cal: item.calories,
      type,
      itemType: "food",
      loggedAt: item.loggedAt,
      loggedTime: item.loggedAt ? new Date(item.loggedAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : null,
    })),
  );

  const activityItems = (activities || []).map((item) => ({
    name: item.name,
    cal: item.calories,
    type: item.mealPeriod || "กิจกรรม",
    itemType: "activity",
    durationMinutes: item.durationMinutes,
    intensityLabel: item.intensityLabel,
    loggedAt: item.loggedAt,
    loggedTime: item.loggedAt ? new Date(item.loggedAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : null,
  }));

  const meals = [...mealItems, ...activityItems];
  if (!meals.length) return null;

  const foodCals = mealItems.reduce((sum, item) => sum + (Number(item.cal) || 0), 0);
  const activityCals = activityItems.reduce((sum, item) => sum + (Number(item.cal) || 0), 0);

  return {
    id: dateKey,
    date: formatThaiArchiveDate(dateKey),
    dateKey,
    weight: `${weight} kg`,
    meals,
    foodCals,
    activityCals,
    netCal: foodCals - activityCals,
  };
};

export const mergeArchiveEntry = (existing, incoming) => {
  if (!existing) return incoming;
  if (!incoming) return existing;

  const mergedMeals = [...(existing.meals || []), ...(incoming.meals || [])];
  const foodCals = mergedMeals
    .filter((item) => item.itemType !== "activity")
    .reduce((sum, item) => sum + (Number(item.cal) || 0), 0);
  const activityCals = mergedMeals
    .filter((item) => item.itemType === "activity")
    .reduce((sum, item) => sum + (Number(item.cal) || 0), 0);

  return {
    ...existing,
    meals: mergedMeals,
    foodCals,
    activityCals,
    netCal: foodCals - activityCals,
  };
};

export const upsertHistoryEntry = (history, entry) => {
  if (!entry) return history;
  const list = Array.isArray(history) ? [...history] : [];
  const index = list.findIndex((day) => day.dateKey === entry.dateKey || day.date === entry.date);

  if (index >= 0) {
    list[index] = mergeArchiveEntry(list[index], entry);
    return list;
  }

  return [entry, ...list];
};

const normalizeMealItem = (item, fallbackType = "—") => {
  if (!item || typeof item !== "object") return null;

  const name = String(item.name || item.foodName || item.title || "").trim();
  if (!name) return null;

  const cal = Number(item.cal ?? item.calories ?? item.kcal ?? 0);
  const itemType = item.itemType
    || (item.durationMinutes != null || item.intensityLabel ? "activity" : "food");
  const type = item.type || item.mealType || item.mealPeriod || item.meal || fallbackType;

  return {
    name,
    cal,
    type,
    itemType,
    durationMinutes: item.durationMinutes,
    intensityLabel: item.intensityLabel,
    loggedAt: item.loggedAt,
    loggedTime: item.loggedTime
      || (item.loggedAt
        ? new Date(item.loggedAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })
        : null),
  };
};

const flattenDailyMealsObject = (dailyMeals) =>
  Object.entries(dailyMeals || {}).flatMap(([mealType, list]) =>
    (Array.isArray(list) ? list : []).map((item) => normalizeMealItem(item, mealType)).filter(Boolean),
  );

export const normalizeHistoryDay = (day) => {
  if (!day) return null;

  const dateKey = day.dateKey
    || (day.date && !String(day.date).includes(" ")
      ? day.date
      : null);

  let meals = [];
  if (Array.isArray(day.meals)) {
    meals = day.meals.map((item) => normalizeMealItem(item)).filter(Boolean);
  } else if (Array.isArray(day.items)) {
    meals = day.items.map((item) => normalizeMealItem(item)).filter(Boolean);
  } else if (day.dailyMeals && typeof day.dailyMeals === "object") {
    meals = flattenDailyMealsObject(day.dailyMeals);
  }

  const foodCalsFromMeals = meals
    .filter((item) => item.itemType !== "activity")
    .reduce((sum, item) => sum + (Number(item.cal) || 0), 0);
  const activityCalsFromMeals = meals
    .filter((item) => item.itemType === "activity")
    .reduce((sum, item) => sum + (Number(item.cal) || 0), 0);

  const foodCals = Number(day.foodCals ?? day.totalCal ?? foodCalsFromMeals) || foodCalsFromMeals;
  const activityCals = Number(day.activityCals ?? activityCalsFromMeals) || activityCalsFromMeals;
  const netCal = Number.isFinite(Number(day.netCal))
    ? Number(day.netCal)
    : foodCals - activityCals;

  const stableKey = dateKey || String(day.date || day.id || "");

  return {
    ...day,
    id: stableKey || day.id,
    dateKey: dateKey || day.dateKey,
    meals,
    foodCals,
    activityCals,
    netCal,
    totalCal: foodCals,
    foodCount: meals.filter((item) => item.itemType !== "activity").length,
    activityCount: meals.filter((item) => item.itemType === "activity").length,
  };
};

export const normalizeHistoryList = (history) =>
  (Array.isArray(history) ? history : [])
    .map(normalizeHistoryDay)
    .filter(Boolean);

const SIMULATED_SAMPLE_FOODS = ["ข้าวกะเพราไก่", "ข้าวมันไก่", "ก๋วยเตี๋ยวต้มยำ"];

/** ตรวจว่าเป็นวันที่ระบบสร้างจำลอง (เคยใส่ให้ดูตัวอย่างกราฟ) */
export const isSimulatedHistoryDay = (day) => {
  if (!day) return false;
  if (day.simulated === true) return true;
  if (String(day.id || "").startsWith("sim-")) return true;

  const foods = (day.meals || [])
    .filter((item) => item?.itemType !== "activity")
    .map((item) => String(item?.name || "").trim());

  if (foods.length !== 3) return false;

  const isSampleSet = SIMULATED_SAMPLE_FOODS.every((name) => foods.includes(name));
  if (!isSampleSet) return false;

  const hasRealTimestamps = (day.meals || []).some((item) => item?.loggedAt);
  return !hasRealTimestamps;
};

/** ลบประวัติจำลองออก — เหลือเฉพาะวันที่บันทึกจริง */
export const stripSimulatedHistory = (history) =>
  (Array.isArray(history) ? history : []).filter((day) => !isSimulatedHistoryDay(day));

/** รวมบันทึกวันนี้จาก dailyMeals เข้ากราฟ/ประวัติทันที (ยังไม่รอ archive เที่ยงคืน) */
export const mergeTodayIntoHistory = ({ history, dailyMeals, activities, weight }) => {
  const todayKey = getTodayKey();
  const list = Array.isArray(history) ? [...history] : [];
  const withoutToday = list.filter(
    (day) => day.dateKey !== todayKey && day.date !== formatThaiArchiveDate(todayKey),
  );

  const todayEntry = buildArchiveEntry({
    dateKey: todayKey,
    weight,
    dailyMeals,
    activities,
  });

  if (!todayEntry) return normalizeHistoryList(withoutToday);
  return normalizeHistoryList(upsertHistoryEntry(withoutToday, todayEntry));
};

export const recoverStaleActivities = ({ history, activities, weight, todayKey }) => {
  const staleActivities = (activities || []).filter(
    (item) => !item.loggedDate || item.loggedDate !== todayKey,
  );

  if (!staleActivities.length) {
    return {
      history,
      activities,
      changed: false,
    };
  }

  const yesterdayKey = getYesterdayKey();
  const entry = buildArchiveEntry({
    dateKey: yesterdayKey,
    weight,
    dailyMeals: { "มื้อเช้า": [], "มื้อกลางวัน": [], "มื้อเย็น": [] },
    activities: staleActivities,
  });

  const updatedHistory = upsertHistoryEntry(history, entry);
  const remainingActivities = (activities || []).filter(
    (item) => item.loggedDate === todayKey,
  );

  return {
    history: updatedHistory,
    activities: remainingActivities,
    changed: true,
  };
};
