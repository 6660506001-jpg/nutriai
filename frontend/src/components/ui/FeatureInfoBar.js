import React from "react";
import InfoTip from "./InfoTip";

export default function FeatureInfoBar({ items = [] }) {
  const visible = items.filter((item) => item?.tooltip);
  if (!visible.length) return null;

  return (
    <div className="feature-info-bar" role="region" aria-label="คำอธิบายระบบ">
      {visible.map((item) => (
        <div
          key={item.id}
          className={`feature-info-pill${item.highlight ? " is-highlight" : ""}`}
        >
          <span className="feature-info-pill-label">{item.label}</span>
          {item.value != null && item.value !== "" && (
            <strong className="feature-info-pill-value">{item.value}</strong>
          )}
          <InfoTip
            tooltip={item.tooltip}
            label={item.label}
            idPrefix={`feature-${item.id}`}
            size={14}
          />
        </div>
      ))}
    </div>
  );
}
