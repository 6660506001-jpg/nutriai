import { buildArchiveEntry } from "./dailyArchive";
import { buildWeightChartData } from "./chartTheme";

/** ประมาณการไขมัน ~7,700 kcal ต่อ 1 kg */
export const KCAL_PER_KG_FAT = 7700;

const roundWeight = (value) => Math.round(value * 10) / 10;

const formatDayLabel = (date) =>
  date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });

const toDateKey = (date) => date.toLocaleDateString("en-CA");

/** ค่า sway น้ำหนัก ±kg ต่อวัน — กำหนดจากวันที่ให้คงที่ทุกครั้งที่เปิด */
const DEFAULT_DAILY_SWAY = [0.35, 0.15, 0.4, 0.05, 0.25, 0.1, 0];

export function getLast7DayKeys() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));
    return {
      dateKey: toDateKey(day),
      dateLabel: formatDayLabel(day),
      isToday: index === 6,
    };
  });
}

function parseHistoryWeight(entry) {
  if (!entry?.weight) return null;
  const weight = parseFloat(String(entry.weight).replace(/[^\d.]/g, ""));
  return Number.isFinite(weight) ? weight : null;
}

function getDayCalorieLog({
  dateKey,
  isToday,
  historyData,
  dailyMeals,
  activities,
  weight,
}) {
  const historyEntry = (historyData || []).find((day) => day.dateKey === dateKey);

  if (isToday) {
    const liveEntry = buildArchiveEntry({
      dateKey,
      weight,
      dailyMeals,
      activities,
    });
    if (liveEntry) {
      return {
        netCal: liveEntry.netCal,
        hasLog: true,
        recordedWeight: parseHistoryWeight(historyEntry) ?? weight,
      };
    }
  }

  if (historyEntry && (historyEntry.meals?.length || historyEntry.netCal != null)) {
    return {
      netCal: Number(historyEntry.netCal) || 0,
      hasLog: true,
      recordedWeight: parseHistoryWeight(historyEntry),
    };
  }

  return {
    hasLog: false,
    recordedWeight: parseHistoryWeight(historyEntry),
  };
}

function getDailyFluctuation(dateKey, dayIndex) {
  let hash = dayIndex + 1;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = ((hash << 5) - hash) + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (Math.abs(hash) % 1000) / 1000;
  return (normalized - 0.5) * 0.5;
}

function isFlatWeightSeries(data) {
  const weights = data
    .map((point) => point.weight)
    .filter((weight) => weight != null && Number.isFinite(weight));

  if (weights.length < 2) return true;
  return Math.max(...weights) - Math.min(...weights) < 0.15;
}

function backCalculateFromCalories(dayLogs, safeWeight, safeTdee) {
  const weights = new Array(dayLogs.length);
  weights[dayLogs.length - 1] = safeWeight;

  for (let index = dayLogs.length - 2; index >= 0; index -= 1) {
    const nextDay = dayLogs[index + 1];
    if (nextDay.hasLog) {
      const deltaKg = (safeTdee - nextDay.netCal) / KCAL_PER_KG_FAT;
      weights[index] = weights[index + 1] + deltaKg;
    } else {
      weights[index] = weights[index + 1];
    }
  }

  return weights;
}

function fillMissingDays(weights, dayLogs) {
  const filled = [...weights];

  for (let index = 0; index < filled.length; index += 1) {
    if (Number.isFinite(filled[index])) continue;

    let prev = null;
    let next = null;
    for (let left = index - 1; left >= 0; left -= 1) {
      if (Number.isFinite(filled[left])) {
        prev = { index: left, value: filled[left] };
        break;
      }
    }
    for (let right = index + 1; right < filled.length; right += 1) {
      if (Number.isFinite(filled[right])) {
        next = { index: right, value: filled[right] };
        break;
      }
    }

    if (prev && next) {
      const ratio = (index - prev.index) / (next.index - prev.index);
      filled[index] = prev.value + (next.value - prev.value) * ratio;
    } else if (prev) {
      filled[index] = prev.value;
    } else if (next) {
      filled[index] = next.value;
    } else {
      filled[index] = weights[weights.length - 1] ?? 0;
    }
  }

  return filled;
}

function applyNaturalVariation(weights, dayLogs, safeWeight) {
  const varied = weights.map((weight, index) => {
    const sway = DEFAULT_DAILY_SWAY[index] ?? 0;
    const noise = getDailyFluctuation(dayLogs[index].dateKey, index) * 0.25;
    return weight + sway + noise;
  });

  const offset = safeWeight - varied[varied.length - 1];
  return varied.map((weight) => roundWeight(weight + offset));
}

function buildInsight({ loggedDayCount, startWeight, endWeight, avgDeficit, isSimulated }) {
  const change = roundWeight(endWeight - startWeight);
  const prefix = isSimulated ? `จำลอง ${loggedDayCount > 0 ? `จากแคล ${loggedDayCount} วัน` : "แนวโน้มโดยประมาณ"}` : "7 วันล่าสุด";

  if (Math.abs(change) < 0.05) {
    return `${prefix}: น้ำหนักใกล้เคียง ~${endWeight} kg มีการขึ้น-ลงเล็กน้อยตามน้ำในร่างกาย`;
  }
  if (change < 0) {
    return `${prefix}: ลด ~${Math.abs(change)} kg (${startWeight} → ${endWeight} kg)${loggedDayCount > 0 ? ` — ขาดแคลเฉลี่ย ~${Math.round(Math.max(0, avgDeficit))} kcal/วัน` : ""}`;
  }
  return `${prefix}: เพิ่ม ~${change} kg (${startWeight} → ${endWeight} kg)${loggedDayCount > 0 ? ` — เกินแคลเฉลี่ย ~${Math.round(Math.max(0, -avgDeficit))} kcal/วัน` : ""}`;
}

export function simulateWeightTrendFromCalories({
  historyData,
  currentWeight,
  tdee,
  dailyMeals,
  activities,
}) {
  const safeWeight = Number(currentWeight);
  const safeTdee = Number(tdee);

  if (!Number.isFinite(safeWeight) || safeWeight <= 0) {
    return { data: [], hasEnoughCalorieLogs: false, insight: null };
  }

  const dayLogs = getLast7DayKeys().map((day) => ({
    ...day,
    ...getDayCalorieLog({
      dateKey: day.dateKey,
      isToday: day.isToday,
      historyData,
      dailyMeals,
      activities,
      weight: safeWeight,
    }),
  }));

  const loggedDays = dayLogs.filter((day) => day.hasLog);
  const hasCalorieLogs = loggedDays.length > 0 && Number.isFinite(safeTdee) && safeTdee > 0;

  let baseWeights;
  if (hasCalorieLogs) {
    baseWeights = backCalculateFromCalories(dayLogs, safeWeight, safeTdee);
  } else {
    baseWeights = dayLogs.map(() => safeWeight);
  }

  const filled = fillMissingDays(baseWeights, dayLogs);
  const varied = applyNaturalVariation(filled, dayLogs, safeWeight);

  const startWeight = varied[0];
  const endWeight = varied[varied.length - 1];
  const avgDeficit = hasCalorieLogs
    ? loggedDays.reduce((sum, day) => sum + (safeTdee - day.netCal), 0) / loggedDays.length
    : 0;

  const data = dayLogs.map((day, index) => ({
    date: day.dateLabel,
    weight: varied[index],
    simulated: true,
    netCal: day.hasLog ? day.netCal : null,
  }));

  return {
    data,
    hasEnoughCalorieLogs: true,
    loggedDayCount: loggedDays.length,
    insight: buildInsight({
      loggedDayCount: loggedDays.length,
      startWeight,
      endWeight,
      avgDeficit,
      isSimulated: true,
    }),
    totalChange: roundWeight(endWeight - startWeight),
    isSimulated: true,
  };
}

export function buildWeightTrendView({
  historyData,
  currentWeight,
  tdee,
  dailyMeals,
  activities,
}) {
  const actual = buildWeightChartData(historyData, currentWeight);
  const actualData = actual.data.map((point) => ({ ...point, simulated: false }));

  if (!actual.isFallback && !isFlatWeightSeries(actualData)) {
    const start = actualData[0]?.weight;
    const end = actualData[actualData.length - 1]?.weight;
    const change = start != null && end != null ? roundWeight(end - start) : 0;

    let insight = "รักษาวินัยนี้ไว้ได้ดีมากค่ะ!";
    if (Math.abs(change) >= 0.1) {
      insight = change < 0
        ? `7 วันล่าสุดลด ~${Math.abs(change)} kg — แนวโน้มดีมาก`
        : `7 วันล่าสุดเพิ่ม ~${change} kg — ลองดูแคลและกิจกรรมเพิ่ม`;
    }

    return {
      data: actualData,
      isFallback: false,
      isSimulated: false,
      insight,
    };
  }

  const simulated = simulateWeightTrendFromCalories({
    historyData,
    currentWeight,
    tdee,
    dailyMeals,
    activities,
  });

  return {
    data: simulated.data,
    isFallback: false,
    isSimulated: true,
    insight: simulated.insight,
    loggedDayCount: simulated.loggedDayCount,
  };
}
