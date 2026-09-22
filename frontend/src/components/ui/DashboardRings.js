import React from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

const fmt = (n) => Math.round(n).toLocaleString("th-TH");

const RING = 156;
const STROKE = 13;
const RADIUS = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

function EnergyRow({ tone, label, value, widthPct }) {
  return (
    <div className={`dash-energy-row dash-energy-row--${tone}`}>
      <span className="dash-energy-row-label">{label}</span>
      <div className="dash-energy-row-track" aria-hidden="true">
        <span className="dash-energy-row-fill" style={{ width: `${Math.max(widthPct, value > 0 ? 3 : 0)}%` }} />
      </div>
      <span className="dash-energy-row-value">{fmt(value)}</span>
    </div>
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
  const goal = Math.max(Number(tdee) || 0, 1);
  const eaten = Math.max(0, Number(foodCals) || 0);
  const burned = Math.max(0, Number(activityCals) || 0);
  const remaining = goal - (eaten - burned);
  const over = remaining < 0;
  const overflow = over ? Math.abs(remaining) : 0;
  const used = Math.max(0, eaten - burned);
  const ringPct = Math.min(1, used / goal);
  const dash = CIRC * ringPct;
  const gap = CIRC - dash;
  const uid = React.useId().replace(/:/g, "");
  const gradId = `dashEnergyRing-${uid}`;
  const barScale = Math.max(eaten, burned, goal, 1);
  const barPct = (n) => Math.min(100, (n / barScale) * 100);
  const story = over
    ? `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · เกิน ${fmt(overflow)}`
    : `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · คงเหลือ ${fmt(remaining)}`;

  return (
    <div className={`dash-energy-wrap ${className}`.trim()} aria-label={story}>
      <div className={`dash-energy-panel${over ? " is-over" : ""}`}>
        <div className="dash-energy-ring-block">
          <div className="dash-energy-ring" aria-hidden="true">
            <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`}>
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={over ? "#fb923c" : "#60a5fa"} />
                  <stop offset="100%" stopColor={over ? "#ea580c" : "#2563eb"} />
                </linearGradient>
              </defs>
              <circle
                className="dash-energy-ring-track"
                cx={RING / 2}
                cy={RING / 2}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE}
              />
              <circle
                className="dash-energy-ring-value"
                cx={RING / 2}
                cy={RING / 2}
                r={RADIUS}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
              />
            </svg>
            <div className="dash-energy-ring-center">
              <span className="dash-energy-ring-kicker">{over ? "เกินเป้าหมาย" : "พลังงานคงเหลือ"}</span>
              <strong className="dash-energy-ring-num">{fmt(Math.abs(remaining))}</strong>
              <span className="dash-energy-ring-unit">กิโลแคลอรี</span>
            </div>
          </div>
        </div>

        <div className="dash-energy-rows">
          <EnergyRow tone="eat" label="ที่ได้รับ" value={eaten} widthPct={barPct(eaten)} />
          <EnergyRow tone="burn" label="ที่เผาผลาญ" value={burned} widthPct={barPct(burned)} />
          <EnergyRow tone="goal" label="เป้าหมาย" value={goal} widthPct={barPct(goal)} />
        </div>
        <p className="dash-energy-story">{story}</p>
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
