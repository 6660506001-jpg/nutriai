import React from "react";

export default function CalorieProgress({
  consumed = 0,
  target = 0,
  label = "พลังงานวันนี้",
  showRemaining = true,
}) {
  const safeTarget = Math.max(Number(target) || 0, 1);
  const safeConsumed = Math.max(Number(consumed) || 0, 0);
  const pct = Math.min(100, Math.round((safeConsumed / safeTarget) * 100));
  const remaining = Math.max(0, safeTarget - safeConsumed);
  const over = safeConsumed > safeTarget;

  return (
    <div className="nutri-cal-progress" role="group" aria-label={label}>
      <div className="nutri-cal-progress-head">
        <span className="nutri-cal-progress-label">{label}</span>
        <span className="nutri-cal-progress-stats">
          <strong>{safeConsumed.toLocaleString("th-TH")}</strong>
          <span className="nutri-cal-progress-of"> / {safeTarget.toLocaleString("th-TH")} kcal</span>
        </span>
      </div>
      <div
        className={`nutri-cal-progress-track${over ? " is-over" : ""}`}
        role="progressbar"
        aria-valuenow={safeConsumed}
        aria-valuemin={0}
        aria-valuemax={safeTarget}
        aria-label={`${pct}% ของเป้าหมาย`}
      >
        <span className="nutri-cal-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {showRemaining && (
        <p className={`nutri-cal-progress-foot${over ? " is-over" : ""}`}>
          {over
            ? `เกินเป้า ${(safeConsumed - safeTarget).toLocaleString("th-TH")} kcal`
            : `เหลือ ${remaining.toLocaleString("th-TH")} kcal`}
        </p>
      )}
    </div>
  );
}
