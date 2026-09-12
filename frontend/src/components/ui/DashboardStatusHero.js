import React from "react";
import { formatTodayLabel } from "../../utils/logDisplay";
import DashboardRings from "./DashboardRings";

export default function DashboardStatusHero({
  username,
  tdee = 0,
  foodCals = 0,
  activityCals = 0,
  protein = 0,
  carbs = 0,
  fat = 0,
  targetProtein = 0,
  targetCarbs = 0,
  targetFat = 0,
  onLogFood,
  onLogActivity,
  showActions = true,
  variant = "full",
}) {
  const isCompact = variant === "compact";
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "สวัสดีตอนเช้า";
    if (hour < 17) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
  })();

  const remaining = (Number(tdee) || 0) - (foodCals - activityCals);
  const over = remaining < 0;
  const hasLogs = foodCals > 0 || activityCals > 0;
  const statusText = !hasLogs
    ? "ยังไม่ได้บันทึกอาหารวันนี้ — เริ่มจากแท็บอาหาร"
    : over
      ? `เกินเป้าแล้ว ${Math.abs(Math.round(remaining)).toLocaleString("th-TH")} kcal`
      : remaining === 0
        ? "ถึงเป้าแล้ว — มื้อถัดไปควรเบาลง"
        : `วันนี้ยังกินได้อีกประมาณ ${Math.round(remaining).toLocaleString("th-TH")} kcal`;

  return (
    <section className={`dash-status-hero${isCompact ? " dash-status-hero--compact" : ""}`} aria-label="สรุปสถานะวันนี้">
      {isCompact ? (
        (showActions && (onLogFood || onLogActivity)) ? (
          <div className="dash-status-hero-actions dash-status-hero-actions--compact">
            {onLogFood ? (
              <button type="button" className="dash-status-hero-cta dash-status-hero-cta--food" onClick={onLogFood}>
                + บันทึกอาหาร
              </button>
            ) : null}
            {onLogActivity ? (
              <button type="button" className="dash-status-hero-cta dash-status-hero-cta--activity" onClick={onLogActivity}>
                + บันทึกกิจกรรม
              </button>
            ) : null}
          </div>
        ) : null
      ) : (
        <>
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
                  <button type="button" className="dash-status-hero-cta dash-status-hero-cta--food" onClick={onLogFood}>
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

          <DashboardRings
            foodCals={foodCals}
            activityCals={activityCals}
            tdee={tdee}
            protein={protein}
            carbs={carbs}
            fat={fat}
            targetProtein={targetProtein}
            targetCarbs={targetCarbs}
            targetFat={targetFat}
            className="dash-status-hero-energy"
          />
        </>
      )}
    </section>
  );
}
