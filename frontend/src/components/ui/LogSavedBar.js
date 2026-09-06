import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function LogSavedBar({
  notice,
  onDismiss,
  onViewRecords,
  onGoHome,
}) {
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(onDismiss, 8000);
    return () => window.clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  const detail = notice.detail || `${notice.calories} kcal`;

  return createPortal(
    <div className="log-saved-bar" role="status" aria-live="polite">
      <div className="log-saved-bar-main">
        <strong className="log-saved-bar-title">บันทึกแล้ว ✓</strong>
        <span className="log-saved-bar-detail">
          {notice.name}
          {" · "}
          {detail}
        </span>
        <p className="log-saved-bar-next">ถัดไป: ดูเมนูแนะนำด้านล่าง หรือเลือกจากรายการ</p>
      </div>
      <div className="log-saved-bar-actions">
        <button type="button" className="log-saved-bar-btn log-saved-bar-btn--primary" onClick={onViewRecords}>
          ดูรายการ
        </button>
        <button type="button" className="log-saved-bar-btn" onClick={onGoHome}>
          หน้าหลัก
        </button>
      </div>
      <button type="button" className="log-saved-bar-close" onClick={onDismiss} aria-label="ปิด">
        ×
      </button>
    </div>,
    document.body,
  );
}
