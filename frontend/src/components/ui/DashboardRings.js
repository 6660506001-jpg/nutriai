import React from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

const fmt = (n) => Math.round(n).toLocaleString("th-TH");

function PairCard({
  tone,
  label,
  value,
  fillPct,
  overPct = 0,
  goalPct,
}) {
  return (
    <div className={`dash-energy-pair-card dash-energy-pair-card--${tone}`}>
      <span className="dash-energy-pair-label">{label}</span>
      <strong className="dash-energy-pair-num">{fmt(value)}</strong>
      <span className="dash-energy-pair-unit">กิโลแคลอรี</span>
      <div className="dash-energy-pair-chart">
        <div className="dash-energy-pair-track">
          <span className={`dash-energy-pair-fill dash-energy-pair-fill--${tone}`} style={{ width: `${fillPct}%` }} />
          {overPct > 0 ? (
            <span className="dash-energy-pair-fill dash-energy-pair-fill--over" style={{ width: `${overPct}%` }} />
          ) : null}
        </div>
        <span className="dash-energy-pair-target" style={{ left: `${goalPct}%` }} title="เป้าหมายพลังงาน" />
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
  const scale = Math.max(eaten, burned, goal, 1) * 1.12;
  const toPct = (n) => Math.min(100, (Math.max(0, n) / scale) * 100);
  const goalPct = toPct(goal);
  const eatenBasePct = toPct(Math.min(eaten, goal));
  const eatenOverPct = eaten > goal ? toPct(eaten - goal) : 0;
  const burnedPct = toPct(burned);

  return (
    <div
      className={`dash-energy-wrap ${className}`.trim()}
      role="img"
      aria-label={
        over
          ? `เกินเป้าหมายพลังงาน ${fmt(overflow)} กิโลแคลอรี จากเป้าหมาย ${fmt(goal)} พลังงานที่ได้รับ ${fmt(eaten)} พลังงานที่เผาผลาญ ${fmt(burned)}`
          : `พลังงานคงเหลือ ${fmt(remaining)} กิโลแคลอรี จากเป้าหมายพลังงาน ${fmt(goal)} พลังงานที่ได้รับ ${fmt(eaten)} พลังงานที่เผาผลาญ ${fmt(burned)}`
      }
    >
      <div className="dash-energy-pair">
        <PairCard
          tone="eat"
          label="พลังงานที่ได้รับ"
          value={eaten}
          fillPct={eatenBasePct}
          overPct={eatenOverPct}
          goalPct={goalPct}
        />
        <PairCard
          tone="burn"
          label="พลังงานที่เผาผลาญ"
          value={burned}
          fillPct={burnedPct}
          goalPct={goalPct}
        />
      </div>
      <p className="dash-energy-goal-note">เส้นตั้งคือเป้าหมายพลังงานวันนี้ {fmt(goal)} กิโลแคลอรี</p>

      <div className={`dash-energy-hero${over ? " is-over" : ""}`}>
        <span className="dash-energy-hero-label">{over ? "เกินเป้าหมาย" : "พลังงานคงเหลือ"}</span>
        <strong className="dash-energy-hero-value">
          {fmt(Math.abs(remaining))}
        </strong>
        <span className="dash-energy-hero-unit">กิโลแคลอรี</span>
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
