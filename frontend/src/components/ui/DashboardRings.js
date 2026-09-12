import React from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

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
  const scale = eaten > goal ? eaten : goal;
  const usedPct = scale > 0 ? (Math.min(eaten, goal) / scale) * 100 : 0;
  const overPct = scale > 0 && eaten > goal ? ((eaten - goal) / scale) * 100 : 0;

  return (
    <div
      className={`dash-energy-wrap ${className}`.trim()}
      role="img"
      aria-label={
        over
          ? `เกินเป้า ${Math.round(overflow)} kcal จากเป้าหมาย ${Math.round(goal)}`
          : `กินได้อีก ${Math.round(remaining)} kcal จากเป้าหมาย ${Math.round(goal)}`
      }
    >
      <div className={`dash-energy-hero${over ? " is-over" : ""}`}>
        <span className="dash-energy-hero-label">{over ? "เกินเป้า" : "กินได้อีก"}</span>
        <strong className="dash-energy-hero-value">
          {Math.abs(Math.round(remaining)).toLocaleString("th-TH")}
        </strong>
        <span className="dash-energy-hero-unit">kcal</span>
      </div>

      <div
        className={`dash-energy-bar${eaten > goal ? " is-over" : ""}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={Math.round(goal)}
        aria-valuenow={Math.round(eaten)}
        aria-label={`กินไปแล้ว ${Math.round(eaten)} จาก ${Math.round(goal)} kcal`}
      >
        <span className="dash-energy-bar-track">
          <span className="dash-energy-bar-used" style={{ width: `${usedPct}%` }} />
          {overPct > 0 ? <span className="dash-energy-bar-over" style={{ width: `${overPct}%` }} /> : null}
        </span>
        <span className="dash-energy-bar-meta">
          {`กินไปแล้ว ${Math.round(eaten).toLocaleString("th-TH")} / ${Math.round(goal).toLocaleString("th-TH")} kcal`}
        </span>
      </div>

      <div className="dash-energy-mini">
        <div className="dash-energy-mini-item">
          <span className="dash-energy-mini-label">เป้าหมาย</span>
          <strong className="dash-energy-mini-value">{Math.round(goal).toLocaleString("th-TH")}</strong>
        </div>
        <div className="dash-energy-mini-item">
          <span className="dash-energy-mini-label">เผาผลาญเพิ่ม</span>
          <strong className="dash-energy-mini-value">{Math.round(burned).toLocaleString("th-TH")}</strong>
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
