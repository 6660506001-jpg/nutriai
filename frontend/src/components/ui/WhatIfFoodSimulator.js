import React, { useEffect, useState } from "react";
import { estimateCustomFood } from "../../utils/foodEstimator";
import {
  matchDrinkOverride,
  normalizeWhatIfQuery,
  simulateWhatIf,
} from "../../utils/whatIfSimulator";
import WhatIfMacroCompare from "./WhatIfMacroCompare";

export default function WhatIfFoodSimulator({
  totalEaten,
  macros,
  recommendationTargets,
  onTryFood,
  onTrySwap,
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [estimateMeta, setEstimateMeta] = useState(null);

  useEffect(() => {
    const text = normalizeWhatIfQuery(query);
    if (!text) {
      setSimulation(null);
      setEstimateMeta(null);
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const override = matchDrinkOverride(text);
        const estimated = override
          ? { ...override, name: text, estimated: true, estimateSource: "drink_reference" }
          : await estimateCustomFood(text);

        if (cancelled || !estimated) return;

        const result = simulateWhatIf({
          totalEaten,
          macros,
          proposedFood: estimated,
          recommendationTargets,
        });

        setEstimateMeta(estimated);
        setSimulation(result);
      } catch (err) {
        console.error("What-if simulation error:", err);
        if (!cancelled) {
          setSimulation(null);
          setEstimateMeta(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    query,
    totalEaten.cal,
    totalEaten.p,
    totalEaten.c,
    totalEaten.f,
    macros.protein,
    macros.carbs,
    macros.fat,
    recommendationTargets?.calMin,
    recommendationTargets?.calMax,
    recommendationTargets?.canRecommend,
  ]);

  const hasLoggedFood = (totalEaten?.cal || 0) > 0;

  return (
    <div className="what-if-simulator-panel">
      <div className="what-if-simulator-head">
        <span className="what-if-simulator-icon">🔮</span>
        <div>
          <div className="what-if-simulator-title">จำลองมื้อถัดไป (What-If)</div>
          <div className="what-if-simulator-sub">
            พิมพ์เมนูที่อยากกิน แล้วดูกราฟมาโครก่อนตัดสินใจ
          </div>
        </div>
      </div>

      <input
        className="what-if-simulator-input"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='เช่น "ชาเขียวนมสด" หรือ "มื้อถัดไปอยากกินข้าวผัดไก่"'
      />

      {!hasLoggedFood && (
        <p className="what-if-simulator-note">
          บันทึกมื้อวันนี้อย่างน้อย 1 รายการก่อน จึงจะจำลองได้แม่นขึ้น
        </p>
      )}

      {loading && (
        <p className="what-if-simulator-loading">กำลังประมาณค่าและจำลองกราฟ...</p>
      )}

      {!loading && simulation && (
        <div className="what-if-simulator-result">
          <div className={`what-if-verdict what-if-verdict-${simulation.tone}`}>
            {simulation.verdict}
          </div>

          {estimateMeta && (
            <div className="what-if-food-estimate">
              <strong>{estimateMeta.name}</strong>
              <span>
                {estimateMeta.calories} kcal · P {estimateMeta.protein}g · C {estimateMeta.carbs}g · F {estimateMeta.fat}g
              </span>
            </div>
          )}

          <WhatIfMacroCompare rows={simulation.compareRows} />

          {simulation.swap?.projectedPctWithSwap && (
            <WhatIfMacroCompare
              title="หลังเปลี่ยนทางเลือก"
              rows={simulation.swapCompareRows}
            />
          )}

          {simulation.warnings.length > 0 && (
            <ul className="what-if-warning-list">
              {simulation.warnings.map((warning) => (
                <li key={warning.key}>{warning.message}</li>
              ))}
            </ul>
          )}

          {simulation.swap && (
            <div className="what-if-swap-card">
              <div className="what-if-swap-title">💡 ทางเลือกที่ดีกว่า</div>
              <p className="what-if-swap-message">{simulation.swap.message}</p>
              <div className="what-if-swap-meta">
                {simulation.swap.alternative.name} · {simulation.swap.alternative.calories} kcal · C {simulation.swap.alternative.carbs}g
              </div>
              <div className="what-if-swap-actions">
                <button
                  type="button"
                  className="what-if-btn what-if-btn-primary"
                  onClick={() => onTrySwap?.(simulation.swap.alternative)}
                >
                  ใช้ทางเลือกนี้
                </button>
                <button
                  type="button"
                  className="what-if-btn what-if-btn-ghost"
                  onClick={() => onTryFood?.(estimateMeta)}
                >
                  กินเมนูเดิมอยู่ดี
                </button>
              </div>
            </div>
          )}

          {!simulation.swap && !simulation.isRisky && (
            <button
              type="button"
              className="what-if-btn what-if-btn-primary what-if-btn-full"
              onClick={() => onTryFood?.(estimateMeta)}
            >
              + เพิ่มเมนูนี้ลงมื้อ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
