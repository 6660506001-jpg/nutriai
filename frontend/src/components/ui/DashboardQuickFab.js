import React, { useEffect, useState } from "react";
import { MdDinnerDining, MdDirectionsRun } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { getMealPeriodByTime } from "../../utils/logDisplay";

export default function DashboardQuickFab({ onLogFood, onLogActivity }) {
  const [open, setOpen] = useState(false);

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
                <span>บันทึกกิจกรรม</span>
              </button>
            ) : null}
            {onLogFood ? (
              <button
                type="button"
                className="dash-quick-fab-option dash-quick-fab-option--food"
                onClick={() => {
                  onLogFood(getMealPeriodByTime());
                  close();
                }}
              >
                <MdDinnerDining size={18} aria-hidden />
                <span>บันทึกอาหาร</span>
              </button>
            ) : null}
          </>
        ) : null}
        <button
          type="button"
          className="dash-quick-fab-main"
          aria-label={open ? "ปิดเมนูบันทึก" : "บันทึกอาหารหรือกิจกรรม"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <HiPlus size={24} aria-hidden />
        </button>
      </div>
    </div>
  );
}
