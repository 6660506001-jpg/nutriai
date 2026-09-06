import React from "react";
import {
  formatTodayLabel,
  getMealShort,
  MEAL_ORDER,
} from "../../utils/logDisplay";

export default function LogPageSummary({
  mode = "food",
  activeMeal,
  foodCals = 0,
  activityCals = 0,
  totalMinutes = 0,
  activityCount = 0,
  mealTotals = null,
  rewards = null,
}) {
  return (
    <div className={`log-page-summary log-page-summary--${mode}`}>
      <div className="log-page-summary-row">
        <span className="log-page-summary-date">{formatTodayLabel()}</span>
        <span className={`log-page-summary-meal log-page-summary-meal--${mode}`}>
          {mode === "activity" ? "ช่วง" : "มื้อ"} {getMealShort(activeMeal)}
        </span>
      </div>

      <div className="log-page-summary-metrics">
        {mode === "food" ? (
          <>
            <div className="log-page-summary-metric">
              <span className="log-page-summary-metric-label">กินวันนี้</span>
              <strong className="log-page-summary-metric-value">{foodCals} kcal</strong>
            </div>
            {rewards?.mealCount > 0 && (
              <div className="log-page-summary-metric log-page-summary-metric--reward">
                <span className="log-page-summary-metric-label">รางวัล</span>
                <strong className="log-page-summary-metric-value">
                  {rewards.totalPoints} แต้ม · ♥ {rewards.totalHearts}
                </strong>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="log-page-summary-metric">
              <span className="log-page-summary-metric-label">เผาวันนี้</span>
              <strong className="log-page-summary-metric-value log-page-summary-metric-value--burn">
                −{activityCals} kcal
              </strong>
            </div>
            <div className="log-page-summary-metric">
              <span className="log-page-summary-metric-label">เวลา / รายการ</span>
              <strong className="log-page-summary-metric-value">
                {totalMinutes} น. · {activityCount} รายการ
              </strong>
            </div>
          </>
        )}
      </div>

      {mode === "food" && mealTotals && (
        <div className="log-page-summary-meals">
          {MEAL_ORDER.map((mealType) => (
            <span
              key={mealType}
              className={`log-page-summary-meal-chip${mealTotals[mealType] > 0 ? " has-data" : ""}`}
            >
              {getMealShort(mealType)} {mealTotals[mealType] > 0 ? mealTotals[mealType] : "—"}
            </span>
          ))}
        </div>
      )}

      {mode === "food" && rewards?.dayPraise && rewards.mealCount > 0 && (
        <p className="log-page-summary-praise">{rewards.dayPraise}</p>
      )}

      {mode === "food" && foodCals > 0 && (
        <p className="log-page-summary-hint">
          บันทึกแล้ว — ดูรายการด้านล่าง หรือไปแผนมื้อดูเมนูแนะนำ
        </p>
      )}
    </div>
  );
}
