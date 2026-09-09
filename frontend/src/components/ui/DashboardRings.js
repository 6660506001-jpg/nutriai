import React, { useMemo } from "react";
import { HiFire } from "react-icons/hi";
import { MdDirectionsRun } from "react-icons/md";

function ellipseCircumference(rx, ry) {
  const h = ((rx - ry) ** 2) / ((rx + ry) ** 2);
  return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

function pointOnEllipse(cx, cy, rx, ry, progress) {
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
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
  const circ = ellipseCircumference(rx, ry);
  const clamped = Math.min(Math.max(progress, 0), 1.001);
  const offset = circ * (1 - Math.min(clamped, 1));
  const tip = pointOnEllipse(cx, cy, rx, ry, Math.min(clamped, 1));
  const pct = Math.round(Math.min(clamped, 1) * 100);

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
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        className="dash-ring-progress"
      />
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
