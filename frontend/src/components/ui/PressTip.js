import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TooltipContent, computeTooltipPosition } from "./InfoTip";

export default function PressTip({
  tooltip,
  label = "ข้อมูลเพิ่มเติม",
  className = "",
  children,
}) {
  const tipId = `press-tip-${String(label).replace(/\s+/g, "-")}`;
  const [tipOpen, setTipOpen] = useState(false);
  const [tipStyle, setTipStyle] = useState(null);
  const anchorRef = useRef(null);
  const tooltipRef = useRef(null);
  const closeTimerRef = useRef(null);

  const openTip = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setTipOpen(true);
  };

  const scheduleCloseTip = (delay = 120) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setTipOpen(false);
      closeTimerRef.current = null;
    }, delay);
  };

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!tipOpen) return undefined;

    const positionTooltip = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 140;
      const position = computeTooltipPosition(anchor.getBoundingClientRect(), tooltipHeight);
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
  }, [tipOpen, tooltip]);

  useEffect(() => {
    if (!tipOpen) setTipStyle(null);
  }, [tipOpen]);

  useEffect(() => {
    if (!tipOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        anchorRef.current?.contains(event.target)
        || tooltipRef.current?.contains(event.target)
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
  }, [tipOpen]);

  if (!tooltip) return children;

  const usePortal = tipOpen && typeof document !== "undefined";

  return (
    <span
      ref={anchorRef}
      className={`press-tip-wrap${tipOpen ? " is-open" : ""}${className ? ` ${className}` : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") openTip();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") scheduleCloseTip();
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") openTip();
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") scheduleCloseTip(1600);
      }}
      onPointerCancel={() => scheduleCloseTip(1600)}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
      {usePortal
        ? createPortal(
            <div
              id={tipId}
              ref={tooltipRef}
              className={`stat-card-tooltip stat-card-tooltip--fixed${tipStyle ? " is-visible" : ""}`}
              role="tooltip"
              style={tipStyle || undefined}
              onPointerEnter={openTip}
              onPointerLeave={() => scheduleCloseTip()}
            >
              <TooltipContent tooltip={tooltip} />
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
