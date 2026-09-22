import React from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

const fmt = (n) => Math.round(n).toLocaleString("th-TH");

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
  const scale = Math.max(used, goal, 1);
  const usedToGoalPct = (Math.min(used, goal) / scale) * 100;
  const overflowPct = over ? (overflow / scale) * 100 : 0;
  const story = over
    ? `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · เกิน ${fmt(overflow)}`
    : `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · คงเหลือ ${fmt(remaining)}`;

  return (
    <div
      className={`dash-energy-wrap ${className}`.trim()}
      role="img"
      aria-label={story}
    >
      <div className="dash-energy-pair">
        <div className="dash-energy-pair-card dash-energy-pair-card--eat">
          <span className="dash-energy-pair-label">พลังงานที่ได้รับ</span>
          <strong className="dash-energy-pair-num">{fmt(eaten)}</strong>
          <span className="dash-energy-pair-unit">กิโลแคลอรี</span>
        </div>
        <div className="dash-energy-pair-card dash-energy-pair-card--burn">
          <span className="dash-energy-pair-label">พลังงานที่เผาผลาญ</span>
          <strong className="dash-energy-pair-num">{fmt(burned)}</strong>
          <span className="dash-energy-pair-unit">กิโลแคลอรี</span>
        </div>
      </div>

      <div className={`dash-energy-hero${over ? " is-over" : ""}`}>
        <span className="dash-energy-hero-label">{over ? "เกินเป้าหมาย" : "พลังงานคงเหลือ"}</span>
        <strong className="dash-energy-hero-value">{fmt(Math.abs(remaining))}</strong>
        <span className="dash-energy-hero-unit">กิโลแคลอรี</span>
        <div className="dash-energy-bar" aria-hidden="true">
          <span className="dash-energy-bar-track">
            <span className="dash-energy-bar-used" style={{ width: `${usedToGoalPct}%` }} />
            {over ? <span className="dash-energy-bar-over" style={{ width: `${overflowPct}%` }} /> : null}
          </span>
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
