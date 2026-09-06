import React, { useState } from "react";
import {
  FOOD_DISLIKE_PRESETS,
  FOOD_LIKE_PRESETS,
  normalizeFoodPreferences,
} from "../../utils/foodPreferences";

export default function MenuRecommendationPrefs({
  preferences,
  onShuffle,
  disabled = false,
}) {
  const [likeInput, setLikeInput] = useState("");
  const [dislikeInput, setDislikeInput] = useState("");
  const { likes, dislikes } = normalizeFoodPreferences(preferences);

  const submit = (type, value) => {
    const keyword = value.trim();
    if (!keyword) return false;
    onShuffle({ type, keyword });
    if (type === "like") setLikeInput("");
    else setDislikeInput("");
    return true;
  };

  const handleKeyDown = (type, value, setter) => (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    submit(type, value);
    setter("");
  };

  return (
    <div className="dash-ai-menu-feedback">
      <p className="dash-ai-menu-feedback-title">ชอบ / ไม่ชอบอะไร? กรอกแล้วสุ่มเมนูใหม่</p>

      <div className="dash-ai-menu-feedback-inputs">
        <input
          type="text"
          className="dash-ai-menu-feedback-input"
          placeholder="ชอบ เช่น ไก่"
          value={likeInput}
          disabled={disabled}
          onChange={(e) => setLikeInput(e.target.value)}
          onKeyDown={handleKeyDown("like", likeInput, setLikeInput)}
        />
        <input
          type="text"
          className="dash-ai-menu-feedback-input"
          placeholder="ไม่ชอบ เช่น ปลา"
          value={dislikeInput}
          disabled={disabled}
          onChange={(e) => setDislikeInput(e.target.value)}
          onKeyDown={handleKeyDown("dislike", dislikeInput, setDislikeInput)}
        />
        <button
          type="button"
          className="dash-ai-menu-shuffle-btn"
          disabled={disabled}
          onClick={() => {
            if (dislikeInput.trim()) submit("dislike", dislikeInput);
            else if (likeInput.trim()) submit("like", likeInput);
            else onShuffle({ type: "shuffle" });
          }}
        >
          สุ่มใหม่
        </button>
      </div>

      <div className="dash-ai-menu-feedback-presets">
        {FOOD_LIKE_PRESETS.slice(0, 4).map((preset) => (
          <button
            key={`like-${preset}`}
            type="button"
            className="dash-ai-menu-feedback-chip dash-ai-menu-feedback-chip--like"
            disabled={disabled}
            onClick={() => onShuffle({ type: "like", keyword: preset })}
          >
            +ชอบ {preset}
          </button>
        ))}
        {FOOD_DISLIKE_PRESETS.slice(0, 4).map((preset) => (
          <button
            key={`dislike-${preset}`}
            type="button"
            className="dash-ai-menu-feedback-chip dash-ai-menu-feedback-chip--dislike"
            disabled={disabled}
            onClick={() => onShuffle({ type: "dislike", keyword: preset })}
          >
            −ไม่ชอบ {preset}
          </button>
        ))}
      </div>

      {(likes.length > 0 || dislikes.length > 0) && (
        <p className="dash-ai-menu-feedback-summary">
          {likes.length > 0 ? `ชอบ: ${likes.join(", ")}` : ""}
          {likes.length > 0 && dislikes.length > 0 ? " · " : ""}
          {dislikes.length > 0 ? `ไม่ชอบ: ${dislikes.join(", ")}` : ""}
        </p>
      )}
    </div>
  );
}
