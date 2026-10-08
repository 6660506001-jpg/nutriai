import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { playCelebrationSound } from "../../utils/celebrationSound";
import SparkBurst from "./SparkBurst";

export default function LogSavedBar({
  notice,
  onDismiss,
  onAddMore,
  onViewNext,
  onGoHome,
  addLabel = "เพิ่มอีก",
  nextLabel = "ดูเมนูแนะนำ",
}) {
  useEffect(() => {
    if (!notice) return undefined;
    playCelebrationSound();
    const timer = window.setTimeout(onDismiss, 16000);
    return () => window.clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  const detail = notice.detail || `${notice.calories} kcal`;

  return createPortal(
    <div className="log-saved-bar" role="status" aria-live="polite">
      <SparkBurst playKey={notice.name + notice.calories} />
      <div className="log-saved-bar-main">
        <strong className="log-saved-bar-title">บันทึกแล้ว ✓</strong>
        <span className="log-saved-bar-detail">
          {notice.name}
          {" · "}
          {detail}
        </span>
        <p className="log-saved-bar-next">ทำอะไรต่อ?</p>
      </div>
      <div className="log-saved-bar-actions">
        {onAddMore ? (
          <button type="button" className="log-saved-bar-btn log-saved-bar-btn--primary" onClick={onAddMore}>
            {addLabel}
          </button>
        ) : null}
        {onViewNext ? (
          <button type="button" className="log-saved-bar-btn" onClick={onViewNext}>
            {nextLabel}
          </button>
        ) : null}
        {onGoHome ? (
          <button type="button" className="log-saved-bar-btn" onClick={onGoHome}>
            หน้าหลัก
          </button>
        ) : null}
      </div>
      <button type="button" className="log-saved-bar-close" onClick={onDismiss} aria-label="ปิด">
        ×
      </button>
    </div>,
    document.body,
  );
}
