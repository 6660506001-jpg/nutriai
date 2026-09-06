import React, { useState } from "react";

const getMenuBadges = (menu) => {
  const badges = [];
  if (menu.category === "lean-protein" || (menu.protein || 0) >= 22) {
    badges.push({ label: "โปรตีนสูง", tone: "protein" });
  }
  if (menu.category === "soup" || menu.category === "salad" || menu.category === "light") {
    badges.push({ label: "GI ต่ำ", tone: "gi" });
  }
  if (badges.length === 0) {
    badges.push({ label: "เหมาะสม", tone: "fit" });
  }
  return badges.slice(0, 2);
};

export default function MenuRecommendationCard({
  menu,
  index,
  mealLabel,
  onSelect,
  onDislike,
  loading = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const badges = getMenuBadges(menu);

  return (
    <article className="nutri-menu-card">
      <div className="nutri-menu-card-visual" aria-hidden>
        <span className="nutri-menu-card-visual-icon">
          {menu.category === "lean-protein" ? "🥗" : menu.category === "soup" ? "🍲" : "🍽️"}
        </span>
        <span className="nutri-menu-card-index">#{index + 1}</span>
      </div>

      <div className="nutri-menu-card-body">
        <div className="nutri-menu-card-top">
          <h3 className="nutri-menu-card-name">{menu.name}</h3>
          <div className="nutri-menu-card-badges">
            {badges.map((badge) => (
              <span key={badge.label} className={`nutri-menu-badge nutri-menu-badge--${badge.tone}`}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div className="nutri-menu-card-macros">
          <div className="nutri-menu-macro nutri-menu-macro--cal">
            <strong>{menu.calories}</strong>
            <span>kcal</span>
          </div>
          <div className="nutri-menu-macro">
            <strong>{menu.protein}g</strong>
            <span>Protein</span>
          </div>
          <div className="nutri-menu-macro">
            <strong>{menu.carbs}g</strong>
            <span>Carbs</span>
          </div>
          <div className="nutri-menu-macro">
            <strong>{menu.fat}g</strong>
            <span>Fat</span>
          </div>
        </div>

        {expanded && menu.portionLabel ? (
          <p className="nutri-menu-card-detail">{menu.portionLabel}</p>
        ) : null}

        <div className="nutri-menu-card-actions">
          <button
            type="button"
            className="nutri-menu-btn nutri-menu-btn--ghost"
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "ย่อรายละเอียด" : "ดูรายละเอียด"}
          </button>
          <button
            type="button"
            className="nutri-menu-btn nutri-menu-btn--primary"
            onClick={() => onSelect(menu)}
            disabled={loading}
          >
            เลือกเมนู
          </button>
          {onDislike ? (
            <button
              type="button"
              className="nutri-menu-btn nutri-menu-btn--text"
              onClick={() => onDislike(menu)}
              disabled={loading}
            >
              ไม่ชอบ
            </button>
          ) : null}
        </div>
        {mealLabel ? <p className="nutri-menu-card-meal-hint">เพิ่มลง{mealLabel}</p> : null}
      </div>
    </article>
  );
}
