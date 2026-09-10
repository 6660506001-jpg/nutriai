import React, { useEffect, useState } from "react";
import { MdCoffee, MdDinnerDining, MdDirectionsRun, MdLunchDining } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { MEAL_ORDER, getMealPeriodByTime, getMealShort } from "../../utils/logDisplay";

const MEAL_ICONS = {
  "มื้อเช้า": MdCoffee,
  "มื้อกลางวัน": MdLunchDining,
  "มื้อเย็น": MdDinnerDining,
};

export default function DashboardQuickFab({ onLogFood, onLogActivity }) {
  const [open, setOpen] = useState(false);
  const suggestedMeal = getMealPeriodByTime();

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={`dash-quick-fab${open ? " is-open" : ""}`}>
      {open ? (
        <button
          type="button"
          className="dash-quick-fab-backdrop"
          aria-label="ปิดเมนูบันทึก"
          onClick={close}
        />
      ) : null}
      <div className="dash-quick-fab-stack">
        {open ? (
          <>
            {onLogActivity ? (
              <button
                type="button"
                className="dash-quick-fab-option dash-quick-fab-option--activity"
                onClick={() => {
                  onLogActivity();
                  close();
                }}
              >
                <MdDirectionsRun size={18} aria-hidden />
                <span>กิจกรรม</span>
              </button>
            ) : null}
            {onLogFood
              ? [
                  ...MEAL_ORDER.filter((meal) => meal !== suggestedMeal),
                  suggestedMeal,
                ].map((meal) => {
                  const Icon = MEAL_ICONS[meal] || MdLunchDining;
                  const isSuggested = meal === suggestedMeal;
                  return (
                    <button
                      key={meal}
                      type="button"
                      className={`dash-quick-fab-option dash-quick-fab-option--meal${isSuggested ? " is-suggested" : ""}`}
                      aria-label={`บันทึก${meal}`}
                      onClick={() => {
                        onLogFood(meal);
                        close();
                      }}
                    >
                      <Icon size={18} aria-hidden />
                      <span>
                        {getMealShort(meal)}
                        {isSuggested ? <small>ตอนนี้</small> : null}
                      </span>
                    </button>
                  );
                })
              : null}
          </>
        ) : null}
        <button
          type="button"
          className="dash-quick-fab-main"
          aria-label={open ? "ปิดเมนูบันทึก" : "บันทึกมื้ออาหารหรือกิจกรรม"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <HiPlus size={24} aria-hidden />
        </button>
      </div>
    </div>
  );
}
