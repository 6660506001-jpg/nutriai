import React from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import "./DashboardRings.css";

function EqTerm({ label, value, emphasize = false, over = false }) {
  return (
    <div className={`dash-energy-term${emphasize ? " dash-energy-term--result" : ""}${over ? " dash-energy-term--over" : ""}`}>
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
  const used = Math.max(0, foodCals - activityCals);
  const remaining = goal - (foodCals - activityCals);
  const over = remaining < 0;
  const overflow = over ? Math.abs(remaining) : 0;
  const scale = over ? used : goal;
  const usedPct = scale > 0 ? (Math.min(used, goal) / scale) * 100 : 0;
  const overPct = scale > 0 ? (overflow / scale) * 100 : 0;

  return (
    <div
      className={`dash-energy-wrap ${className}`.trim()}
      role="img"
      aria-label={`เป้าหมาย ${Math.round(goal)} ลบกินแล้ว ${foodCals} บวกกิจกรรม ${activityCals} เท่ากับ${over ? "เกินเป้า" : "คงเหลือ"} ${Math.abs(Math.round(remaining))} kcal`}
    >
      <div className="dash-energy-eq" aria-hidden>
        <EqTerm label="เป้าหมาย" value={goal} />
        <span className="dash-energy-op">−</span>
        <EqTerm label="กินแล้ว" value={foodCals} />
        <span className="dash-energy-op">+</span>
        <EqTerm label="กิจกรรม" value={activityCals} />
        <span className={`dash-energy-op dash-energy-op--eq${over ? " is-over" : ""}`}>=</span>
        <EqTerm
          label={over ? "เกินเป้า" : "คงเหลือ"}
          value={Math.abs(remaining)}
          emphasize
          over={over}
        />
      </div>

      <div
        className={`dash-energy-bar${over ? " is-over" : ""}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={Math.round(goal)}
        aria-valuenow={Math.round(used)}
        aria-label={over ? "กินเกินเป้าหมายแล้ว" : `ใช้ไป ${Math.round(used)} จาก ${Math.round(goal)} kcal`}
      >
        <span className="dash-energy-bar-track">
          <span className="dash-energy-bar-used" style={{ width: `${usedPct}%` }} />
          {over ? <span className="dash-energy-bar-over" style={{ width: `${overPct}%` }} /> : null}
        </span>
        <span className="dash-energy-bar-meta">
          {over
            ? `ใช้ไป ${Math.round(used).toLocaleString("th-TH")} / ${Math.round(goal).toLocaleString("th-TH")} · เกิน ${Math.round(overflow).toLocaleString("th-TH")} kcal`
            : `ใช้ไป ${Math.round(used).toLocaleString("th-TH")} / ${Math.round(goal).toLocaleString("th-TH")} kcal`}
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
