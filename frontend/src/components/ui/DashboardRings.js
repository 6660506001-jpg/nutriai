import React, { useEffect, useState } from "react";
import DashboardMacroStrip from "./DashboardMacroStrip";
import SparkBurst from "./SparkBurst";
import "./DashboardRings.css";

const fmt = (n) => Math.round(n).toLocaleString("th-TH");

const RING = 140;
const STROKE = 12;
const RADIUS = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

function useMotionEnabled() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return enabled;
}

function useTween(target, duration = 900) {
  const motion = useMotionEnabled();
  const [value, setValue] = useState(motion ? 0 : target);

  useEffect(() => {
    if (!motion) {
      setValue(target);
      return undefined;
    }
    let frame = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(from + (target - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, motion]);

  return value;
}

function EnergyRow({ tone, label, value, widthPct }) {
  const shownWidth = useTween(widthPct, 800);
  return (
    <div className={`dash-energy-row dash-energy-row--${tone}`}>
      <span className="dash-energy-row-label">{label}</span>
      <div className="dash-energy-row-track" aria-hidden="true">
        <span className="dash-energy-row-fill" style={{ width: `${Math.max(shownWidth, value > 0 ? 3 : 0)}%` }} />
      </div>
      <span className="dash-energy-row-value">{fmt(value)}</span>
    </div>
  );
}

function EnergyRing({ tone, label, value, pct, gradId, from, to, delay = 0 }) {
  const amount = useTween(Math.min(1, Math.max(0, pct)), 950 + delay);
  const shownValue = useTween(value, 950 + delay);
  const dash = CIRC * amount;
  const gap = CIRC - dash;
  const [pop, setPop] = useState(false);

  return (
    <button
      type="button"
      className={`dash-energy-ring dash-energy-ring--${tone}${pop ? " is-pop" : ""}`}
      onClick={() => {
        setPop(true);
        window.setTimeout(() => setPop(false), 280);
      }}
      aria-label={`${label} ${fmt(value)} กิโลแคลอรี`}
    >
      <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          className="dash-energy-ring-track"
          cx={RING / 2}
          cy={RING / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className="dash-energy-ring-value"
          cx={RING / 2}
          cy={RING / 2}
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
        />
      </svg>
      <div className="dash-energy-ring-center">
        <span className="dash-energy-ring-kicker">{label}</span>
        <strong className="dash-energy-ring-num">{fmt(shownValue)}</strong>
        <span className="dash-energy-ring-unit">กิโลแคลอรี</span>
      </div>
    </button>
  );
}

export default function DashboardRings({
  foodCals = 0,
  activityCals = 0,
  tdee = 0,
  protein = 0,
  carbs = 0,
  fat = 0,
  targetProtein = 0,
  targetCarbs = 0,
  targetFat = 0,
  className = "",
}) {
  const goal = Math.max(Number(tdee) || 0, 1);
  const eaten = Math.max(0, Number(foodCals) || 0);
  const burned = Math.max(0, Number(activityCals) || 0);
  const remaining = goal - (eaten - burned);
  const over = remaining < 0;
  const overflow = over ? Math.abs(remaining) : 0;
  const used = Math.max(0, eaten - burned);
  const uid = React.useId().replace(/:/g, "");
  const [helloSpark] = useState(() => `rings-${Date.now()}`);
  const story = over
    ? `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · เกิน ${fmt(overflow)}`
    : `ใช้แล้ว ${fmt(used)} จากเป้าหมาย ${fmt(goal)} กิโลแคลอรี · คงเหลือ ${fmt(remaining)}`;

  return (
    <div className={`dash-energy-wrap ${className}`.trim()} aria-label={story}>
      <div className="dash-energy-panel" style={{ position: "relative", overflow: "visible" }}>
        <SparkBurst playKey={helloSpark} />
        <div className="dash-energy-ring-block">
          <EnergyRing
            tone="eat"
            label="พลังงานที่ได้รับ"
            value={eaten}
            pct={eaten / goal}
            gradId={`dashEnergyEat-${uid}`}
            from="#60a5fa"
            to="#2563eb"
            delay={0}
          />
          <EnergyRing
            tone="burn"
            label="พลังงานที่เผาผลาญ"
            value={burned}
            pct={burned / goal}
            gradId={`dashEnergyBurn-${uid}`}
            from="#34d399"
            to="#059669"
            delay={80}
          />
          <EnergyRing
            tone={over ? "over" : "remain"}
            label={over ? "เกินเป้าหมาย" : "คงเหลือวันนี้"}
            value={over ? overflow : remaining}
            pct={over ? overflow / goal : remaining / goal}
            gradId={`dashEnergyRemain-${uid}`}
            from={over ? "#fb923c" : "#38bdf8"}
            to={over ? "#ea580c" : "#2563eb"}
            delay={160}
          />
        </div>

        <div className="dash-energy-rows">
          <EnergyRow tone="goal" label="เป้าหมายพลังงาน" value={goal} widthPct={100} />
        </div>
        <p className="dash-energy-story">{story}</p>
      </div>

      <DashboardMacroStrip
        protein={protein}
        carbs={carbs}
        fat={fat}
        targetProtein={targetProtein}
        targetCarbs={targetCarbs}
        targetFat={targetFat}
      />
    </div>
  );
}
