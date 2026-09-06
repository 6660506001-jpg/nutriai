import React, { useEffect, useId, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

export default function DashCollapsible({
  title,
  preview,
  badge,
  icon,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  collapseOnMobile = true,
  alwaysStartCollapsed = false,
  mobileBreakpoint = 768,
  className = "",
  style,
  children,
}) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(() => {
    if (alwaysStartCollapsed) return false;
    if (typeof window === "undefined") return defaultOpen;
    if (!collapseOnMobile) return defaultOpen;
    return defaultOpen && window.innerWidth > mobileBreakpoint;
  });
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    const value = typeof next === "function" ? next(open) : next;
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };
  const panelId = useId();

  useEffect(() => {
    if (isControlled || alwaysStartCollapsed || !collapseOnMobile) return undefined;

    const media = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    const sync = () => setOpen(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [isControlled, alwaysStartCollapsed, collapseOnMobile, mobileBreakpoint]);

  return (
    <section
      className={`dash-collapse${open ? " is-open" : ""} ${className}`.trim()}
      style={style}
    >
      <button
        type="button"
        className="dash-collapse-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="dash-collapse-head">
          <span className="dash-collapse-title-row">
            {icon ? <span className="dash-collapse-icon" aria-hidden>{icon}</span> : null}
            <span className="dash-collapse-title">{title}</span>
          </span>
          {!open && preview ? (
            <span className="dash-collapse-preview">{preview}</span>
          ) : null}
        </span>
        {badge ? <span className="dash-collapse-badge">{badge}</span> : null}
        <HiChevronDown className="dash-collapse-chevron" aria-hidden />
      </button>
      {open ? (
        <div id={panelId} className="dash-collapse-body">
          {children}
        </div>
      ) : null}
    </section>
  );
}
