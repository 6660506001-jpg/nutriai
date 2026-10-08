import React, { useEffect, useState } from "react";

const COLORS = ["#2563eb", "#38bdf8", "#22c55e", "#f59e0b", "#f97316", "#e11d48"];
const BITS = ["✦", "★", "●", "✧"];

export default function SparkBurst({ playKey }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!playKey) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const next = Array.from({ length: 22 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 22 + Math.random() * 0.4;
      const dist = 70 + Math.random() * 90;
      return {
        id: `${playKey}-${index}`,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 20,
        rot: Math.round(Math.random() * 240 - 120),
        color: COLORS[index % COLORS.length],
        mark: BITS[index % BITS.length],
        delay: Math.round(Math.random() * 90),
      };
    });
    setPieces(next);
    const timer = window.setTimeout(() => setPieces([]), 900);
    return () => window.clearTimeout(timer);
  }, [playKey]);

  if (pieces.length === 0) return null;

  return (
    <div className="spark-burst" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="spark-burst-bit"
          style={{
            color: piece.color,
            "--spark-x": `${piece.x}px`,
            "--spark-y": `${piece.y}px`,
            "--spark-rot": `${piece.rot}deg`,
            animationDelay: `${piece.delay}ms`,
          }}
        >
          {piece.mark}
        </span>
      ))}
    </div>
  );
}
