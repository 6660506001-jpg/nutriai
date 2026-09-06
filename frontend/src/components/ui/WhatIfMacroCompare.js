import React from "react";
import { styles } from "../../styles/appStyles";

const MACRO_COLORS = {
  current: "#1e293b",
  projected: "#f59e0b",
  projectedOver: "#dc2626",
  target: "#94a3b8",
  track: "#e2e8f0",
};

const toBarWidth = (pct) => `${Math.min(130, Math.max(0, pct))}%`;

export default function WhatIfMacroCompare({ rows, title }) {
  if (!rows?.length) return null;

  return (
    <div className="what-if-macro-wrap" style={styles.aiMacroMeterWrap}>
      {title ? <div className="what-if-macro-title">{title}</div> : null}
      <div className="what-if-macro-legend">
        <span className="what-if-legend-item">
          <i className="what-if-legend-dot what-if-legend-dot-current" /> ตอนนี้
        </span>
        <span className="what-if-legend-item">
          <i className="what-if-legend-dot what-if-legend-dot-projected" /> หลังกินเมนูนี้
        </span>
      </div>
      {rows.map((row) => {
        const currentWidth = toBarWidth(row.currentPct);
        const projectedWidth = toBarWidth(row.projectedPct);
        const delta = Math.round(row.projectedPct - row.currentPct);
        const isOver = row.projectedPct > 110;
        const projectedColor = isOver ? MACRO_COLORS.projectedOver : MACRO_COLORS.projected;

        return (
          <div key={row.key} className="what-if-macro-row" style={styles.aiMacroMeterRow}>
            <div style={styles.aiMacroMeterTop}>
              <span style={{ ...styles.aiMacroMeterLabel, color: row.color }}>{row.label}</span>
              <span style={styles.aiMacroMeterPct}>
                {Math.round(row.currentPct)}%
                <span className="what-if-macro-arrow"> → </span>
                <span className={isOver ? "what-if-macro-over" : ""}>
                  {Math.round(row.projectedPct)}%
                </span>
                {delta !== 0 && (
                  <span className={`what-if-macro-delta${delta > 0 ? " is-up" : " is-down"}`}>
                    ({delta > 0 ? "+" : ""}{delta}%)
                  </span>
                )}
              </span>
            </div>
            <div className="what-if-macro-track" style={{ ...styles.aiMacroMeterTrack, background: MACRO_COLORS.track }}>
              <div
                className="what-if-macro-target-line"
                style={{ left: toBarWidth(100) }}
                title="เป้า 100%"
              />
              <div
                className="what-if-macro-fill-projected"
                style={{
                  width: projectedWidth,
                  background: projectedColor,
                  opacity: 0.55,
                }}
              />
              <div
                className="what-if-macro-fill-current"
                style={{
                  width: currentWidth,
                  minWidth: row.currentPct > 0 ? undefined : "6px",
                  background: MACRO_COLORS.current,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
