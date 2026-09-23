import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import {
  ACTIVITY_INTENSITY_OPTIONS,
  MAX_ACTIVITY_DURATION_MINUTES,
  buildActivityLogEntry,
  calculateActivityCalories,
  combineDurationMinutes,
  formatActivityDuration,
  splitDurationParts,
} from "../../utils/activityCalculator";
import { styles } from "../../styles/appStyles";

function durationStateFromMinutes(totalMinutes) {
  const { hours, minutes } = splitDurationParts(totalMinutes || 30);
  return {
    hours: hours > 0 ? String(hours) : "0",
    minutes: String(minutes),
  };
}

export default function ActivityLogModal({
  activity,
  userWeight,
  mealPeriod,
  suggestedDurationMinutes,
  suggestedIntensity,
  onClose,
  onConfirm,
}) {
  const [durationHours, setDurationHours] = useState("0");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [intensity, setIntensity] = useState(suggestedIntensity || "moderate");

  useEffect(() => {
    if (!activity) return;
    const next = durationStateFromMinutes(
      suggestedDurationMinutes || activity.defaultDurationMinutes || 30,
    );
    setDurationHours(next.hours);
    setDurationMinutes(next.minutes);
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

  const totalMinutes = combineDurationMinutes(durationHours, durationMinutes);

  const previewCalories = useMemo(() => {
    if (!activity) return 0;
    if (!totalMinutes || totalMinutes <= 0) return 0;
    return calculateActivityCalories({
      activity,
      durationMinutes: totalMinutes,
      intensity,
      userWeight,
    });
  }, [activity, totalMinutes, intensity, userWeight]);

  if (!activity) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!totalMinutes || totalMinutes <= 0) {
      alert("กรุณากรอกระยะเวลาเป็นชั่วโมงหรือนาที");
      return;
    }
    if (Number(durationMinutes) > 59) {
      alert("นาทีต้องอยู่ระหว่าง 0–59 ถ้าเกิน 60 นาทีให้ใส่ที่ช่องชั่วโมง");
      return;
    }
    if (totalMinutes > MAX_ACTIVITY_DURATION_MINUTES) {
      alert("ระยะเวลาไม่ควรเกิน 10 ชั่วโมง");
      return;
    }
    onConfirm(buildActivityLogEntry({
      activity,
      durationMinutes: totalMinutes,
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
            <span style={styles.customFoodLabel}>ระยะเวลา *</span>
            <div style={styles.activityDurationRow}>
              <div>
                <label style={styles.customFoodLabel} htmlFor="activity-duration-hours">
                  ชั่วโมง
                </label>
                <input
                  id="activity-duration-hours"
                  type="number"
                  min="0"
                  max="10"
                  step="1"
                  inputMode="numeric"
                  style={styles.customFoodInput}
                  placeholder="0"
                  value={durationHours}
                  onChange={(event) => setDurationHours(event.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label style={styles.customFoodLabel} htmlFor="activity-duration-minutes">
                  นาที
                </label>
                <input
                  id="activity-duration-minutes"
                  type="number"
                  min="0"
                  max="59"
                  step="1"
                  inputMode="numeric"
                  style={styles.customFoodInput}
                  placeholder="เช่น 30"
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(event.target.value)}
                />
              </div>
            </div>
            {totalMinutes > 0 ? (
              <p style={styles.activityDurationHint}>รวม {formatActivityDuration(totalMinutes)}</p>
            ) : null}
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
