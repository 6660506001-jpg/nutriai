import React, { useEffect, useMemo, useState } from "react";
import { HiFire, HiCalendar, HiChevronDown } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Colors } from "../../constants/colors";
import { buildHistoryCombinedChart, HISTORY_CHART_PERIODS, parseHistoryDayDate } from "../../utils/historyChart";
import { buildDisplayHistoryList, buildHistoryView } from "../../utils/historyChartSimulation";
import { isSimulatedHistoryDay } from "../../utils/dailyArchive";
import { getMealShort, MEAL_ORDER } from "../../utils/logDisplay";
import { getChartThemeColors } from "../../utils/chartTheme";
import { FEATURE_TOOLTIPS } from "../../constants/featureTooltips";
import DashCollapsible from "../ui/DashCollapsible";
import InfoTip from "../ui/InfoTip";
import { styles } from "../../styles/appStyles";

const getDayMonthKey = (day) => {
  if (day?.dateKey && /^\d{4}-\d{2}-\d{2}$/.test(String(day.dateKey))) {
    return String(day.dateKey).slice(0, 7);
  }
  const parsed = parseHistoryDayDate(day);
  if (parsed && !Number.isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }
  return "unknown";
};

const formatMonthLabel = (monthKey) => {
  const [year, month] = String(monthKey).split("-").map(Number);
  if (!year || !month) return monthKey;
  return new Date(year, month - 1, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });
};

const groupHistoryByMonth = (history) => {
  const groups = new Map();
  (history || []).forEach((day) => {
    const key = getDayMonthKey(day);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(day);
  });

  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([monthKey, days]) => ({
      monthKey,
      label: formatMonthLabel(monthKey),
      days,
      dayCount: days.length,
    }));
};

export default function HistoryPage({ historyData, dailyMeals, activities, userWeight, userTdee }) {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedMonths, setExpandedMonths] = useState(() => new Set());
  const [chartRange, setChartRange] = useState("day");
  const [chartColors, setChartColors] = useState(getChartThemeColors);
  const [isCompactChart, setIsCompactChart] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
  );

  const { history: combinedHistory, loggedDayCount } = useMemo(
    () => buildHistoryView({
      history: historyData,
      dailyMeals,
      activities,
      weight: userWeight,
    }),
    [historyData, dailyMeals, activities, userWeight],
  );

  const historyForList = useMemo(
    () => buildDisplayHistoryList(combinedHistory),
    [combinedHistory],
  );

  useEffect(() => {
    const syncChartColors = () => setChartColors(getChartThemeColors());
    syncChartColors();
    const observer = new MutationObserver(syncChartColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style", "class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const syncCompact = () => {
      setIsCompactChart(media.matches);
      if (media.matches) setChartRange("week");
    };
    syncCompact();
    media.addEventListener("change", syncCompact);
    return () => media.removeEventListener("change", syncCompact);
  }, []);

  const mapHistoryDay = (day) => {
    const items = day.meals || [];
    const foodCals = items
      .filter((item) => item.itemType !== "activity")
      .reduce((sum, meal) => sum + (Number(meal.cal) || 0), 0);
    const activityCals = items
      .filter((item) => item.itemType === "activity")
      .reduce((sum, meal) => sum + (Number(meal.cal) || 0), 0);
    const totalCal = Number(day.foodCals) || foodCals;
    const burnCals = Number(day.activityCals) || activityCals;
    const netCal = Number.isFinite(day.netCal) ? day.netCal : totalCal - burnCals;
    const expandKey = day.dateKey || day.date || String(day.id || "");

    return {
      ...day,
      expandKey,
      totalCal,
      activityCals: burnCals,
      netCal,
      foodCount: items.filter((item) => item.itemType !== "activity").length,
      activityCount: items.filter((item) => item.itemType === "activity").length,
    };
  };

  const normalizedHistory = historyForList.map(mapHistoryDay);
  const normalizedRealHistory = normalizedHistory.filter((day) => !isSimulatedHistoryDay(day));
  const historyByMonth = useMemo(
    () => groupHistoryByMonth(normalizedRealHistory),
    [normalizedRealHistory],
  );

  useEffect(() => {
    if (!historyByMonth.length) return;
    setExpandedMonths((prev) => {
      if (prev.size > 0) return prev;
      return new Set([historyByMonth[0].monthKey]);
    });
  }, [historyByMonth]);

  const toggleMonth = (monthKey) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthKey)) next.delete(monthKey);
      else next.add(monthKey);
      return next;
    });
  };

  const getDayMealGroups = (day) => {
    const groups = MEAL_ORDER.map((mealType) => ({
      key: mealType,
      label: mealType,
      items: (day.meals || []).filter(
        (item) => item.itemType !== "activity" && item.type === mealType,
      ),
    })).filter((group) => group.items.length > 0);

    const activities = (day.meals || []).filter((item) => item.itemType === "activity");
    if (activities.length > 0) {
      groups.push({ key: "activity", label: "กิจกรรม", items: activities });
    }

    const uncategorized = (day.meals || []).filter(
      (item) => item.itemType !== "activity"
        && !MEAL_ORDER.includes(item.type),
    );
    if (uncategorized.length > 0) {
      groups.push({ key: "other", label: "อื่นๆ", items: uncategorized });
    }

    return groups;
  };

  const renderMealRow = (meal, idx) => (
    <div key={`${meal.name}-${meal.loggedTime}-${idx}`} style={styles.historyMealRow} className="history-meal-row-clear">
      <div className="history-meal-row-left">
        <span className="history-meal-time">{meal.loggedTime || "—"}</span>
        <span style={styles.historyMealType} className="history-meal-type-clear">
          {getMealShort(meal.type)}{meal.itemType === "activity" ? " 🏃" : ""}
        </span>
        <span className="history-meal-name">{meal.name}</span>
        {meal.itemType === "activity" && meal.durationMinutes ? (
          <span className="history-meal-meta">{meal.durationMinutes} น.</span>
        ) : null}
      </div>
      <div style={{ fontWeight: '800', color: meal.itemType === "activity" ? Colors.success : Colors.textDark }}>
        {meal.itemType === "activity" ? `−${meal.cal}` : meal.cal} kcal
      </div>
    </div>
  );

  const renderHistoryDay = (day) => {
    const isExpanded = expandedId === day.expandKey;
    const mealGroups = getDayMealGroups(day);

    return (
      <div
        key={day.expandKey}
        style={{ ...styles.historyBox, borderColor: isExpanded ? Colors.primary : Colors.border }}
      >
        <button
          type="button"
          onClick={() => setExpandedId(isExpanded ? null : day.expandKey)}
          className="history-header-responsive history-day-toggle"
          style={{
            ...styles.historyHeader,
            cursor: "pointer",
            background: isExpanded ? Colors.aiLight : "white",
            width: "100%",
            border: "none",
            textAlign: "left",
          }}
          aria-expanded={isExpanded}
        >
          <div style={{ fontWeight: "900", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <HiCalendar color={isExpanded ? Colors.primary : Colors.textGray} /> {day.date}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="history-day-net" style={{ fontSize: "14px", fontWeight: "800", color: Colors.primary }}>
              สุทธิ {day.netCal} kcal
            </span>
            <span style={{ fontSize: "13px", color: Colors.textGray }}>
              กิน {day.totalCal}{day.activityCals > 0 ? ` · เผา ${day.activityCals}` : ""}
            </span>
            <HiChevronDown style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }} />
          </div>
        </button>
        {isExpanded && (
          <div className="history-day-detail" style={{ padding: "10px 25px 20px 25px", borderTop: "1px solid #f0f0f0" }}>
            <div style={styles.historyDetailMetaRow}>
              <span style={styles.historyMetaPill}>
                {day.foodCount > 0 ? `${day.foodCount} อาหาร` : null}
                {day.foodCount > 0 && day.activityCount > 0 ? " · " : null}
                {day.activityCount > 0 ? `${day.activityCount} กิจกรรม` : null}
                {!day.foodCount && !day.activityCount && day.totalCal > 0
                  ? "มีแค่ยอดรวม (ไม่มีรายการเมนู)"
                  : null}
                {!day.foodCount && !day.activityCount && day.totalCal === 0
                  ? "ไม่มีรายการ"
                  : null}
              </span>
            </div>
            {mealGroups.length > 0 ? (
              mealGroups.map((group) => (
                <div key={group.key} className="history-meal-group">
                  <div className="history-meal-group-title">{group.label}</div>
                  {group.items.map((meal, idx) => renderMealRow(meal, idx))}
                </div>
              ))
            ) : day.totalCal > 0 ? (
              <p className="history-day-empty-detail">
                วันนี้มีแค่ยอดรวม {day.totalCal} kcal — รายละเอียดเมนูไม่ได้เก็บไว้ในเวอร์ชันเก่า
                บันทึกใหม่จากนี้จะเห็นรายการครบ
              </p>
            ) : (
              <p className="history-day-empty-detail">ไม่มีรายการในวันนี้</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const totalDays = loggedDayCount || normalizedRealHistory.length;
  const totalCalories = normalizedRealHistory.reduce((sum, day) => sum + day.totalCal, 0);
  const averageCalories = totalDays ? Math.round(totalCalories / totalDays) : 0;
  const bestDay = normalizedRealHistory.reduce((highest, day) => day.totalCal > highest.totalCal ? day : highest, { totalCal: 0, date: "-" });
  const bestActivityDay = normalizedRealHistory.reduce(
    (highest, day) => (day.activityCals > highest.activityCals ? day : highest),
    { activityCals: 0, date: "-" },
  );
  const totalActivityBurn = normalizedRealHistory.reduce((sum, day) => sum + day.activityCals, 0);
  const averageActivityBurn = totalDays ? Math.round(totalActivityBurn / totalDays) : 0;
  const hasActivityHistory = normalizedRealHistory.some((day) => day.activityCals > 0);

  const chartData = buildHistoryCombinedChart(normalizedRealHistory, chartRange);
  const foodPointsWithData = chartData.filter((item) => item.hasFoodData);
  const activityPointsWithData = chartData.filter((item) => item.hasActivityData);
  const chartAverage = foodPointsWithData.length
    ? Math.round(foodPointsWithData.reduce((sum, item) => sum + item.foodCalories, 0) / foodPointsWithData.length)
    : 0;
  const activityChartAverage = activityPointsWithData.length
    ? Math.round(activityPointsWithData.reduce((sum, item) => sum + item.activityCalories, 0) / activityPointsWithData.length)
    : 0;

  const chartRangeLabel = chartRange === "day" ? "รายวัน" : chartRange === "week" ? "รายสัปดาห์" : "รายเดือน";
  const chartAverageLabel = chartRange === "day" ? "เฉลี่ยสัปดาห์นี้" : "เฉลี่ยต่อช่วงที่มีข้อมูล";
  const chartPeriodText = HISTORY_CHART_PERIODS[chartRange];

  const formatAxisKcal = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "";
    if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
    return String(n);
  };

  const showChartDots = chartData.length <= 7;
  const chartDotProps = (color) => ({
    r: showChartDots ? 4 : 0,
    fill: color,
    stroke: "#fff",
    strokeWidth: 2,
  });
  const chartActiveDotProps = (color, lightColor) => ({
    r: 6,
    fill: lightColor || color,
    stroke: "#fff",
    strokeWidth: 2,
  });

  const renderCombinedTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    const hasAnyData = point.hasFoodData || point.hasActivityData;

    return (
      <div className="history-chart-tooltip">
        <p className="history-chart-tooltip-title">
          {label}{point.subLabel ? ` · ${point.subLabel}` : ""}
        </p>
        {!hasAnyData ? (
          <p className="history-chart-tooltip-empty">ไม่มีข้อมูลบันทึก</p>
        ) : (
          <>
            <div className="history-chart-tooltip-row history-chart-tooltip-row--food">
              <span className="history-chart-tooltip-dot" aria-hidden="true" />
              <span>แคลอรี่</span>
              <b>{point.foodCalories.toLocaleString()} kcal</b>
            </div>
            <div className="history-chart-tooltip-row history-chart-tooltip-row--activity">
              <span className="history-chart-tooltip-dot" aria-hidden="true" />
              <span>กิจกรรม</span>
              <b>{point.activityCalories.toLocaleString()} kcal</b>
            </div>
            {(point.foodCalories > 0 || point.activityCalories > 0) && (
              <p className="history-chart-tooltip-net">
                สุทธิ <b>{point.netCalories.toLocaleString()} kcal</b>
              </p>
            )}
            {chartRange !== "day" && (
              <p className="history-chart-tooltip-meta">
                เฉลี่ย กิน {point.foodAverage.toLocaleString()} · เผา {point.activityAverage.toLocaleString()} kcal/วัน ({point.days} วัน)
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  const renderChartLegend = (value) => (
    <span className="history-chart-legend-item">{value}</span>
  );

  const renderCombinedChart = () => (
    <div className="history-combined-chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 18,
            right: isCompactChart ? 0 : 4,
            left: 0,
            bottom: 4,
          }}
        >
          <defs>
            <linearGradient id="historyFoodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.32} />
              <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="historyActivityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.success} stopOpacity={0.26} />
              <stop offset="95%" stopColor={chartColors.success} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 6" vertical={false} stroke={chartColors.grid} strokeOpacity={0.65} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: isCompactChart ? 9 : (chartRange === "day" ? 10 : 11), fill: chartColors.textGray, fontWeight: 600 }}
            dy={8}
            interval={isCompactChart ? "preserveStartEnd" : 0}
            angle={isCompactChart && chartRange === "day" ? -35 : 0}
            textAnchor={isCompactChart && chartRange === "day" ? "end" : "middle"}
            height={isCompactChart && chartRange === "day" ? 50 : 30}
          />
          <YAxis
            yAxisId="food"
            orientation="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: isCompactChart ? 10 : 11, fill: chartColors.primary, fontWeight: 600 }}
            tickFormatter={formatAxisKcal}
            allowDecimals={false}
            width={isCompactChart ? 36 : 44}
          />
          <YAxis
            yAxisId="activity"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: isCompactChart ? 10 : 11, fill: chartColors.success, fontWeight: 600 }}
            tickFormatter={formatAxisKcal}
            allowDecimals={false}
            width={isCompactChart ? 32 : 44}
            hide={isCompactChart && chartRange !== "week"}
          />
          <Tooltip content={renderCombinedTooltip} cursor={{ stroke: chartColors.grid, strokeWidth: 1, strokeDasharray: "4 4" }} />
          <Legend
            verticalAlign="bottom"
            height={40}
            iconType="circle"
            iconSize={8}
            formatter={renderChartLegend}
          />
          <Area
            yAxisId="food"
            type="monotone"
            dataKey="foodCalories"
            name="แคลอรี่"
            stroke="none"
            fill="url(#historyFoodFill)"
            fillOpacity={1}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
          <Line
            yAxisId="food"
            type="monotone"
            dataKey="foodCalories"
            name="แคลอรี่"
            stroke={chartColors.primary}
            strokeWidth={2.5}
            dot={chartDotProps(chartColors.primary)}
            activeDot={chartActiveDotProps(chartColors.primary, chartColors.primaryLight)}
            hide={false}
            legendType="none"
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
          <Area
            yAxisId="activity"
            type="monotone"
            dataKey="activityCalories"
            name="กิจกรรม"
            stroke="none"
            fill="url(#historyActivityFill)"
            fillOpacity={1}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
          <Line
            yAxisId="activity"
            type="monotone"
            dataKey="activityCalories"
            name="กิจกรรม"
            stroke={chartColors.success}
            strokeWidth={2.5}
            dot={chartDotProps(chartColors.success)}
            activeDot={chartActiveDotProps(chartColors.success, chartColors.successLight)}
            legendType="none"
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={styles.pageLayout}>
      <div className="history-hero-card" style={styles.historyHeroCard}>
        <div className="history-hero-title" style={{...styles.cardTitle, color: 'white'}}>
          <MdHistory size={30} color="white"/> สรุปย้อนหลัง
          <InfoTip tooltip={FEATURE_TOOLTIPS.history} label="ประวัติสุขภาพ" idPrefix="history-hero" size={16} className="history-hero-info-tip" />
        </div>
        <div className="history-kpi-grid-responsive" style={styles.historyKpiGrid}>
          <div className="history-kpi-box" style={styles.historyKpiBox}>
            <small>วันที่บันทึกทั้งหมด</small>
            <div>{totalDays} วัน</div>
          </div>
          <div className="history-kpi-box" style={styles.historyKpiBox}>
            <small>แคลอรี่เฉลี่ยต่อวัน</small>
            <div>{averageCalories} kcal</div>
          </div>
          <div className="history-kpi-box" style={styles.historyKpiBox}>
            <small>เผาเฉลี่ยต่อวัน</small>
            <div>{averageActivityBurn} kcal</div>
          </div>
        </div>
        <div className="history-hero-subtext history-hero-subtext--compact" style={styles.historyHeroSubtext}>
          {totalDays > 0 ? (
            <>
              กินสูงสุด <b>{bestDay.totalCal} kcal</b>
              {hasActivityHistory && <> · เผาสูงสุด <b>{bestActivityDay.activityCals} kcal</b></>}
            </>
          ) : (
            <>ยังไม่มีประวัติ — บันทึกอาหาร/กิจกรรมแล้วข้อมูลจะเก็บแยกตามบัญชีของคุณ</>
          )}
        </div>
      </div>

      <DashCollapsible
        className="dash-collapse-history-chart"
        title="กราฟกิน vs เผา"
        preview={`${chartRangeLabel} · กิน ${chartAverage} · เผา ${activityChartAverage} kcal`}
        defaultOpen={false}
      >
      <div style={{...styles.card, marginTop: 0}} className="hover-lift-card responsive-card history-combined-chart-card">
        <div style={{...styles.cardTitle, marginBottom: '16px'}}>
          <HiFire color={Colors.primary}/> สรุปแคลอรี่และกิจกรรม{chartRangeLabel}
          <InfoTip tooltip={FEATURE_TOOLTIPS.history} label="กราปประวัติ" idPrefix="history-chart" size={15} />
        </div>
        <div style={styles.historyChartToggle}>
          <button
            type="button"
            onClick={() => setChartRange("day")}
            style={chartRange === "day" ? styles.historyChartBtnActive : styles.historyChartBtn}
          >
            7 วัน
          </button>
          <button
            type="button"
            onClick={() => setChartRange("week")}
            style={chartRange === "week" ? styles.historyChartBtnActive : styles.historyChartBtn}
          >
            8 สัปดาห์
          </button>
          <button
            type="button"
            onClick={() => setChartRange("month")}
            style={chartRange === "month" ? styles.historyChartBtnActive : styles.historyChartBtn}
          >
            6 เดือน
          </button>
        </div>
        {chartData.length === 0 ? (
          <p style={{ textAlign: 'center', color: Colors.textGray, margin: '30px 0' }}>ยังไม่มีข้อมูลสำหรับสร้างกราฟ</p>
        ) : (
          <>
            <div style={styles.historyChartMeta}>
              <span>
                ช่วงที่แสดง: <b>{chartPeriodText}</b>
              </span>
              <span>
                {chartAverageLabel}: กิน <b>{chartAverage}</b> · เผา <b>{activityChartAverage}</b> kcal
              </span>
            </div>
            {renderCombinedChart()}
          </>
        )}
      </div>
      </DashCollapsible>

      <DashCollapsible
        className="dash-collapse-history-days"
        title="รายการรายวัน"
        preview={`${normalizedRealHistory.length} วัน · เฉลี่ย ${averageCalories} kcal`}
        defaultOpen={true}
      >
      <div style={{...styles.card, marginTop: 0}} className="hover-lift-card responsive-card">
        <div style={{...styles.cardTitle, marginBottom: '8px'}}><MdHistory color={Colors.primary}/> ประวัติการบันทึก</div>
        <p className="history-day-list-hint">กดหัวข้อเดือนเพื่อย่อ/ขยาย · กดแต่ละวันเพื่อดูรายการเมนู</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {normalizedRealHistory.length === 0 ? (
            <p style={{ textAlign: 'center', color: Colors.textGray }}>ยังไม่มีประวัติการบันทึก</p>
          ) : (
            historyByMonth.map((month) => {
              const isMonthOpen = expandedMonths.has(month.monthKey);
              const monthAvgCal = month.dayCount
                ? Math.round(month.days.reduce((sum, day) => sum + day.totalCal, 0) / month.dayCount)
                : 0;

              return (
                <section
                  key={month.monthKey}
                  className={`history-month-group${isMonthOpen ? " is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="history-month-header"
                    onClick={() => toggleMonth(month.monthKey)}
                    aria-expanded={isMonthOpen}
                  >
                    <span className="history-month-head">
                      <span className="history-month-title">{month.label}</span>
                      {!isMonthOpen && (
                        <span className="history-month-preview">
                          เฉลี่ย {monthAvgCal} kcal/วัน
                        </span>
                      )}
                    </span>
                    <span className="history-month-meta">{month.dayCount} วัน</span>
                    <HiChevronDown className="history-month-chevron" aria-hidden />
                  </button>
                  {isMonthOpen && (
                    <div className="history-month-days">
                      {month.days.map((day) => renderHistoryDay(day))}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      </div>
      </DashCollapsible>
    </div>
  );
}
