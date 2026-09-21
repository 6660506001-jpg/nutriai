import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiX, HiSparkles } from "react-icons/hi";
import { MdRestaurant, MdDirectionsRun, MdMenuBook, MdHistory } from "react-icons/md";
import {
  USER_GUIDE_INTRO,
  USER_GUIDE_STEPS,
  USER_GUIDE_TITLE,
} from "../../constants/userGuide";

const STEP_ICONS = {
  food: MdRestaurant,
  activity: MdDirectionsRun,
  meals: MdMenuBook,
  history: MdHistory,
};

export default function UserGuideModal({ open, onClose, onStartFood, onStartActivity, onStartMeals }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="user-guide-overlay" onClick={onClose} role="presentation">
      <div
        className="user-guide-modal user-guide-modal--compact"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-guide-title"
      >
        <header className="user-guide-head">
          <div className="user-guide-head-text">
            <p className="user-guide-kicker">
              <HiSparkles aria-hidden />
              NutriAI
            </p>
            <h2 id="user-guide-title" className="user-guide-title">{USER_GUIDE_TITLE}</h2>
            <p className="user-guide-intro">{USER_GUIDE_INTRO}</p>
          </div>
          <button type="button" className="user-guide-close" onClick={onClose} aria-label="ปิด">
            <HiX size={20} />
          </button>
        </header>

        <ol className="user-guide-quick-steps">
          {USER_GUIDE_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.id] || MdRestaurant;
            return (
              <li key={step.id || step.title} className={`user-guide-quick-step user-guide-quick-step--${step.id}`}>
                <span className="user-guide-quick-icon-wrap" aria-hidden>
                  <Icon size={18} />
                </span>
                <div className="user-guide-quick-copy">
                  <strong className="user-guide-quick-title">
                    <span className="user-guide-quick-index">{index + 1}</span>
                    {step.title}
                  </strong>
                  <p className="user-guide-quick-text">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <footer className="user-guide-foot user-guide-foot--simple">
          <p className="user-guide-foot-label">เริ่มจากตรงนี้</p>
          <div className="user-guide-start-actions">
            {onStartFood ? (
              <button
                type="button"
                className="user-guide-start-btn"
                onClick={() => {
                  onClose();
                  onStartFood();
                }}
              >
                <MdRestaurant size={18} aria-hidden />
                อาหาร
              </button>
            ) : null}
            {onStartActivity ? (
              <button
                type="button"
                className="user-guide-start-btn user-guide-start-btn--activity"
                onClick={() => {
                  onClose();
                  onStartActivity();
                }}
              >
                <MdDirectionsRun size={18} aria-hidden />
                กิจกรรม
              </button>
            ) : null}
            {onStartMeals ? (
              <button
                type="button"
                className="user-guide-start-btn user-guide-start-btn--meals"
                onClick={() => {
                  onClose();
                  onStartMeals();
                }}
              >
                <MdMenuBook size={18} aria-hidden />
                เมนู AI
              </button>
            ) : null}
          </div>
          <button type="button" className="user-guide-close-btn" onClick={onClose}>
            เข้าใจแล้ว — เริ่มใช้งาน
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
