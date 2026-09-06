import React from "react";
import InfoTip from "./InfoTip";

export default function MetricCard({
  label,
  value,
  unit,
  tooltip,
  variant = "default",
  compact = false,
}) {
  return (
    <article className={`nutri-metric-card nutri-metric-card--${variant}${compact ? " is-compact" : ""}`}>
      <div className="nutri-metric-card-head">
        <span className="nutri-metric-card-label">{label}</span>
        {tooltip ? (
          <InfoTip tooltip={tooltip} label={label} idPrefix={`metric-${label}`} size={14} />
        ) : null}
      </div>
      <div className="nutri-metric-card-value-row">
        <strong className="nutri-metric-card-value">{value}</strong>
        {unit ? <span className="nutri-metric-card-unit">{unit}</span> : null}
      </div>
    </article>
  );
}
