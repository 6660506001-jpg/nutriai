import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import {
  ACTIVITY_INTENSITY_OPTIONS,
  buildActivityLogEntry,
  calculateActivityCalories,
} from "../../utils/activityCalculator";
import { styles } from "../../styles/appStyles";

export default function ActivityLogModal({
  activity,
  userWeight,
  mealPeriod,
  suggestedDurationMinutes,
  suggestedIntensity,
  onClose,
  onConfirm,
}) {
  const [durationMinutes, setDurationMinutes] = useState(
    String(suggestedDurationMinutes || 30),
  );
  const [intensity, setIntensity] = useState(suggestedIntensity || "moderate");

  useEffect(() => {
    if (!activity) return;
    setDurationMinutes(String(suggestedDurationMinutes || activity.defaultDurationMinutes || 30));
    setIntensity(suggestedIntensity || activity.defaultIntensity || "moderate");
  }, [activity, suggestedDurationMinutes, suggestedIntensity]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!activity) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activity]);

  const previewCalories = useMemo(() => {
    if (!activity) return 0;
    const minutes = Number(durationMinutes);
    if (!minutes || minutes <= 0) return 0;
    return calculateActivityCalories({
      activity,
      durationMinutes: minutes,
      intensity,
      userWeight,
    });
  }, [activity, durationMinutes, intensity, userWeight]);

  if (!activity) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const minutes = Number(durationMinutes);
    if (!minutes || minutes <= 0) {
      alert("กรุณากรอกระยะเวลา (นาที)");
      return;
    }
    if (minutes > 600) {
      alert("ระยะเวลาไม่ควรเกิน 600 นาที");
      return;
    }
    onConfirm(buildActivityLogEntry({
      activity,
      durationMinutes: minutes,
      intensity,
      userWeight,
    }));
  };

  return createPortal(
    <div className="activity-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="activity-modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
      >
        <div className="activity-modal-head">
          <div>
            <div id="activity-modal-title" style={styles.activityModalTitle}>
              บันทึกกิจกรรม
            </div>
            <div style={styles.activityModalSubtitle}>
              {activity.name}
              {mealPeriod ? ` · ${mealPeriod.replace("มื้อ", "")}` : ""}
            </div>
          </div>
          <button type="button" className="activity-modal-close" onClick={onClose} aria-label="ปิด">
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.customFoodField}>
            <label style={styles.customFoodLabel} htmlFor="activity-duration">
              ระยะเวลา (นาที) *
            </label>
            <input
              id="activity-duration"
              type="number"
              min="1"
              max="600"
              step="1"
              style={styles.customFoodInput}
              placeholder="เช่น 30"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              autoFocus
            />
          </div>

          <div style={styles.customFoodField}>
            <label style={styles.customFoodLabel} htmlFor="activity-intensity">
              ระดับความเหนื่อย
            </label>
            <select
              id="activity-intensity"
              style={styles.activityIntensitySelect}
              value={intensity}
              onChange={(event) => setIntensity(event.target.value)}
            >
              {ACTIVITY_INTENSITY_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} — {option.hint}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.activityModalPreview}>
            <span style={styles.activityModalPreviewLabel}>แคลอรี่ที่เผา (ประมาณ)</span>
            <span style={styles.activityModalPreviewValue}>{previewCalories} kcal</span>
          </div>

          <div style={styles.activityModalActions}>
            <button type="button" style={styles.customFoodCancelBtn} onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" style={styles.customFoodSubmitBtn}>
              บันทึกกิจกรรม
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
