import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import {
  USER_GUIDE_INTRO,
  USER_GUIDE_STEPS,
  USER_GUIDE_TITLE,
} from "../../constants/userGuide";

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
            <p className="user-guide-kicker">NutriAI</p>
            <h2 id="user-guide-title" className="user-guide-title">{USER_GUIDE_TITLE}</h2>
            <p className="user-guide-intro">{USER_GUIDE_INTRO}</p>
          </div>
          <button type="button" className="user-guide-close" onClick={onClose} aria-label="ปิด">
            <HiX size={22} />
          </button>
        </header>

        <ol className="user-guide-quick-steps">
          {USER_GUIDE_STEPS.map((step, index) => (
            <li key={step.title} className="user-guide-quick-step">
              <span className="user-guide-quick-num" aria-hidden>{index + 1}</span>
              <div className="user-guide-quick-copy">
                <strong className="user-guide-quick-title">{step.title}</strong>
                <p className="user-guide-quick-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <footer className="user-guide-foot user-guide-foot--simple">
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
                บันทึกอาหาร
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
                บันทึกกิจกรรม
              </button>
            ) : null}
          </div>
          {onStartMeals ? (
            <button
              type="button"
              className="user-guide-start-btn user-guide-start-btn--meals"
              onClick={() => {
                onClose();
                onStartMeals();
              }}
            >
              ดูเมนูแนะนำ AI
            </button>
          ) : null}
          <button type="button" className="user-guide-close-btn" onClick={onClose}>
            เข้าใจแล้ว — เริ่มใช้งาน
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
