import React, { useState } from "react";

const getMenuBadges = (menu) => {
  const badges = [];
  if (menu.category === "lean-protein" || (menu.protein || 0) >= 22) {
    badges.push({ label: "โปรตีนสูง", tone: "protein" });
  }
  if (menu.category === "soup" || menu.category === "salad" || menu.category === "light") {
    badges.push({ label: "เบา ย่อยง่าย", tone: "gi" });
  }
  if (badges.length === 0) {
    badges.push({ label: "เข้ากับเป้าวันนี้", tone: "fit" });
  }
  return badges.slice(0, 2);
};

const getMenuPlainReason = (menu) => {
  if (menu.category === "lean-protein" || (menu.protein || 0) >= 22) {
    return "ช่วยเติมโปรตีนโดยไม่กินแคลเกินเป้า";
  }
  if (menu.category === "soup" || menu.category === "salad" || menu.category === "light") {
    return "เมนูเบา ไม่ท้องหนัก เหมาะมื้อถัดไป";
  }
  return "ปริมาณแคลใกล้เคียงที่คุณกินได้อีกวันนี้";
};

const formatCalories = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("th-TH");
};

export default function MenuRecommendationCard({
  menu,
  index,
  mealLabel,
  onSelect,
  onDislike,
  loading = false,
  variant = "default",
}) {
  const [expanded, setExpanded] = useState(false);
  const badges = getMenuBadges(menu);
  const isHome = variant === "home";
  const showPortion = isHome || expanded;

  const homeIcon = menu.category === "lean-protein" ? "🥗" : menu.category === "soup" ? "🍲" : "🍽️";
  const homeReason = menu.matchNote || getMenuPlainReason(menu);
  const homePortion = menu.portionLabel ? ` · ${menu.portionLabel}` : "";

  if (isHome) {
    return (
      <article className="nutri-menu-card nutri-menu-card--home nutri-menu-card--home-compact">
        <div className="nutri-menu-home-compact-top">
          <span className="nutri-menu-home-compact-icon" aria-hidden>{homeIcon}</span>
          <div className="nutri-menu-home-compact-main">
            <h3 className="nutri-menu-card-name">{menu.name}</h3>
            <div className="nutri-menu-card-badges nutri-menu-card-badges--compact">
              <span className="nutri-menu-badge nutri-menu-badge--fit">AI #1</span>
              {badges.slice(0, 1).map((badge) => (
                <span key={badge.label} className={`nutri-menu-badge nutri-menu-badge--${badge.tone}`}>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="nutri-menu-card-reason nutri-menu-card-reason--compact">{homeReason}</p>
        <p className="nutri-menu-home-stats-line">
          <strong>{formatCalories(menu.calories)} kcal</strong>
          <span className="nutri-menu-home-stats-sep">·</span>
          <span>P {menu.protein}g</span>
          <span className="nutri-menu-home-stats-sep">·</span>
          <span>C {menu.carbs}g</span>
          <span className="nutri-menu-home-stats-sep">·</span>
          <span>F {menu.fat}g</span>
          {homePortion ? <span className="nutri-menu-home-stats-portion">{homePortion}</span> : null}
        </p>
        <div className="nutri-menu-card-actions nutri-menu-card-actions--home-compact">
          <button
            type="button"
            className="nutri-menu-btn nutri-menu-btn--primary"
            onClick={() => onSelect(menu)}
            disabled={loading}
          >
            {mealLabel ? `บันทึก${mealLabel}` : "บันทึกเมนูนี้"}
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
      </article>
    );
  }

  return (
    <article className="nutri-menu-card">
      <div className="nutri-menu-card-visual" aria-hidden>
        <span className="nutri-menu-card-visual-icon">{homeIcon}</span>
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
            <strong>{formatCalories(menu.calories)}</strong>
            <span>แคลอรี่</span>
          </div>
          <div className="nutri-menu-macro nutri-menu-macro--protein">
            <strong>{menu.protein}g</strong>
            <span>โปรตีน</span>
          </div>
          <div className="nutri-menu-macro nutri-menu-macro--carbs">
            <strong>{menu.carbs}g</strong>
            <span>คาร์บ</span>
          </div>
          <div className="nutri-menu-macro nutri-menu-macro--fat">
            <strong>{menu.fat}g</strong>
            <span>ไขมัน</span>
          </div>
        </div>

        {showPortion && menu.portionLabel ? (
          <p className="nutri-menu-card-detail">ขนาด: {menu.portionLabel}</p>
        ) : null}

        <div className="nutri-menu-card-actions">
          <button
            type="button"
            className="nutri-menu-btn nutri-menu-btn--ghost"
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? "ย่อรายละเอียด" : "ดูขนาดจาน"}
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
        {mealLabel ? <p className="nutri-menu-card-meal-hint">เพิ่มใน{mealLabel}</p> : null}
      </div>
    </article>
  );
}
