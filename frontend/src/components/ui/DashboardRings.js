import React from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

function EqTerm({ label, value }) {
  return (
    <div className="dash-energy-term">
      <span className="dash-energy-term-label">{label}</span>
      <strong className="dash-energy-term-value">{Math.round(value).toLocaleString("th-TH")}</strong>
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
  const netCals = foodCals - activityCals;
  const remaining = goal - netCals;
  const over = remaining < 0;
  const usedPct = Math.min(100, Math.max(0, (netCals / goal) * 100));
  const barPct = over ? 100 : usedPct;
  const tone = over ? "over" : remaining === 0 && (foodCals > 0 || activityCals > 0) ? "ok" : "ok";

  return (
    <div
      className={`dash-energy-wrap ${className}`.trim()}
      role="img"
      aria-label={`เป้าหมาย ${Math.round(goal)} ลบกินแล้ว ${foodCals} บวกกิจกรรม ${activityCals} เท่ากับคงเหลือ ${Math.round(remaining)} kcal`}
    >
      <div className="dash-energy-eq">
        <EqTerm label="เป้าหมาย" value={goal} />
        <span className="dash-energy-op" aria-hidden>−</span>
        <EqTerm label="กินแล้ว" value={foodCals} />
        <span className="dash-energy-op" aria-hidden>+</span>
        <EqTerm label="กิจกรรม" value={activityCals} />
      </div>

      <div className={`dash-energy-remain dash-energy-remain--${tone}`}>
        <span className="dash-energy-remain-label">{over ? "เกินเป้า" : "คงเหลือ"}</span>
        <strong className="dash-energy-remain-value">
          {Math.abs(Math.round(remaining)).toLocaleString("th-TH")}
        </strong>
        <span className="dash-energy-remain-unit">kcal</span>
      </div>

      <div
        className={`dash-energy-bar${over ? " is-over" : ""}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={Math.round(goal)}
        aria-valuenow={Math.round(Math.max(0, netCals))}
        aria-label={over ? "กินเกินเป้าหมายแล้ว" : `ใช้ไป ${Math.round(usedPct)}% ของเป้าหมาย`}
      >
        <span className="dash-energy-bar-track">
          <span className="dash-energy-bar-fill" style={{ width: `${barPct}%` }} />
        </span>
        <span className="dash-energy-bar-meta">
          {over
            ? `เกิน ${Math.abs(Math.round(remaining)).toLocaleString("th-TH")} kcal`
            : `ใช้ไป ${Math.round(Math.max(0, netCals)).toLocaleString("th-TH")} / ${Math.round(goal).toLocaleString("th-TH")} kcal`}
        </span>
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
