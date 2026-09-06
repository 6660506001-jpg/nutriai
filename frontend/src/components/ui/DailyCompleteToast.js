import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { renderStars } from "../../utils/mealRewards";

export default function DailyCompleteToast({ payload, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 5500);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  if (!payload) return null;

  return createPortal(
    <div className="daily-complete-toast-wrap" role="status" aria-live="polite">
      <div className={`daily-complete-toast daily-complete-toast--${payload.tone}`}>
        <button type="button" className="daily-complete-toast-close" onClick={onClose} aria-label="ปิด">
          ×
        </button>
        <div className="daily-complete-toast-stars" aria-hidden>
          {renderStars(payload.stars).map(({ filled, key }) => (
            <span key={key} className={`reward-star${filled ? " is-filled" : ""}`}>★</span>
          ))}
        </div>
        <p className="daily-complete-toast-title">{payload.message}</p>
        {payload.hint ? <p className="daily-complete-toast-hint">{payload.hint}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
