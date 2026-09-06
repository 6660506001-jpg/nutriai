import { mergeTodayIntoHistory, normalizeHistoryList, stripSimulatedHistory } from "./dailyArchive";

const sortHistoryByDateDesc = (history) =>
  [...(history || [])].sort((a, b) => {
    const keyA = a?.dateKey && /^\d{4}-\d{2}-\d{2}$/.test(String(a.dateKey)) ? a.dateKey : "";
    const keyB = b?.dateKey && /^\d{4}-\d{2}-\d{2}$/.test(String(b.dateKey)) ? b.dateKey : "";
    if (keyA && keyB) return keyB.localeCompare(keyA);
    return String(b?.date || "").localeCompare(String(a?.date || ""), "th");
  });

export const buildDisplayHistoryList = (history) => sortHistoryByDateDesc(history);

const countLoggedDays = (history) =>
  (history || []).filter((day) => (Number(day.foodCals ?? day.totalCal) || 0) > 0).length;

/** รวมประวัติจริงของผู้ใช้เท่านั้น — ไม่ใส่ข้อมูลจำลอง */
export const buildHistoryView = ({
  history,
  dailyMeals,
  activities,
  weight,
}) => {
  const mergedToday = mergeTodayIntoHistory({
    history: stripSimulatedHistory(history),
    dailyMeals,
    activities,
    weight,
  });

  const combined = sortHistoryByDateDesc(normalizeHistoryList(mergedToday));
  const loggedDayCount = countLoggedDays(combined);

  return {
    history: combined,
    isSimulated: false,
    loggedDayCount,
    simulatedDayCount: 0,
  };
};

/** @deprecated use buildHistoryView */
export const buildHistoryChartView = buildHistoryView;
