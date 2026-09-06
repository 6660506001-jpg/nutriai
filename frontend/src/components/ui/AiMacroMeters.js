import React from "react";
import { macroBarTone } from "../../utils/aiPrediction";
import { styles } from "../../styles/appStyles";

export default function AiMacroMeters({ rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={styles.aiMacroMeterWrap}>
      {rows.map((row) => {
        const tone = macroBarTone(row.valuePct);
        const width = `${Math.min(130, Math.max(0, row.valuePct))}%`;
        return (
          <div key={row.key} style={styles.aiMacroMeterRow}>
            <div style={styles.aiMacroMeterTop}>
              <span style={{ ...styles.aiMacroMeterLabel, color: row.color }}>{row.label}</span>
              <span style={styles.aiMacroMeterPct}>{Math.round(row.valuePct)}%</span>
            </div>
            <div style={{ ...styles.aiMacroMeterTrack, background: tone.track }}>
              <div style={{ ...styles.aiMacroMeterFill, width, background: tone.fill }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
