import React from "react";
import { HiExclamation } from "react-icons/hi";

export default function FoodAvoidanceWarning({
  keywords = [],
  variant = "inline",
  title = "อาจมีสิ่งที่คุณแพ้/หลีกเลี่ยง",
}) {
  if (!keywords.length) return null;

  return (
    <div className={`food-avoidance-warn food-avoidance-warn--${variant}`} role="alert">
      <HiExclamation className="food-avoidance-warn-icon" aria-hidden />
      <div className="food-avoidance-warn-copy">
        <strong>{title}</strong>
        <span>{keywords.join(", ")}</span>
      </div>
    </div>
  );
}
