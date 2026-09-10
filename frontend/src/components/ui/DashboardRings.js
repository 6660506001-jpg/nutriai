import React, { useMemo } from "react";
import { HiFire } from "react-icons/hi";
import { MdDirectionsRun } from "react-icons/md";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

function pointOnCircle(cx, cy, r, progress) {
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function ActivityRing({
  cx,
  cy,
  r,
  progress,
  color,
  trackColor,
  strokeWidth,
  icon: Icon,
  label,
  value,
  goal,
  unit = "kcal",
}) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - clamped);
  const tip = pointOnCircle(cx, cy, r, clamped || 0.001);
  const pct = Math.round(clamped * 100);
  const isComplete = clamped >= 0.999;

  return (
    <g className="dash-ring-group" aria-hidden>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="3 7"
      />
      {clamped > 0 ? (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={isComplete ? undefined : circumference}
          strokeDashoffset={isComplete ? undefined : dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="dash-ring-progress"
        />
      ) : null}
      {clamped > 0.03 && (
        <g transform={`translate(${tip.x} ${tip.y})`}>
          <circle r={strokeWidth * 0.68} fill={color} className="dash-ring-tip-badge" />
          <foreignObject x={-9} y={-9} width={18} height={18}>
            <div xmlns="http://www.w3.org/1999/xhtml" className="dash-ring-tip-icon" aria-hidden>
              <Icon size={10} color="#fff" />
            </div>
          </foreignObject>
        </g>
      )}
      <title>{`${label}: ${value.toLocaleString("th-TH")} / ${goal.toLocaleString("th-TH")} ${unit} (${pct}%)`}</title>
    </g>
  );
}

export default function DashboardRings({
  foodCals = 0,
  activityCals = 0,
  tdee = 0,
  protein = 0,
  carbs = 0,
  fat = 0,
  targetProtein = 0,
  targetCarbs = 0,
  targetFat = 0,
  className = "",
}) {
  const foodGoal = Math.max(Number(tdee) || 0, 1);
  const activityGoal = Math.max(250, Math.round(foodGoal * 0.2));
  const foodProgress = foodCals / foodGoal;
  const activityProgress = activityCals / activityGoal;
  const netCals = foodCals - activityCals;
  const foodOver = Math.max(0, foodCals - foodGoal);
  const netRemaining = foodGoal - netCals;

  const summary = useMemo(() => {
    if (foodCals === 0 && activityCals === 0) {
      return {
        label: "พลังงานคงเหลือ",
        value: Math.round(foodGoal).toLocaleString("th-TH"),
        detail: "เริ่มบันทึกวันนี้",
        tone: "neutral",
      };
    }

    if (netRemaining > 0) {
      return {
        label: "กินได้อีก",
        value: Math.round(netRemaining).toLocaleString("th-TH"),
        detail: activityCals > 0
          ? `สุทธิ ${netCals.toLocaleString("th-TH")} kcal (หักเผาแล้ว)`
          : null,
        tone: "ok",
      };
    }

    if (netRemaining === 0) {
      return {
        label: "ถึงเป้าแล้ว",
        value: "0",
        detail: activityCals > 0 ? `สุทธิ ${netCals.toLocaleString("th-TH")} kcal` : null,
        tone: "ok",
      };
    }

    return {
      label: "เกินเป้า",
      value: Math.abs(Math.round(netRemaining)).toLocaleString("th-TH"),
      detail: activityCals > 0
        ? `กิน ${foodCals.toLocaleString("th-TH")} · เผา ${activityCals.toLocaleString("th-TH")}`
        : `กิน ${foodCals.toLocaleString("th-TH")} / ${foodGoal.toLocaleString("th-TH")}`,
      tone: "over",
    };
  }, [foodCals, activityCals, foodGoal, netCals, netRemaining]);

  const cx = 110;
  const cy = 110;

  return (
    <div
      className={`dash-rings-wrap ${className}`.trim()}
      role="img"
      aria-label={`กิน ${foodCals} kcal · เผา ${activityCals} kcal · สุทธิ ${netCals} kcal · ${summary.label} ${summary.value} kcal${summary.detail ? ` · ${summary.detail}` : ""}`}
    >
      <div
        className="dash-rings-donut"
        style={{
          position: "relative",
          width: 220,
          height: 220,
          margin: "8px auto 0",
          flex: "0 0 220px",
        }}
      >
        <svg
          className="dash-rings-svg"
          width="220"
          height="220"
          viewBox="0 0 220 220"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          style={{ width: 220, height: 220, display: "block" }}
        >
          <ActivityRing
            cx={cx}
            cy={cy}
            r={92}
            progress={foodProgress}
            color="#2563eb"
            trackColor="rgba(37, 99, 235, 0.14)"
            strokeWidth={14}
            icon={HiFire}
            label="กินแล้ว"
            value={foodCals}
            goal={foodGoal}
          />
          <ActivityRing
            cx={cx}
            cy={cy}
            r={72}
            progress={activityProgress}
            color="#059669"
            trackColor="rgba(5, 150, 105, 0.14)"
            strokeWidth={14}
            icon={MdDirectionsRun}
            label="กิจกรรม"
            value={activityCals}
            goal={activityGoal}
          />
        </svg>
        <div className={`dash-rings-center dash-rings-center--${summary.tone}`}>
          <span className="dash-rings-center-label">{summary.label}</span>
          <strong className="dash-rings-center-value">{summary.value}</strong>
          <span className="dash-rings-center-unit">kcal</span>
        </div>
      </div>

      {summary.detail ? (
        <p className="dash-rings-caption">{summary.detail}</p>
      ) : null}

      <div className="dash-rings-legend">
        <div className="dash-rings-legend-item dash-rings-legend-item--food">
          <span className="dash-rings-legend-dot" aria-hidden />
          <div>
            <span className="dash-rings-legend-label">กินแล้ว</span>
            <strong className={foodOver > 0 ? "dash-rings-value--over" : ""}>
              {foodCals.toLocaleString("th-TH")}
            </strong>
            <small>
              {foodOver > 0
                ? ` / ${foodGoal.toLocaleString("th-TH")} (เกิน ${foodOver.toLocaleString("th-TH")})`
                : ` / ${foodGoal.toLocaleString("th-TH")} kcal`}
            </small>
          </div>
        </div>
        <div className="dash-rings-legend-item dash-rings-legend-item--activity">
          <span className="dash-rings-legend-dot" aria-hidden />
          <div>
            <span className="dash-rings-legend-label">กิจกรรม</span>
            <strong>{activityCals.toLocaleString("th-TH")}</strong>
            <small> / {activityGoal.toLocaleString("th-TH")} kcal</small>
          </div>
        </div>
      </div>

      <DashboardMacroStrip
        protein={protein}
        carbs={carbs}
        fat={fat}
        targetProtein={targetProtein}
        targetCarbs={targetCarbs}
        targetFat={targetFat}
      />
    </div>
  );
}
