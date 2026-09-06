import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiInformationCircle } from "react-icons/hi";

const TOOLTIP_MAX_WIDTH = 288;
const VIEWPORT_MARGIN = 16;
const TOOLTIP_GAP = 10;

function getMainContentMinLeft() {
  const sidebar = document.querySelector(".app-sidebar");
  if (!sidebar) return VIEWPORT_MARGIN;

  const rect = sidebar.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return VIEWPORT_MARGIN;

  const isBottomNav = rect.top > window.innerHeight / 2;
  if (isBottomNav) return VIEWPORT_MARGIN;

  return Math.max(VIEWPORT_MARGIN, Math.round(rect.right + 8));
}

function computeTooltipPosition(buttonRect, tooltipHeight) {
  const width = Math.min(TOOLTIP_MAX_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
  const minLeft = getMainContentMinLeft();
  const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN;

  let left = buttonRect.left + buttonRect.width / 2 - width / 2;
  left = Math.max(minLeft, Math.min(left, maxLeft));

  const spaceAbove = buttonRect.top - VIEWPORT_MARGIN;
  const spaceBelow = window.innerHeight - buttonRect.bottom - VIEWPORT_MARGIN;
  const showBelow =
    spaceAbove < tooltipHeight + TOOLTIP_GAP && spaceBelow > spaceAbove;

  if (showBelow) {
    return {
      width,
      left,
      top: buttonRect.bottom + TOOLTIP_GAP,
      placement: "bottom",
    };
  }

  return {
    width,
    left,
    top: buttonRect.top - TOOLTIP_GAP,
    placement: "top",
  };
}

export function TooltipContent({ tooltip }) {
  if (!tooltip) return null;

  if (typeof tooltip === "string") {
    return <p className="stat-card-tooltip-body">{tooltip}</p>;
  }

  return (
    <>
      <div className="stat-card-tooltip-head">
        <span className="stat-card-tooltip-title">{tooltip.title}</span>
        {tooltip.subtitle && (
          <span className="stat-card-tooltip-subtitle">{tooltip.subtitle}</span>
        )}
      </div>
      {tooltip.body && <p className="stat-card-tooltip-body">{tooltip.body}</p>}
      {tooltip.ranges?.length > 0 && (
        <ul className="stat-card-tooltip-ranges">
          {tooltip.ranges.map((item) => (
            <li key={item.range}>
              <span className="stat-card-tooltip-range">{item.range}</span>
              <span className="stat-card-tooltip-range-label">{item.label}</span>
            </li>
          ))}
        </ul>
      )}
      {tooltip.note && <p className="stat-card-tooltip-note">{tooltip.note}</p>}
    </>
  );
}

export default function InfoTip({
  tooltip,
  label = "ข้อมูลเพิ่มเติม",
  size = 15,
  className = "",
  idPrefix = "info-tip",
  preferInline = false,
}) {
  const tipId = `${idPrefix}-${String(label).replace(/\s+/g, "-")}`;
  const [tipOpen, setTipOpen] = useState(false);
  const [tipStyle, setTipStyle] = useState(null);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  const closeTimerRef = useRef(null);

  const openTip = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setTipOpen(true);
  };

  const scheduleCloseTip = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setTipOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

  useLayoutEffect(() => {
    if (!tipOpen || preferInline) return undefined;

    const positionTooltip = () => {
      const button = buttonRef.current;
      if (!button) return;

      const tooltipEl = tooltipRef.current;
      const tooltipHeight = tooltipEl?.offsetHeight || 180;
      const position = computeTooltipPosition(button.getBoundingClientRect(), tooltipHeight);

      setTipStyle({
        width: position.width,
        left: position.left,
        top: position.top,
        transform: position.placement === "top" ? "translateY(-100%)" : "none",
      });
    };

    positionTooltip();
    const rafId = requestAnimationFrame(positionTooltip);
    window.addEventListener("resize", positionTooltip);
    window.addEventListener("scroll", positionTooltip, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", positionTooltip);
      window.removeEventListener("scroll", positionTooltip, true);
    };
  }, [tipOpen, preferInline, tooltip]);

  useEffect(() => {
    if (!tipOpen) setTipStyle(null);
  }, [tipOpen]);

  useEffect(() => {
    if (!tipOpen || preferInline) return undefined;

    const handlePointerDown = (event) => {
      if (
        buttonRef.current?.contains(event.target) ||
        tooltipRef.current?.contains(event.target)
      ) {
        return;
      }
      setTipOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setTipOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tipOpen, preferInline]);

  if (!tooltip) return null;

  const usePortal = !preferInline && tipOpen && typeof document !== "undefined";

  return (
    <>
      <span
        className={`stat-card-tooltip-wrap info-tip-wrap${tipOpen ? " is-open" : ""}${className ? ` ${className}` : ""}`}
        onMouseEnter={openTip}
        onMouseLeave={scheduleCloseTip}
        onFocus={openTip}
        onBlur={(event) => {
          if (event.currentTarget.contains(event.relatedTarget)) return;
          setTipOpen(false);
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          className="stat-info-btn"
          aria-label={`คำอธิบาย ${label}`}
          aria-describedby={tipOpen ? tipId : undefined}
          aria-expanded={tipOpen}
          onClick={(event) => {
            event.stopPropagation();
            setTipOpen((open) => !open);
          }}
        >
          <HiInformationCircle size={size} />
        </button>
        {preferInline ? (
          <div id={tipId} className="stat-card-tooltip" role="tooltip">
            <TooltipContent tooltip={tooltip} />
          </div>
        ) : null}
      </span>
      {usePortal
        ? createPortal(
            <div
              id={tipId}
              ref={tooltipRef}
              className={`stat-card-tooltip stat-card-tooltip--fixed${tipStyle ? " is-visible" : ""}`}
              role="tooltip"
              style={tipStyle || undefined}
              onMouseEnter={openTip}
              onMouseLeave={scheduleCloseTip}
            >
              <TooltipContent tooltip={tooltip} />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
