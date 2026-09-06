import React, { useState } from "react";
import { HiPlus, HiShieldCheck, HiX } from "react-icons/hi";
import {
  EMPTY_FOOD_PREFERENCES,
  FOOD_ALLERGY_PRESETS,
  appendFoodPreference,
  normalizeFoodPreferences,
  removeFoodPreference,
  toggleFoodPreference,
} from "../../utils/foodPreferences";

const PRESET_ICONS = {
  ถั่ว: "🥜",
  นม: "🥛",
  ไข่: "🥚",
  กุ้ง: "🦐",
  ปลา: "🐟",
  ไก่: "🍗",
  ทะเล: "🦑",
  เนื้อ: "🥩",
};

export default function FoodAvoidanceEditor({
  preferences = EMPTY_FOOD_PREFERENCES,
  onChange,
  compact = false,
  showHint = true,
  idPrefix = "food-avoid",
}) {
  const [input, setInput] = useState("");
  const { dislikes } = normalizeFoodPreferences(preferences);

  const updatePreferences = (next) => {
    onChange?.(normalizeFoodPreferences(next));
  };

  const addFromInput = () => {
    const parts = input
      .split(/[,，;\n|]+/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (!parts.length) return;
    let next = preferences;
    parts.forEach((keyword) => {
      next = appendFoodPreference(next, "dislike", keyword);
    });
    updatePreferences(next);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addFromInput();
  };

  return (
    <div className={`food-avoid-card${compact ? " food-avoid-card--compact" : ""}`}>
      <header className="food-avoid-head">
        <span className="food-avoid-head-icon" aria-hidden>
          <HiShieldCheck size={compact ? 18 : 20} />
        </span>
        <div className="food-avoid-head-copy">
          <h3 className="food-avoid-title">อาหารที่ไม่ชอบหรือแพ้</h3>
          {showHint ? (
            <p className="food-avoid-hint">
              AI จะไม่แนะนำเมนูที่ชื่อมีคำเหล่านี้ — พิมพ์หลายรายการคั่นด้วยจุลภาค
            </p>
          ) : null}
        </div>
      </header>

      {dislikes.length > 0 ? (
        <div className="food-avoid-selected">
          <span className="food-avoid-selected-label">เลือกแล้ว {dislikes.length} รายการ</span>
          <div className="food-avoid-tags">
            {dislikes.map((item) => (
              <button
                key={item}
                type="button"
                className="food-avoid-tag"
                onClick={() => updatePreferences(removeFoodPreference(preferences, "dislike", item))}
                title="กดเพื่อลบ"
              >
                <span>{PRESET_ICONS[item] || "🚫"} {item}</span>
                <HiX size={14} aria-hidden />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="food-avoid-empty">
          <span className="food-avoid-empty-dot" aria-hidden />
          ยังไม่ได้เลือก — แตะด้านล่างหรือพิมพ์เอง
        </div>
      )}

      <div className="food-avoid-input-row">
        <input
          id={`${idPrefix}-input`}
          type="text"
          className="food-avoid-input"
          placeholder="เช่น ถั่ว, นม, ไก่"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="อาหารที่ไม่ชอบหรือแพ้"
        />
        <button
          type="button"
          className="food-avoid-add-btn"
          onClick={addFromInput}
          disabled={!input.trim()}
        >
          <HiPlus size={16} aria-hidden />
          <span>เพิ่ม</span>
        </button>
      </div>

      <div className="food-avoid-presets">
        <p className="food-avoid-presets-label">เลือกด่วน</p>
        <div className="food-avoid-preset-grid">
          {FOOD_ALLERGY_PRESETS.map((preset) => {
            const active = dislikes.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                className={`food-avoid-preset${active ? " is-active" : ""}`}
                onClick={() => updatePreferences(toggleFoodPreference(preferences, "dislike", preset))}
                aria-pressed={active}
              >
                <span className="food-avoid-preset-emoji" aria-hidden>
                  {PRESET_ICONS[preset] || "•"}
                </span>
                <span className="food-avoid-preset-label">{preset}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
