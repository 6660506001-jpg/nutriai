import React from "react";
import { HiSparkles } from "react-icons/hi";
import { MdDirectionsRun, MdRestaurant } from "react-icons/md";

export default function HomeActionGrid({
  foodCals = 0,
  activityCals = 0,
  mealPoints = 0,
  onFood,
  onActivity,
  onMeals,
}) {
  return (
    <section className="home-action-grid" aria-label="ทำอะไรต่อ">
      <h3 className="home-action-grid-title">ทำอะไรต่อ?</h3>
      <div className="home-action-grid-cards">
        <button type="button" className="home-action-card home-action-card--food" onClick={onFood}>
          <span className="home-action-card-icon" aria-hidden>
            <MdRestaurant size={22} />
          </span>
          <span className="home-action-card-copy">
            <strong>บันทึกอาหาร</strong>
            <small>
              {foodCals > 0
                ? `วันนี้ ${foodCals} kcal${mealPoints > 0 ? ` · ${mealPoints} แต้ม` : ""}`
                : "ระบบเลือกมื้อตามเวลา → ค้นหา → บันทึก"}
            </small>
          </span>
        </button>

        <button type="button" className="home-action-card home-action-card--activity" onClick={onActivity}>
          <span className="home-action-card-icon" aria-hidden>
            <MdDirectionsRun size={22} />
          </span>
          <span className="home-action-card-copy">
            <strong>บันทึกกิจกรรม</strong>
            <small>
              {activityCals > 0 ? `เผาแล้ว ${activityCals} kcal` : "บันทึกการออกกำลังกาย"}
            </small>
          </span>
        </button>

        <button type="button" className="home-action-card home-action-card--meals" onClick={onMeals}>
          <span className="home-action-card-icon" aria-hidden>
            <HiSparkles size={22} />
          </span>
          <span className="home-action-card-copy">
            <strong>เมนูแนะนำ AI</strong>
            <small>ดูว่ามื้อถัดไปควรกินอะไร</small>
          </span>
        </button>
      </div>
    </section>
  );
}
