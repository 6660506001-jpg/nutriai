import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiCheck, HiMoon, HiSun, HiX } from "react-icons/hi";
import { MdColorize } from "react-icons/md";
import {
  CUSTOM_THEME_ID,
  buildCustomTheme,
  getFeaturedThemeIds,
  getThemeById,
  getThemesForAppearance,
  normalizeAppearance,
  pickDefaultThemeForAppearance,
} from "../../constants/themes";
import { getBrandPanelPickerStyles, getChromePickerStyles } from "../../utils/resolveAppearanceMode";
import { styles } from "../../styles/appStyles";

function ThemePreviewCircle({ preview, size = 52 }) {
  const [top, bottomLeft, bottomRight] = preview;
  return (
    <div
      className="theme-preview-circle"
      style={{
        ...styles.themePreviewCircle,
        width: size,
        height: size,
      }}
    >
      <span style={{ ...styles.themePreviewTop, background: top }} />
      <span style={{ ...styles.themePreviewBottomLeft, background: bottomLeft }} />
      <span style={{ ...styles.themePreviewBottomRight, background: bottomRight }} />
    </div>
  );
}

const APPEARANCE_OPTIONS = [
  { id: "light", label: "สว่าง", Icon: HiSun },
  { id: "dark", label: "มืด", Icon: HiMoon },
];

export default function ThemePicker({
  variant = "default",
  overlayMode = null,
  themeId,
  appearanceMode,
  followDevice: _followDevice,
  customPrimary,
  onThemeChange,
  onAppearanceChange,
  onFollowDeviceChange,
  onCustomPrimaryChange,
}) {
  const colorInputRef = useRef(null);
  const isBrand = variant === "brand";
  const isCustomActive = themeId === CUSTOM_THEME_ID;
  const customTheme = buildCustomTheme(customPrimary);
  const currentAppearance = normalizeAppearance(appearanceMode);

  const [showAllThemes, setShowAllThemes] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const usePortal = isBrand && overlayMode === "portal";

  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  useEffect(() => {
    if (!expanded || !usePortal) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded, usePortal]);

  const isDark = currentAppearance === "dark";
  const chrome = isBrand ? getBrandPanelPickerStyles() : getChromePickerStyles(isDark);
  const activeTheme = getThemeById(themeId, customPrimary);

  const previewSize = isBrand ? 34 : 48;
  const customInnerSize = isBrand ? 34 : 52;

  const themesForAppearance = useMemo(
    () => getThemesForAppearance(currentAppearance),
    [currentAppearance],
  );

  const featuredIds = useMemo(
    () => getFeaturedThemeIds(currentAppearance),
    [currentAppearance],
  );

  const visibleThemes = useMemo(() => {
    if (!isBrand || showAllThemes) return themesForAppearance;

    const featured = themesForAppearance.filter((theme) => featuredIds.includes(theme.id));
    if (themeId !== CUSTOM_THEME_ID && !featuredIds.includes(themeId)) {
      const current = themesForAppearance.find((theme) => theme.id === themeId);
      if (current) return [...featured, current];
    }
    return featured;
  }, [isBrand, showAllThemes, themeId, themesForAppearance, featuredIds]);

  const hiddenThemeCount = Math.max(themesForAppearance.length - featuredIds.length, 0);

  const toggleExpanded = () => setExpanded((open) => !open);

  const handleCustomPick = (hex) => {
    onCustomPrimaryChange(hex);
    onThemeChange(CUSTOM_THEME_ID);
    if (currentAppearance === "dark") {
      onAppearanceChange("light");
    }
  };

  const handleAppearanceSelect = (mode) => {
    const nextAppearance = normalizeAppearance(mode);
    onFollowDeviceChange(false);
    onAppearanceChange(nextAppearance);
    setShowAllThemes(false);

    const nextThemes = getThemesForAppearance(nextAppearance);
    const nextIds = new Set(nextThemes.map((theme) => theme.id));
    const keepCurrent =
      themeId !== CUSTOM_THEME_ID && nextIds.has(themeId);

    if (!keepCurrent) {
      onThemeChange(pickDefaultThemeForAppearance(nextAppearance));
    }
  };

  const renderSwatch = (theme, active) => (
    <button
      key={theme.id}
      type="button"
      aria-label={theme.label}
      aria-pressed={active}
      title={theme.label}
      onClick={() => onThemeChange(theme.id)}
      style={{
        ...styles.themePickerTile,
        ...chrome.tile,
        ...(isBrand ? styles.themePickerTileCompact : {}),
        ...(active ? { ...styles.themePickerTileActive, ...chrome.tileActive } : {}),
      }}
    >
      <ThemePreviewCircle preview={theme.preview} size={previewSize} />
      {active && (
        <span style={{ ...styles.themePickerBadgeCompact, ...chrome.badge }}>
          <HiCheck size={11} />
        </span>
      )}
    </button>
  );

  const renderModeToggle = () => (
    <div
      className="theme-mode-toggle"
      style={{ ...styles.themeModeToggle, ...chrome.modeToggle }}
    >
      {APPEARANCE_OPTIONS.map(({ id, label, Icon }) => {
        const active = currentAppearance === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => handleAppearanceSelect(id)}
            style={{
              ...styles.themeModeBtn,
              ...chrome.modeBtn,
              ...(active ? chrome.modeBtnActive : {}),
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
            {active && (
              <span style={styles.themeModeCheck}>
                <HiCheck size={12} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderPickerBody = () => (
    <>
      {renderModeToggle()}

      <p style={{ ...styles.themePickerSectionLabel, color: chrome.followLabel.color, textAlign: isBrand ? 'center' : undefined }}>
        {currentAppearance === "dark" ? "โทนสีมืด" : "โทนสีสว่าง"}
      </p>

      <div
        className={`theme-picker-grid-responsive theme-picker-chrome-grid${isBrand ? (showAllThemes ? " theme-picker-grid-expanded" : " theme-picker-grid-compact") : ""}`}
        style={{
          ...styles.themePickerGrid,
          ...(isBrand
            ? (showAllThemes ? styles.themePickerGridExpanded : styles.themePickerGridCompact)
            : {}),
        }}
      >
        {visibleThemes.map((theme) => renderSwatch(theme, themeId === theme.id))}

        {currentAppearance === "light" && (
          <button
            type="button"
            aria-label="เลือกสีเอง"
            aria-pressed={isCustomActive}
            title="เลือกสีเอง"
            onClick={() => colorInputRef.current?.click()}
            style={{
              ...styles.themePickerTile,
              ...chrome.tile,
              ...(isBrand ? styles.themePickerTileCompact : {}),
              ...(isCustomActive ? { ...styles.themePickerTileActive, ...chrome.tileActive } : {}),
            }}
          >
            {isCustomActive ? (
              <ThemePreviewCircle preview={customTheme.preview} size={previewSize} />
            ) : (
              <div
                className="theme-picker-custom-inner-brand"
                style={{
                  ...styles.themePickerCustomInner,
                  ...chrome.customInner,
                  width: customInnerSize,
                  height: customInnerSize,
                }}
              >
                <MdColorize size={18} color={chrome.eyedropperColor} />
              </div>
            )}
            {isCustomActive && (
              <span style={{ ...styles.themePickerBadgeCompact, ...chrome.badge }}>
                <HiCheck size={11} />
              </span>
            )}
            <input
              ref={colorInputRef}
              type="color"
              value={customPrimary}
              onChange={(e) => handleCustomPick(e.target.value)}
              style={styles.themePickerColorInput}
              aria-hidden="true"
              tabIndex={-1}
            />
          </button>
        )}
      </div>

      {isBrand && !showAllThemes && hiddenThemeCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAllThemes(true)}
          style={{ ...styles.themePickerExpandBtn, color: chrome.followLabel.color }}
        >
          โทนสีเพิ่มเติม ({hiddenThemeCount}+)
        </button>
      )}

      {isBrand && showAllThemes && (
        <button
          type="button"
          onClick={() => setShowAllThemes(false)}
          style={{ ...styles.themePickerExpandBtn, color: chrome.followLabel.color }}
        >
          แสดงน้อยลง
        </button>
      )}
    </>
  );

  const renderFabPanelHeader = () => (
    <div className="theme-fab-panel-header" style={styles.themeFabPanelHeader}>
      <div>
        <div style={{ ...styles.themePickerTitle, ...chrome.title, marginBottom: 0 }}>รูปลักษณ์</div>
        <p
          className="theme-picker-modal-hint"
          style={{ ...styles.themePickerModalHint, color: chrome.followLabel.color, textAlign: "center" }}
        >
          เลือกโหมดและโทนสีที่ชอบ
        </p>
      </div>
    </div>
  );

  const renderFabPanel = (extraClass = "") => (
    <div
      className={`theme-fab-panel theme-picker-brand theme-picker-compact ${extraClass}`.trim()}
      style={{
        ...styles.themeFabPanel,
        ...chrome.wrap,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderFabPanelHeader()}
      {renderPickerBody()}
    </div>
  );

  const renderFabTrigger = (className = "theme-fab-trigger") => (
    <button
      type="button"
      className={className}
      aria-expanded={expanded}
      aria-label={expanded ? "ปิดเมนูเลือกสี" : "เปิดเมนูเลือกสี"}
      onClick={toggleExpanded}
      style={{
        ...styles.themeFabTrigger,
        ...(expanded && !usePortal
          ? {}
          : {
              background: "#FFFFFF",
              border: "3px solid rgba(255,255,255,0.92)",
              boxShadow: "0 8px 22px rgba(15,23,42,0.22)",
            }),
      }}
    >
      {expanded && !usePortal ? (
        <HiX size={24} color="#fff" />
      ) : (
        <ThemePreviewCircle preview={activeTheme.preview} size={40} />
      )}
    </button>
  );

  const renderPortalLaunch = () => (
    <button
      type="button"
      className="theme-fab-launch login-theme-portal-launch"
      aria-expanded={expanded}
      aria-label="เปลี่ยนโทนสีและโหมดแสดงผล"
      onClick={toggleExpanded}
    >
      <span className="theme-fab-launch-icon" aria-hidden="true">
        <ThemePreviewCircle preview={activeTheme.preview} size={36} />
      </span>
      <span className="theme-fab-launch-text">
        <span className="theme-fab-launch-title">เปลี่ยนโทนสี</span>
        <span className="theme-fab-launch-sub">กดเพื่อเลือกธีมและโหมดสว่าง/มืด</span>
      </span>
    </button>
  );

  if (isBrand) {
    return (
      <div style={styles.themeFabRoot} className="theme-fab-root">
        {usePortal && expanded && typeof document !== "undefined" && createPortal(
          <div
            className="login-theme-portal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="เลือกรูปลักษณ์"
            onClick={() => setExpanded(false)}
          >
            <button
              type="button"
              className="login-theme-portal-close"
              aria-label="ปิด"
              onClick={() => setExpanded(false)}
            >
              <HiX size={22} />
            </button>
            {renderFabPanel("login-theme-portal-panel")}
          </div>,
          document.body,
        )}

        {usePortal ? (
          renderPortalLaunch()
        ) : (
          <div
            className={`theme-fab-shell${expanded ? " is-expanded" : ""}`}
            style={styles.themeFabShell}
            onClick={expanded ? () => setExpanded(false) : undefined}
          >
            <div aria-hidden={!expanded} style={{ pointerEvents: expanded ? "auto" : "none" }}>
              {renderFabPanel()}
            </div>
            {renderFabTrigger()}
          </div>
        )}

      </div>
    );
  }

  return (
    <div
      className={isDark ? "theme-picker-chrome-dark" : "theme-picker-chrome-light"}
      style={{
        ...styles.themePickerWrap,
        ...chrome.wrap,
      }}
    >
      <div style={{ ...styles.themePickerTitle, ...chrome.title }}>รูปลักษณ์</div>
      {renderPickerBody()}
    </div>
  );
}
