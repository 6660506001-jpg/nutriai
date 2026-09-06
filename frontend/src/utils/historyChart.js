const THAI_MONTH_MAP = {
  มกราคม: 0, กุมภาพันธ์: 1, มีนาคม: 2, เมษายน: 3, พฤษภาคม: 4, มิถุนายน: 5,
  กรกฎาคม: 6, สิงหาคม: 7, กันยายน: 8, ตุลาคม: 9, พฤศจิกายน: 10, ธันวาคม: 11
};

const DAILY_CHART_DAYS = 7;
const WEEKLY_CHART_WEEKS = 8;
const MONTHLY_CHART_MONTHS = 6;

const THAI_WEEKDAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];

export const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const parseThaiHistoryDate = (dateStr) => {
  const parts = String(dateStr || "").trim().split(/\s+/);
  if (parts.length < 3) return null;
  const day = Number(parts[0]);
  const month = THAI_MONTH_MAP[parts[1]];
  const year = Number(parts[2]) - 543;
  if (!day || month === undefined || !year) return null;
  return new Date(year, month, day);
};

/** Prefer ISO dateKey; fall back to Thai date string. */
export const parseHistoryDayDate = (day) => {
  const key = day?.dateKey;
  if (key && /^\d{4}-\d{2}-\d{2}$/.test(String(key))) {
    const [y, m, d] = String(key).split("-").map(Number);
    const parsed = new Date(y, m - 1, d);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return parseThaiHistoryDate(day?.date);
};

export const startOfWeekSunday = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

export const startOfWeekMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMetricValue = (day, metric) => {
  if (metric === "activity") return Number(day.activityCals) || 0;
  if (metric === "net") {
    const food = Number(day.totalCal) || Number(day.foodCals) || 0;
    const burn = Number(day.activityCals) || 0;
    return Number.isFinite(day.netCal) ? Number(day.netCal) : food - burn;
  }
  return Number(day.totalCal) || Number(day.foodCals) || 0;
};

const buildDailyMetricChart = (rows, metric) => {
  const valueByKey = {};
  rows.forEach((day) => {
    valueByKey[toDateKey(day.parsedDate)] = getMetricValue(day, metric);
  });

  const weekStart = startOfWeekSunday(new Date());
  const points = [];

  for (let i = 0; i < DAILY_CHART_DAYS; i += 1) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const key = toDateKey(d);
    const value = valueByKey[key] ?? 0;
    const hasData = metric === "activity"
      ? value > 0
      : valueByKey[key] !== undefined && value > 0;

    points.push({
      key,
      label: THAI_WEEKDAYS[i],
      subLabel: d.toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
      calories: value,
      average: value,
      days: 1,
      hasData,
    });
  }
  return points;
};

const buildWeeklyMetricChart = (rows, metric) => {
  const bucketData = {};
  rows.forEach((day) => {
    const weekStart = startOfWeekMonday(day.parsedDate);
    const key = toDateKey(weekStart);
    if (!bucketData[key]) bucketData[key] = { total: 0, recordedDays: 0 };
    bucketData[key].total += getMetricValue(day, metric);
    bucketData[key].recordedDays += 1;
  });

  const currentWeekStart = startOfWeekMonday(new Date());
  const points = [];

  for (let i = WEEKLY_CHART_WEEKS - 1; i >= 0; i -= 1) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - i * 7);
    const key = toDateKey(weekStart);
    const bucket = bucketData[key];
    const value = bucket?.total ?? 0;
    const recordedDays = bucket?.recordedDays ?? 0;
    const hasData = metric === "activity" ? value > 0 : recordedDays > 0;

    points.push({
      key,
      label: weekStart.toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
      subLabel: `สัปดาห์ ${weekStart.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}`,
      calories: value,
      average: recordedDays ? Math.round(value / recordedDays) : 0,
      days: recordedDays,
      hasData,
    });
  }

  return points;
};

const getMonthBucketKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const buildMonthlyMetricChart = (rows, metric) => {
  const bucketData = {};
  rows.forEach((day) => {
    const key = getMonthBucketKey(day.parsedDate);
    if (!bucketData[key]) bucketData[key] = { total: 0, recordedDays: 0 };
    bucketData[key].total += getMetricValue(day, metric);
    bucketData[key].recordedDays += 1;
  });

  const now = new Date();
  const points = [];

  for (let i = MONTHLY_CHART_MONTHS - 1; i >= 0; i -= 1) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthBucketKey(monthStart);
    const bucket = bucketData[key];
    const value = bucket?.total ?? 0;
    const recordedDays = bucket?.recordedDays ?? 0;
    const hasData = metric === "activity" ? value > 0 : recordedDays > 0;

    points.push({
      key,
      label: monthStart.toLocaleDateString("th-TH", { month: "short", year: "2-digit" }),
      subLabel: monthStart.toLocaleDateString("th-TH", { month: "long", year: "numeric" }),
      calories: value,
      average: recordedDays ? Math.round(value / recordedDays) : 0,
      days: recordedDays,
      hasData,
    });
  }

  return points;
};

export const buildHistoryMetricChart = (history, range, metric = "food") => {
  const rows = history
    .map((day) => ({ ...day, parsedDate: parseHistoryDayDate(day) }))
    .filter((day) => day.parsedDate && !Number.isNaN(day.parsedDate.getTime()))
    .sort((a, b) => a.parsedDate - b.parsedDate);

  if (range === "day") {
    return buildDailyMetricChart(rows, metric);
  }

  if (range === "week") {
    return buildWeeklyMetricChart(rows, metric);
  }

  return buildMonthlyMetricChart(rows, metric);
};

export const HISTORY_CHART_PERIODS = {
  day: "อาทิตย์ – เสาร์",
  week: `${WEEKLY_CHART_WEEKS} สัปดาห์ล่าสุด`,
  month: `${MONTHLY_CHART_MONTHS} เดือนล่าสุด`,
};


export const buildHistoryCalorieChart = (history, range) =>
  buildHistoryMetricChart(history, range, "food");

export const buildHistoryActivityChart = (history, range) =>
  buildHistoryMetricChart(history, range, "activity");

const getCombinedPointKey = (point) => point.key || point.label;

export const buildHistoryCombinedChart = (history, range) => {
  const foodData = buildHistoryMetricChart(history, range, "food");
  const activityData = buildHistoryMetricChart(history, range, "activity");
  const merged = new Map();

  foodData.forEach((point) => {
    const key = getCombinedPointKey(point);
    merged.set(key, {
      key,
      label: point.label,
      subLabel: point.subLabel,
      days: point.days,
      foodCalories: point.calories,
      foodAverage: point.average,
      hasFoodData: point.hasData,
      activityCalories: 0,
      activityAverage: 0,
      hasActivityData: false,
    });
  });

  activityData.forEach((point) => {
    const key = getCombinedPointKey(point);
    const existing = merged.get(key) || {
      key,
      label: point.label,
      subLabel: point.subLabel,
      days: point.days,
      foodCalories: 0,
      foodAverage: 0,
      hasFoodData: false,
    };
    merged.set(key, {
      ...existing,
      activityCalories: point.calories,
      activityAverage: point.average,
      hasActivityData: point.hasData,
    });
  });

  return Array.from(merged.values()).sort((a, b) => a.key.localeCompare(b.key)).map((point) => ({
    ...point,
    hasData: point.hasFoodData || point.hasActivityData,
    netCalories: point.foodCalories - point.activityCalories,
  }));
};
