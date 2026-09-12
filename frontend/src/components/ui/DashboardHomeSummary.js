import React from "react";
import MetricCard from "./MetricCard";
import { STAT_TOOLTIPS } from "../../constants/statTooltips";

function useHomeSummaryMetrics({
  foodCals = 0,
  activityCals = 0,
  netCals = 0,
}) {
  const intakeNote =
    activityCals > 0
      ? `กิน ${foodCals.toLocaleString("th-TH")} · เผา ${activityCals.toLocaleString("th-TH")} · สุทธิ ${netCals.toLocaleString("th-TH")}`
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
}) {
  const { intakeNote } = useHomeSummaryMetrics({
    foodCals,
    activityCals,
    netCals,
  });
  const remaining = (Number(tdee) || 0) - netCals;
  const over = remaining < 0;

  return (
    <section className="dash-home-summary dash-home-stats-block" aria-label="ข้อมูลสรุป">
      <header className="dash-home-summary-head">
        <h2 className="dash-home-summary-title">ข้อมูลสรุป</h2>
        <p className="dash-home-summary-desc">น้ำหนัก · BMI · TDEE · พลังงานคงเหลือ</p>
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
          label={over ? "เกินเป้า" : "พลังงานคงเหลือ"}
          value={Math.abs(Math.round(remaining)).toLocaleString("th-TH")}
          unit="kcal"
          tooltip={STAT_TOOLTIPS.remainingCal}
          variant={over ? "warn" : "success"}
          compact
        />
      </div>

      {intakeNote ? <p className="dash-home-summary-net">{intakeNote}</p> : null}
    </section>
  );
}

export function DashboardHomeAdvice({ brief }) {
  const hasBrief = brief?.lead || (brief?.tips?.length > 0);

  return (
    <article className="dash-home-summary-advice dash-home-advice-block" aria-label="คำแนะนำการบริโภคอาหาร">
      <h3 className="dash-home-summary-advice-title">คำแนะนำการบริโภคอาหาร</h3>
      {hasBrief ? (
        <div className="dash-home-summary-advice-body">
          {brief.lead ? <p className="dash-home-advice-lead">{brief.lead}</p> : null}
          {brief.tips?.length > 0 ? (
            <ul className="dash-home-advice-tips">
              {brief.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="dash-home-summary-advice-body dash-home-summary-advice-body--muted">
          บันทึกมื้อวันนี้เพื่อรับคำแนะนำสั้นๆ ตามแคลและมาโครของคุณ
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
      <DashboardHomeAdvice brief={props.brief} />
    </>
  );
}
