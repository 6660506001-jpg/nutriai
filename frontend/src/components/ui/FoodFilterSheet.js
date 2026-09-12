import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import { MEAL_ORDER, getMealShort } from "../../utils/logDisplay";

const GI_OPTIONS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "low", label: "GI ต่ำ" },
  { id: "mid", label: "GI ปานกลาง" },
  { id: "high", label: "GI สูง" },
];

const KCAL_OPTIONS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "200", label: "≤ 200 kcal" },
  { id: "400", label: "≤ 400 kcal" },
  { id: "600", label: "≤ 600 kcal" },
];

export default function FoodFilterSheet({
  open,
  onClose,
  filters,
  onChange,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const setFilter = (key, value) => onChange({ ...filters, [key]: value });

  return createPortal(
    <div className="nutri-filter-sheet-overlay" onClick={onClose} role="presentation">
      <div
        className="nutri-filter-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-filter-title"
      >
        <header className="nutri-filter-sheet-head">
          <h2 id="food-filter-title">ตัวกรอง</h2>
          <button type="button" className="nutri-filter-sheet-close" onClick={onClose} aria-label="ปิด">
            <HiX size={22} />
          </button>
        </header>

        <div className="nutri-filter-sheet-body">
          <section className="nutri-filter-group">
            <h3>มื้ออาหาร</h3>
            <div className="nutri-filter-chips">
              {MEAL_ORDER.map((meal) => (
                <button
                  key={meal}
                  type="button"
                  className={`nutri-filter-chip${filters.meal === meal ? " is-active" : ""}`}
                  onClick={() => setFilter("meal", meal)}
                >
                  {getMealShort(meal)}
                </button>
              ))}
            </div>
          </section>

          <section className="nutri-filter-group">
            <h3>พลังงานสูงสุด</h3>
            <div className="nutri-filter-chips">
              {KCAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`nutri-filter-chip${filters.maxKcal === opt.id ? " is-active" : ""}`}
                  onClick={() => setFilter("maxKcal", opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section className="nutri-filter-group">
            <h3>ดัชนี GI</h3>
            <div className="nutri-filter-chips">
              {GI_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`nutri-filter-chip${filters.giLevel === opt.id ? " is-active" : ""}`}
                  onClick={() => setFilter("giLevel", opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="nutri-filter-sheet-foot">
          <button
            type="button"
            className="nutri-filter-reset"
            onClick={() => onChange({ meal: filters.meal, maxKcal: "all", giLevel: "all" })}
          >
            รีเซ็ต
          </button>
          <button type="button" className="nutri-filter-apply" onClick={onClose}>
            ใช้ตัวกรอง
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export function applyFoodFilters(items, filters) {
  let list = [...(items || [])];
  const maxKcal = Number(filters.maxKcal);
  if (filters.maxKcal && filters.maxKcal !== "all" && !Number.isNaN(maxKcal)) {
    list = list.filter((item) => (Number(item.calories) || 0) <= maxKcal);
  }
  if (filters.giLevel && filters.giLevel !== "all") {
    list = list.filter((item) => {
      const gi = Number(item.gi ?? item.giScore);
      if (Number.isNaN(gi)) return filters.giLevel === "mid";
      if (filters.giLevel === "low") return gi <= 55;
      if (filters.giLevel === "high") return gi >= 70;
      return gi > 55 && gi < 70;
    });
  }
  return list;
}
