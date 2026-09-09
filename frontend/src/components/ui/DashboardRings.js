import React, { useMemo } from "react";
import { HiFire } from "react-icons/hi";
import { MdDirectionsRun } from "react-icons/md";

function pointOnEllipse(cx, cy, rx, ry, progress) {
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
}

function describeEllipseArc(cx, cy, rx, ry, progress) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  if (clamped <= 0) return null;

  const start = pointOnEllipse(cx, cy, rx, ry, 0);
  const end = pointOnEllipse(cx, cy, rx, ry, clamped);
  const largeArc = clamped > 0.5 ? 1 : 0;

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${rx} ${ry} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
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
  const arcPath = describeEllipseArc(cx, cy, rx, ry, clamped);
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
          strokeLinecap="butt"
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
  className = "",
}) {
  const foodGoal = Math.max(Number(tdee) || 0, 1);
  const activityGoal = Math.max(250, Math.round(foodGoal * 0.2));
  const foodProgress = foodCals / foodGoal;
  const activityProgress = activityCals / activityGoal;

  const summary = useMemo(() => {
    const net = foodCals - activityCals;
    const remaining = Math.max(0, foodGoal - net);
    if (foodCals === 0 && activityCals === 0) return "เริ่มบันทึกวันนี้";
    if (remaining > 0) return `เหลืออีก ~${remaining.toLocaleString("th-TH")} kcal`;
    return "ถึงเป้าแล้ว";
  }, [foodCals, activityCals, foodGoal]);

  const cx = 168;
  const cy = 52;

  return (
    <div className={`dash-rings-wrap ${className}`.trim()} role="img" aria-label={`กินแล้ว ${foodCals} kcal จาก ${foodGoal} · กิจกรรม ${activityCals} kcal`}>
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
          color="#FF375F"
          trackColor="rgba(255, 55, 95, 0.14)"
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
          color="#30D158"
          trackColor="rgba(48, 209, 88, 0.14)"
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
            <strong>{foodCals.toLocaleString("th-TH")}</strong>
            <small> / {foodGoal.toLocaleString("th-TH")} kcal</small>
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
      <p className="dash-rings-summary">{summary}</p>
    </div>
  );
}
