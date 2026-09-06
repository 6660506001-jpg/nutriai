import React from "react";
import { HiSparkles, HiX } from "react-icons/hi";

export default function PostSaveMenuSuggestions({
  headline,
  focusDetail,
  calRange,
  menus = [],
  loading = false,
  onSelectMenu,
  onDismiss,
  onViewAllMeals,
}) {
  if (!loading && menus.length === 0) return null;

  return (
    <section className="post-save-menus" aria-live="polite" aria-label="เมนูแนะนำมื้อถัดไป">
      <header className="post-save-menus-head">
        <div className="post-save-menus-head-copy">
          <p className="post-save-menus-kicker">
            <HiSparkles aria-hidden />
            เมนูแนะนำมื้อถัดไป
          </p>
          {headline ? <p className="post-save-menus-headline">{headline}</p> : null}
          {focusDetail ? <p className="post-save-menus-focus">{focusDetail}</p> : null}
          {calRange ? <p className="post-save-menus-range">ช่วงแนะนำ ~{calRange} kcal</p> : null}
        </div>
        {onDismiss ? (
          <button type="button" className="post-save-menus-dismiss" onClick={onDismiss} aria-label="ปิด">
            <HiX size={18} />
          </button>
        ) : null}
      </header>

      {loading ? (
        <p className="post-save-menus-loading">กำลังคัดเมนูที่เหมาะกับคุณ...</p>
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
                  <small>
                    {menu.calories} kcal
                    {menu.protein ? ` · โปรตีน ${menu.protein}g` : ""}
                    {menu.matchNote ? ` · ${menu.matchNote}` : ""}
                  </small>
                </span>
                <span className="post-save-menu-cta">เลือก</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {onViewAllMeals && !loading ? (
        <button type="button" className="post-save-menus-more" onClick={onViewAllMeals}>
          ดูเมนูแนะนำเพิ่ม →
        </button>
      ) : null}
    </section>
  );
}
