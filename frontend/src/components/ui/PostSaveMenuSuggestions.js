import React from "react";
import { HiSparkles, HiX } from "react-icons/hi";

export default function PostSaveMenuSuggestions({
  headline,
  menus = [],
  loading = false,
  onSelectMenu,
  onDismiss,
  onViewAllMeals,
  onAddMore,
}) {
  if (!loading && menus.length === 0) return null;

  return (
    <section className="post-save-menus" aria-live="polite" aria-label="ขั้นถัดไป">
      <header className="post-save-menus-head">
        <div className="post-save-menus-head-copy">
          <p className="post-save-menus-kicker">
            <HiSparkles aria-hidden />
            ขั้นถัดไป
          </p>
          <p className="post-save-menus-headline">
            {headline || "เพิ่มอาหารต่อ หรือเลือกเมนูแนะนำ"}
          </p>
        </div>
        {onDismiss ? (
          <button type="button" className="post-save-menus-dismiss" onClick={onDismiss} aria-label="ปิด">
            <HiX size={18} />
          </button>
        ) : null}
      </header>

      {loading ? (
        <p className="post-save-menus-loading">กำลังคัดเมนู...</p>
      ) : (
        <ul className="post-save-menus-list">
          {menus.map((menu, index) => (
            <li key={`${menu.id || menu.name}-${index}`}>
              <button
                type="button"
                className="post-save-menu-item"
                onClick={() => onSelectMenu?.(menu)}
              >
                <span className="post-save-menu-index">{index + 1}</span>
                <span className="post-save-menu-copy">
                  <strong>{menu.name}</strong>
                  <small>{menu.calories} kcal{menu.protein ? ` · โปรตีน ${menu.protein}g` : ""}</small>
                </span>
                <span className="post-save-menu-cta">เลือก</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading ? (
        <div className="post-save-menus-footer">
          {onAddMore ? (
            <button type="button" className="post-save-menus-more" onClick={onAddMore}>
              เพิ่มอาหารอีก
            </button>
          ) : null}
          {onViewAllMeals ? (
            <button type="button" className="post-save-menus-more" onClick={onViewAllMeals}>
              ดูเมนูเพิ่ม
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
