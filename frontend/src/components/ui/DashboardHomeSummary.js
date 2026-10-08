import React from "react";
import MetricCard from "./MetricCard";
import { STAT_TOOLTIPS } from "../../constants/statTooltips";

function useHomeSummaryMetrics({ foodCals = 0, activityCals = 0 }) {
  const intakeNote = activityCals > 0
    ? `กิน ${foodCals.toLocaleString("th-TH")} · เผา ${activityCals.toLocaleString("th-TH")}`
    : null;
  return { intakeNote };
}

export function DashboardHomeStats({
  weight,
  bmi,
  bmiStatus,
  tdee = 0,
  foodCals = 0,
  activityCals = 0,
  netCals = 0,
  compact = false,
}) {
  const { intakeNote } = useHomeSummaryMetrics({ foodCals, activityCals });
  const remaining = (Number(tdee) || 0) - netCals;
  const over = remaining < 0;

  return (
    <section className={`dash-home-summary dash-home-stats-block${compact ? " is-compact" : ""}`} aria-label="ร่างกาย">
      <header className="dash-home-summary-head">
        <h2 className="dash-home-summary-title">{compact ? "ร่างกาย" : "ข้อมูลสรุป"}</h2>
      </header>

      <div className={`dash-home-summary-grid${compact ? " dash-home-summary-grid--two" : ""}`}>
        <MetricCard
          label="น้ำหนัก"
          value={weight ?? "—"}
          unit={weight != null ? "kg" : ""}
          tooltip={STAT_TOOLTIPS.weight}
          compact
        />
        <MetricCard
          label="ดัชนีมวลกาย"
          value={bmi ?? "—"}
          unit={bmiStatus ? `(${bmiStatus})` : ""}
          tooltip={STAT_TOOLTIPS.bmi}
          compact
        />
        {compact ? null : (
          <>
            <MetricCard
              label="เป้าหมายพลังงาน"
              value={tdee || "—"}
              unit={tdee ? "กิโลแคลอรี/วัน" : ""}
              tooltip={STAT_TOOLTIPS.tdee}
              compact
            />
            <MetricCard
              label={over ? "เกินเป้าหมาย" : "พลังงานคงเหลือ"}
              value={Math.abs(Math.round(remaining)).toLocaleString("th-TH")}
              unit="กิโลแคลอรี"
              tooltip={STAT_TOOLTIPS.remainingCal}
              variant={over ? "warn" : "success"}
              compact
            />
          </>
        )}
      </div>

      {!compact && intakeNote ? <p className="dash-home-summary-net">{intakeNote}</p> : null}
    </section>
  );
}

export function DashboardHomeAdvice({ brief, onPlanNextMeal }) {
  const adviceText = brief?.lead || brief?.rebalance || "";

  return (
    <article className="dash-home-summary-advice dash-home-advice-block" aria-label="คำแนะนำวันนี้">
      <h3 className="dash-home-summary-advice-title">คำแนะนำวันนี้</h3>
      <p className="dash-home-advice-lead">
        {adviceText || "บันทึกอาหารแล้วจะมีคำแนะนำมื้อถัดไปที่นี่"}
      </p>
      {onPlanNextMeal ? (
        <button type="button" className="dash-home-advice-cta" onClick={onPlanNextMeal}>
          ดูเมนูแนะนำ
        </button>
      ) : null}
    </article>
  );
}

/** @deprecated use DashboardHomeStats + DashboardHomeAdvice */
export default function DashboardHomeSummary(props) {
  return (
    <>
      <DashboardHomeStats {...props} />
      <DashboardHomeAdvice brief={props.brief} />
    </>
  );
}
