import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import FoodAvoidanceEditor from "./FoodAvoidanceEditor";
import { EMPTY_FOOD_PREFERENCES, hasFoodAvoidanceConfigured, normalizeFoodPreferences } from "../../utils/foodPreferences";

export default function FoodPreferencesModal({ open, initialPreferences, onSave, onSkip }) {
  const [preferences, setPreferences] = useState(EMPTY_FOOD_PREFERENCES);

  useEffect(() => {
    if (!open) return;
    setPreferences(normalizeFoodPreferences(initialPreferences));
  }, [open, initialPreferences]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onSkip?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onSkip]);

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
    <div className="user-guide-overlay" onClick={onSkip} role="presentation">
      <div
        className="user-guide-modal user-guide-modal--compact food-prefs-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-prefs-title"
      >
        <header className="user-guide-head">
          <div className="user-guide-head-text">
            <p className="user-guide-kicker">ตั้งค่าเริ่มต้น</p>
            <h2 id="food-prefs-title" className="user-guide-title">อาหารที่หลีกเลี่ยง</h2>
            <p className="user-guide-intro">
              บอกสิ่งที่ไม่ชอบหรือแพ้ — AI จะกรองเมนูแนะนำให้ตั้งแต่แรก
            </p>
          </div>
          <button type="button" className="user-guide-close" onClick={onSkip} aria-label="ปิด">
            <HiX size={22} />
          </button>
        </header>

        <FoodAvoidanceEditor
          preferences={preferences}
          onChange={setPreferences}
          compact
          showHint
          idPrefix="food-prefs-modal"
        />

        <footer className="user-guide-foot user-guide-foot--simple">
          <button
            type="button"
            className="user-guide-start-btn"
            onClick={() => onSave?.(normalizeFoodPreferences(preferences))}
          >
            {hasFoodAvoidanceConfigured(preferences) ? "บันทึกและเริ่มใช้งาน" : "บันทึก (ยังไม่เลือกรายการ)"}
          </button>
          <button type="button" className="user-guide-close-btn" onClick={onSkip}>
            ข้าม — ไม่มีอะไรแพ้
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
