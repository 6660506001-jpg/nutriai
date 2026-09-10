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

  return (
    <article className={`nutri-menu-card${isHome ? " nutri-menu-card--home" : ""}`}>
      {!isHome ? (
        <div className="nutri-menu-card-visual" aria-hidden>
          <span className="nutri-menu-card-visual-icon">
            {menu.category === "lean-protein" ? "🥗" : menu.category === "soup" ? "🍲" : "🍽️"}
          </span>
          <span className="nutri-menu-card-index">#{index + 1}</span>
        </div>
      ) : (
        <div className="nutri-menu-card-home-icon" aria-hidden>
          {menu.category === "lean-protein" ? "🥗" : menu.category === "soup" ? "🍲" : "🍽️"}
        </div>
      )}

      <div className="nutri-menu-card-body">
        <div className="nutri-menu-card-top">
          <h3 className="nutri-menu-card-name">{menu.name}</h3>
          <div className="nutri-menu-card-badges">
            {isHome ? (
              <span className="nutri-menu-badge nutri-menu-badge--fit">อันดับ 1 จาก AI</span>
            ) : null}
            {badges.map((badge) => (
              <span key={badge.label} className={`nutri-menu-badge nutri-menu-badge--${badge.tone}`}>
                {badge.label}
              </span>
            ))}
          </div>
          {isHome ? (
            <p className="nutri-menu-card-reason">
              {menu.matchNote
                ? `AI: ${menu.matchNote} — ${getMenuPlainReason(menu)}`
                : getMenuPlainReason(menu)}
            </p>
          ) : null}
        </div>

        {isHome ? (
          <div className="nutri-menu-home-cal-block">
            <p className="nutri-menu-home-cal-label">แคลอรี่โดยประมาณ</p>
            <p className="nutri-menu-home-cal-value">
              <strong>{formatCalories(menu.calories)}</strong>
              <span> กิโลแคลอรี่</span>
            </p>
            {menu.portionLabel ? (
              <p className="nutri-menu-home-portion">ขนาด: {menu.portionLabel}</p>
            ) : null}
          </div>
        ) : null}

        <div className={`nutri-menu-card-macros${isHome ? " nutri-menu-card-macros--home" : ""}`}>
          {!isHome ? (
            <div className="nutri-menu-macro nutri-menu-macro--cal">
              <strong>{formatCalories(menu.calories)}</strong>
              <span>แคลอรี่</span>
            </div>
          ) : null}
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

        {!isHome && showPortion && menu.portionLabel ? (
          <p className="nutri-menu-card-detail">ขนาด: {menu.portionLabel}</p>
        ) : null}

        <div className={`nutri-menu-card-actions${isHome ? " nutri-menu-card-actions--home" : ""}`}>
          {!isHome ? (
            <button
              type="button"
              className="nutri-menu-btn nutri-menu-btn--ghost"
              onClick={() => setExpanded((open) => !open)}
            >
              {expanded ? "ย่อรายละเอียด" : "ดูขนาดจาน"}
            </button>
          ) : null}
          <button
            type="button"
            className="nutri-menu-btn nutri-menu-btn--primary"
            onClick={() => onSelect(menu)}
            disabled={loading}
          >
            {isHome ? "บันทึกเมนูนี้" : "เลือกเมนู"}
          </button>
          {onDislike ? (
            <button
              type="button"
              className="nutri-menu-btn nutri-menu-btn--text"
              onClick={() => onDislike(menu)}
              disabled={loading}
            >
              {isHome ? "ไม่ชอบเมนูนี้" : "ไม่ชอบ"}
            </button>
          ) : null}
        </div>
        {mealLabel ? (
          <p className="nutri-menu-card-meal-hint">
            {isHome ? `จะบันทึกใน${mealLabel}` : `เพิ่มใน${mealLabel}`}
          </p>
        ) : null}
      </div>
    </article>
  );
}
