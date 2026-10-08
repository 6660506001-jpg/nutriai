import React, { useEffect, useState } from "react";
import { fetchMlMetrics } from "../../utils/mlMealScore";

const pct = (value) => `${Math.round((Number(value) || 0) * 1000) / 10}%`;

export default function MlModelCompare() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let active = true;
    fetchMlMetrics().then((data) => {
      if (active) setMetrics(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const ranking = metrics?.ranking || [];
  if (ranking.length === 0) return null;
  const protocol = metrics.protocol || {};

  return (
    <details className="ml-compare" aria-label="เปรียบเทียบโมเดล">
      <summary className="ml-compare-kicker">โมเดลที่ใช้จัดอันดับเมนู{metrics?.bestModel ? ` · ${metrics.bestModel}` : ""}</summary>
      <h3 className="ml-compare-title">
        Random Forest · SVM · Gradient Boosting
      </h3>
      {protocol.selectionReason ? (
        <p className="ml-compare-lead">{protocol.selectionReason}</p>
      ) : null}
      <div className="ml-compare-grid">
        {ranking.map((row, index) => (
          <article key={row.key} className={`ml-compare-card${index === 0 ? " is-best" : ""}`}>
            <span className="ml-compare-rank">#{index + 1}</span>
            <strong>{row.name}</strong>
            <ul>
              <li>Accuracy {pct(row.accuracy)}</li>
              <li>Precision {pct(row.precision)}</li>
              <li>Recall {pct(row.recall)}</li>
              <li>F1 {pct(row.f1)}</li>
            </ul>
            {index === 0 ? <p className="ml-compare-used">ใช้โมเดลนี้บนเว็บ</p> : null}
          </article>
        ))}
      </div>
    </details>
  );
}
