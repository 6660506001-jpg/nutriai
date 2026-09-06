import React from "react";
import MetricCard from "./MetricCard";

/** @deprecated prefer MetricCard — kept for backward compatibility */
export default function StatCard({ label, value, icon, tooltip }) {
  const match = String(value || "").match(/^([\d.,]+)\s*(.*)$/);
  const num = match ? match[1] : value;
  const unit = match && match[2] ? match[2] : undefined;

  return (
    <MetricCard
      label={label}
      value={num}
      unit={unit}
      tooltip={tooltip}
    />
  );
}
