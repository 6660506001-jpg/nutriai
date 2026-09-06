import React from "react";

export default function QuickStartSteps({
  title = "เริ่มต้น 3 ขั้น",
  steps = [],
  primaryLabel,
  onPrimaryAction,
  compact = false,
}) {
  if (!steps.length) return null;

  return (
    <section
      className={`nutri-quick-steps${compact ? " nutri-quick-steps--compact" : ""}`}
      aria-label={title}
    >
      <h3 className="nutri-quick-steps-title">{title}</h3>
      <ol className="nutri-quick-steps-list">
        {steps.map((step, index) => (
          <li key={step.title} className="nutri-quick-steps-item">
            <span className="nutri-quick-steps-num" aria-hidden>{index + 1}</span>
            <div className="nutri-quick-steps-copy">
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      {primaryLabel && onPrimaryAction ? (
        <button type="button" className="nutri-quick-steps-cta" onClick={onPrimaryAction}>
          {primaryLabel}
        </button>
      ) : null}
    </section>
  );
}
