import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import { Colors } from "../../constants/colors";
import {
  PLATE_SIZE_OPTIONS,
  buildFoodLogEntry,
  getGlassSizeOptions,
  getPortionTypesForFood,
  resolveServingMeta,
  stripPortionSuffix,
} from "../../utils/portionParser";
import { canSaveFoodEntry, isUnverifiedFoodEntry } from "../../utils/foodEstimator";
import { DRINK_SWEETNESS_OPTIONS, isDrinkFood, supportsDrinkSweetness } from "../../utils/drinkSweetness";
import { getMatchingAvoidanceKeywords } from "../../utils/foodPreferences";
import FoodAvoidanceWarning from "./FoodAvoidanceWarning";
import { styles } from "../../styles/appStyles";

const DEFAULT_SELECTION = {
  type: "plate",
  amount: "1",
  plateSize: "normal",
};

export default function FoodPortionModal({
  food,
  mealPeriod,
  onClose,
  onConfirm,
  foodPreferences,
}) {
  const [portionType, setPortionType] = useState(DEFAULT_SELECTION.type);
  const [amount, setAmount] = useState(DEFAULT_SELECTION.amount);
  const [plateSize, setPlateSize] = useState(DEFAULT_SELECTION.plateSize);
  const [sweetness, setSweetness] = useState("100");

  useEffect(() => {
    if (!food) return;
    setSweetness("100");
    if (isDrinkFood(food)) {
      setPortionType("glass");
      setAmount("1");
      setPlateSize("normal");
      return;
    }
    const meta = resolveServingMeta(food);
    if (meta) {
      setPortionType(meta.type);
      setAmount("1");
      setPlateSize(DEFAULT_SELECTION.plateSize);
      return;
    }
    setPortionType(DEFAULT_SELECTION.type);
    setAmount(DEFAULT_SELECTION.amount);
    setPlateSize(DEFAULT_SELECTION.plateSize);
  }, [food]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!food) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [food]);

  const selection = useMemo(() => {
    const base = { type: portionType, amount, plateSize };
    if (supportsDrinkSweetness(food)) {
      return { ...base, sweetness };
    }
    return base;
  }, [food, portionType, amount, plateSize, sweetness]);

  const previewEntry = useMemo(() => {
    if (!food) return null;
    return buildFoodLogEntry(food, selection);
  }, [food, selection]);

  const displayName = food
    ? (food.baseName || stripPortionSuffix(food.name) || food.name)
    : "";

  const avoidanceKeywords = useMemo(
    () => getMatchingAvoidanceKeywords(food || displayName, foodPreferences),
    [food, displayName, foodPreferences],
  );

  if (!food) return null;

  const servingMeta = resolveServingMeta(food);
  const portionTypes = getPortionTypesForFood(food);
  const nutritionUnverified = isUnverifiedFoodEntry(food);
  const canSave = canSaveFoodEntry(food);
  const showSweetness = supportsDrinkSweetness(food);
  const isDrink = isDrinkFood(food);
  const glassSizeOptions = isDrink ? getGlassSizeOptions(food) : [];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (portionType === "gram") {
      const grams = Number(amount);
      if (!grams || grams <= 0) {
        alert("กรุณากรอกปริมาณเป็นกรัม");
        return;
      }
      if (grams > 5000) {
        alert("ปริมาณไม่ควรเกิน 5000g");
        return;
      }
    }

    if (portionType === "tbsp") {
      const tbsp = Number(amount);
      if (!tbsp || tbsp <= 0) {
        alert("กรุณากรอกจำนวนทัพพี");
        return;
      }
      if (tbsp > 50) {
        alert("จำนวนทัพพีไม่ควรเกิน 50");
        return;
      }
    }

    if (portionType === "piece" || portionType === "cup") {
      const qty = Number(amount);
      const unitLabel = servingMeta?.unitLabel || (portionType === "cup" ? "ถ้วย" : "ลูก");
      if (!qty || qty <= 0) {
        alert(`กรุณากรอกจำนวน${unitLabel}`);
        return;
      }
      if (qty > 20) {
        alert("จำนวนไม่ควรเกิน 20");
        return;
      }
    }

    const entry = buildFoodLogEntry(food, selection);
    if (!canSaveFoodEntry(entry)) {
      alert("ไม่สามารถคำนวนเมนูอาหารนี้ได้");
      return;
    }

    if (avoidanceKeywords.length > 0) {
      const ok = window.confirm(
        `เมนูนี้อาจมี "${avoidanceKeywords.join(", ")}" ซึ่งคุณตั้งว่าแพ้/หลีกเลี่ยง\n\nต้องการบันทึกต่อหรือไม่?`,
      );
      if (!ok) return;
    }

    onConfirm(entry);
  };

  const activeType = portionTypes.find((option) => option.id === portionType);

  return createPortal(
    <div className="activity-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="activity-modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-portion-modal-title"
      >
        <div className="activity-modal-head">
          <div>
            <div id="food-portion-modal-title" style={styles.activityModalTitle}>
              บันทึกอาหาร
            </div>
            <div style={styles.activityModalSubtitle}>
              {displayName}
              {mealPeriod ? ` · ${mealPeriod.replace("มื้อ", "")}` : ""}
            </div>
          </div>
          <button type="button" className="activity-modal-close" onClick={onClose} aria-label="ปิด">
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {avoidanceKeywords.length > 0 ? (
            <FoodAvoidanceWarning
              keywords={avoidanceKeywords}
              variant="modal"
              title="คำเตือน: เมนูนี้อาจมีสิ่งที่คุณแพ้/หลีกเลี่ยง"
            />
          ) : null}
          {nutritionUnverified ? (
            <div className="food-portion-unverified-note">
              {canSave
                ? "ข้อมูลโภชนาการเป็นค่าประมาณ — การวิเคราะห์มื้ออาจไม่แม่นยำ"
                : "ไม่สามารถคำนวนเมนูอาหารนี้ได้ — กรุณาเลือกจากฐานข้อมูลหรือพิมพ์ชื่อเมนูที่รู้จัก"}
            </div>
          ) : null}
          {isDrink ? (
            <div style={styles.customFoodField}>
              <label style={styles.customFoodLabel}>หน่วยปริมาณ</label>
              <div style={styles.portionTypeGroup}>
                <button type="button" style={styles.activeModeBtn} aria-pressed="true">
                  แก้ว
                </button>
              </div>
              <p style={styles.portionTypeHint}>เลือกขนาดแก้วด้านล่าง</p>
            </div>
          ) : (
          <div style={styles.customFoodField}>
            <label style={styles.customFoodLabel}>หน่วยปริมาณ</label>
            <div style={styles.portionTypeGroup}>
              {portionTypes.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setPortionType(option.id);
                    if (option.id === "gram") setAmount(String(food.defaultServingGrams || 150));
                    if (option.id === "tbsp") setAmount("1");
                    if (option.id === "piece" || option.id === "cup") setAmount("1");
                  }}
                  style={portionType === option.id ? styles.activeModeBtn : styles.inactiveModeBtn}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {activeType?.hint && (
              <p style={styles.portionTypeHint}>{activeType.hint}</p>
            )}
          </div>
          )}

          {(isDrink || portionType === "glass") && (
            <div style={styles.customFoodField}>
              <label style={styles.customFoodLabel}>ขนาดแก้ว</label>
              <div className="meal-tab-row">
                {glassSizeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPlateSize(option.id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "10px",
                      border: "none",
                      background: plateSize === option.id ? Colors.primary : Colors.bgSoft,
                      color: plateSize === option.id ? "white" : Colors.textDark,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p style={styles.portionTypeHint}>
                {glassSizeOptions.map((option) => `${option.label} ~${option.grams}ml`).join(" · ")}
              </p>
            </div>
          )}

          {portionType === "plate" && (
            <div style={styles.customFoodField}>
              <label style={styles.customFoodLabel}>ขนาดจาน</label>
              <div className="meal-tab-row">
                {PLATE_SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPlateSize(option.id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "10px",
                      border: "none",
                      background: plateSize === option.id ? Colors.primary : Colors.bgSoft,
                      color: plateSize === option.id ? "white" : Colors.textDark,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p style={styles.portionTypeHint}>
                เล็ก ~100g · ปกติ ~150g · พิเศษ ~220g
              </p>
            </div>
          )}

          {portionType === "tbsp" && (
            <div style={styles.customFoodField}>
              <label style={styles.customFoodLabel} htmlFor="food-portion-tbsp">
                จำนวนทัพพี *
              </label>
              <input
                id="food-portion-tbsp"
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                style={styles.customFoodInput}
                placeholder="เช่น 1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                autoFocus
              />
            </div>
          )}

          {(portionType === "piece" || portionType === "cup") && (
            <div style={styles.customFoodField}>
              <label style={styles.customFoodLabel} htmlFor="food-portion-piece">
                จำนวน{servingMeta?.unitLabel || (portionType === "cup" ? "ถ้วย" : "ลูก")} *
              </label>
              <input
                id="food-portion-piece"
                type="number"
                min="0.5"
                max="20"
                step="0.5"
                style={styles.customFoodInput}
                placeholder="เช่น 1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                autoFocus
              />
              {servingMeta?.hint && (
                <p style={styles.portionTypeHint}>{servingMeta.hint}</p>
              )}
            </div>
          )}

          {portionType === "gram" && (
            <div style={styles.customFoodField}>
              <label style={styles.customFoodLabel} htmlFor="food-portion-gram">
                ปริมาณ (g) *
              </label>
              <input
                id="food-portion-gram"
                type="number"
                min="1"
                max="5000"
                step="1"
                style={styles.customFoodInput}
                placeholder="เช่น 150"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                autoFocus
              />
            </div>
          )}

          {showSweetness && (
            <div style={styles.customFoodField}>
              <label style={styles.customFoodLabel}>ระดับความหวาน</label>
              <div className="meal-tab-row food-sweetness-row">
                {DRINK_SWEETNESS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSweetness(option.id)}
                    style={{
                      flex: 1,
                      padding: "8px 6px",
                      borderRadius: "10px",
                      border: "none",
                      background: sweetness === option.id ? Colors.primary : Colors.bgSoft,
                      color: sweetness === option.id ? "white" : Colors.textDark,
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.82rem",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p style={styles.portionTypeHint}>
                ค่าในฐานข้อมูล = หวาน 100% · ลดน้ำตาลแล้วแคลและคาร์บจะลดลง
              </p>
            </div>
          )}

          {previewEntry && (
            <div style={styles.activityModalPreview}>
              <span style={styles.activityModalPreviewLabel}>
                {nutritionUnverified ? "แคลอรี่ (ประมาณ · ไม่ยืนยัน)" : "แคลอรี่ (ประมาณ)"}
              </span>
              <span style={styles.activityModalPreviewValue}>{previewEntry.calories} kcal</span>
              <div style={styles.portionPreviewMacros}>
                P {previewEntry.protein}g · C {previewEntry.carbs}g · F {previewEntry.fat}g
              </div>
              {(previewEntry.portionLabel || previewEntry.sweetnessLabel) && (
                <div style={styles.portionPreviewNote}>
                  {[previewEntry.portionLabel, previewEntry.sweetnessLabel].filter(Boolean).join(" · ")}
                </div>
              )}
            </div>
          )}

          <div style={styles.activityModalActions}>
            <button type="button" style={styles.customFoodCancelBtn} onClick={onClose}>
              ยกเลิก
            </button>
            <button
              type="submit"
              style={styles.customFoodSubmitBtn}
              disabled={!canSave}
            >
              {canSave ? "บันทึกอาหาร" : "บันทึกไม่ได้"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
