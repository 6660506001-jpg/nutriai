import React from "react";

function MacroRow({ label, value, target, tone }) {
  const safeTarget = Math.max(Number(target) || 0, 1);
  const safeValue = Math.max(Number(value) || 0, 0);
  const pct = Math.min(100, Math.round((safeValue / safeTarget) * 100));
  const over = safeValue > safeTarget;

  return (
    <div className={`dash-macro-row dash-macro-row--${tone}${over ? " is-over" : ""}`}>
      <span className="dash-macro-row-label">{label}</span>
      <div className="dash-macro-row-track" aria-hidden>
        <span className="dash-macro-row-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="dash-macro-row-value">
        {Math.round(safeValue)}
        <small> / {Math.round(safeTarget)}g</small>
      </span>
    </div>
  );
}

export default function DashboardMacroStrip({
  protein = 0,
  carbs = 0,
  fat = 0,
  targetProtein = 0,
  targetCarbs = 0,
  targetFat = 0,
  className = "",
}) {
  return (
    <div
      className={`dash-macro-rows${className ? ` ${className}` : ""}`}
      aria-label="มาโครนิวเทรนต์วันนี้"
    >
      <MacroRow label="โปรตีน" value={protein} target={targetProtein} tone="protein" />
      <MacroRow label="คาร์บ" value={carbs} target={targetCarbs} tone="carbs" />
      <MacroRow label="ไขมัน" value={fat} target={targetFat} tone="fat" />
    </div>
  );
}
