import React from "react";
import MetricCard from "./MetricCard";
import { STAT_TOOLTIPS } from "../../constants/statTooltips";

function useHomeSummaryMetrics({
  weight,
  bmi,
  bmiStatus,
  tdee = 0,
  foodCals = 0,
  activityCals = 0,
  netCals = 0,
  target = 0,
}) {
  const goal = target || tdee || 0;
  const remaining = goal > 0 ? goal - netCals : 0;
  const remainingDisplay = remaining > 0 ? Math.round(remaining) : 0;
  const overBy = remaining < 0 ? Math.round(Math.abs(remaining)) : 0;
  const intakeNote =
    activityCals > 0
      ? `กิน ${foodCals.toLocaleString("th-TH")} · เผา ${activityCals.toLocaleString("th-TH")} · สุทธิ ${netCals.toLocaleString("th-TH")}`
      : null;
  return { remainingDisplay, overBy, intakeNote };
}

export function DashboardHomeStats({
  weight,
  bmi,
  bmiStatus,
  tdee = 0,
  foodCals = 0,
  activityCals = 0,
  netCals = 0,
  target = 0,
}) {
  const { remainingDisplay, overBy, intakeNote } = useHomeSummaryMetrics({
    weight,
    bmi,
    bmiStatus,
    tdee,
    foodCals,
    activityCals,
    netCals,
    target,
  });

  return (
    <section className="dash-home-summary dash-home-stats-block" aria-label="ข้อมูลสรุป">
      <header className="dash-home-summary-head">
        <h2 className="dash-home-summary-title">ข้อมูลสรุป</h2>
        <p className="dash-home-summary-desc">น้ำหนัก · BMI · TDEE · พลังงานวันนี้</p>
      </header>

      <div className="dash-home-summary-grid">
        <MetricCard
          label="น้ำหนัก"
          value={weight ?? "—"}
          unit={weight != null ? "kg" : ""}
          tooltip={STAT_TOOLTIPS.weight}
          compact
        />
        <MetricCard
          label="BMI"
          value={bmi ?? "—"}
          unit={bmiStatus ? `(${bmiStatus})` : ""}
          tooltip={STAT_TOOLTIPS.bmi}
          compact
        />
        <MetricCard
          label="TDEE"
          value={tdee || "—"}
          unit={tdee ? "kcal/วัน" : ""}
          tooltip={STAT_TOOLTIPS.tdee}
          compact
        />
        <MetricCard
          label="พลังงานที่ได้รับ"
          value={foodCals}
          unit="kcal"
          tooltip="แคลอรีจากอาหารที่บันทึกวันนี้"
          variant="primary"
          compact
        />
        <MetricCard
          label="พลังงานคงเหลือ"
          value={remainingDisplay}
          unit="kcal"
          tooltip={STAT_TOOLTIPS.remainingCal}
          variant={overBy > 0 ? "default" : "success"}
          compact
        />
        {overBy > 0 ? (
          <div className="dash-home-summary-over" role="status">
            เกินเป้าสุทธิ ~{overBy.toLocaleString("th-TH")} kcal
          </div>
        ) : null}
      </div>

      {intakeNote ? <p className="dash-home-summary-net">{intakeNote}</p> : null}
    </section>
  );
}

export function DashboardHomeAdvice({ adviceTitle, adviceDetail, adviceSubline }) {
  const adviceLead = adviceTitle && adviceTitle !== "คำแนะนำการบริโภคอาหาร" ? adviceTitle : null;
  const adviceBody = [adviceLead, adviceDetail, adviceSubline].filter(Boolean).join(" ");

  return (
    <article className="dash-home-summary-advice dash-home-advice-block" aria-label="คำแนะนำการบริโภคอาหาร">
      <h3 className="dash-home-summary-advice-title">คำแนะนำการบริโภคอาหาร</h3>
      {adviceBody ? (
        <p className="dash-home-summary-advice-body">{adviceBody}</p>
      ) : (
        <p className="dash-home-summary-advice-body dash-home-summary-advice-body--muted">
          บันทึกมื้ออาหารวันนี้เพื่อรับคำแนะนำที่เหมาะกับแคลและมาโครของคุณ
        </p>
      )}
    </article>
  );
}

/** @deprecated use DashboardHomeStats + DashboardHomeAdvice */
export default function DashboardHomeSummary(props) {
  return (
    <>
      <DashboardHomeStats {...props} />
      <DashboardHomeAdvice
        adviceTitle={props.adviceTitle}
        adviceDetail={props.adviceDetail}
        adviceSubline={props.adviceSubline}
      />
    </>
  );
}
