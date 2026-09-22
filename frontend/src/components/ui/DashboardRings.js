import React from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

const fmt = (n) => Math.round(n).toLocaleString("th-TH");

const RING = 140;
const STROKE = 12;
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

function EnergyRing({ tone, label, value, pct, gradId, from, to }) {
  const amount = Math.min(1, Math.max(0, pct));
  const dash = CIRC * amount;
  const gap = CIRC - dash;
  return (
    <div className={`dash-energy-ring dash-energy-ring--${tone}`}>
      <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
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
        <span className="dash-energy-ring-kicker">{label}</span>
        <strong className="dash-energy-ring-num">{fmt(value)}</strong>
        <span className="dash-energy-ring-unit">กิโลแคลอรี</span>
      </div>
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
  const uid = React.useId().replace(/:/g, "");
  const barScale = Math.max(eaten, burned, goal, 1);
  const barPct = (n) => Math.min(100, (n / barScale) * 100);
  const story = over
    ? `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · เกิน ${fmt(overflow)}`
    : `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · คงเหลือ ${fmt(remaining)}`;

  return (
    <div className={`dash-energy-wrap ${className}`.trim()} aria-label={story}>
      <div className="dash-energy-panel">
        <div className="dash-energy-ring-block">
          <EnergyRing
            tone="eat"
            label="พลังงานที่ได้รับ"
            value={eaten}
            pct={eaten / goal}
            gradId={`dashEnergyEat-${uid}`}
            from="#60a5fa"
            to="#2563eb"
          />
          <EnergyRing
            tone="burn"
            label="พลังงานที่เผาผลาญ"
            value={burned}
            pct={burned / goal}
            gradId={`dashEnergyBurn-${uid}`}
            from="#34d399"
            to="#059669"
          />
          <EnergyRing
            tone="over"
            label="เกินเป้าหมาย"
            value={overflow}
            pct={overflow / goal}
            gradId={`dashEnergyOver-${uid}`}
            from="#fb923c"
            to="#ea580c"
          />
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
