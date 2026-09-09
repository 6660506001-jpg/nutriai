import React, { useMemo } from "react";
import { HiFire } from "react-icons/hi";
import { MdDirectionsRun } from "react-icons/md";
import DashboardMacroStrip from "./DashboardMacroStrip";

function pointOnEllipse(cx, cy, rx, ry, progress) {
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
}

/** Sample points along the ellipse so progress hugs the same path as the track ring. */
function describeEllipseProgress(cx, cy, rx, ry, progress) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  if (clamped <= 0) return null;

  const startAngle = -Math.PI / 2;
  const sweep = clamped * 2 * Math.PI;
  const steps = Math.max(24, Math.ceil(100 * clamped));
  const coords = [];

  for (let i = 0; i <= steps; i += 1) {
    const angle = startAngle + (i / steps) * sweep;
    coords.push({
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
    });
  }

  return coords
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
}

function ActivityRing({
  cx,
  cy,
  rx,
  ry,
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
  const arcPath = describeEllipseProgress(cx, cy, rx, ry, clamped);
  const tip = pointOnEllipse(cx, cy, rx, ry, clamped || 0.001);
  const pct = Math.round(clamped * 100);
  const isComplete = clamped >= 0.999;

  return (
    <g className="dash-ring-group" aria-hidden>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="3 7"
      />
      {isComplete ? (
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="dash-ring-progress"
        />
      ) : arcPath ? (
        <path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
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
      return { main: "เริ่มบันทึกวันนี้", detail: null, tone: "neutral" };
    }

    if (netRemaining > 0) {
      const main = `กินได้อีก ~${Math.round(netRemaining).toLocaleString("th-TH")} kcal`;
      let detail = null;
      if (foodOver > 0 && activityCals > 0) {
        detail = `กินเกินเป้า ${foodOver.toLocaleString("th-TH")} · เผา ${activityCals.toLocaleString("th-TH")} · สุทธิ ${netCals.toLocaleString("th-TH")}`;
      } else if (activityCals > 0) {
        detail = `สุทธิ ${netCals.toLocaleString("th-TH")} kcal (หักเผาแล้ว)`;
      }
      return { main, detail, tone: "ok" };
    }

    if (netRemaining === 0) {
      return {
        main: "ถึงเป้าสุทธิแล้ว",
        detail: activityCals > 0 ? `สุทธิ ${netCals.toLocaleString("th-TH")} kcal` : null,
        tone: "ok",
      };
    }

    return {
      main: `เกินเป้าสุทธิ ~${Math.abs(Math.round(netRemaining)).toLocaleString("th-TH")} kcal`,
      detail: activityCals > 0
        ? `กิน ${foodCals.toLocaleString("th-TH")} · เผา ${activityCals.toLocaleString("th-TH")} · สุทธิ ${netCals.toLocaleString("th-TH")}`
        : `กิน ${foodCals.toLocaleString("th-TH")} / เป้า ${foodGoal.toLocaleString("th-TH")}`,
      tone: "over",
    };
  }, [foodCals, activityCals, foodGoal, foodOver, netCals, netRemaining]);

  const cx = 168;
  const cy = 52;

  return (
    <div
      className={`dash-rings-wrap ${className}`.trim()}
      role="img"
      aria-label={`กิน ${foodCals} kcal · เผา ${activityCals} kcal · สุทธิ ${netCals} kcal · ${summary.main}${summary.detail ? ` · ${summary.detail}` : ""}`}
    >
      <svg
        className="dash-rings-svg"
        viewBox="0 0 336 104"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <ActivityRing
          cx={cx}
          cy={cy}
          rx={148}
          ry={44}
          progress={foodProgress}
          color="#2563eb"
          trackColor="rgba(37, 99, 235, 0.14)"
          strokeWidth={11}
          icon={HiFire}
          label="กินแล้ว"
          value={foodCals}
          goal={foodGoal}
        />
        <ActivityRing
          cx={cx}
          cy={cy}
          rx={122}
          ry={34}
          progress={activityProgress}
          color="#059669"
          trackColor="rgba(5, 150, 105, 0.14)"
          strokeWidth={11}
          icon={MdDirectionsRun}
          label="กิจกรรม"
          value={activityCals}
          goal={activityGoal}
        />
      </svg>

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
      <div className={`dash-rings-summary dash-rings-summary--${summary.tone}`}>
        <p className="dash-rings-summary-main">{summary.main}</p>
        {summary.detail ? (
          <p className="dash-rings-summary-detail">{summary.detail}</p>
        ) : null}
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
