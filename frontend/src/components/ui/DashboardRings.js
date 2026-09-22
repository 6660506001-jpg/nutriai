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
  const pairScale = Math.max(eaten, burned, 1);
  const eatenPct = (eaten / pairScale) * 100;
  const burnedPct = (burned / pairScale) * 100;
  const net = eaten - burned;
  const compareText = eaten === 0 && burned === 0
    ? "ยังไม่มีรายการบันทึกวันนี้"
    : net > 0
      ? `พลังงานที่ได้รับมากกว่าที่เผาผลาญ ${Math.round(net).toLocaleString("th-TH")} กิโลแคลอรี`
      : net < 0
        ? `พลังงานที่เผาผลาญมากกว่าที่ได้รับ ${Math.round(Math.abs(net)).toLocaleString("th-TH")} กิโลแคลอรี`
        : "พลังงานที่ได้รับเท่ากับการเผาผลาญ";

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
        className="dash-energy-pair"
        aria-label={`พลังงานที่ได้รับ ${Math.round(eaten)} กิโลแคลอรี พลังงานที่เผาผลาญ ${Math.round(burned)} กิโลแคลอรี`}
      >
        <div className="dash-energy-pair-card dash-energy-pair-card--eat">
          <span className="dash-energy-pair-label">พลังงานที่ได้รับ</span>
          <strong className="dash-energy-pair-num">{Math.round(eaten).toLocaleString("th-TH")}</strong>
          <span className="dash-energy-pair-unit">กิโลแคลอรี</span>
          <span className="dash-energy-pair-track">
            <span className="dash-energy-pair-fill dash-energy-pair-fill--eat" style={{ width: `${eatenPct}%` }} />
          </span>
        </div>
        <div className="dash-energy-pair-card dash-energy-pair-card--burn">
          <span className="dash-energy-pair-label">พลังงานที่เผาผลาญ</span>
          <strong className="dash-energy-pair-num">{Math.round(burned).toLocaleString("th-TH")}</strong>
          <span className="dash-energy-pair-unit">กิโลแคลอรี</span>
          <span className="dash-energy-pair-track">
            <span className="dash-energy-pair-fill dash-energy-pair-fill--burn" style={{ width: `${burnedPct}%` }} />
          </span>
        </div>
      </div>
      <p className="dash-energy-pair-note">{compareText}</p>
      <p className="dash-energy-goal-note">เป้าหมายพลังงานวันนี้ {Math.round(goal).toLocaleString("th-TH")} กิโลแคลอรี</p>

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
