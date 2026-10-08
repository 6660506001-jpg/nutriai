import React from "react";

const statusLabel = {
  under: "ยังขาด",
  ok: "พอดี",
  over: "เกินเป้า",
};

export default function NutrientRebalancePanel({ plan }) {
  if (!plan?.gaps?.length) return null;

  return (
    <section className="nutri-rebalance" aria-label="ปรับสมดุลสารอาหาร">
      <p className="nutri-rebalance-kicker">มื้อถัดไป</p>
      <h3 className="nutri-rebalance-title">{plan.title}</h3>
      {plan.nextMeal ? <p className="nutri-rebalance-lead">{plan.nextMeal}</p> : null}
      <ul className="nutri-rebalance-gaps">
        {plan.gaps.map((gap) => (
          <li key={gap.key} className={`nutri-rebalance-gap nutri-rebalance-gap--${gap.status}`}>
            <span className="nutri-rebalance-gap-label">{gap.label}</span>
            <strong>{statusLabel[gap.status] || gap.status}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
