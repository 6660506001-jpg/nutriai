import React from "react";

function MacroCell({ label, short, value, target, tone }) {
  const safeTarget = Math.max(Number(target) || 0, 1);
  const safeValue = Math.max(Number(value) || 0, 0);
  const pct = Math.min(100, Math.round((safeValue / safeTarget) * 100));

  return (
    <div className={`dash-macro-strip-item dash-macro-strip-item--${tone}`}>
      <div className="dash-macro-strip-head">
        <span className="dash-macro-strip-label">{label}</span>
        <span className="dash-macro-strip-value">
          {Math.round(safeValue)}
          <small>/{Math.round(safeTarget)}g</small>
        </span>
      </div>
      <div className="dash-macro-strip-track" aria-hidden>
        <span className="dash-macro-strip-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="dash-macro-strip-short">{short}</span>
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
  const hasData = protein + carbs + fat > 0;

  return (
    <div
      className={`dash-macro-strip${hasData ? " dash-macro-strip--active" : ""}${className ? ` ${className}` : ""}`}
      aria-label="มาโครนิวเทรนต์วันนี้"
    >
      <MacroCell label="โปรตีน" short="P" value={protein} target={targetProtein} tone="protein" />
      <MacroCell label="คาร์บ" short="C" value={carbs} target={targetCarbs} tone="carbs" />
      <MacroCell label="ไขมัน" short="F" value={fat} target={targetFat} tone="fat" />
    </div>
  );
}
