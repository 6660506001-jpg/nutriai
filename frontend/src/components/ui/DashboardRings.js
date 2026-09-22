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
  const scale = Math.max(eaten, burned, goal, 1);
  const eatenPct = (eaten / scale) * 100;
  const burnedPct = (burned / scale) * 100;
  const goalPct = (goal / scale) * 100;

  return (
    <div
      className={`dash-energy-wrap ${className}`.trim()}
      role="img"
      aria-label={
        over
          ? `เกินเป้าหมายพลังงาน ${Math.round(overflow)} กิโลแคลอรี จากเป้าหมาย ${Math.round(goal)}`
          : `พลังงานคงเหลือ ${Math.round(remaining)} กิโลแคลอรี จากเป้าหมายพลังงาน ${Math.round(goal)}`
      }
    >
      <div className={`dash-energy-hero${over ? " is-over" : ""}`}>
        <span className="dash-energy-hero-label">{over ? "เกินเป้าหมาย" : "พลังงานคงเหลือ"}</span>
        <strong className="dash-energy-hero-value">
          {Math.abs(Math.round(remaining)).toLocaleString("th-TH")}
        </strong>
        <span className="dash-energy-hero-unit">กิโลแคลอรี</span>
      </div>

      <div
        className="dash-energy-compare"
        role="img"
        aria-label={`พลังงานที่ได้รับ ${Math.round(eaten)} กิโลแคลอรี พลังงานที่เผาผลาญ ${Math.round(burned)} กิโลแคลอรี เป้าหมาย ${Math.round(goal)} กิโลแคลอรี`}
      >
        <div className="dash-energy-compare-legend">
          <span className="dash-energy-compare-swatch dash-energy-compare-swatch--intake" />
          พลังงานที่ได้รับ
          <span className="dash-energy-compare-swatch dash-energy-compare-swatch--burn" />
          พลังงานที่เผาผลาญ
          <span className="dash-energy-compare-swatch dash-energy-compare-swatch--goal" />
          เป้าหมาย
        </div>

        <div className="dash-energy-compare-row">
          <span className="dash-energy-compare-label">พลังงานที่ได้รับ</span>
          <div className="dash-energy-compare-track">
            <span className="dash-energy-compare-fill dash-energy-compare-fill--intake" style={{ width: `${eatenPct}%` }} />
            <span className="dash-energy-compare-goal" style={{ left: `${goalPct}%` }} aria-hidden />
          </div>
          <strong className="dash-energy-compare-value">{Math.round(eaten).toLocaleString("th-TH")}</strong>
        </div>

        <div className="dash-energy-compare-row">
          <span className="dash-energy-compare-label">พลังงานที่เผาผลาญ</span>
          <div className="dash-energy-compare-track">
            <span className="dash-energy-compare-fill dash-energy-compare-fill--burn" style={{ width: `${burnedPct}%` }} />
            <span className="dash-energy-compare-goal" style={{ left: `${goalPct}%` }} aria-hidden />
          </div>
          <strong className="dash-energy-compare-value">{Math.round(burned).toLocaleString("th-TH")}</strong>
        </div>

        <p className="dash-energy-compare-meta">
          เทียบกับเป้าหมาย {Math.round(goal).toLocaleString("th-TH")} กิโลแคลอรี
        </p>
      </div>

      <div className="dash-energy-mini">
        <div className="dash-energy-mini-item">
          <span className="dash-energy-mini-label">เป้าหมายพลังงาน</span>
          <strong className="dash-energy-mini-value">{Math.round(goal).toLocaleString("th-TH")}</strong>
        </div>
        <div className="dash-energy-mini-item">
          <span className="dash-energy-mini-label">พลังงานที่ได้รับ</span>
          <strong className="dash-energy-mini-value">{Math.round(eaten).toLocaleString("th-TH")}</strong>
        </div>
        <div className="dash-energy-mini-item">
          <span className="dash-energy-mini-label">พลังงานที่เผาผลาญ</span>
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
