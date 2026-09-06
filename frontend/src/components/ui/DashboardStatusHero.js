import React from "react";
import { formatTodayLabel } from "../../utils/logDisplay";
import CalorieProgress from "./CalorieProgress";
import MetricCard from "./MetricCard";
import { STAT_TOOLTIPS } from "../../constants/statTooltips";

export default function DashboardStatusHero({
  username,
  tdee = 0,
  target = 0,
  foodCals = 0,
  activityCals = 0,
  netCals = 0,
  onLogFood,
  onLogActivity,
  showActions = true,
}) {
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "สวัสดีตอนเช้า";
    if (hour < 17) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
  })();

  const remaining = Math.max(0, (target || tdee) - netCals);
  const statusText = netCals === 0
    ? "ยังไม่ได้บันทึกอาหารวันนี้ — เริ่มจากแท็บ「อาหาร」"
    : remaining > 0
      ? `วันนี้ยังกินได้อีกประมาณ ${remaining.toLocaleString("th-TH")} kcal`
      : "ถึงเป้าแล้ว — มื้อถัดไปควรเบาลง";

  return (
    <section className="dash-status-hero" aria-label="สรุปสถานะวันนี้">
      <header className="dash-status-hero-head">
        <div>
          <p className="dash-status-hero-date">{formatTodayLabel()}</p>
          <h2 className="dash-status-hero-greeting">
            {greeting}
            {username ? `, ${username}` : ""}
          </h2>
          <p className="dash-status-hero-status">{statusText}</p>
        </div>
        {(showActions && (onLogFood || onLogActivity)) ? (
          <div className="dash-status-hero-actions">
            {onLogFood ? (
              <button type="button" className="dash-status-hero-cta" onClick={onLogFood}>
                + บันทึกอาหาร
              </button>
            ) : null}
            {onLogActivity ? (
              <button type="button" className="dash-status-hero-cta dash-status-hero-cta--activity" onClick={onLogActivity}>
                + บันทึกกิจกรรม
              </button>
            ) : null}
          </div>
        ) : null}
      </header>

      {target > 0 && (
        <CalorieProgress
          consumed={netCals}
          target={target}
          label="ความคืบหน้า"
        />
      )}

      <div className="dash-status-metrics">
        <MetricCard label="เป้าหมาย/วัน" value={tdee || "—"} unit="kcal" tooltip={STAT_TOOLTIPS.tdee} compact />
        <MetricCard label="กินแล้ว" value={foodCals} unit="kcal" variant="primary" compact />
        <MetricCard
          label="เหลือ"
          value={remaining}
          unit="kcal"
          tooltip={STAT_TOOLTIPS.remainingCal}
          variant="success"
          compact
        />
      </div>

      {activityCals > 0 && (
        <p className="dash-status-hero-burn">เผาแล้ว {activityCals} kcal · สุทธิ {netCals} kcal</p>
      )}
    </section>
  );
}
