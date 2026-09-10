import React from "react";

export default function AppVisualEffects() {
  return (
    <style>{`
      @keyframes floatPulse {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-4px); }
        100% { transform: translateY(0px); }
      }
      @keyframes softShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes nutriOrbFloat {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(0, -10px, 0) scale(1.03); }
      }
      .nutri-page-bg {
        position: relative;
        isolation: isolate;
        overflow: hidden;
      }
      .app-main.nutri-page-bg {
        background: #f4f8fb;
      }

      /* ===== Design System: Healthcare + AI ===== */
      :root {
        --nutri-health-green: #059669;
        --nutri-health-blue: #2563eb;
        --nutri-health-green-soft: #ecfdf5;
        --nutri-health-blue-soft: #eff6ff;
        --nutri-food-accent: #2563eb;
        --nutri-food-accent-soft: rgba(37, 99, 235, 0.14);
        --nutri-activity-accent: #059669;
        --nutri-activity-accent-soft: rgba(5, 150, 105, 0.14);
        --nutri-radius-md: 14px;
        --nutri-radius-lg: 18px;
        --nutri-space-1: 8px;
        --nutri-space-2: 12px;
        --nutri-space-3: 16px;
        --nutri-space-4: 20px;
        --nutri-font-body: 14px;
        --nutri-font-small: 12px;
        --nutri-font-display: clamp(24px, 4vw, 32px);
      }

      .app-scroll {
        max-width: 1120px;
        margin: 0 auto;
        width: 100%;
      }

      .sidebar-brand {
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .sidebar-footer-actions {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-top: 8px;
      }

      .sidebar-logout-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        border: none;
        background: transparent;
        color: rgba(255, 255, 255, 0.78);
        padding: 10px 14px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }

      .sidebar-logout-btn:hover {
        color: #fff;
      }

      .dash-status-hero {
        padding: var(--nutri-space-4);
        border-radius: var(--nutri-radius-lg);
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
      }

      .dash-status-hero-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 14px;
      }

      .dash-status-hero-date {
        margin: 0 0 4px;
        font-size: var(--nutri-font-small);
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
      }

      .dash-status-hero-greeting {
        margin: 0;
        font-size: clamp(20px, 4vw, 26px);
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        letter-spacing: -0.02em;
      }

      .dash-status-hero-status {
        margin: 6px 0 0;
        font-size: var(--nutri-font-body);
        font-weight: 600;
        color: var(--nutri-health-blue, #2563eb);
      }

      .dash-status-hero-cta,
      .dash-status-hero-cta--food {
        flex-shrink: 0;
        border: none;
        border-radius: 12px;
        padding: 10px 14px;
        background: var(--nutri-food-accent, #2563eb);
        color: #fff;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        min-height: 44px;
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
      }

      .dash-status-hero-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex-shrink: 0;
        min-width: 140px;
      }

      .dash-status-hero-cta--activity {
        background: var(--nutri-activity-accent, #059669) !important;
        box-shadow: 0 8px 20px rgba(5, 150, 105, 0.28) !important;
      }

      .dash-status-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 14px;
      }

      .dash-status-hero-burn {
        margin: 10px 0 0;
        font-size: var(--nutri-font-small);
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
      }

      .dash-status-hero--compact {
        padding: 0;
        background: transparent;
        border: none;
        box-shadow: none;
      }

      .dash-status-hero-actions--compact {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        min-width: 0;
        width: 100%;
      }

      .dash-status-hero-actions--compact .dash-status-hero-cta {
        width: 100%;
        min-height: 48px;
      }

      .app-header--dash-rings {
        display: block !important;
        padding: max(12px, env(safe-area-inset-top)) 14px 10px !important;
        background: #fff;
        border-bottom: 1px solid var(--nutri-border, #e2e8f0);
      }

      .app-header-dash-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
      }

      .app-header-dash-top .app-header-page-title {
        margin: 0;
        font-size: 20px;
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .app-header-help-btn--icon {
        width: 40px;
        height: 40px;
        padding: 0 !important;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .app-header-dash-rings-row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }

      .app-header-avatar--rings {
        width: 52px;
        height: 52px;
        flex-shrink: 0;
        border-radius: 50%;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 800;
        color: #fff;
        background: var(--nutri-gradient-primary, linear-gradient(135deg, #db2777, #be185d));
        box-shadow: 0 4px 14px rgba(219, 39, 119, 0.25);
      }

      .app-header-avatar--rings .app-header-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .dash-rings-wrap {
        flex: 1;
        min-width: 0;
      }

      .dash-rings-svg {
        width: 100%;
        height: auto;
        display: block;
        min-height: 88px;
      }

      .dash-ring-progress {
        transition: stroke-dashoffset 0.45s ease;
      }

      .dash-ring-tip-icon {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dash-rings-legend {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 2px;
      }

      .dash-rings-legend-item {
        display: flex;
        align-items: flex-start;
        gap: 7px;
        min-width: 0;
      }

      .dash-rings-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-top: 5px;
        flex-shrink: 0;
      }

      .dash-rings-legend-item--food .dash-rings-legend-dot {
        background: var(--nutri-food-accent, #2563eb);
      }

      .dash-rings-legend-item--activity .dash-rings-legend-dot {
        background: var(--nutri-activity-accent, #059669);
      }

      .dash-rings-legend-label {
        display: block;
        font-size: 10px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
        line-height: 1.2;
      }

      .dash-rings-legend-item strong {
        font-size: 15px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        letter-spacing: -0.02em;
      }

      .dash-rings-legend-item small {
        font-size: 11px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }

      .dash-rings-value--over {
        color: #dc2626;
      }

      .dash-rings-summary {
        margin: 6px 0 0;
        text-align: center;
      }

      .dash-rings-summary-main {
        margin: 0;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.35;
      }

      .dash-rings-summary-detail {
        margin: 4px 0 0;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.4;
        color: var(--nutri-text-muted, #64748b);
      }

      .dash-rings-summary--ok .dash-rings-summary-main,
      .dash-rings-summary--neutral .dash-rings-summary-main {
        color: var(--nutri-food-accent, #2563eb);
      }

      .dash-rings-summary--over .dash-rings-summary-main {
        color: #dc2626;
      }

      .dash-macro-strip {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        margin-top: 8px;
        opacity: 0.62;
      }

      .dash-macro-strip--active {
        opacity: 1;
      }

      .dash-macro-strip-item {
        min-width: 0;
        padding: 6px 7px;
        border-radius: 10px;
        background: rgba(248, 250, 252, 0.92);
        border: 1px solid var(--nutri-border, #e2e8f0);
      }

      .dash-macro-strip-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 4px;
        margin-bottom: 4px;
      }

      .dash-macro-strip-label {
        font-size: 9px;
        font-weight: 800;
        color: var(--nutri-text-muted, #64748b);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dash-macro-strip-value {
        font-size: 10px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        white-space: nowrap;
      }

      .dash-macro-strip-value small {
        font-size: 9px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
      }

      .dash-macro-strip-track {
        height: 4px;
        border-radius: 999px;
        background: rgba(148, 163, 184, 0.22);
        overflow: hidden;
      }

      .dash-macro-strip-fill {
        display: block;
        height: 100%;
        border-radius: inherit;
        transition: width 0.35s ease;
      }

      .dash-macro-strip-item--protein .dash-macro-strip-fill {
        background: #e11d48;
      }

      .dash-macro-strip-item--carbs .dash-macro-strip-fill {
        background: #f59e0b;
      }

      .dash-macro-strip-item--fat .dash-macro-strip-fill {
        background: #8b5cf6;
      }

      .dash-macro-strip-short {
        display: block;
        margin-top: 3px;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 0.04em;
        color: var(--nutri-text-muted, #94a3b8);
        text-transform: uppercase;
      }

      .dash-quick-fab {
        position: fixed;
        right: max(16px, env(safe-area-inset-right));
        bottom: calc(72px + env(safe-area-inset-bottom));
        z-index: 860;
      }

      .dash-quick-fab-backdrop {
        position: fixed;
        inset: 0;
        z-index: -1;
        border: none;
        background: rgba(15, 23, 42, 0.22);
        cursor: pointer;
      }

      .dash-quick-fab-stack {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
      }

      .dash-quick-fab-main {
        width: 52px;
        height: 52px;
        border: none;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #0f172a;
        color: #fff;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.32);
        cursor: pointer;
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .dash-quick-fab.is-open .dash-quick-fab-main {
        transform: rotate(45deg);
        background: #334155;
      }

      .dash-quick-fab-option {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        border-radius: 999px;
        padding: 10px 14px 10px 12px;
        font-size: 13px;
        font-weight: 800;
        color: #fff;
        cursor: pointer;
        min-height: 42px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
        animation: dashQuickFabIn 0.18s ease;
      }

      @keyframes dashQuickFabIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .dash-quick-fab-option--food {
        background: var(--nutri-food-accent, #2563eb);
      }

      .dash-quick-fab-option--activity {
        background: var(--nutri-activity-accent, #059669);
      }

      .dash-home-summary {
        padding: 14px 14px 16px;
        border-radius: var(--nutri-radius-lg, 18px);
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
      }

      .dash-home-summary-head {
        margin-bottom: 12px;
      }

      .dash-home-summary-title {
        margin: 0;
        font-size: 16px;
        font-weight: 900;
        letter-spacing: -0.02em;
        color: var(--nutri-text-dark, #0f172a);
      }

      .dash-home-summary-desc {
        margin: 4px 0 0;
        font-size: 12px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }

      .dash-home-summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      .dash-home-summary-over {
        grid-column: 1 / -1;
        padding: 8px 10px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 800;
        text-align: center;
        color: #b91c1c;
        background: rgba(254, 242, 242, 0.9);
        border: 1px solid rgba(239, 68, 68, 0.2);
      }

      .dash-home-summary-net {
        margin: 10px 0 0;
        font-size: 11px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
        text-align: center;
      }

      .dash-home-summary-advice {
        margin-top: 14px;
        padding: 12px 12px 14px;
        border-radius: 14px;
        background: var(--nutri-health-blue-soft, #eff6ff);
        border: 1px solid color-mix(in srgb, var(--nutri-food-accent, #2563eb) 18%, var(--nutri-border));
      }

      .dash-home-summary-advice-title {
        margin: 0 0 6px;
        font-size: 13px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }

      .dash-home-summary-advice-body {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.5;
        color: #334155;
      }

      .dash-home-summary-advice-body--muted {
        color: var(--nutri-text-muted, #64748b);
      }

      .dash-home-menu-pick {
        margin-top: 12px;
        padding: 12px 12px 14px;
        border-radius: var(--nutri-radius-lg, 18px);
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
      }

      .dash-home-menu-pick-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 10px;
      }

      .dash-home-menu-pick-title {
        margin: 0;
        font-size: 15px;
        font-weight: 900;
        letter-spacing: -0.02em;
        line-height: 1.25;
        flex: 1;
        min-width: 0;
      }

      .dash-home-menu-pick-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: flex-end;
      }

      .dash-home-menu-pick-link {
        border: none;
        background: var(--nutri-health-blue-soft, #eff6ff);
        color: var(--nutri-food-accent, #2563eb);
        font-size: 11px;
        font-weight: 800;
        padding: 6px 8px;
        border-radius: 999px;
        cursor: pointer;
        min-height: 32px;
        white-space: nowrap;
      }

      .dash-home-menu-pick-link:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .dash-home-menu-pick-loading,
      .dash-home-menu-pick-empty {
        margin: 0;
        padding: 12px 10px;
        font-size: 13px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
        text-align: center;
        border-radius: 12px;
        background: var(--nutri-bg-soft, #f8fafc);
      }

      .dash-home-menu-pick .nutri-menu-card--home-compact {
        margin: 0;
      }

      .nutri-menu-card--home-compact {
        padding: 10px 10px 8px;
        border-radius: 14px;
        background: var(--nutri-bg-soft, #f8fafc);
        border: 1px solid var(--nutri-border, #e2e8f0);
      }

      .nutri-menu-home-compact-top {
        display: flex;
        gap: 8px;
        align-items: flex-start;
      }

      .nutri-menu-home-compact-icon {
        font-size: 22px;
        line-height: 1.2;
        flex-shrink: 0;
      }

      .nutri-menu-home-compact-main {
        flex: 1;
        min-width: 0;
      }

      .nutri-menu-card--home-compact .nutri-menu-card-name {
        margin: 0 0 6px;
        font-size: 15px;
        line-height: 1.3;
        word-break: normal;
        overflow-wrap: anywhere;
      }

      .nutri-menu-card-badges--compact {
        margin-bottom: 0;
      }

      .nutri-menu-card-badges--compact .nutri-menu-badge {
        font-size: 10px;
        padding: 3px 7px;
      }

      .nutri-menu-card-reason--compact {
        margin: 8px 0 0;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.35;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-menu-home-stats-line {
        margin: 8px 0 10px;
        padding: 8px 10px;
        border-radius: 10px;
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-text-dark, #0f172a);
        line-height: 1.4;
        flex-wrap: wrap;
      }

      .nutri-menu-home-stats-line strong {
        color: var(--nutri-food-accent, #2563eb);
        font-size: 13px;
      }

      .nutri-menu-home-stats-sep {
        margin: 0 4px;
        color: var(--nutri-text-muted, #94a3b8);
        font-weight: 600;
      }

      .nutri-menu-home-stats-portion {
        color: var(--nutri-text-muted, #64748b);
        font-weight: 600;
      }

      .nutri-menu-card-actions--home-compact {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        margin: 0;
      }

      .nutri-menu-card-actions--home-compact .nutri-menu-btn--primary {
        flex: 1;
        min-height: 42px;
        padding: 10px 12px;
        font-size: 13px;
        background: var(--nutri-food-accent, #2563eb);
      }

      .nutri-menu-card-actions--home-compact .nutri-menu-btn--text {
        flex-shrink: 0;
        min-height: 42px;
        padding: 8px 10px;
        font-size: 12px;
      }

      .nutri-menu-macro--protein strong {
        color: #dc2626;
      }

      .nutri-menu-macro--carbs strong {
        color: #ea580c;
      }

      .nutri-menu-macro--fat strong {
        color: #7c3aed;
      }

      @media (min-width: 769px) {
        .dash-home-summary-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 900px) {
        .app-main--mobile .dash-status-hero--compact {
          display: none !important;
        }

        .app-main--mobile.app-main-tab-dashboard .dashboard-home-simple {
          padding-bottom: calc(84px + env(safe-area-inset-bottom));
        }

        .app-main.app-main--mobile {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .app-main--mobile .dash-home-summary {
          margin-top: 4px;
        }
      }

      @media (min-width: 769px) {
        .dash-quick-fab {
          display: none;
        }
      }

      .dash-secondary-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .nutri-metric-card {
        padding: 12px 14px;
        border-radius: var(--nutri-radius-md);
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
      }

      .nutri-metric-card--primary {
        border-color: color-mix(in srgb, var(--nutri-health-blue) 25%, var(--nutri-border));
        background: var(--nutri-health-blue-soft, #eff6ff);
      }

      .nutri-metric-card--success {
        border-color: color-mix(in srgb, var(--nutri-health-green) 25%, var(--nutri-border));
        background: var(--nutri-health-green-soft, #ecfdf5);
      }

      .nutri-metric-card-head {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
      }

      .nutri-metric-card-label {
        font-size: var(--nutri-font-small);
        font-weight: 800;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-metric-card-value-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .nutri-metric-card-value {
        font-size: clamp(22px, 4vw, 28px);
        font-weight: 900;
        line-height: 1;
        color: var(--nutri-text-dark, #0f172a);
        letter-spacing: -0.03em;
      }

      .nutri-metric-card-unit {
        font-size: var(--nutri-font-small);
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-cal-progress {
        margin-top: 4px;
      }

      .nutri-cal-progress-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .nutri-cal-progress-label {
        font-size: var(--nutri-font-small);
        font-weight: 800;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-cal-progress-stats strong {
        font-size: 18px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }

      .nutri-cal-progress-of {
        font-size: var(--nutri-font-small);
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-cal-progress-track {
        height: 10px;
        border-radius: 999px;
        background: #e2e8f0;
        overflow: hidden;
      }

      .nutri-cal-progress-fill {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--nutri-health-green, #059669), var(--nutri-health-blue, #2563eb));
        transition: width 0.25s ease;
      }

      .nutri-cal-progress-track.is-over .nutri-cal-progress-fill {
        background: var(--nutri-warning, #d97706);
      }

      .nutri-cal-progress-foot {
        margin: 6px 0 0;
        font-size: var(--nutri-font-small);
        font-weight: 700;
        color: var(--nutri-health-green, #059669);
      }

      .nutri-cal-progress-foot.is-over {
        color: var(--nutri-warning, #d97706);
      }

      .nutri-menu-card-grid {
        display: grid;
        gap: 12px;
      }

      .nutri-menu-card {
        display: grid;
        grid-template-columns: 72px minmax(0, 1fr);
        gap: 12px;
        padding: 14px;
        border-radius: var(--nutri-radius-lg);
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
      }

      /* หน้าหลัก — ไม่ใช้ grid 72px ของการ์ด AI ทั่วไป (โน๊ตบุ๊กเคยบีบชื่อเมนูเป็นตัวต่อตัว) */
      .nutri-menu-card--home-compact {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }

      .nutri-menu-card-visual {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-radius: 14px;
        background: var(--nutri-health-green-soft, #ecfdf5);
        min-height: 72px;
      }

      .nutri-menu-card-visual-icon {
        font-size: 24px;
        line-height: 1;
      }

      .nutri-menu-card-index {
        font-size: 11px;
        font-weight: 800;
        color: var(--nutri-health-green, #059669);
      }

      .nutri-menu-card-name {
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        line-height: 1.35;
      }

      .nutri-menu-card-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 10px;
      }

      .nutri-menu-badge {
        font-size: 11px;
        font-weight: 800;
        padding: 4px 8px;
        border-radius: 999px;
      }

      .nutri-menu-badge--fit {
        background: var(--nutri-health-blue-soft, #eff6ff);
        color: var(--nutri-health-blue, #2563eb);
      }

      .nutri-menu-badge--protein {
        background: #f0fdf4;
        color: #166534;
      }

      .nutri-menu-badge--gi {
        background: #ecfdf5;
        color: #047857;
      }

      .nutri-menu-card-macros {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 12px;
      }

      .nutri-menu-macro {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .nutri-menu-macro strong {
        font-size: 14px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }

      .nutri-menu-macro span {
        font-size: 10px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-menu-macro--cal strong {
        color: var(--nutri-health-blue, #2563eb);
        font-size: 18px;
      }

      .nutri-menu-card-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .nutri-menu-btn {
        border-radius: 12px;
        padding: 10px 14px;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        min-height: 44px;
      }

      .nutri-menu-btn--primary {
        border: none;
        background: var(--nutri-health-green, #059669);
        color: #fff;
        flex: 1;
      }

      .nutri-menu-btn--ghost {
        border: 1px solid var(--nutri-border, #e2e8f0);
        background: #fff;
        color: var(--nutri-text-dark, #0f172a);
      }

      .nutri-menu-btn--text {
        border: none;
        background: transparent;
        color: var(--nutri-text-muted, #64748b);
        min-height: auto;
        padding: 8px;
      }

      .nutri-menu-card-detail,
      .nutri-menu-card-meal-hint {
        margin: 8px 0 0;
        font-size: var(--nutri-font-small);
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }

      .log-search-hero-label {
        display: block;
        margin-bottom: 8px;
        font-size: var(--nutri-font-body);
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }

      .log-search-hero-row {
        display: flex;
        gap: 10px;
        align-items: stretch;
      }

      .log-search-hero-input-wrap {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 14px;
        min-height: 52px;
        border-radius: 14px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        background: #fff;
      }

      .log-search-hero-icon {
        color: var(--nutri-text-muted, #64748b);
        flex-shrink: 0;
      }

      .log-search-hero-input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 16px;
        font-weight: 600;
        color: var(--nutri-text-dark, #0f172a);
        outline: none;
        min-width: 0;
      }

      .log-search-filter-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0 14px;
        min-height: 52px;
        border-radius: 14px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        background: #fff;
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
        cursor: pointer;
        white-space: nowrap;
      }

      .log-search-item-card {
        border-radius: 14px !important;
        margin-bottom: 8px;
      }

      .log-add-food-fab {
        position: fixed;
        right: max(16px, env(safe-area-inset-right));
        bottom: calc(72px + env(safe-area-inset-bottom));
        z-index: 850;
        border: none;
        border-radius: 999px;
        padding: 14px 18px;
        background: var(--nutri-food-accent, #2563eb);
        color: #fff;
        font-size: 14px;
        font-weight: 900;
        box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35);
        cursor: pointer;
        min-height: 48px;
      }

      .nutri-filter-sheet-overlay {
        position: fixed;
        inset: 0;
        z-index: 1100;
        background: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }

      .nutri-filter-sheet {
        width: min(520px, 100%);
        max-height: 85vh;
        overflow: auto;
        background: #fff;
        border-radius: 20px 20px 0 0;
        padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
      }

      .nutri-filter-sheet-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .nutri-filter-sheet-head h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 900;
      }

      .nutri-filter-sheet-close {
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-filter-group + .nutri-filter-group {
        margin-top: 16px;
      }

      .nutri-filter-group h3 {
        margin: 0 0 8px;
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-muted, #64748b);
      }

      .nutri-filter-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .nutri-filter-chip {
        border: 1px solid var(--nutri-border, #e2e8f0);
        border-radius: 999px;
        padding: 10px 14px;
        background: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        min-height: 44px;
      }

      .nutri-filter-chip.is-active {
        background: var(--nutri-health-blue-soft, #eff6ff);
        border-color: var(--nutri-health-blue, #2563eb);
        color: var(--nutri-health-blue, #2563eb);
      }

      .nutri-filter-sheet-foot {
        display: flex;
        gap: 10px;
        margin-top: 18px;
      }

      .nutri-filter-reset,
      .nutri-filter-apply {
        flex: 1;
        min-height: 48px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
      }

      .nutri-filter-reset {
        border: 1px solid var(--nutri-border, #e2e8f0);
        background: #fff;
      }

      .nutri-filter-apply {
        border: none;
        background: var(--nutri-health-green, #059669);
        color: #fff;
      }

      @media (min-width: 769px) {
        .nutri-filter-sheet-overlay {
          align-items: center;
          padding: 16px;
        }
        .nutri-filter-sheet {
          border-radius: 20px;
        }
        .dash-status-metrics {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .nutri-menu-card-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .log-add-food-fab {
          display: none;
        }
      }

      @media (min-width: 1024px) {
        .dashboard-home-simple {
          max-width: 960px;
        }
      }

      @media (max-width: 768px) {
        .dash-status-hero-head {
          flex-direction: column;
        }
        .dash-status-hero-actions {
          width: 100%;
          min-width: 0;
        }
        .dash-status-hero-cta {
          width: 100%;
        }
        .user-guide-start-actions {
          grid-template-columns: 1fr;
        }
        .nutri-menu-card {
          grid-template-columns: 1fr;
        }
        .nutri-menu-card-visual {
          flex-direction: row;
          min-height: auto;
          padding: 10px 12px;
        }
        .log-search-filter-btn span {
          display: none;
        }
      }
      .login-page-bg.nutri-page-bg {
        background: #eef2f7;
      }
      html, body, #root {
        background-color: #ffffff;
      }
      .nutri-blurred-food-bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
      }
      .nutri-blurred-food-bg-image {
        position: absolute;
        inset: -24px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        filter: blur(10px) saturate(1.18) brightness(1.02);
        transform: scale(1.04);
      }
      .nutri-blurred-food-bg-scrim {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.08);
      }
      .login-page-bg .nutri-blurred-food-bg-image {
        filter: blur(6px) saturate(1.2) brightness(1.03);
      }
      .login-page-bg .nutri-blurred-food-bg-scrim {
        background: rgba(255, 255, 255, 0.06);
      }
      .app-sidebar {
        background: var(--nutri-sidebar-bg, #0F172A) !important;
        border-right-color: rgba(255, 255, 255, 0.08) !important;
      }
      .app-sidebar .sidebar-logo-wrap,
      .app-sidebar .sidebar-logo-wrap * {
        color: #F8FAFC !important;
      }
      .app-sidebar .nav-link-pro {
        color: rgba(255, 255, 255, 0.72) !important;
      }
      .app-sidebar .nav-link-active {
        color: #FFFFFF !important;
        background: rgba(255, 255, 255, 0.08) !important;
        box-shadow: inset 3px 0 0 #F472B6 !important;
      }
      .app-sidebar .nav-link-pro svg {
        color: inherit !important;
        fill: currentColor;
      }
      .app-header {
        background: linear-gradient(
          180deg,
          #ffffff 0%,
          color-mix(in srgb, var(--nutri-primary) 4%, #fff) 100%
        ) !important;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border-bottom: 1px solid #e2e8f0 !important;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
      }
      .header-title-wrap {
        color: #1E293B !important;
      }
      .app-header-context {
        display: grid;
        grid-template-columns: minmax(180px, 1.1fr) minmax(220px, 1.4fr) auto;
        align-items: center;
        gap: 16px;
        padding: max(16px, env(safe-area-inset-top)) 28px 16px !important;
      }
      .app-header-text {
        min-width: 0;
      }
      .app-header-title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .app-header-page-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        flex-shrink: 0;
        color: var(--nutri-primary, #f472b6);
        background: color-mix(in srgb, var(--nutri-primary) 14%, #fff);
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 22%, #e2e8f0);
      }
      .app-header-page-title {
        margin: 0;
        font-size: clamp(18px, 4vw, 22px);
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        line-height: 1.2;
      }
      .app-header-page-tagline {
        margin: 4px 0 0 48px;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.4;
        color: var(--nutri-text-muted, #64748b);
        max-width: 42ch;
      }
      .app-header-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
        min-width: 0;
      }
      .app-header-chip {
        display: inline-flex;
        align-items: center;
        padding: 7px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-text-dark, #1e293b);
        background: #fff;
        border: 1px solid color-mix(in srgb, var(--nutri-border, #e2e8f0) 88%, transparent);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        white-space: nowrap;
      }
      .app-header-chip--date {
        color: var(--nutri-text-muted, #64748b);
        background: color-mix(in srgb, var(--nutri-bg-soft, #f8fafc) 80%, #fff);
      }
      .app-header-chip--accent {
        color: var(--nutri-primary-dark, #be185d);
        background: color-mix(in srgb, var(--nutri-primary) 10%, #fff);
        border-color: color-mix(in srgb, var(--nutri-primary) 24%, #e2e8f0);
      }
      .app-header-user {
        flex-shrink: 0;
        font-size: 14px !important;
      }
      .app-header-user-card {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px 8px 8px;
        border-radius: 999px;
        background: #fff;
        border: 1px solid color-mix(in srgb, var(--nutri-border, #e2e8f0) 88%, transparent);
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
      }
      .app-header-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 0.03em;
        color: #fff;
        background: linear-gradient(
          135deg,
          var(--nutri-primary, #f472b6),
          color-mix(in srgb, var(--nutri-primary) 70%, #6366f1)
        );
      }
      .app-header-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .app-header-user-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1px;
        min-width: 0;
        line-height: 1.2;
      }
      .app-header-user-text strong {
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .app-header-user-text small {
        font-size: 11px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }
      .app-header-wave {
        flex-shrink: 0;
        color: var(--nutri-text-muted, #64748b);
        font-size: 18px;
      }
      .app-main {
        position: relative;
        isolation: isolate;
        min-height: 100vh;
        min-width: 0;
        overflow-x: clip;
        margin-left: 260px;
      }
      .app-scroll {
        padding: 34px;
        max-width: 100%;
        box-sizing: border-box;
      }
      .app-main > .app-header,
      .app-main > .app-scroll {
        position: relative;
        z-index: 2;
      }
      .login-page-bg .login-overlay-veil {
        background: transparent !important;
        z-index: 2;
      }
      .login-page-bg .login-shell-responsive,
      .login-page-bg .login-shell-theme-live {
        position: relative;
        z-index: 3;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-header {
        background: #ffffff !important;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border-bottom: 1px solid #e2e8f0 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-sidebar {
        background: var(--nutri-sidebar-bg, #0F172A) !important;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border-right-color: rgba(255, 255, 255, 0.08) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .responsive-card,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .stat-card-animate,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .dashboard-card-shell {
        background: #ffffff !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.05) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-sidebar .sidebar-logo-wrap,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-sidebar .sidebar-logo-wrap *,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-sidebar .nav-link-pro {
        color: rgba(255, 255, 255, 0.78) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-sidebar .nav-link-active {
        color: #FFFFFF !important;
        background: rgba(255, 255, 255, 0.10) !important;
        box-shadow: inset 3px 0 0 #F472B6 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-sidebar .nav-link-pro svg {
        color: inherit !important;
        fill: currentColor;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .stat-card-animate small {
        color: #475569 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .stat-card-animate b {
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .responsive-card input,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .responsive-card select,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .responsive-card textarea {
        background: rgba(255, 255, 255, 0.88) !important;
        border-color: rgba(148, 163, 184, 0.55) !important;
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .responsive-card input::placeholder {
        color: #64748B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .ai-shell-glow {
        background: #ffffff !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.05) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .ai-menu-recommend-panel {
        background: #f8fafc !important;
        backdrop-filter: none !important;
        border: 1px solid #e2e8f0 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .ai-menu-recommend-card {
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .ai-activity-suggest-panel {
        background: #fffbeb !important;
        backdrop-filter: none !important;
        border: 1px solid #fde68a !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .what-if-simulator-panel {
        background: #ffffff !important;
        backdrop-filter: none !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .dashboard-records-slot p,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .custom-food-hint-text,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .meal-empty-text {
        color: #64748B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .daily-net-card,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .daily-advice-hero,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .meal-insight-text {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .daily-meals-advice-summary {
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05) !important;
      }
      .profile-weight-chart-wrap {
        min-width: 0;
        min-height: 320px;
      }
      .profile-weight-chart-note {
        margin: 0 0 4px;
        font-size: 12px;
        font-weight: 700;
        color: #64748B;
        line-height: 1.45;
      }
      .profile-weight-chart-note--sim {
        padding: 8px 10px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--nutri-primary) 10%, #fff);
        color: var(--nutri-primary-dark, #1e40af);
      }
      .history-chart-note {
        margin: 0 0 10px;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        background: rgba(148, 163, 184, 0.12);
        line-height: 1.45;
      }
      .history-chart-note--sim {
        color: #b45309;
        background: rgba(251, 191, 36, 0.14);
      }
      .history-day-list-sim-note {
        margin-bottom: 12px;
      }
      .history-day-simulated {
        border-style: dashed !important;
        background: color-mix(in srgb, var(--nutri-warning, #f59e0b) 4%, #fff);
      }
      .history-day-sim-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.02em;
        color: #b45309;
        background: rgba(251, 191, 36, 0.18);
        border: 1px solid rgba(251, 191, 36, 0.35);
      }
      .history-day-sim-detail {
        margin: 0 0 10px;
        padding: 8px 10px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 600;
        color: #b45309;
        background: rgba(251, 191, 36, 0.1);
        line-height: 1.45;
      }
      .history-month-group {
        display: flex;
        flex-direction: column;
        gap: 0;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 14%, var(--nutri-border, #e2e8f0));
        background: #fff;
      }
      .history-month-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        padding: 12px 14px;
        border: none;
        background: color-mix(in srgb, var(--nutri-primary) 8%, #fff);
        cursor: pointer;
        text-align: left;
        transition: background 0.2s ease;
      }
      .history-month-header:hover {
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
      }
      .history-month-head {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        flex: 1;
      }
      .history-month-title {
        font-size: 15px;
        font-weight: 800;
        color: var(--nutri-text-dark, #1e293b);
      }
      .history-month-preview {
        font-size: 12px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }
      .history-month-meta {
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
        white-space: nowrap;
      }
      .history-month-chevron {
        flex-shrink: 0;
        color: var(--nutri-text-muted, #64748b);
        transition: transform 0.25s ease;
      }
      .history-month-group.is-open .history-month-chevron {
        transform: rotate(180deg);
      }
      .history-month-days {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        border-top: 1px solid color-mix(in srgb, var(--nutri-border, #e2e8f0) 80%, transparent);
        background: color-mix(in srgb, var(--nutri-bg-soft, #f8fafc) 60%, #fff);
      }
      .history-combined-chart-wrap {
        width: 100%;
        height: 340px;
        margin-top: 10px;
        padding: 12px 8px 4px;
        border-radius: 16px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--nutri-primary) 4%, #fff) 0%, #fff 42%, color-mix(in srgb, var(--nutri-success) 3%, #fff) 100%);
        border: 1px solid color-mix(in srgb, var(--nutri-border) 70%, transparent);
      }
      .history-chart-tooltip {
        min-width: 168px;
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
      }
      .history-chart-tooltip-title {
        margin: 0 0 10px;
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-dark, #1e293b);
        line-height: 1.35;
      }
      .history-chart-tooltip-empty {
        margin: 0;
        font-size: 12px;
        color: var(--nutri-text-muted, #64748b);
      }
      .history-chart-tooltip-row {
        display: grid;
        grid-template-columns: 8px 1fr auto;
        align-items: center;
        gap: 8px;
        margin: 0 0 6px;
        font-size: 12px;
        color: var(--nutri-text-muted, #64748b);
      }
      .history-chart-tooltip-row b {
        font-size: 13px;
        font-weight: 800;
      }
      .history-chart-tooltip-row--food b {
        color: var(--nutri-primary, #f472b6);
      }
      .history-chart-tooltip-row--activity b {
        color: var(--nutri-success, #059669);
      }
      .history-chart-tooltip-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #fff;
      }
      .history-chart-tooltip-row--food .history-chart-tooltip-dot {
        background: var(--nutri-primary, #f472b6);
      }
      .history-chart-tooltip-row--activity .history-chart-tooltip-dot {
        background: var(--nutri-success, #059669);
      }
      .history-chart-tooltip-net {
        margin: 8px 0 0;
        padding-top: 8px;
        border-top: 1px dashed rgba(148, 163, 184, 0.45);
        font-size: 12px;
        color: var(--nutri-text-muted, #64748b);
      }
      .history-chart-tooltip-net b {
        color: var(--nutri-text-dark, #1e293b);
      }
      .history-chart-tooltip-meta {
        margin: 6px 0 0;
        font-size: 11px;
        line-height: 1.45;
        color: var(--nutri-text-muted, #64748b);
      }
      .history-chart-legend-item {
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
        padding: 0 4px;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .profile-weight-chart-note {
        color: #475569 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .profile-weight-chart-card {
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .header-title-wrap {
        color: #1E293B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .history-hero-card {
        background: #ffffff !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        color: #1E293B !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.05) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .history-hero-title,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .history-hero-title svg {
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .history-kpi-box {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        color: #1E293B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .history-kpi-box small {
        color: #64748B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .history-hero-subtext {
        color: #475569 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .history-hero-subtext b {
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .app-main .profile-hero-card {
        background: #ffffff !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        color: #0F172A !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.05) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .profile-hero-name,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .profile-hero-card h1 {
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .profile-hero-meta {
        color: #334155 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .profile-avatar-hint {
        color: #475569 !important;
      }
      .hover-lift-card {
        transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
      }
      .app-main .hover-lift-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.06) !important;
        border-color: #cbd5e1 !important;
      }
      .app-main .stat-card-animate:hover {
        transform: translateY(-3px) scale(1.01);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.06) !important;
      }
      .stat-card-animate {
        transition: transform 180ms ease, box-shadow 180ms ease;
        overflow: visible;
        position: relative;
        z-index: 1;
      }
      .stat-card-animate:has(.stat-card-tooltip-wrap.is-open) {
        z-index: 90;
      }
      .stat-card-tooltip-wrap {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
        margin-left: 4px;
      }
      .stat-card-tooltip-wrap.is-open::before {
        content: "";
        position: absolute;
        left: -6px;
        right: -6px;
        bottom: 100%;
        height: 18px;
      }
      .stat-info-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        padding: 0;
        border: none;
        border-radius: 999px;
        background: var(--nutri-bg-soft);
        color: var(--nutri-text-muted);
        cursor: help;
        transition: background 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
      }
      .stat-info-btn:hover,
      .stat-info-btn:focus-visible,
      .stat-card-tooltip-wrap.is-open .stat-info-btn {
        background: var(--nutri-accent-alpha-15);
        color: var(--nutri-primary);
        box-shadow: 0 0 0 3px var(--nutri-accent-alpha-12);
        outline: none;
      }
      .stat-card-tooltip {
        position: absolute;
        left: 50%;
        bottom: calc(100% + 10px);
        transform: translateX(-50%) translateY(6px) scale(0.98);
        width: min(288px, calc(100vw - 32px));
        padding: 0;
        background: var(--nutri-surface);
        color: var(--nutri-text-body);
        border: 1px solid var(--nutri-border);
        border-radius: 14px;
        box-shadow:
          0 4px 6px rgba(15, 23, 42, 0.04),
          0 16px 32px rgba(15, 23, 42, 0.12);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
          opacity 0ms linear,
          transform 120ms ease,
          visibility 0ms linear 120ms;
        z-index: 100;
        text-align: left;
        overflow: hidden;
      }
      .stat-card-tooltip-wrap.is-open .stat-card-tooltip,
      .stat-card-tooltip-wrap:hover .stat-card-tooltip,
      .stat-card-tooltip-wrap:focus-within .stat-card-tooltip {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateX(-50%) translateY(0) scale(1);
        transition:
          opacity 0ms linear,
          transform 120ms ease,
          visibility 0ms linear;
      }
      .stat-card-tooltip::before {
        content: "";
        display: block;
        height: 3px;
        background: var(--nutri-gradient-primary);
      }
      .stat-card-tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 7px solid transparent;
        border-top-color: var(--nutri-surface);
        filter: drop-shadow(0 2px 1px rgba(15, 23, 42, 0.06));
      }
      .stat-card-tooltip-head {
        padding: 12px 14px 0;
      }
      .stat-card-tooltip-title {
        display: block;
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-secondary);
        letter-spacing: -0.2px;
        line-height: 1.3;
      }
      .stat-card-tooltip-subtitle {
        display: block;
        margin-top: 2px;
        font-size: 10px;
        font-weight: 700;
        color: var(--nutri-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        line-height: 1.3;
      }
      .stat-card-tooltip-body {
        margin: 8px 0 0;
        padding: 0 14px;
        font-size: 12px;
        line-height: 1.6;
        font-weight: 500;
        color: var(--nutri-text-body);
      }
      .stat-card-tooltip-ranges {
        list-style: none;
        margin: 10px 14px 0;
        padding: 8px 10px;
        background: var(--nutri-bg-soft);
        border-radius: 10px;
        border: 1px solid var(--nutri-border);
      }
      .stat-card-tooltip-ranges li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 4px 0;
        font-size: 11px;
        line-height: 1.4;
      }
      .stat-card-tooltip-ranges li + li {
        border-top: 1px solid var(--nutri-border);
        margin-top: 2px;
        padding-top: 6px;
      }
      .stat-card-tooltip-range {
        font-weight: 700;
        color: var(--nutri-secondary);
        font-variant-numeric: tabular-nums;
      }
      .stat-card-tooltip-range-label {
        font-weight: 600;
        color: var(--nutri-text-muted);
      }
      .stat-card-tooltip-note {
        margin: 10px 0 0;
        padding: 8px 14px 12px;
        font-size: 11px;
        line-height: 1.5;
        font-weight: 600;
        color: var(--nutri-primary-dark);
        background: var(--nutri-accent-alpha-12);
        border-top: 1px solid var(--nutri-accent-alpha-15);
      }
      .stat-card-tooltip--fixed {
        position: fixed;
        bottom: auto;
        left: 0;
        top: 0;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: none;
        z-index: 1200;
      }
      .stat-card-tooltip--fixed.is-visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
      .stat-card-tooltip--fixed::after {
        display: none;
      }
      .stat-info-dot {
        display: none;
      }

      .nav-link-label-full {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .sidebar-nav-info-tip .stat-info-btn {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.85);
      }
      .sidebar-nav-info-tip .stat-info-btn:hover,
      .sidebar-nav-info-tip.is-open .stat-info-btn {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }
      .sidebar-nav-info-tip .stat-card-tooltip {
        left: auto;
        right: 0;
        transform: translateX(0) translateY(6px) scale(0.98);
      }
      .sidebar-nav-info-tip.is-open .stat-card-tooltip,
      .sidebar-nav-info-tip:hover .stat-card-tooltip,
      .sidebar-nav-info-tip:focus-within .stat-card-tooltip {
        transform: translateX(0) translateY(0) scale(1);
      }
      .sidebar-guide-wrap {
        padding: 0 12px 8px;
      }
      .sidebar-guide-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 12px 16px;
        border: 1px dashed rgba(255, 255, 255, 0.22);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.88);
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
      }
      .sidebar-guide-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.35);
      }

      .user-guide-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(15, 23, 42, 0.55);
        backdrop-filter: blur(4px);
      }
      .user-guide-foot--simple .user-guide-close-btn {
        width: 100%;
      }
      .user-guide-foot--simple {
        flex-direction: column;
        gap: 8px;
      }
      .user-guide-start-btn {
        width: 100%;
        border: none;
        border-radius: 12px;
        padding: 12px 16px;
        background: var(--nutri-food-accent, #2563eb);
        color: #fff;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        min-height: 48px;
      }

      .user-guide-start-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        width: 100%;
      }

      .user-guide-start-btn--activity {
        background: var(--nutri-activity-accent, #059669);
      }

      .log-add-activity-fab {
        background: var(--nutri-activity-accent, #059669);
        box-shadow: 0 12px 28px rgba(5, 150, 105, 0.35);
      }

      .log-quick-pick--activity.is-active,
      .log-meal-tab-activity.is-active {
        border-color: color-mix(in srgb, var(--nutri-activity-accent, #059669) 35%, transparent);
        color: var(--nutri-activity-accent, #059669);
      }

      .app-header-help-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        border-radius: 999px;
        padding: 6px 12px;
        background: #fff;
        color: var(--nutri-text-dark, #0f172a);
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        min-height: 36px;
      }

      .app-page-hint {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 0 16px 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(255, 255, 255, 0.96));
        border: 1px solid rgba(59, 130, 246, 0.18);
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.06);
      }
      .app-page-hint-icon {
        flex-shrink: 0;
        margin-top: 1px;
        color: #2563eb;
        font-size: 18px;
      }
      .app-page-hint-text {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.55;
        color: #334155;
      }

      .home-action-grid {
        margin-bottom: 18px;
      }
      .home-action-grid-title {
        margin: 0 0 10px;
        font-size: 14px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }
      .home-action-grid-cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }
      .home-action-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        text-align: left;
        padding: 14px;
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.28);
        background: #fff;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
      }
      .home-action-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      }
      .home-action-card-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 12px;
      }
      .home-action-card--food .home-action-card-icon {
        color: var(--nutri-food-accent, #2563eb);
        background: var(--nutri-food-accent-soft, rgba(37, 99, 235, 0.14));
      }
      .home-action-card--activity .home-action-card-icon {
        color: var(--nutri-activity-accent, #059669);
        background: var(--nutri-activity-accent-soft, rgba(5, 150, 105, 0.14));
      }
      .home-action-card--meals .home-action-card-icon {
        color: #c2410c;
        background: rgba(251, 146, 60, 0.14);
      }
      .home-action-card-copy strong {
        display: block;
        font-size: 14px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        margin-bottom: 4px;
      }
      .home-action-card-copy small {
        display: block;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.45;
        color: #64748b;
      }
      .home-action-card--food:hover { border-color: rgba(37, 99, 235, 0.35); }
      .home-action-card--activity:hover { border-color: rgba(5, 150, 105, 0.35); }
      .home-action-card--meals:hover { border-color: rgba(251, 146, 60, 0.4); }

      .dash-section-label {
        margin: 0 0 8px;
        width: 100%;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.03em;
        color: #64748b;
      }
      .dash-body-section {
        margin-bottom: 16px;
      }

      .user-guide-start-btn--meals {
        width: 100%;
        background: linear-gradient(145deg, #f97316, #ea580c);
      }

      .nutri-quick-steps {
        padding: 14px 16px;
        border-radius: 16px;
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
      }

      .nutri-quick-steps-title {
        margin: 0 0 10px;
        font-size: 15px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }

      .nutri-quick-steps-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }

      .nutri-quick-steps-item {
        display: flex;
        gap: 10px;
        align-items: flex-start;
      }

      .nutri-quick-steps-num {
        width: 24px;
        height: 24px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--nutri-health-blue, #2563eb);
        color: #fff;
        font-size: 12px;
        font-weight: 900;
        flex-shrink: 0;
      }

      .nutri-quick-steps-copy strong {
        display: block;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }

      .nutri-quick-steps-copy p {
        margin: 2px 0 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
        line-height: 1.45;
      }

      .nutri-quick-steps-cta {
        width: 100%;
        margin-top: 12px;
        border: none;
        border-radius: 12px;
        padding: 12px 16px;
        background: var(--nutri-health-green, #059669);
        color: #fff;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        min-height: 48px;
      }

      .dash-meals-intro {
        padding: 14px 16px;
        border-radius: 14px;
        background: var(--nutri-health-blue-soft, #eff6ff);
        border: 1px solid color-mix(in srgb, var(--nutri-health-blue) 20%, var(--nutri-border));
      }

      .dash-meals-intro strong {
        display: block;
        font-size: 15px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        margin-bottom: 4px;
      }

      .dash-meals-intro p {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
        line-height: 1.45;
      }

      .dash-meals-empty-cta {
        padding: 16px;
        border-radius: 16px;
        background: #fff;
        border: 1px dashed var(--nutri-border, #e2e8f0);
        text-align: center;
      }

      .dash-meals-empty-cta p {
        margin: 0 0 12px;
        font-size: 14px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }

      .user-guide-modal--compact {
        width: min(440px, 100%);
        max-height: none;
      }
      .user-guide-quick-steps {
        list-style: none;
        margin: 0;
        padding: 16px 20px;
        display: grid;
        gap: 10px;
      }
      .user-guide-quick-step {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 14px;
        background: var(--nutri-bg-soft, #f8fafc);
        border: 1px solid var(--nutri-border, #e2e8f0);
      }
      .user-guide-quick-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        background: var(--nutri-primary);
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .user-guide-quick-icon {
        font-size: 22px;
        line-height: 1;
        flex-shrink: 0;
      }
      .user-guide-quick-copy {
        min-width: 0;
      }
      .user-guide-quick-title {
        display: block;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
        margin-bottom: 2px;
      }
      .user-guide-quick-text {
        margin: 0;
        font-size: 13px;
        line-height: 1.45;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }
      .user-guide-foot--simple {
        justify-content: center;
        padding-top: 4px;
      }
      .user-guide-foot--simple .user-guide-close-btn {
        width: 100%;
      }
      .user-guide-modal {
        width: min(640px, 100%);
        max-height: min(90vh, 860px);
        min-height: 0;
        display: flex;
        flex-direction: column;
        background: var(--nutri-surface, #fff);
        border-radius: 22px;
        box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
        overflow: hidden;
      }
      .user-guide-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        padding: 20px 20px 14px;
        border-bottom: 1px solid var(--nutri-border, #e2e8f0);
        background: linear-gradient(135deg, color-mix(in srgb, var(--nutri-primary) 10%, #fff) 0%, #fff 100%);
      }
      .user-guide-head-text {
        min-width: 0;
      }
      .user-guide-kicker {
        margin: 0 0 2px;
        font-size: 12px;
        font-weight: 800;
        color: var(--nutri-primary);
      }
      .user-guide-title {
        margin: 0;
        font-size: 24px;
        font-weight: 900;
        letter-spacing: -0.02em;
        color: var(--nutri-text-dark, #0f172a);
      }
      .user-guide-intro {
        margin: 6px 0 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--nutri-text-muted, #64748b);
      }
      .user-guide-close {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 999px;
        background: var(--nutri-bg-soft, #f1f5f9);
        color: var(--nutri-text-muted, #64748b);
        cursor: pointer;
      }
      .user-guide-close:hover {
        background: var(--nutri-accent-alpha-15, rgba(59, 130, 246, 0.15));
        color: var(--nutri-primary);
      }
      .user-guide-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 20px;
        border-bottom: 1px solid var(--nutri-border, #e2e8f0);
        background: #fff;
      }
      .user-guide-nav-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        border-radius: 999px;
        background: var(--nutri-bg-soft, #f8fafc);
        color: var(--nutri-text-body, #334155);
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
      }
      .user-guide-nav-btn.is-active,
      .user-guide-nav-btn:hover {
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        border-color: color-mix(in srgb, var(--nutri-primary) 30%, var(--nutri-border));
        color: var(--nutri-primary-dark, #1e40af);
      }
      .user-guide-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 14px 16px 10px;
      }
      .user-guide-panel {
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 22%, var(--nutri-border));
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
      }
      .user-guide-panel-head {
        padding: 16px 16px 12px;
        border-bottom: 1px solid var(--nutri-border, #e2e8f0);
        background: linear-gradient(180deg, color-mix(in srgb, var(--nutri-primary) 6%, #fff) 0%, #fff 100%);
      }
      .user-guide-panel-step {
        display: inline-block;
        margin-bottom: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        color: var(--nutri-primary-dark, #1e40af);
        font-size: 12px;
        font-weight: 800;
      }
      .user-guide-panel-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .user-guide-panel-icon {
        font-size: 22px;
        line-height: 1;
      }
      .user-guide-panel-title {
        margin: 0;
        font-size: 18px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }
      .user-guide-panel-summary {
        margin: 6px 0 0;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }
      .user-guide-panel-content {
        padding: 0 0 4px;
      }
      .user-guide-group + .user-guide-group {
        border-top: 1px solid var(--nutri-border, #e2e8f0);
      }
      .user-guide-group-title {
        margin: 0;
        padding: 14px 16px 8px;
        font-size: 14px;
        font-weight: 900;
        line-height: 1.4;
        color: var(--nutri-primary-dark, #1e40af);
      }
      .user-guide-list {
        margin: 0;
        padding: 0 12px 12px;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .user-guide-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--nutri-bg-soft, #f8fafc);
      }
      .user-guide-item-label {
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-primary-dark, #1e40af);
      }
      .user-guide-item-text {
        font-size: 14px;
        line-height: 1.55;
        color: var(--nutri-text-body, #334155);
      }
      .user-guide-foot {
        flex-shrink: 0;
        padding: 10px 20px 16px;
        border-top: 1px solid var(--nutri-border, #e2e8f0);
        text-align: center;
      }
      .user-guide-foot-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
      }
      .user-guide-step-btn {
        padding: 8px 12px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        border-radius: 999px;
        background: var(--nutri-bg-soft, #f8fafc);
        color: var(--nutri-text-body, #334155);
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }
      .user-guide-step-btn:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--nutri-primary) 30%, var(--nutri-border));
        color: var(--nutri-primary-dark, #1e40af);
      }
      .user-guide-step-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .user-guide-step-count {
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-muted, #64748b);
      }
      .user-guide-close-btn {
        width: 100%;
        max-width: 280px;
        padding: 12px 22px;
        border: none;
        border-radius: 999px;
        background: var(--nutri-primary);
        color: #fff;
        font-size: 15px;
        font-weight: 800;
        cursor: pointer;
      }
      .user-guide-close-btn:hover {
        filter: brightness(1.05);
      }
      @media (max-width: 520px) {
        .user-guide-nav {
          padding: 10px 12px;
          gap: 6px;
        }
        .user-guide-nav-btn {
          padding: 7px 10px;
          font-size: 12px;
        }
        .user-guide-list {
          padding: 10px;
        }
      }

      .feature-info-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
      }
      .dash-daily-goal {
        margin-bottom: 16px;
        padding: 14px 16px;
        border-radius: 16px;
        background: linear-gradient(135deg, color-mix(in srgb, var(--nutri-primary) 10%, #fff) 0%, #fff 100%);
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 20%, var(--nutri-border));
      }
      .dash-daily-goal-main {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .dash-daily-goal-label {
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-primary-dark, #1e40af);
      }
      .dash-daily-goal-value {
        font-size: 22px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        letter-spacing: -0.02em;
      }
      .dash-daily-goal-hint {
        margin: 6px 0 0;
        font-size: 13px;
        line-height: 1.45;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }
      .feature-info-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--nutri-bg-soft);
        border: 1px solid var(--nutri-border);
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-text-muted);
      }
      .feature-info-pill.is-highlight {
        background: color-mix(in srgb, var(--nutri-primary) 10%, #fff);
        border-color: color-mix(in srgb, var(--nutri-primary) 22%, var(--nutri-border));
        color: var(--nutri-primary-dark);
      }
      .feature-info-pill-value {
        font-size: 13px;
        font-weight: 900;
        color: var(--nutri-text-dark);
      }
      .feature-info-pill .stat-info-btn {
        width: 20px;
        height: 20px;
      }

      .dash-welcome-banner {
        margin-bottom: 16px;
        padding: 16px 18px;
        border-radius: 18px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--nutri-primary) 14%, #fff) 0%,
          color-mix(in srgb, var(--nutri-success, #16a34a) 8%, #fff) 100%
        );
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 22%, var(--nutri-border));
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
      }
      .dash-welcome-banner-main {
        display: flex;
        gap: 14px;
        align-items: flex-start;
      }
      .dash-welcome-banner-icon {
        font-size: 28px;
        line-height: 1;
        flex-shrink: 0;
      }
      .dash-welcome-banner-title {
        display: block;
        font-size: 17px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        margin-bottom: 4px;
      }
      .dash-welcome-banner-text {
        margin: 0 0 10px;
        font-size: 13px;
        line-height: 1.5;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }
      .dash-welcome-steps {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 6px;
      }
      .dash-welcome-steps li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-welcome-steps li span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        background: var(--nutri-primary);
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        flex-shrink: 0;
      }
      .dash-welcome-banner-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 14px;
      }
      .dash-welcome-primary,
      .dash-welcome-secondary {
        border: none;
        border-radius: 12px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .dash-welcome-primary {
        background: var(--nutri-primary);
        color: #fff;
        box-shadow: 0 8px 20px color-mix(in srgb, var(--nutri-primary) 35%, transparent);
      }
      .dash-welcome-secondary {
        background: rgba(255, 255, 255, 0.85);
        color: var(--nutri-primary-dark, #1e40af);
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 25%, var(--nutri-border));
      }
      .dash-welcome-primary:hover,
      .dash-welcome-secondary:hover {
        transform: translateY(-1px);
      }

      .dash-ai-deficit-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 8px;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        color: var(--nutri-primary-dark);
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 20%, transparent);
      }
      .dash-ai-simple-title {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
      }

      .meal-log-section-meta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .meal-gi-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
      }
      .meal-gi-badge--low {
        background: rgba(22, 163, 74, 0.12);
        color: #15803d;
      }
      .meal-gi-badge--mid {
        background: rgba(245, 158, 11, 0.14);
        color: #b45309;
      }
      .meal-gi-badge--high {
        background: rgba(239, 68, 68, 0.12);
        color: #b91c1c;
      }
      .meal-reward-stars-wrap {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .history-hero-title {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .history-hero-info-tip .stat-info-btn {
        background: rgba(255, 255, 255, 0.18);
        color: rgba(255, 255, 255, 0.95);
      }
      .history-hero-info-tip .stat-info-btn:hover,
      .history-hero-info-tip.is-open .stat-info-btn {
        background: rgba(255, 255, 255, 0.28);
        color: #fff;
      }

      .meal-section-advice {
        margin-top: 12px;
        padding: 14px 16px;
        border-radius: 14px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--meal-advice-accent, var(--nutri-primary)) 10%, var(--nutri-surface) 90%) 0%,
          var(--nutri-bg-soft) 100%
        );
        border: 1px solid color-mix(in srgb, var(--meal-advice-accent, var(--nutri-primary)) 28%, var(--nutri-border) 72%);
        border-left: 5px solid var(--meal-advice-accent, var(--nutri-primary));
        box-shadow: 0 4px 14px color-mix(in srgb, var(--meal-advice-accent, var(--nutri-primary)) 12%, transparent 88%);
      }
      .meal-section-advice-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }
      .meal-section-advice-badge {
        font-size: 12px;
        font-weight: 900;
        padding: 5px 12px;
        border-radius: 999px;
        letter-spacing: 0.2px;
      }
      .meal-section-advice-cal {
        font-size: 13px;
        font-weight: 900;
        color: var(--meal-advice-accent, var(--nutri-primary));
      }
      .meal-section-advice-line {
        margin: 0;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark);
        line-height: 1.55;
      }
      .meal-section-advice-line + .meal-section-advice-line {
        margin-top: 6px;
      }
      .meal-section-advice-tip {
        margin: 10px 0 0;
        padding: 10px 12px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--meal-advice-accent, var(--nutri-primary)) 8%, var(--nutri-surface) 92%);
        border: 1px dashed color-mix(in srgb, var(--meal-advice-accent, var(--nutri-primary)) 35%, var(--nutri-border) 65%);
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-body);
        line-height: 1.55;
      }
      .meal-section-advice-tip::before {
        content: "💡 ";
      }
      .active-meal-advice {
        margin: 0 0 12px;
      }
      .active-meal-advice--over {
        --meal-advice-accent: var(--nutri-warning, #d97706);
      }
      .active-meal-advice--under {
        --meal-advice-accent: var(--nutri-danger, #dc2626);
      }
      .active-meal-advice--ok {
        --meal-advice-accent: var(--nutri-success, #16a34a);
      }
      .active-meal-advice--empty,
      .active-meal-advice--neutral {
        --meal-advice-accent: #64748b;
      }
      .meal-section-advice-meta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .active-meal-advice-verdict {
        font-size: 15px;
      }
      .active-meal-advice-detail {
        font-size: 13px;
        font-weight: 700;
        color: #475569;
      }
      .active-meal-advice-macro {
        margin: 8px 0 0;
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
      }
      .active-meal-advice-daily {
        margin: 10px 0 0;
        padding-top: 8px;
        border-top: 1px dashed rgba(148, 163, 184, 0.35);
        font-size: 12px;
        font-weight: 800;
        color: var(--meal-advice-accent, var(--nutri-primary));
      }
      .active-meal-advice-reward {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        font-size: 12px;
        font-weight: 700;
        color: #475569;
      }
      .active-meal-advice-reward-text {
        flex: 1;
        min-width: 0;
      }
      .incomplete-meals-notice {
        margin-bottom: 12px;
        padding: 14px 16px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(254, 243, 199, 0.55) 0%, rgba(255, 251, 235, 0.95) 100%);
        border: 1px solid rgba(245, 158, 11, 0.35);
        border-left: 5px solid var(--nutri-warning, #d97706);
      }
      .incomplete-meals-notice-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }
      .incomplete-meals-notice-badge {
        font-size: 12px;
        font-weight: 900;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(245, 158, 11, 0.18);
        color: #b45309;
      }
      .incomplete-meals-notice-status {
        font-size: 12px;
        font-weight: 700;
        color: #92400e;
      }
      .incomplete-meals-notice-headline {
        margin: 0 0 6px;
        font-size: 14px;
        font-weight: 800;
        color: #78350f;
      }
      .incomplete-meals-notice-missing {
        margin: 0 0 6px;
        font-size: 13px;
        font-weight: 700;
        color: #92400e;
      }
      .incomplete-meals-notice-advice,
      .incomplete-meals-notice-next {
        margin: 0;
        font-size: 12px;
        font-weight: 700;
        color: #a16207;
        line-height: 1.5;
      }
      .incomplete-meals-notice-next {
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px dashed rgba(245, 158, 11, 0.35);
      }
      .analyzed-meal-row {
        padding: 10px 8px;
        box-sizing: border-box;
      }
      .analyzed-meal-row .meal-row-top b,
      .analyzed-meal-row .meal-row-name {
        font-size: 14px;
        line-height: 1.35;
      }
      .meal-row-top > div:first-child {
        flex: 1;
        min-width: 0;
      }
      .meal-row-top > div:last-child {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        margin-left: auto;
      }
      .activity-record-row {
        background: linear-gradient(90deg, rgba(5, 150, 105, 0.06) 0%, transparent 72%);
        border-radius: 10px;
        padding: 10px 10px !important;
        margin: 0;
      }
      .meal-section-header {
        width: 100%;
      }
      .meal-section-header > div:last-child,
      .meal-section-header .meal-section-total-wrap {
        flex-shrink: 0;
        margin-left: auto;
        text-align: right;
      }
      .meal-insight-text {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-top: 2px;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.5;
        padding: 10px 12px;
        border-radius: 10px;
        background: linear-gradient(
          90deg,
          color-mix(in srgb, var(--meal-insight-accent, var(--nutri-primary)) 12%, var(--nutri-surface) 88%) 0%,
          var(--nutri-bg-soft) 100%
        );
        border: 1px solid color-mix(in srgb, var(--meal-insight-accent, var(--nutri-primary)) 24%, var(--nutri-border) 76%);
        border-left: 4px solid var(--meal-insight-accent, var(--nutri-primary));
        color: var(--nutri-text-body);
      }
      .meal-insight-label {
        flex-shrink: 0;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        color: var(--meal-insight-accent, var(--nutri-primary));
        background: color-mix(in srgb, var(--meal-insight-accent, var(--nutri-primary)) 14%, var(--nutri-surface) 86%);
        padding: 3px 8px;
        border-radius: 999px;
        line-height: 1.3;
      }
      .meal-insight-copy {
        flex: 1;
        min-width: 0;
        color: var(--nutri-text-dark);
      }
      .dashboard-records-slot .macro-pill-row {
        padding: 4px 10px;
        font-size: 11px;
        gap: 8px;
      }
      .dashboard-records-slot .custom-meal-badge,
      .dashboard-records-slot .meal-status-badge {
        flex-shrink: 0;
        white-space: nowrap;
      }
      .dashboard-records-slot .meal-delete-btn {
        width: 28px !important;
        height: 28px !important;
        min-width: 28px;
        padding: 0 !important;
      }
      .daily-net-card {
        margin-top: 14px;
        padding: 14px 16px;
        border-radius: 14px;
        background: var(--nutri-bg-soft);
        border: 1px solid var(--nutri-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .daily-net-card-label {
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-body);
      }
      .daily-net-card-main {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .daily-net-breakdown {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 11px;
        font-weight: 700;
        color: var(--nutri-text-muted);
      }
      .daily-net-burn {
        color: #059669;
      }
      .daily-net-card-label small {
        font-size: 11px;
        font-weight: 700;
        color: var(--nutri-text-muted);
      }
      .daily-net-card-value {
        font-size: 24px;
        font-weight: 900;
        color: var(--nutri-primary);
        letter-spacing: -0.3px;
      }
      .daily-meals-advice-summary {
        margin-top: 12px;
        padding: 14px;
        border-radius: 16px;
        background: var(--nutri-surface);
        border: 1px solid var(--nutri-border);
        border-top: 3px solid var(--summary-accent, var(--nutri-primary));
      }
      .daily-meals-advice-title {
        font-size: 12px;
        font-weight: 900;
        color: var(--nutri-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.4px;
        margin-bottom: 12px;
      }
      .daily-advice-hero {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        padding: 12px;
        border-radius: 14px;
        background: var(--nutri-bg-soft);
        margin-bottom: 10px;
      }
      .daily-advice-hero-stat {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 64px;
      }
      .daily-advice-hero-num {
        font-size: 22px;
        font-weight: 900;
        color: var(--nutri-secondary);
        line-height: 1;
        letter-spacing: -0.3px;
      }
      .daily-advice-hero-label {
        font-size: 10px;
        font-weight: 800;
        color: var(--nutri-text-muted);
        text-transform: uppercase;
      }
      .daily-advice-hero-divider {
        width: 1px;
        height: 32px;
        background: var(--nutri-border);
        flex-shrink: 0;
      }
      .daily-advice-hero-badge {
        margin-left: auto;
        font-size: 11px;
        font-weight: 900;
        padding: 5px 12px;
        border-radius: 999px;
      }
      .daily-meals-advice-headline {
        margin: 0 0 10px;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-secondary);
        line-height: 1.4;
      }
      .daily-advice-action {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--nutri-accent-alpha-12);
        border: 1px solid var(--nutri-accent-alpha-15);
        margin-bottom: 12px;
      }
      .daily-advice-action-label {
        font-size: 10px;
        font-weight: 900;
        color: var(--nutri-primary);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      .daily-advice-action-text {
        font-size: 13px;
        font-weight: 700;
        color: var(--nutri-text-body);
        line-height: 1.45;
      }
      .daily-meals-advice-chips {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 4px;
      }
      .daily-meal-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 10px 6px;
        border-radius: 12px;
        background: var(--nutri-bg-soft);
        border: 1px solid var(--nutri-border);
        border-bottom: 3px solid var(--chip-accent, var(--nutri-primary));
        text-align: center;
      }
      .daily-meal-chip--empty {
        opacity: 0.55;
        border-bottom-color: var(--nutri-border);
      }
      .daily-meal-chip-name {
        font-size: 11px;
        font-weight: 800;
        color: var(--nutri-text-muted);
      }
      .daily-meal-chip-cal {
        font-size: 18px;
        font-weight: 900;
        color: var(--nutri-secondary);
        line-height: 1;
      }
      .daily-meal-chip-cal::after {
        content: " kcal";
        font-size: 9px;
        font-weight: 800;
        color: var(--nutri-text-muted);
      }
      .daily-meal-chip-burn {
        font-size: 10px;
        font-weight: 800;
        color: #059669;
        line-height: 1;
      }
      .daily-meal-chip-burn::after {
        content: " kcal";
        font-size: 8px;
        font-weight: 700;
      }
      .daily-meal-chip-status {
        font-size: 10px;
        font-weight: 800;
        color: var(--chip-accent, var(--nutri-primary));
      }
      .daily-meal-chip-empty {
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-muted);
      }
      .daily-activity-summary {
        margin-top: 12px;
        padding: 12px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgba(5, 150, 105, 0.07) 0%, var(--nutri-bg-soft) 100%);
        border: 1px solid rgba(5, 150, 105, 0.18);
        border-left: 3px solid #059669;
      }
      .daily-activity-summary-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }
      .daily-activity-summary-title {
        font-size: 13px;
        font-weight: 900;
        color: var(--nutri-secondary);
      }
      .daily-activity-summary-total {
        font-size: 18px;
        font-weight: 900;
        color: #059669;
        letter-spacing: -0.2px;
      }
      .daily-activity-summary-total::after {
        content: " kcal";
        font-size: 10px;
        font-weight: 800;
      }
      .daily-activity-summary-meta {
        margin: 0 0 10px;
        font-size: 11px;
        font-weight: 700;
        color: var(--nutri-text-muted);
        line-height: 1.4;
      }
      .daily-activity-summary-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .daily-activity-summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(5, 150, 105, 0.12);
      }
      .daily-activity-summary-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .daily-activity-summary-top {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .daily-activity-summary-period {
        font-size: 10px;
        font-weight: 900;
        color: #059669;
        background: rgba(5, 150, 105, 0.12);
        padding: 2px 7px;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.2px;
      }
      .daily-activity-summary-name {
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-body);
      }
      .daily-activity-summary-detail {
        font-size: 11px;
        font-weight: 600;
        color: var(--nutri-text-muted);
      }
      .daily-activity-summary-cal {
        flex-shrink: 0;
        font-size: 15px;
        font-weight: 900;
        color: #059669;
      }
      .daily-activity-summary-cal::after {
        content: " kcal";
        font-size: 9px;
        font-weight: 800;
      }
      .daily-weight-trend {
        margin-top: 12px;
        padding: 12px;
        border-radius: 12px;
        background: var(--nutri-bg-soft);
        border: 1px solid var(--nutri-border);
        border-left: 3px solid var(--weight-trend-accent, var(--nutri-primary));
      }
      .daily-weight-trend-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }
      .daily-weight-trend-icon {
        font-size: 16px;
        line-height: 1;
      }
      .daily-weight-trend-badge {
        font-size: 11px;
        font-weight: 900;
        padding: 3px 10px;
        border-radius: 999px;
      }
      .daily-weight-trend-line {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
        color: var(--nutri-text-body);
        line-height: 1.5;
      }
      .daily-weight-trend-line strong {
        font-weight: 800;
        color: var(--nutri-secondary);
      }
      .daily-weight-trend-note {
        margin: 6px 0 0;
        font-size: 11px;
        font-weight: 600;
        color: var(--nutri-text-muted);
        line-height: 1.4;
      }
      .activity-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 5000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        background: rgba(15, 23, 42, 0.45);
        backdrop-filter: blur(4px);
      }
      .activity-modal-card {
        width: min(420px, 100%);
        padding: 20px;
        border-radius: 20px;
        background: var(--nutri-surface);
        border: 1px solid var(--nutri-border);
        box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
      }
      .activity-modal-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 16px;
      }
      .activity-modal-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border: 1px solid var(--nutri-border);
        border-radius: 10px;
        background: var(--nutri-bg-soft);
        color: var(--nutri-text-muted);
        cursor: pointer;
      }
      .activity-modal-close:hover {
        color: var(--nutri-primary);
        border-color: var(--nutri-accent-alpha-28);
      }
      .ai-shell-glow {
        position: relative;
        overflow: hidden;
      }
      .ai-shell-glow::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
        background-size: 200% 100%;
        animation: softShimmer 5.8s linear infinite;
      }
      .nav-link-pro {
        transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
      }
      .nav-link-pro:hover {
        transform: translateX(4px);
        background: rgba(255, 255, 255, 0.06);
      }
      .nav-link-active {
        background: var(--nutri-nav-active-bg);
        box-shadow: inset 3px 0 0 var(--nutri-primary);
      }
      .btn-float {
        transition: transform 150ms ease, box-shadow 180ms ease;
      }
      .btn-float:hover {
        transform: translateY(-2px);
        box-shadow: var(--nutri-shadow-primary-soft);
      }
      .hero-float {
        animation: floatPulse 6s ease-in-out infinite;
      }

      /* --- Responsive layout --- */
      .stat-grid-responsive {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
        margin-bottom: 25px;
        overflow: visible;
      }
      .main-grid-responsive {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 30px;
      }
      .dashboard-main-grid {
        grid-template-areas: "left records";
        grid-template-columns: 1fr 1.2fr;
        align-items: start;
      }
      .dashboard-left-slot {
        grid-area: left;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .dashboard-search-slot,
      .dashboard-ai-slot,
      .dashboard-records-slot {
        align-self: stretch;
        width: 100%;
      }
      .dashboard-records-slot { grid-area: records; }
      .dashboard-records-slot.responsive-card {
        padding: 18px 16px !important;
        max-width: 100%;
        box-sizing: border-box;
        overflow-x: clip;
      }
      .dashboard-records-body {
        padding-inline: 0;
        box-sizing: border-box;
        min-height: 0;
        max-width: 100%;
        overflow-x: clip;
      }
      .meal-section-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        flex-wrap: wrap;
        width: 100%;
        box-sizing: border-box;
      }
      .meal-section-header .meal-section-total-wrap {
        flex-shrink: 0;
        margin-left: auto;
        text-align: right;
        max-width: 100%;
      }
      .dashboard-records-slot > div:first-child {
        padding-inline: 0;
        box-sizing: border-box;
        margin-bottom: 10px !important;
        font-size: 16px !important;
      }
      .meal-section-block {
        margin-bottom: 14px;
      }
      .meal-section-block:last-child {
        margin-bottom: 0;
      }
      .meal-section-title {
        font-weight: 800;
        color: var(--nutri-primary);
        font-size: 15px;
        line-height: 1.3;
      }
      .meal-row-name {
        font-size: 14px;
        line-height: 1.35;
        flex: 1 1 100%;
        min-width: 0;
        word-break: break-word;
        overflow-wrap: anywhere;
      }
      .meal-tab-row {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }
      .meal-row-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
        flex-wrap: wrap;
      }
      .meal-row-top .meal-row-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        margin-left: auto;
      }
      .meal-row-top .meal-row-main {
        flex: 1 1 180px;
        min-width: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        row-gap: 4px;
      }
      .history-header-responsive {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .profile-hero-responsive {
        display: flex;
        align-items: center;
        gap: 25px;
        flex-wrap: wrap;
      }
      .profile-mobile-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .profile-account-actions {
        margin-bottom: 20px;
        padding: 14px 16px;
        border-radius: 18px;
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
      }
      .profile-account-actions-label {
        margin: 0 0 10px;
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
        letter-spacing: 0.02em;
      }
      .profile-action-btn {
        width: 100%;
        min-height: 48px;
        padding: 12px 16px;
        border-radius: 14px;
        font-size: 15px;
        font-weight: 800;
        cursor: pointer;
        border: 1px solid var(--nutri-border, #e2e8f0);
        background: #fff;
        color: var(--nutri-text-dark, #0f172a);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .profile-action-btn--ghost {
        background: color-mix(in srgb, var(--nutri-primary) 8%, #fff);
        border-color: color-mix(in srgb, var(--nutri-primary) 25%, #e2e8f0);
        color: var(--nutri-primary-dark, #be185d);
      }
      .profile-action-btn--danger {
        background: #fef2f2;
        border-color: #fecaca;
        color: #b91c1c;
      }
      .profile-account-actions--bottom {
        margin-top: 4px;
        margin-bottom: calc(12px + env(safe-area-inset-bottom));
        border-color: rgba(239, 68, 68, 0.25);
        background: linear-gradient(180deg, #fff 0%, #fef2f2 100%);
      }
      .profile-account-actions--bottom .profile-action-btn--danger {
        font-size: 16px;
        min-height: 52px;
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.15);
      }
      @media (max-width: 900px) {
        .profile-account-actions--top {
          display: none;
        }
        .app-main-tab-profile .app-scroll {
          padding-bottom: calc(20px + env(safe-area-inset-bottom)) !important;
        }
      }
      @media (min-width: 901px) {
        .profile-account-actions--bottom {
          display: none;
        }
      }

      .share-access-card {
        display: none !important;
      }
      .share-access-card--login {
        margin-top: 24px;
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(255, 255, 255, 0.28);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      .share-access-card--pending {
        background: rgba(255, 255, 255, 0.72);
      }
      .share-access-card-head {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 14px;
      }
      .share-access-card-head svg {
        flex-shrink: 0;
        margin-top: 2px;
        color: var(--nutri-primary, #db2777);
      }
      .share-access-card--login .share-access-card-head svg {
        color: inherit;
        opacity: 0.92;
      }
      .share-access-card-title {
        margin: 0;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
        line-height: 1.35;
      }
      .share-access-card--login .share-access-card-title {
        color: inherit;
      }
      .share-access-card-note {
        margin: 4px 0 0;
        font-size: 12px;
        line-height: 1.45;
        color: var(--nutri-text-muted, #64748b);
      }
      .share-access-card--login .share-access-card-note {
        color: inherit;
        opacity: 0.88;
      }
      .share-access-card-note code {
        font-size: 11px;
        padding: 1px 5px;
        border-radius: 6px;
        background: rgba(15, 23, 42, 0.06);
      }
      .share-access-card-body {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
      }
      .share-access-qr-wrap {
        flex-shrink: 0;
        padding: 8px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
      }
      .share-access-qr-wrap--desktop-only {
        display: block;
      }
      @media (max-width: 860px) {
        .share-access-qr-wrap--desktop-only {
          display: none !important;
        }
      }
      .share-access-qr {
        display: block;
        width: 160px;
        height: 160px;
        border-radius: 8px;
      }
      .share-access-qr-hint {
        margin: 8px 0 0;
        font-size: 11px;
        font-weight: 700;
        text-align: center;
        color: var(--nutri-text-muted, #64748b);
      }
      .share-access-card--login .share-access-qr-hint {
        color: inherit;
        opacity: 0.85;
      }
      .share-access-link-block {
        flex: 1;
        min-width: 180px;
      }
      .share-access-link {
        display: block;
        word-break: break-all;
        font-size: 13px;
        font-weight: 700;
        color: var(--nutri-primary-dark, #be185d);
        text-decoration: none;
        margin-bottom: 10px;
      }
      .share-access-link:hover {
        text-decoration: underline;
      }
      .share-access-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .share-access-btn {
        min-height: 38px;
        padding: 8px 12px;
        border-radius: 12px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        background: #fff;
        color: var(--nutri-text-dark, #0f172a);
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-decoration: none;
      }
      .share-access-btn--primary {
        background: var(--nutri-gradient-primary, linear-gradient(135deg, #db2777, #be185d));
        border-color: transparent;
        color: #fff;
      }
      .share-access-btn--ghost {
        background: color-mix(in srgb, var(--nutri-primary) 8%, #fff);
      }
      .share-access-card--login .share-access-btn {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.35);
        color: inherit;
      }
      .share-access-card--login .share-access-btn--primary {
        background: rgba(255, 255, 255, 0.92);
        color: var(--nutri-primary-dark, #be185d);
        border-color: transparent;
      }
      .share-access-card--login .share-access-link {
        color: inherit;
        opacity: 0.95;
      }
      .share-access-desktop-only {
        display: block;
      }
      .share-access-mobile-only {
        display: none;
      }
      @media (max-width: 860px) {
        .share-access-desktop-only {
          display: none !important;
        }
        .share-access-mobile-only {
          display: block;
          margin-top: 18px;
        }
        .share-access-card-body {
          flex-direction: column;
          align-items: stretch;
        }
        .share-access-qr-wrap {
          align-self: center;
        }
        .share-access-actions {
          flex-direction: column;
        }
        .share-access-btn {
          width: 100%;
        }
      }

      .sidebar-logout-wrap {
        margin-top: auto;
        padding: 8px 0 12px;
      }
      .ai-plan-grid-responsive {
        display: grid;
        gap: 10px;
        grid-template-columns: 1fr 1fr;
      }
      .ai-menu-recommend-btn {
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .ai-menu-recommend-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
      }
      .ai-menu-recommend-btn:disabled {
        opacity: 0.7;
        cursor: wait;
      }
      .ai-menu-venue-filter {
        margin-top: 12px;
        padding: 10px;
        border-radius: 12px;
        background: rgba(248, 250, 252, 0.9);
        border: 1px solid var(--nutri-border, #e2e8f0);
      }
      .ai-menu-venue-filter-label {
        display: block;
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
        margin-bottom: 8px;
      }
      .ai-menu-venue-filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .ai-menu-venue-chip {
        flex: 1;
        min-width: 88px;
        border: 1px solid #e2e8f0;
        border-radius: 999px;
        padding: 8px 10px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        background: #fff;
        color: #475569;
      }
      .ai-menu-venue-chip.is-active {
        background: var(--nutri-primary, #1e293b);
        color: #fff;
        border-color: var(--nutri-primary, #1e293b);
      }
      .ai-menu-recommend-venue {
        margin-top: 6px;
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
      }
      .ai-menu-recommend-panel {
        margin-top: 12px;
        padding: 12px;
        border-radius: 14px;
        background: rgba(248, 250, 252, 0.92);
        border: 1px solid var(--nutri-border, #e2e8f0);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .ai-menu-recommend-panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 800;
        color: var(--nutri-text-dark, #1e293b);
      }
      .ai-menu-recommend-close {
        border: none;
        background: transparent;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        color: #64748b;
        padding: 0 4px;
      }
      .ai-menu-recommend-loading,
      .ai-menu-recommend-empty {
        margin: 0;
        font-size: 12px;
        color: #64748b;
        text-align: center;
        padding: 8px 0;
      }
      .ai-menu-recommend-card {
        padding: 12px;
        border-radius: 12px;
        background: #fff;
        border: 1px solid #e2e8f0;
      }
      .ai-menu-recommend-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
      }
      .ai-menu-recommend-rank {
        font-size: 11px;
        font-weight: 800;
        color: var(--nutri-primary, #1e293b);
      }
      .ai-menu-recommend-match {
        font-size: 10px;
        font-weight: 700;
        color: #166534;
        background: #dcfce7;
        padding: 2px 8px;
        border-radius: 999px;
      }
      .ai-menu-recommend-name {
        font-size: 14px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 6px;
      }
      .ai-menu-recommend-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 11px;
        font-weight: 700;
        color: #475569;
      }
      .ai-menu-recommend-portion {
        margin-top: 6px;
        font-size: 11px;
        color: #64748b;
      }
      .ai-menu-recommend-add-btn {
        margin-top: 10px;
        width: 100%;
        border: none;
        border-radius: 10px;
        padding: 8px 10px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        color: #fff;
        background: var(--nutri-primary, #1e293b);
      }
      .ai-menu-recommend-add-btn:hover {
        filter: brightness(1.08);
      }
      .ai-activity-suggest-panel {
        margin-top: 12px;
        padding: 14px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(254, 243, 199, 0.95), rgba(255, 251, 235, 0.92));
        border: 1px solid #fde68a;
      }
      .ai-activity-suggest-head {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 8px;
      }
      .ai-activity-suggest-icon {
        font-size: 22px;
        line-height: 1;
      }
      .ai-activity-suggest-title {
        font-size: 13px;
        font-weight: 800;
        color: #92400e;
      }
      .ai-activity-suggest-sub {
        margin-top: 2px;
        font-size: 11px;
        font-weight: 700;
        color: #b45309;
      }
      .ai-activity-suggest-message {
        margin: 0 0 10px;
        font-size: 12px;
        line-height: 1.55;
        color: #78350f;
        font-weight: 600;
      }
      .ai-activity-suggest-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
      }
      .ai-activity-suggest-stats span {
        font-size: 11px;
        font-weight: 800;
        color: #92400e;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid #fde68a;
        padding: 4px 8px;
        border-radius: 999px;
      }
      .ai-activity-suggest-btn {
        width: 100%;
        border: none;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        color: #fff;
        background: #d97706;
      }
      .ai-activity-suggest-btn:hover {
        filter: brightness(1.06);
      }
      .what-if-simulator-panel {
        margin-top: 12px;
        padding: 14px;
        border-radius: 14px;
        background: rgba(248, 250, 252, 0.95);
        border: 1px dashed #cbd5e1;
      }
      .what-if-simulator-head {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        margin-bottom: 10px;
      }
      .what-if-simulator-icon {
        font-size: 22px;
        line-height: 1;
      }
      .what-if-simulator-title {
        font-size: 13px;
        font-weight: 800;
        color: #0f172a;
      }
      .what-if-simulator-sub {
        margin-top: 2px;
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        line-height: 1.4;
      }
      .what-if-simulator-input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 13px;
        font-weight: 600;
        color: #0f172a;
        background: #fff;
      }
      .what-if-simulator-note,
      .what-if-simulator-loading {
        margin: 8px 0 0;
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
      }
      .what-if-simulator-result {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .what-if-verdict {
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 700;
        line-height: 1.45;
      }
      .what-if-verdict-warn {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fde68a;
      }
      .what-if-verdict-good {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
      }
      .what-if-food-estimate {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        color: #475569;
      }
      .what-if-food-estimate strong {
        color: #0f172a;
        font-size: 13px;
      }
      .what-if-macro-legend {
        display: flex;
        gap: 12px;
        margin-bottom: 4px;
      }
      .what-if-legend-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 700;
        color: #64748b;
      }
      .what-if-legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        display: inline-block;
      }
      .what-if-legend-dot-current {
        background: #1e293b;
      }
      .what-if-legend-dot-projected {
        background: #f59e0b;
        opacity: 0.65;
      }
      .what-if-macro-track {
        position: relative;
        height: 10px !important;
      }
      .what-if-macro-title {
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .what-if-macro-target-line {
        position: absolute;
        top: -2px;
        bottom: -2px;
        width: 2px;
        background: #94a3b8;
        opacity: 0.7;
        z-index: 2;
        pointer-events: none;
      }
      .what-if-macro-fill-projected,
      .what-if-macro-fill-current {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 999px;
        transition: width 0.35s ease;
      }
      .what-if-macro-fill-projected {
        z-index: 1;
      }
      .what-if-macro-fill-current {
        z-index: 3;
      }
      .what-if-macro-over {
        color: #b45309;
        font-weight: 900;
      }
      .what-if-macro-delta {
        margin-left: 4px;
        font-size: 10px;
        font-weight: 800;
      }
      .what-if-macro-delta.is-up {
        color: #b45309;
      }
      .what-if-macro-delta.is-down {
        color: #166534;
      }
      .what-if-warning-list {
        margin: 0;
        padding-left: 18px;
        font-size: 12px;
        font-weight: 600;
        color: #b45309;
        line-height: 1.5;
      }
      .what-if-swap-card {
        padding: 12px;
        border-radius: 12px;
        background: #fff;
        border: 1px solid #e2e8f0;
      }
      .what-if-swap-title {
        font-size: 12px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 6px;
      }
      .what-if-swap-message {
        margin: 0 0 8px;
        font-size: 12px;
        line-height: 1.5;
        color: #334155;
        font-weight: 600;
      }
      .what-if-swap-meta {
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 10px;
      }
      .what-if-swap-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .what-if-btn {
        border: none;
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }
      .what-if-btn-primary {
        background: var(--nutri-primary, #1e293b);
        color: #fff;
      }
      .what-if-btn-ghost {
        background: #f1f5f9;
        color: #475569;
      }
      .what-if-btn-full {
        width: 100%;
      }
      .history-kpi-grid-responsive {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      @media (max-width: 1024px) {
        .stat-grid-responsive {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .main-grid-responsive {
          grid-template-columns: 1fr;
          gap: 14px;
        }
        .dashboard-main-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .dashboard-left-slot {
          display: contents;
        }
        .dashboard-search-slot {
          order: 1;
        }
        .dashboard-records-slot {
          order: 2;
        }
        .dashboard-ai-slot {
          order: 3;
        }
        .app-scroll {
          padding: 16px !important;
          padding-left: max(14px, env(safe-area-inset-left)) !important;
          padding-right: max(14px, env(safe-area-inset-right)) !important;
          box-sizing: border-box;
        }
        .dashboard-records-slot.responsive-card {
          padding: 16px 14px !important;
        }
        .dashboard-records-body {
          min-height: 0 !important;
          padding-inline: 0 !important;
        }
        .meal-row-top {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          column-gap: 8px;
          row-gap: 6px;
          align-items: start;
        }
        .meal-row-main {
          grid-column: 1;
          min-width: 0;
        }
        .meal-row-actions {
          grid-column: 2;
          grid-row: 1;
          margin-left: 0 !important;
        }
        .ai-plan-grid-responsive {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 900px) {
        .app-sidebar {
          top: auto !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          height: auto !important;
          flex-direction: column !important;
          align-items: stretch !important;
          border-right: none !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          background: var(--nutri-mobile-sidebar) !important;
          padding: 0 !important;
          box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.08) !important;
        }
        .sidebar-logo-wrap {
          display: none !important;
        }
        .sidebar-links-wrap {
          display: flex !important;
          flex: 1;
          justify-content: space-around;
          align-items: stretch;
          gap: 2px;
          padding: 4px 6px calc(4px + env(safe-area-inset-bottom));
        }
        .sidebar-footer-actions {
          display: none !important;
        }
        .sidebar-logout-wrap {
          margin-top: 0 !important;
          display: flex;
          align-items: stretch;
        }
        .app-sidebar .nav-link-pro {
          flex-direction: column !important;
          justify-content: center !important;
          gap: 4px !important;
          margin: 0 !important;
          padding: 8px 2px !important;
          font-size: 11px !important;
          text-align: center;
          flex: 1;
          border-top: none !important;
          min-width: 0;
          min-height: 48px;
          border-radius: 10px !important;
        }
        .app-sidebar--mobile .sidebar-links-wrap {
          gap: 4px;
          padding: 6px 10px calc(6px + env(safe-area-inset-bottom));
        }
        .app-sidebar--mobile .nav-link-pro {
          padding: 8px 2px !important;
          min-height: 52px;
          gap: 4px !important;
        }
        .app-sidebar--mobile .nav-link-label-short {
          font-size: 9px;
          line-height: 1.1;
        }
        .app-sidebar--mobile .nav-link-pro svg {
          width: 22px;
          height: 22px;
        }
        .app-sidebar--mobile .sidebar-links-wrap {
          gap: 2px;
          padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
        }
        .app-sidebar--mobile .nav-link-pro {
          padding: 7px 1px !important;
          min-height: 50px;
        }
        .app-page-hint {
          display: none !important;
        }
        .profile-page .share-access-card {
          margin-top: 12px;
          padding: 14px;
        }
        .profile-page .share-access-qr {
          width: 140px;
          height: 140px;
        }
        .profile-quick-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }
        .profile-action-btn--primary {
          background: var(--nutri-gradient-primary, linear-gradient(135deg, #db2777, #be185d));
          border-color: transparent;
          color: #fff;
        }
        .app-sidebar .nav-link-active {
          box-shadow: inset 0 3px 0 #F472B6 !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .app-sidebar .nav-link-pro svg {
          width: 22px;
          height: 22px;
        }
        .nav-link-label-short {
          font-size: 11px;
          line-height: 1.15;
          font-weight: 800;
        }
        .app-sidebar .nav-link-pro:hover {
          transform: none !important;
        }
        .app-main {
          margin-left: 0 !important;
          padding-bottom: calc(72px + env(safe-area-inset-bottom)) !important;
        }
        .app-main-tab-food .app-scroll {
          padding-bottom: calc(88px + env(safe-area-inset-bottom)) !important;
        }
        .app-header {
          padding: 14px 16px !important;
          text-align: left !important;
        }
        .app-header-context {
          padding: 14px 16px !important;
        }
        .header-title-wrap {
          justify-content: flex-start !important;
          font-size: 16px !important;
        }
        .app-scroll {
          padding: 16px !important;
          padding-left: max(16px, env(safe-area-inset-left)) !important;
          padding-right: max(16px, env(safe-area-inset-right)) !important;
        }
        .responsive-card {
          padding: 20px !important;
          border-radius: 22px !important;
          box-sizing: border-box;
          max-width: 100%;
        }
        .dashboard-records-slot.responsive-card {
          padding: 16px 14px !important;
        }
        .history-header-responsive {
          flex-direction: column;
          align-items: flex-start !important;
        }
        .profile-hero-responsive {
          flex-direction: column;
          align-items: flex-start !important;
          padding: 28px 22px !important;
        }
      }

      @media (max-width: 640px) {
        .stat-grid-responsive {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .main-grid-responsive {
          gap: 10px;
        }
        .dashboard-records-slot.responsive-card {
          padding: 14px 12px !important;
        }
        .dashboard-records-body {
          min-height: 0 !important;
          padding-inline: 0 !important;
        }
        .analyzed-meal-row {
          padding: 10px 0 !important;
        }
        .activity-record-row {
          padding: 10px 8px !important;
        }
        .meal-row-top {
          column-gap: 6px;
        }
        .meal-row-top .meal-row-main b,
        .meal-row-top .meal-row-name {
          font-size: 14px !important;
        }
        .meal-section-header {
          gap: 6px;
        }
        .meal-section-net,
        .meal-section-burn {
          font-size: 12px !important;
        }
        .daily-advice-hero {
          gap: 8px;
          padding: 10px;
        }
        .daily-advice-hero-num {
          font-size: 20px;
        }
        .daily-advice-hero-badge {
          width: 100%;
          margin-left: 0;
          text-align: center;
        }
        .daily-meals-advice-chips {
          gap: 6px;
        }
        .daily-meal-chip-cal {
          font-size: 16px;
        }
        .meal-tab-row button {
          min-width: calc(50% - 6px);
          flex: 1 1 calc(50% - 6px);
        }
        .ai-chip-row-responsive {
          grid-template-columns: repeat(auto-fit, minmax(88px, 1fr)) !important;
          gap: 8px !important;
        }
        .ai-chip-row-responsive .ai-chip-item {
          padding: 8px 6px !important;
        }
        .ai-chip-row-responsive .ai-chip-label {
          font-size: 9px !important;
          line-height: 1.2 !important;
        }
        .ai-chip-row-responsive .ai-chip-value {
          margin-top: 4px !important;
          font-size: 12px !important;
          line-height: 1.25 !important;
          word-break: break-word;
        }
        .ai-plan-grid-responsive > div {
          padding: 10px !important;
        }
        .ai-shell-glow {
          padding: 10px !important;
        }
        .login-shell-responsive {
          grid-template-columns: 1fr !important;
        }
        .login-brand-panel-responsive {
          padding: 24px 20px !important;
        }
        .login-brand-theme-slot {
          margin-top: 20px !important;
        }
        .theme-picker-compact .theme-preview-circle {
          width: 30px !important;
          height: 30px !important;
        }
        .theme-picker-compact .theme-picker-custom-inner-brand {
          width: 30px !important;
          height: 30px !important;
        }
        .theme-picker-grid-compact {
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 4px !important;
        }
        .theme-picker-brand .theme-preview-circle {
          width: 34px !important;
          height: 34px !important;
        }
        .theme-picker-brand .theme-picker-custom-inner-brand {
          width: 34px !important;
          height: 34px !important;
        }
        .login-form-panel-responsive {
          padding: 28px 20px !important;
        }
        .login-grid-2-responsive {
          grid-template-columns: 1fr !important;
        }
        .avatar-modal-card {
          padding: 14px !important;
        }
        .avatar-modal-actions {
          grid-template-columns: 1fr !important;
        }
        .history-kpi-grid-responsive {
          grid-template-columns: 1fr !important;
        }
        .theme-picker-chrome-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 6px !important;
        }
        .theme-picker-chrome-grid .theme-preview-circle {
          width: 40px !important;
          height: 40px !important;
        }
        .theme-mode-toggle button span:not(.theme-mode-check) {
          font-size: 11px;
        }
        .theme-mode-toggle button svg {
          width: 14px;
          height: 14px;
        }
      }

      @media (max-width: 901px) and (min-width: 769px) {
        .app-header-context {
          grid-template-columns: 1fr auto;
          gap: 10px 12px;
          padding: max(14px, env(safe-area-inset-top)) 20px 14px !important;
        }
        .app-header-meta {
          grid-column: 1 / -1;
          justify-content: flex-start;
        }
        .app-header-page-tagline {
          margin-left: 0;
          max-width: none;
        }
      }

      @media (max-width: 480px) {
        .app-header-context {
          grid-template-columns: 1fr auto;
          gap: 8px;
          padding: max(10px, env(safe-area-inset-top)) 12px 10px !important;
        }
        .app-header-page-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
        }
        .app-header-page-title {
          font-size: 17px;
        }
        .app-header-user-text {
          display: none;
        }
        .app-header-user-card {
          padding: 4px !important;
          border-radius: 50%;
        }
        .app-header-chip {
          font-size: 10px;
          padding: 4px 7px;
        }
        .app-scroll {
          padding: 12px !important;
          padding-left: max(12px, env(safe-area-inset-left)) !important;
          padding-right: max(12px, env(safe-area-inset-right)) !important;
        }
        .responsive-card {
          padding: 16px !important;
          border-radius: 18px !important;
        }
        .profile-hero-responsive {
          padding: 22px 16px !important;
          border-radius: 22px !important;
        }
        .profile-hero-name {
          font-size: 24px !important;
        }
        .profile-weight-chart-wrap {
          height: 260px !important;
        }
        .sidebar-links-wrap {
          gap: 0;
          padding: 4px 2px calc(4px + env(safe-area-inset-bottom));
        }
        .app-sidebar .nav-link-pro {
          padding: 6px 0 !important;
          gap: 2px !important;
          min-height: 44px;
          border-radius: 8px !important;
        }
        .app-sidebar .nav-link-pro svg {
          width: 22px;
          height: 22px;
        }
        .nav-link-label-short {
          font-size: 9px;
          line-height: 1.1;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .share-access-qr {
          width: 140px;
          height: 140px;
        }
        .share-access-link-block {
          min-width: 0;
        }
        .share-access-actions {
          flex-direction: column;
        }
        .log-page-summary-metric {
          min-width: calc(50% - 8px);
          flex: 1 1 calc(50% - 8px);
        }
        .log-page-summary-metric-value {
          font-size: 16px;
        }
        .what-if-simulator-panel {
          padding: 12px !important;
        }
        .what-if-simulator-input {
          font-size: 16px;
        }
        .what-if-swap-actions {
          flex-direction: column;
        }
        .what-if-btn {
          width: 100%;
        }
        .dashboard-quick-actions {
          grid-template-columns: 1fr;
        }
        .user-guide-modal-card {
          margin: 12px !important;
          max-height: calc(100dvh - 24px) !important;
        }
      }

      @media (max-width: 360px) {
        .app-sidebar--mobile .nav-link-label-short {
          font-size: 10px;
        }
      }

      .nav-link-label-short {
        display: none;
      }

      .dashboard-quick-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 20px;
      }
      .dash-quick-btn {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 18px 16px;
        border: 1px solid rgba(148, 163, 184, 0.25);
        border-radius: 18px;
        background: var(--nutri-card-bg, #fff);
        cursor: pointer;
        text-align: left;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
      }
      .dash-quick-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
      }
      .dash-quick-btn-food {
        border-color: color-mix(in srgb, var(--nutri-primary) 35%, transparent);
      }
      .dash-quick-btn-activity {
        border-color: color-mix(in srgb, var(--nutri-success, #16a34a) 35%, transparent);
      }
      .dash-quick-icon {
        font-size: 28px;
        line-height: 1;
        flex-shrink: 0;
      }
      .dash-quick-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }
      .dash-quick-label {
        font-weight: 800;
        font-size: 15px;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-quick-meta {
        font-size: 12px;
        color: #64748b;
      }
      .dashboard-summary-strip {
        padding: 16px !important;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .dashboard-summary-net {
        margin: 0;
      }
      .dashboard-summary-chips {
        margin: 0;
      }
      .dashboard-home-simple {
        max-width: 720px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .dash-home-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
      }
      .dash-home-stack .dash-home-stats-block {
        order: 1;
      }
      .dash-home-stack .dash-home-menu-pick {
        order: 2;
        margin-top: 0;
      }
      .dash-home-stack .dash-home-advice-block {
        order: 3;
        margin: 0;
        padding: 14px;
        border-radius: var(--nutri-radius-lg, 18px);
        background: #fff;
        border: 1px solid var(--nutri-border, #e2e8f0);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
      }
      .dashboard-home-simple .dash-stats-compact {
        margin-bottom: 0;
      }
      .dash-collapse {
        border: 1px solid var(--nutri-border, #e2e8f0);
        border-radius: 16px;
        background: var(--nutri-surface, #fff);
        overflow: hidden;
      }
      .dash-collapse-ai.dash-ai-simple {
        padding: 0 !important;
        border-radius: 20px !important;
      }
      .dash-collapse-ai .dash-collapse-toggle {
        padding: 16px 16px 12px;
      }
      .dash-collapse-ai.is-open .dash-collapse-toggle {
        padding-bottom: 8px;
      }
      .dash-collapse-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 12px 14px;
        border: none;
        background: transparent;
        text-align: left;
        cursor: pointer;
      }
      .dash-collapse-head {
        flex: 1;
        min-width: 0;
      }
      .dash-collapse-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .dash-collapse-icon {
        display: inline-flex;
        color: var(--nutri-primary);
      }
      .dash-collapse-title {
        font-size: 15px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-collapse-preview {
        display: block;
        margin-top: 3px;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.35;
        color: var(--nutri-text-muted, #64748b);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .dash-collapse-badge {
        flex-shrink: 0;
        font-size: 11px;
        font-weight: 800;
        padding: 4px 9px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        color: var(--nutri-primary);
      }
      .dash-collapse-chevron {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        color: var(--nutri-text-muted, #94a3b8);
        transition: transform 0.18s ease;
      }
      .dash-collapse.is-open .dash-collapse-chevron {
        transform: rotate(180deg);
      }
      .dash-collapse-body {
        padding: 0 14px 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .dash-collapse-stats .dash-collapse-body {
        padding-top: 0;
      }
      .dash-collapse-summary .dashboard-day-summary {
        margin: 0;
      }
      .dash-collapse-ai .dash-collapse-body {
        padding-top: 0;
      }
      .dash-collapse-ai .dash-ai-hero-headline {
        font-size: clamp(18px, 4vw, 24px);
      }

      @media (max-width: 768px) {
        .app-header-context {
          grid-template-columns: 1fr auto;
          gap: 8px 10px;
          padding: max(12px, env(safe-area-inset-top)) 14px 12px !important;
        }
        .app-header-meta {
          grid-column: 1 / -1;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 6px;
        }
        .app-header-chip {
          font-size: 11px;
          padding: 5px 8px;
        }
        .app-header-help-btn span {
          display: none;
        }
        .app-header-help-btn {
          min-width: 40px;
          min-height: 40px;
          padding: 8px;
        }
        .app-header-user-card {
          padding: 6px 10px !important;
        }
        .app-header-user-text strong {
          font-size: 13px;
        }
        .app-header-chip--date {
          flex: 1 1 100%;
        }
        .app-header-user-text small {
          display: none;
        }
        .app-header-wave {
          display: none;
        }
        .app-header-page-tagline {
          display: none;
        }
        .app-main--mobile .app-header-page-icon {
          display: none;
        }
        .app-main--mobile .app-header-chip:not(.app-header-chip--accent) {
          display: none;
        }
        .app-main--mobile .app-header-user-text {
          display: none;
        }
        .app-main--mobile .app-header-user-card {
          padding: 4px !important;
          border-radius: 50%;
        }
        .app-page-hint {
          display: none !important;
        }
        .app-page-hint-text {
          font-size: 12px;
        }
        .home-action-grid-cards {
          grid-template-columns: 1fr;
        }
        .home-action-card {
          flex-direction: row;
          align-items: center;
        }
        .app-main-tab-food .app-header-meta,
        .app-main-tab-activity .app-header-meta {
          display: none;
        }
        .log-page-block-summary .log-page-summary {
          position: sticky;
          top: 0;
          z-index: 4;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }
        .log-page.has-records .log-page-block-advice,
        .log-page.has-records .log-page-block-notice {
          display: none;
        }
        .log-page {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .log-page-block-summary { order: 1; }
        .log-page-block-tabs { order: 2; }
        .log-page-block-search {
          order: 3;
          position: sticky;
          top: 0;
          z-index: 6;
        }
        .log-page-food:not(.has-records) .log-page-block-search {
          order: 1;
        }
        .log-page-food:not(.has-records) .log-page-block-tabs {
          order: 2;
        }
        .log-page-food:not(.has-records) .log-page-block-summary {
          order: 3;
          position: static;
        }
        .log-page-food:not(.has-records) .log-page-block-summary .log-page-summary {
          position: static;
          box-shadow: none;
        }
        .log-page-food:not(.has-records) .log-page-block-hints,
        .log-page-food:not(.has-records) .log-page-block-advice,
        .log-page-food:not(.has-records) .log-page-block-notice {
          display: none !important;
        }
        .log-quick-picks-hint {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--nutri-text-muted, #64748b);
        }
        .log-quick-picks-more {
          width: 100%;
          margin-top: 8px;
          min-height: 44px;
          border-radius: 12px;
          border: 1px dashed var(--nutri-border, #e2e8f0);
          background: #fff;
          color: var(--nutri-text-muted, #64748b);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .log-search-hero-input {
          font-size: 16px !important;
          min-height: 48px;
        }
        .log-meal-tab {
          min-height: 44px;
        }
        .log-page-block-records { order: 4; }
        .log-page-block-suggestions { order: 5; }
        .log-page-block-hints { order: 6; }
        .log-page.is-searching .log-page-block-summary,
        .log-page.is-searching .log-page-block-tabs,
        .log-page.is-searching .log-page-block-records,
        .log-page.is-searching .log-page-block-suggestions,
        .log-page.is-searching .log-page-block-advice,
        .log-page.is-searching .log-page-block-notice,
        .log-page.is-searching .log-add-food-fab {
          display: none !important;
        }
        .log-page.is-searching .log-page-block-search {
          order: 1 !important;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .log-page.is-searching .log-search-results--live {
          max-height: min(72dvh, calc(100dvh - 100px));
        }
        .log-page.is-searching .log-search-panel-pro.is-search-active {
          padding-bottom: 16px !important;
        }
        .log-page.has-save-notice .log-add-food-fab {
          display: none;
        }
        .log-saved-bar {
          left: max(12px, env(safe-area-inset-left));
          right: max(12px, env(safe-area-inset-right));
          grid-template-columns: 1fr;
          padding: 14px 14px 12px;
          padding-top: 28px;
        }
        .log-saved-bar-next {
          display: block;
        }
        .log-saved-bar-actions {
          flex-direction: row;
        }
        .log-saved-bar-btn {
          flex: 1;
          padding: 10px 12px;
          font-size: 13px;
        }
        .log-page-summary-hint {
          display: none;
        }
        .feature-info-bar {
          display: none;
        }
        .log-page.has-records .dash-collapse-log-records .dash-collapse-toggle {
          pointer-events: none;
        }
        .log-page.has-records .dash-collapse-log-records .dash-collapse-chevron {
          display: none;
        }
        .history-hero-subtext--compact {
          display: none;
        }
        .dash-daily-goal {
          margin-bottom: 0;
          padding: 12px 14px;
        }
        .dash-daily-goal-hint {
          display: none;
        }
        .dash-daily-goal-value {
          font-size: 20px;
        }
        .dashboard-quick-actions {
          margin-bottom: 0;
        }
        .dashboard-home-simple {
          gap: 10px;
        }
        .dash-welcome-banner {
          padding: 14px;
        }
        .dash-welcome-banner-actions {
          flex-direction: column;
        }
        .dash-welcome-primary,
        .dash-welcome-secondary {
          width: 100%;
          text-align: center;
        }
      }

      .dash-ai-simple {
        padding: 18px 16px !important;
        border-radius: 20px !important;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .dash-ai-simple-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .dash-ai-simple-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-ai-simple-icon {
        display: inline-flex;
        color: var(--nutri-primary);
      }
      .dash-ai-simple-badge {
        font-size: 11px;
        font-weight: 800;
        padding: 5px 10px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        color: var(--nutri-primary);
      }
      .dash-ai-hero-headline {
        margin: 0;
        font-size: clamp(22px, 5vw, 28px);
        font-weight: 900;
        line-height: 1.2;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-ai-hero-subline {
        margin: 6px 0 0;
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
      }
      .dash-ai-chips {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .dash-ai-chip {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 10px 8px;
        border-radius: 12px;
        background: rgba(241, 245, 249, 0.95);
        text-align: center;
      }
      .dash-ai-chip-label {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #94a3b8;
      }
      .dash-ai-chip-value {
        font-size: 13px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
        font-variant-numeric: tabular-nums;
      }
      .dash-ai-focus {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px 14px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--nutri-primary) 8%, #fff);
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 18%, transparent);
      }
      .dash-ai-focus-title {
        font-size: 12px;
        font-weight: 800;
        color: var(--nutri-primary);
      }
      .dash-ai-focus-detail {
        font-size: 14px;
        font-weight: 600;
        color: var(--nutri-text-dark, #0f172a);
        line-height: 1.4;
      }
      .dash-ai-macros {
        padding-top: 2px;
      }
      .dash-ai-menu-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .dash-ai-venue-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .dash-ai-venue-chip {
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: #fff;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-ai-venue-chip.is-active {
        border-color: var(--nutri-primary);
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        color: var(--nutri-primary);
      }
      .dash-ai-primary-btn {
        width: 100%;
        padding: 14px 16px;
        border: none;
        border-radius: 14px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        color: #fff;
        background: var(--nutri-primary);
      }
      .dash-ai-primary-btn--good { background: #059669; }
      .dash-ai-primary-btn--warn { background: #d97706; }
      .dash-ai-primary-btn--bad { background: #dc2626; }
      .dash-ai-primary-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      .dash-ai-menu-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .dash-ai-menu-loading,
      .dash-ai-menu-empty {
        margin: 0;
        font-size: 13px;
        color: #64748b;
        text-align: center;
        padding: 8px;
      }
      .dash-ai-menu-card {
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.25);
      }
      .dash-ai-menu-card-top {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
        margin-bottom: 4px;
      }
      .dash-ai-menu-name {
        margin: 0 0 10px;
        font-size: 15px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-ai-menu-add {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 10px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        color: var(--nutri-primary);
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
      }
      .dash-ai-menu-card-actions {
        display: flex;
        gap: 8px;
        align-items: stretch;
      }
      .dash-ai-menu-dislike {
        flex: 1;
        padding: 10px 8px;
        border: 1px solid rgba(245, 158, 11, 0.35);
        border-radius: 10px;
        background: #fffbeb;
        color: #b45309;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }
      .dash-ai-menu-dislike:disabled {
        opacity: 0.6;
        cursor: wait;
      }
      .dash-ai-menu-feedback {
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.28);
        margin-bottom: 4px;
      }
      .dash-ai-menu-feedback-title {
        margin: 0 0 10px;
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .dash-ai-menu-feedback-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 8px;
        margin-bottom: 8px;
      }
      @media (max-width: 640px) {
        .dash-ai-menu-feedback-inputs {
          grid-template-columns: 1fr;
        }
      }
      .dash-ai-menu-feedback-input {
        padding: 9px 11px;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        font-size: 13px;
      }
      .dash-ai-menu-shuffle-btn {
        padding: 9px 14px;
        border: none;
        border-radius: 10px;
        background: var(--nutri-primary, #2563eb);
        color: #fff;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        white-space: nowrap;
      }
      .dash-ai-menu-shuffle-btn:disabled {
        opacity: 0.65;
        cursor: wait;
      }
      .dash-ai-menu-feedback-presets {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 6px;
      }
      .dash-ai-menu-feedback-chip {
        border: 1px dashed rgba(148, 163, 184, 0.45);
        border-radius: 999px;
        padding: 4px 9px;
        font-size: 11px;
        font-weight: 700;
        background: #fff;
        cursor: pointer;
      }
      .dash-ai-menu-feedback-chip--like {
        color: #047857;
        border-color: rgba(16, 185, 129, 0.35);
      }
      .dash-ai-menu-feedback-chip--dislike {
        color: #b45309;
        border-color: rgba(245, 158, 11, 0.35);
      }
      .dash-ai-menu-feedback-summary {
        margin: 0;
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        line-height: 1.45;
      }
      .dash-ai-tools-toggle {
        width: 100%;
        padding: 12px;
        border: 1px dashed rgba(148, 163, 184, 0.45);
        border-radius: 12px;
        background: transparent;
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
        cursor: pointer;
      }
      .dash-ai-tools-panel {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 4px;
      }
      .dash-ai-activity-card {
        padding: 12px 14px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--nutri-success, #16a34a) 10%, #fff);
        border: 1px solid rgba(16, 185, 129, 0.25);
      }
      .dash-ai-activity-title {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 800;
        color: #047857;
      }
      .dash-ai-activity-meta {
        margin: 0 0 10px;
        font-size: 13px;
        color: #64748b;
      }
      .dash-ai-activity-btn {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 10px;
        background: var(--nutri-success, #16a34a);
        color: #fff;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
      }

      @media (max-width: 640px) {
        .dash-ai-chips {
          grid-template-columns: 1fr;
        }
      }

      .dashboard-ai-only {
        max-width: 920px;
      }
      .dashboard-overview .dashboard-ai-only .ai-shell-glow {
        width: 100%;
      }

      .log-page {
        max-width: 720px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-bottom: 8px;
      }
      @media (min-width: 901px) {
        .log-page-block-summary { order: 1; }
        .log-page-block-tabs { order: 2; }
        .log-page-block-records { order: 3; }
        .log-page-block-suggestions { order: 4; }
        .log-page-block-search { order: 5; }
        .log-page-block-hints { order: 6; }
        .log-page-block-notice { order: 7; }
        .log-page-block-advice { order: 8; }
      }

      .log-panel-records--top {
        padding-top: 12px;
      }
      .log-records-top-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--nutri-border, #e2e8f0);
      }
      .log-records-top-title {
        margin: 0;
        font-size: 15px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }
      .log-records-top-preview {
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
      }

      .food-avoidance-warn {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: #fef2f2;
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #991b1b;
      }
      .food-avoidance-warn--meal {
        margin-bottom: 10px;
      }
      .food-avoidance-warn--modal {
        margin-bottom: 12px;
      }
      .food-avoidance-warn-icon {
        flex-shrink: 0;
        margin-top: 2px;
        font-size: 18px;
        color: #dc2626;
      }
      .food-avoidance-warn-copy {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 12px;
        line-height: 1.45;
      }
      .food-avoidance-warn-copy strong {
        font-size: 13px;
        font-weight: 900;
      }

      .log-entry-row.has-avoidance {
        background: rgba(254, 242, 242, 0.72);
        border: 1px solid rgba(239, 68, 68, 0.22);
        border-radius: 12px;
      }
      .log-entry-allergy-badge,
      .log-search-allergy-badge {
        display: inline-flex;
        align-items: center;
        margin-right: 6px;
        padding: 2px 7px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.02em;
        color: #fff;
        background: #dc2626;
        vertical-align: middle;
      }
      .log-entry-allergy-note {
        display: block;
        margin-top: 2px;
        color: #b91c1c !important;
        font-weight: 700 !important;
      }
      .log-search-item.has-avoidance {
        border-color: rgba(239, 68, 68, 0.35) !important;
        background: rgba(254, 242, 242, 0.65);
      }
      .log-saved-bar {
        position: fixed;
        left: 12px;
        right: 12px;
        bottom: calc(72px + env(safe-area-inset-bottom));
        z-index: 900;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px 12px;
        align-items: center;
        padding: 12px 14px;
        border-radius: 16px;
        background: var(--nutri-surface, #fff);
        border: 1px solid color-mix(in srgb, var(--nutri-success, #16a34a) 35%, var(--nutri-border));
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
      }
      .log-saved-bar-main {
        min-width: 0;
      }
      .log-saved-bar-title {
        display: block;
        font-size: 14px;
        font-weight: 900;
        color: var(--nutri-success, #16a34a);
      }
      .log-saved-bar-detail {
        display: block;
        margin-top: 2px;
        font-size: 13px;
        font-weight: 700;
        color: var(--nutri-text-dark, #0f172a);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .log-saved-bar-next {
        display: none;
        margin: 4px 0 0;
        font-size: 11px;
        font-weight: 600;
        color: var(--nutri-text-muted, #64748b);
      }
      .log-saved-bar-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .log-saved-bar-btn {
        border: 1px solid var(--nutri-border, #e2e8f0);
        border-radius: 10px;
        padding: 7px 10px;
        font-size: 12px;
        font-weight: 800;
        background: #fff;
        color: var(--nutri-text-dark, #0f172a);
        cursor: pointer;
        white-space: nowrap;
      }
      .log-saved-bar-btn--primary {
        background: var(--nutri-primary);
        border-color: transparent;
        color: #fff;
      }
      .log-saved-bar-close {
        position: absolute;
        top: 6px;
        right: 8px;
        border: none;
        background: transparent;
        color: var(--nutri-text-muted, #64748b);
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        padding: 2px 6px;
      }

      .post-save-menus {
        padding: 14px 16px;
        border-radius: 16px;
        background: linear-gradient(145deg, rgba(255, 251, 245, 0.98), rgba(255, 255, 255, 0.96));
        border: 1px solid rgba(251, 146, 60, 0.28);
        box-shadow: 0 8px 22px rgba(245, 158, 11, 0.1);
      }
      .post-save-menus-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }
      .post-save-menus-kicker {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 6px;
        font-size: 12px;
        font-weight: 900;
        color: #c2410c;
      }
      .post-save-menus-headline {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
        line-height: 1.45;
      }
      .post-save-menus-focus,
      .post-save-menus-range {
        margin: 0;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.45;
        color: #78716c;
      }
      .post-save-menus-dismiss {
        border: none;
        background: transparent;
        color: #94a3b8;
        cursor: pointer;
        padding: 4px;
      }
      .post-save-menus-loading {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
      }
      .post-save-menus-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .post-save-menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(214, 211, 209, 0.8);
        background: rgba(255, 255, 255, 0.92);
        cursor: pointer;
        text-align: left;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .post-save-menu-item:hover {
        border-color: rgba(251, 146, 60, 0.45);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
      }
      .post-save-menu-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 900;
        color: #9a3412;
        background: rgba(254, 243, 199, 0.9);
      }
      .post-save-menu-copy {
        flex: 1;
        min-width: 0;
      }
      .post-save-menu-copy strong {
        display: block;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
        margin-bottom: 2px;
      }
      .post-save-menu-copy small {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        line-height: 1.4;
      }
      .post-save-menu-cta {
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 900;
        color: #ea580c;
      }
      .post-save-menus-more {
        width: 100%;
        margin-top: 10px;
        border: none;
        background: transparent;
        font-size: 13px;
        font-weight: 800;
        color: #2563eb;
        cursor: pointer;
        text-align: left;
        padding: 4px 0 0;
      }
      .log-page-block-suggestions {
        order: 4;
      }

      .log-page-summary {
        padding: 12px 14px;
        border-radius: 16px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        background: linear-gradient(135deg, color-mix(in srgb, var(--nutri-primary) 8%, #fff) 0%, #fff 100%);
      }
      .log-page-summary-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }
      .log-page-summary-date {
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .log-page-summary-meal {
        font-size: 12px;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        color: var(--nutri-primary-dark, #1e40af);
      }
      .log-page-summary-meal--activity {
        background: color-mix(in srgb, var(--nutri-success, #16a34a) 12%, #fff);
        color: #166534;
      }
      .log-page-summary-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
      }
      .log-page-summary-metric {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 120px;
      }
      .log-page-summary-metric-label {
        font-size: 11px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
      }
      .log-page-summary-metric-value {
        font-size: 18px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }
      .log-page-summary-metric-value--burn {
        color: var(--nutri-success, #16a34a);
      }
      .log-page-summary-meals {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }
      .log-page-summary-meal-chip {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 8px;
        background: var(--nutri-bg-soft, #f1f5f9);
        color: var(--nutri-text-muted, #64748b);
      }
      .log-page-summary-meal-chip.has-data {
        background: color-mix(in srgb, var(--nutri-primary) 10%, #fff);
        color: var(--nutri-primary-dark, #1e40af);
      }
      .log-page-summary-praise {
        margin: 8px 0 0;
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-primary-dark, #1e40af);
      }
      .log-page-summary-hint {
        margin: 8px 0 0;
        font-size: 11px;
        font-weight: 600;
        color: var(--nutri-text-muted, #94a3b8);
        line-height: 1.4;
      }
      .log-ai-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 22%, var(--nutri-border));
        font-size: 13px;
        font-weight: 700;
        color: var(--nutri-primary-dark, #1e40af);
      }
      .log-ai-banner-dismiss {
        flex-shrink: 0;
        border: none;
        background: #fff;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }
      .log-records-toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }
      .log-records-scope-btn {
        padding: 6px 12px;
        border: 1px solid var(--nutri-border, #e2e8f0);
        border-radius: 999px;
        background: #fff;
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-text-muted, #64748b);
        cursor: pointer;
      }
      .log-records-scope-btn.is-active {
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        border-color: color-mix(in srgb, var(--nutri-primary) 28%, var(--nutri-border));
        color: var(--nutri-primary-dark, #1e40af);
      }
      .log-quick-picks--food {
        margin-top: 8px;
      }
      .dash-collapse-log-records .dash-collapse-body,
      .dash-collapse-history-chart .dash-collapse-body,
      .dash-collapse-history-days .dash-collapse-body {
        padding: 0 0 8px;
      }
      .dash-collapse-log-records .log-panel-records,
      .dash-collapse-history-chart .history-combined-chart-card,
      .dash-collapse-history-days .responsive-card {
        margin: 0 !important;
      }
      .history-hero-subtext--compact {
        font-size: 13px;
      }
      .log-page-hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        flex-wrap: wrap;
      }
      .log-page-eyebrow {
        margin: 0 0 4px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #64748b;
      }
      .log-page-title {
        margin: 0;
        font-size: clamp(22px, 5vw, 28px);
        line-height: 1.2;
        color: var(--nutri-text-dark, #0f172a);
      }
      .log-page-subtitle {
        margin: 6px 0 0;
        font-size: 13px;
        color: #64748b;
        max-width: 36ch;
      }
      .log-page-stat-pill {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
        padding: 10px 14px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 25%, transparent);
      }
      .log-page-stat-pill-activity {
        background: color-mix(in srgb, var(--nutri-success, #16a34a) 12%, #fff);
        border-color: color-mix(in srgb, var(--nutri-success, #16a34a) 25%, transparent);
      }
      .log-page-stat-label {
        font-size: 11px;
        color: #64748b;
      }
      .log-page-stat-value {
        font-size: 18px;
        font-weight: 800;
        color: var(--nutri-primary);
      }
      .log-page-stat-pill-activity .log-page-stat-value {
        color: var(--nutri-success, #16a34a);
      }
      .log-page-meal-tabs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .log-meal-tab {
        padding: 10px 8px;
        border: none;
        border-radius: 12px;
        background: var(--nutri-bg-soft, #f1f5f9);
        color: var(--nutri-text-dark, #0f172a);
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
      }
      .log-meal-tab.is-active {
        background: var(--nutri-primary);
        color: #fff;
      }
      .log-meal-tab-activity.is-active {
        background: var(--nutri-activity-accent, #059669);
      }
      .log-panel {
        padding: 16px !important;
      }
      .log-search-panel {
        display: flex;
        flex-direction: column;
        gap: 0;
      }
      .log-search-results {
        max-height: 240px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .log-search-panel-pro.is-search-active {
        padding-bottom: 12px !important;
      }
      .log-search-panel-pro.is-search-active .log-search-hero {
        position: sticky;
        top: 0;
        z-index: 2;
        padding-bottom: 8px;
        background: var(--nutri-card-bg, #fff);
      }
      .log-search-panel--live {
        margin-top: 4px;
      }
      .log-search-results--live {
        max-height: min(52vh, 420px);
      }
      .log-search-ai-panel {
        flex-shrink: 0;
        padding: 10px 0 2px;
        border-top: 1px dashed rgba(148, 163, 184, 0.35);
        background: linear-gradient(180deg, rgba(239, 246, 255, 0.55) 0%, rgba(255, 255, 255, 0) 100%);
      }
      .log-search-ai-btn {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid color-mix(in srgb, var(--nutri-primary) 28%, #fff);
        background: color-mix(in srgb, var(--nutri-primary) 10%, #fff);
        cursor: pointer;
        text-align: left;
        transition: border-color 0.15s ease, background 0.15s ease;
      }
      .log-search-ai-btn:hover {
        border-color: var(--nutri-primary, #2563eb);
        background: color-mix(in srgb, var(--nutri-primary) 14%, #fff);
      }
      .log-search-ai-btn-main {
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-primary-dark, #1e40af);
      }
      .log-search-ai-btn-sub {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
      }
      .log-search-status--ai {
        padding: 12px 14px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--nutri-primary) 8%, #fff);
      }
      .log-search-status {
        padding: 10px 12px;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
      }
      .log-search-error {
        padding: 12px 14px;
        margin-top: 4px;
        border-radius: 12px;
        background: #fef2f2;
        border: 1px solid rgba(239, 68, 68, 0.25);
        font-size: 13px;
        font-weight: 700;
        color: #b91c1c;
        text-align: center;
      }
      .log-search-item {
        width: 100%;
        text-align: left;
        border: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .log-search-item--custom {
        margin-top: 4px;
        border-top: 1px dashed rgba(148, 163, 184, 0.35);
        background: rgba(239, 246, 255, 0.65);
      }
      .log-search-item--custom b {
        color: var(--nutri-primary, #2563eb);
      }
      .log-search-item--custom:disabled {
        opacity: 0.7;
        cursor: wait;
      }
      .log-search-custom-hint {
        margin: 8px 0 4px;
        padding: 8px 10px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--nutri-primary) 8%, #fff);
        font-size: 12px;
        font-weight: 700;
        color: var(--nutri-primary-dark, #1e40af);
        text-align: center;
      }
      .log-quick-picks {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0 4px;
      }
      .log-quick-pick {
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: #fff;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        color: var(--nutri-text-dark, #0f172a);
      }
      .log-quick-pick:hover {
        border-color: var(--nutri-success, #16a34a);
        color: var(--nutri-success, #16a34a);
      }
      .log-quick-picks--fruits {
        margin-top: 6px;
      }
      .log-quick-pick--fruit {
        border-color: rgba(234, 88, 12, 0.25);
        background: rgba(255, 247, 237, 0.85);
      }
      .log-quick-pick--fruit:hover {
        border-color: #ea580c;
        color: #ea580c;
      }
      .log-quick-picks--drinks {
        margin-top: 6px;
      }
      .log-quick-picks-label {
        width: 100%;
        font-size: 11px;
        font-weight: 800;
        color: #64748b;
        letter-spacing: 0.3px;
      }
      .log-quick-pick--drink {
        border-color: rgba(59, 130, 246, 0.25);
        background: rgba(239, 246, 255, 0.65);
      }
      .log-quick-pick--drink:hover {
        border-color: var(--nutri-primary, #2563eb);
        color: var(--nutri-primary, #2563eb);
      }
      .log-activity-summary-line {
        margin: 0 0 10px;
        font-size: 13px;
        color: #64748b;
      }
      .log-activity-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .meal-section-header-compact {
        margin-bottom: 8px;
      }
      .log-records-compact .meal-section-block {
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      }
      .log-records-compact .meal-section-block:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      @media (max-width: 900px) {
        .nav-link-label-full {
          display: none;
        }
        .nav-link-label-short {
          display: inline;
        }
        .dashboard-quick-actions {
          grid-template-columns: 1fr;
        }
        .log-page-hero {
          flex-direction: column;
        }
        .log-page-stat-pill {
          align-self: stretch;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }

      @media (max-width: 640px) {
        .log-search-results {
          max-height: 180px;
        }
        .log-search-results--live {
          max-height: min(58vh, 480px);
        }
      }

      .day-context-bar {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 14px 16px;
        border-radius: 16px;
        background: var(--nutri-card-bg, #fff);
        border: 1px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
      }
      .day-context-date {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .day-context-meal {
        font-size: 13px;
        color: #64748b;
      }
      .day-context-meal strong {
        color: var(--nutri-primary);
      }
      .day-context-meal--activity strong {
        color: var(--nutri-success, #16a34a);
      }

      .daily-totals-bar,
      .activity-totals-bar {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px 16px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95));
        border: 1px solid rgba(148, 163, 184, 0.22);
      }
      .daily-totals-main {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .activity-totals-bar {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .daily-total-cell,
      .activity-totals-cell {
        display: flex;
        flex-direction: column;
        gap: 2px;
        align-items: center;
        text-align: center;
        padding: 8px 6px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.7);
      }
      .daily-total-cell--net {
        background: color-mix(in srgb, var(--nutri-primary) 10%, #fff);
      }
      .daily-total-label,
      .activity-totals-label {
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .daily-total-value,
      .activity-totals-value {
        font-size: 20px;
        font-weight: 900;
        line-height: 1.1;
        color: var(--nutri-text-dark, #0f172a);
      }
      .daily-total-value small,
      .activity-totals-value small {
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
      }
      .daily-total-value--food { color: var(--nutri-primary); }
      .daily-total-value--burn { color: var(--nutri-activity-accent, #059669); }
      .activity-totals-value--burn { color: var(--nutri-activity-accent, #059669); }
      .daily-total-value--net { color: var(--nutri-primary); }

      .daily-meal-totals-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .daily-meal-total-chip {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 8px;
        border-radius: 10px;
        background: rgba(241, 245, 249, 0.9);
      }
      .daily-meal-total-name {
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
      }
      .daily-meal-total-cal {
        font-size: 16px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }

      .log-meal-tab-cal {
        display: block;
        font-size: 10px;
        font-weight: 800;
        opacity: 0.85;
        margin-top: 2px;
      }

      .log-records-title {
        font-size: 15px;
        font-weight: 800;
        margin-bottom: 12px;
        color: var(--nutri-text-dark, #0f172a);
      }

      .log-list-header {
        display: grid;
        gap: 8px;
        padding: 6px 10px;
        margin-bottom: 6px;
        border-radius: 8px;
        background: rgba(241, 245, 249, 0.9);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #94a3b8;
      }
      .log-list-header--food {
        grid-template-columns: 52px 1fr 72px 32px;
      }
      .log-list-header--activity {
        grid-template-columns: 52px 44px 1fr 40px 52px 32px;
      }

      .meal-log-section {
        margin-bottom: 12px;
      }
      .meal-log-section-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        margin-bottom: 4px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--nutri-primary) 8%, #fff);
      }
      .meal-log-section--activity .meal-log-section-head {
        background: color-mix(in srgb, var(--nutri-success, #16a34a) 8%, #fff);
      }
      .meal-log-section-name {
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-primary);
      }
      .meal-log-section--activity .meal-log-section-name {
        color: var(--nutri-success, #16a34a);
      }
      .meal-log-section-total {
        font-size: 14px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }

      .log-entry-row {
        display: grid;
        align-items: center;
        gap: 8px;
        padding: 10px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }
      .log-entry-row--food {
        grid-template-columns: 52px 1fr 72px 32px;
      }
      .log-entry-row--activity {
        grid-template-columns: 52px 44px 1fr 40px 52px 32px;
      }
      .log-entry-row:last-child {
        border-bottom: none;
      }
      .log-entry-time {
        font-size: 13px;
        font-weight: 800;
        color: #64748b;
        font-variant-numeric: tabular-nums;
      }
      .log-entry-meal {
        font-size: 11px;
        font-weight: 800;
        color: var(--nutri-success, #16a34a);
      }
      .log-entry-name {
        font-size: 14px;
        font-weight: 700;
        color: var(--nutri-text-dark, #0f172a);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .log-entry-estimate-tag {
        font-weight: 600;
        color: #94a3b8;
      }
      .log-entry-meta {
        font-size: 12px;
        font-weight: 700;
        color: #94a3b8;
        text-align: center;
      }
      .log-entry-kcal {
        font-size: 14px;
        font-weight: 900;
        color: var(--nutri-primary);
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .log-entry-kcal--burn {
        color: var(--nutri-success, #16a34a);
      }
      .log-entry-delete {
        justify-self: end;
      }

      .log-day-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        padding: 12px 14px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--nutri-primary) 12%, #fff);
        font-size: 14px;
        font-weight: 700;
        color: #475569;
      }
      .log-day-footer strong {
        font-size: 18px;
        font-weight: 900;
        color: var(--nutri-primary);
      }
      .log-day-footer--activity {
        background: color-mix(in srgb, var(--nutri-success, #16a34a) 12%, #fff);
      }
      .log-day-footer--activity strong {
        color: var(--nutri-success, #16a34a);
      }

      .log-empty-hint {
        margin: 0;
        padding: 20px 12px;
        text-align: center;
        font-size: 13px;
        color: #94a3b8;
      }

      .dashboard-day-summary {
        margin-bottom: 20px;
        padding: 16px;
        border-radius: 18px;
        background: var(--nutri-card-bg, #fff);
        border: 1px solid rgba(148, 163, 184, 0.22);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
      }
      .dashboard-day-summary-date {
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
        margin-bottom: 12px;
      }

      .daily-reward-strip {
        margin-top: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(255,251,235,0.95), rgba(254,242,242,0.85));
        border: 1px solid rgba(251, 191, 36, 0.25);
      }
      .daily-reward-strip-main {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .daily-reward-points-block {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .daily-reward-points-num {
        font-size: 28px;
        font-weight: 900;
        line-height: 1;
        color: #b45309;
        font-variant-numeric: tabular-nums;
      }
      .daily-reward-points-label {
        font-size: 12px;
        font-weight: 700;
        color: #92400e;
      }
      .daily-reward-hearts-count {
        font-size: 18px;
        font-weight: 900;
        color: #db2777;
      }
      .daily-reward-praise {
        margin: 8px 0 0;
        font-size: 13px;
        font-weight: 700;
        color: #78350f;
      }

      .reward-star,
      .reward-heart {
        color: #cbd5e1;
        font-size: 15px;
        line-height: 1;
      }
      .reward-star.is-filled {
        color: #f59e0b;
      }
      .reward-heart.is-filled {
        color: #ec4899;
      }
      .reward-star.is-sm,
      .reward-heart.is-sm {
        font-size: 10px;
      }
      .icon-rating {
        display: inline-flex;
        gap: 2px;
        align-items: center;
      }
      .meal-tab-stars {
        display: flex;
        justify-content: center;
        gap: 1px;
        margin-top: 2px;
      }

      .meal-reward-banner {
        margin: 0 0 8px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid transparent;
      }
      .meal-reward-banner--great {
        background: linear-gradient(135deg, rgba(220,252,231,0.9), rgba(236,253,245,0.95));
        border-color: rgba(16, 185, 129, 0.25);
      }
      .meal-reward-banner--good {
        background: linear-gradient(135deg, rgba(239,246,255,0.95), rgba(224,242,254,0.9));
        border-color: rgba(59, 130, 246, 0.2);
      }
      .meal-reward-banner--watch {
        background: linear-gradient(135deg, rgba(255,251,235,0.95), rgba(254,243,199,0.85));
        border-color: rgba(245, 158, 11, 0.25);
      }
      .meal-reward-banner--neutral {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-color: rgba(148, 163, 184, 0.35);
      }
      .meal-reward-banner-top--plain {
        justify-content: flex-start;
      }
      .meal-reward-banner--neutral .meal-reward-praise {
        color: #64748b;
      }
      .food-portion-unverified-note {
        margin: 0 0 14px;
        padding: 10px 12px;
        border-radius: 12px;
        background: #fff7ed;
        border: 1px solid rgba(251, 146, 60, 0.35);
        font-size: 13px;
        font-weight: 700;
        color: #c2410c;
        line-height: 1.45;
      }

      .food-preferences-card {
        margin-bottom: 25px;
      }
      .food-preferences-card .food-avoid-card {
        box-shadow: none;
        border: none;
        background: transparent;
        padding: 0;
      }

      .food-avoid-card {
        position: relative;
        overflow: hidden;
        padding: 16px;
        border-radius: 18px;
        background:
          linear-gradient(145deg, rgba(255, 251, 245, 0.98) 0%, rgba(255, 255, 255, 0.96) 55%, rgba(254, 243, 199, 0.22) 100%);
        border: 1px solid rgba(251, 146, 60, 0.22);
        box-shadow:
          0 10px 28px rgba(245, 158, 11, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.85);
      }
      .food-avoid-card::before {
        content: "";
        position: absolute;
        top: -40px;
        right: -30px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, transparent 70%);
        pointer-events: none;
      }
      .food-avoid-card--compact {
        padding: 14px;
        border-radius: 16px;
      }

      .food-avoid-head {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 14px;
      }
      .food-avoid-head-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 14px;
        flex-shrink: 0;
        color: #c2410c;
        background: linear-gradient(145deg, rgba(254, 243, 199, 0.95), rgba(253, 230, 138, 0.55));
        border: 1px solid rgba(251, 146, 60, 0.28);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.12);
      }
      .food-avoid-card--compact .food-avoid-head-icon {
        width: 36px;
        height: 36px;
        border-radius: 12px;
      }
      .food-avoid-title {
        margin: 0 0 4px;
        font-size: 15px;
        font-weight: 900;
        letter-spacing: -0.01em;
        color: #9a3412;
      }
      .food-avoid-card--compact .food-avoid-title {
        font-size: 14px;
      }
      .food-avoid-hint {
        margin: 0;
        font-size: 12px;
        line-height: 1.5;
        color: #78716c;
      }

      .food-avoid-empty {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px dashed rgba(251, 146, 60, 0.28);
        font-size: 12px;
        font-weight: 600;
        color: #a8a29e;
      }
      .food-avoid-empty-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fdba74;
        flex-shrink: 0;
      }

      .food-avoid-selected {
        margin-bottom: 12px;
      }
      .food-avoid-selected-label {
        display: block;
        margin-bottom: 8px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #b45309;
      }
      .food-avoid-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .food-avoid-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid rgba(251, 146, 60, 0.35);
        border-radius: 999px;
        padding: 7px 10px 7px 12px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        color: #9a3412;
        background: linear-gradient(145deg, #fff7ed, #ffedd5);
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .food-avoid-tag:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.16);
      }

      .food-avoid-input-row {
        display: flex;
        gap: 8px;
        margin-bottom: 14px;
      }
      .food-avoid-input {
        flex: 1;
        min-width: 0;
        padding: 11px 14px;
        border-radius: 12px;
        border: 1px solid rgba(214, 211, 209, 0.9);
        background: rgba(255, 255, 255, 0.92);
        font-size: 14px;
        font-weight: 600;
        color: var(--nutri-text-dark, #0f172a);
        outline: none;
        box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .food-avoid-input::placeholder {
        color: #a8a29e;
        font-weight: 500;
      }
      .food-avoid-input:focus {
        border-color: rgba(251, 146, 60, 0.65);
        box-shadow:
          0 0 0 3px rgba(251, 146, 60, 0.14),
          inset 0 1px 2px rgba(15, 23, 42, 0.04);
      }
      .food-avoid-add-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border: none;
        border-radius: 12px;
        padding: 0 14px;
        min-width: 72px;
        font-size: 13px;
        font-weight: 800;
        color: #fff;
        cursor: pointer;
        background: linear-gradient(145deg, #f97316, #ea580c);
        box-shadow: 0 6px 16px rgba(234, 88, 12, 0.28);
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      .food-avoid-add-btn:hover:not(:disabled) {
        transform: translateY(-1px);
      }
      .food-avoid-add-btn:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        box-shadow: none;
      }

      .food-avoid-presets-label {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.03em;
        color: #78716c;
      }
      .food-avoid-preset-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
      }
      .food-avoid-card--compact .food-avoid-preset-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 6px;
      }
      @media (max-width: 520px) {
        .food-avoid-preset-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      .food-avoid-preset {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 64px;
        padding: 8px 6px;
        border-radius: 14px;
        border: 1px solid rgba(214, 211, 209, 0.75);
        background: rgba(255, 255, 255, 0.88);
        cursor: pointer;
        transition:
          transform 0.15s ease,
          border-color 0.15s ease,
          background 0.15s ease,
          box-shadow 0.15s ease;
      }
      .food-avoid-card--compact .food-avoid-preset {
        min-height: 58px;
        border-radius: 12px;
      }
      .food-avoid-preset:hover {
        transform: translateY(-2px);
        border-color: rgba(251, 146, 60, 0.45);
        box-shadow: 0 6px 14px rgba(245, 158, 11, 0.12);
      }
      .food-avoid-preset.is-active {
        border-color: rgba(234, 88, 12, 0.55);
        background: linear-gradient(160deg, #fff7ed 0%, #fed7aa 100%);
        box-shadow:
          0 8px 18px rgba(234, 88, 12, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.7);
      }
      .food-avoid-preset-emoji {
        font-size: 20px;
        line-height: 1;
      }
      .food-avoid-preset-label {
        font-size: 12px;
        font-weight: 800;
        color: #57534e;
      }
      .food-avoid-preset.is-active .food-avoid-preset-label {
        color: #9a3412;
      }

      /* legacy aliases kept for MenuRecommendationPrefs */
      .food-pref-intro {
        margin: 0 0 16px;
        font-size: 13px;
        color: #64748b;
        line-height: 1.5;
      }
      .food-pref-field {
        margin-bottom: 18px;
      }
      .food-pref-label {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .food-pref-field--like .food-pref-label { color: #047857; }
      .food-pref-field--dislike .food-pref-label { color: #b45309; }
      .food-pref-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
        min-height: 0;
      }
      .food-pref-tag {
        border: none;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        background: rgba(59, 130, 246, 0.12);
        color: #1d4ed8;
      }
      .food-pref-field--dislike .food-pref-tag {
        background: rgba(245, 158, 11, 0.15);
        color: #b45309;
      }
      .food-pref-presets {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      .food-pref-preset {
        border: 1px dashed rgba(148, 163, 184, 0.45);
        border-radius: 999px;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 700;
        background: #fff;
        color: #64748b;
        cursor: pointer;
      }
      .food-pref-preset.is-active,
      .food-pref-preset:hover {
        border-color: var(--nutri-primary, #2563eb);
        color: var(--nutri-primary, #2563eb);
      }
      .food-pref-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 4px;
      }
      .food-pref-saved {
        font-size: 13px;
        font-weight: 700;
        color: #047857;
      }
      .dash-ai-pref-hint {
        margin: 0 0 10px;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        line-height: 1.45;
      }
      .dash-ai-pref-panel {
        margin-bottom: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.25);
      }
      .dash-ai-pref-title {
        margin: 0 0 10px;
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .food-pref-editor--compact .food-pref-actions {
        margin-top: 8px;
      }
      .login-food-avoidance {
        margin: 4px 0 16px;
        padding: 0;
        border: none;
        background: transparent;
      }
      .food-prefs-modal .food-avoid-card {
        margin-bottom: 4px;
      }
      .food-pref-compact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      @media (max-width: 720px) {
        .food-pref-compact-grid {
          grid-template-columns: 1fr;
        }
      }
      .food-pref-field--compact {
        margin-bottom: 0;
      }
      .food-pref-field--compact .food-pref-label {
        font-size: 12px;
        margin-bottom: 6px;
      }
      .food-pref-field--compact .food-pref-input {
        width: 100%;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        font-size: 13px;
        margin-bottom: 6px;
      }
      .food-pref-field--compact .food-pref-presets {
        gap: 6px;
        margin-top: 4px;
      }
      .food-pref-field--compact .food-pref-preset {
        padding: 4px 8px;
        font-size: 11px;
      }
      .food-pref-field--compact .food-pref-tag {
        padding: 4px 8px;
        font-size: 11px;
      }
      .food-pref-save-compact {
        border: none;
        border-radius: 10px;
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        background: var(--nutri-primary, #2563eb);
        color: #fff;
      }
      .meal-reward-banner-top {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
      .meal-reward-badge {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 3px 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.75);
        color: #64748b;
      }
      .meal-reward-points {
        margin-left: auto;
        font-size: 12px;
        font-weight: 900;
        color: #b45309;
      }
      .meal-reward-praise {
        margin: 6px 0 0;
        font-size: 13px;
        font-weight: 800;
        color: var(--nutri-text-dark, #0f172a);
      }
      .meal-reward-tip {
        margin: 4px 0 0;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        line-height: 1.4;
      }
      .meal-reward-banner--great .meal-reward-praise { color: #047857; }
      .meal-reward-banner--good .meal-reward-praise { color: #1d4ed8; }
      .meal-reward-banner--watch .meal-reward-praise { color: #b45309; }

      .dashboard-day-summary .daily-reward-strip {
        margin-top: 14px;
      }

      .daily-complete-toast-wrap {
        position: fixed;
        top: max(16px, env(safe-area-inset-top));
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        width: min(420px, calc(100vw - 24px));
        pointer-events: none;
        animation: dailyCompleteToastIn 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }
      @keyframes dailyCompleteToastIn {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-18px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      .daily-complete-toast {
        position: relative;
        pointer-events: auto;
        padding: 16px 18px 14px;
        border-radius: 18px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.6);
        text-align: center;
      }
      .daily-complete-toast--great {
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        border-color: rgba(16, 185, 129, 0.35);
      }
      .daily-complete-toast--good {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border-color: rgba(59, 130, 246, 0.3);
      }
      .daily-complete-toast--watch {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-color: rgba(245, 158, 11, 0.35);
      }
      .daily-complete-toast-close {
        position: absolute;
        top: 8px;
        right: 10px;
        border: none;
        background: transparent;
        font-size: 20px;
        line-height: 1;
        color: #94a3b8;
        cursor: pointer;
        padding: 4px;
      }
      .daily-complete-toast-stars {
        display: flex;
        justify-content: center;
        gap: 4px;
        margin-bottom: 6px;
      }
      .daily-complete-toast-stars .reward-star {
        font-size: 22px;
      }
      .daily-complete-toast-title {
        margin: 0;
        font-size: 17px;
        font-weight: 900;
        color: var(--nutri-text-dark, #0f172a);
      }
      .daily-complete-toast-hint {
        margin: 4px 0 0;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
      }
      .daily-complete-toast--great .daily-complete-toast-title { color: #047857; }
      .daily-complete-toast--good .daily-complete-toast-title { color: #1d4ed8; }
      .daily-complete-toast--watch .daily-complete-toast-title { color: #b45309; }

      .history-meal-row-clear {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
      .history-meal-row-left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        min-width: 0;
      }
      .history-meal-time {
        font-size: 12px;
        font-weight: 800;
        color: #64748b;
        font-variant-numeric: tabular-nums;
        min-width: 44px;
      }
      .history-meal-type-clear {
        font-size: 11px !important;
        font-weight: 800 !important;
      }
      .history-meal-name {
        font-size: 14px;
        font-weight: 600;
      }
      .history-meal-meta {
        font-size: 12px;
        color: #94a3b8;
      }
      .history-day-list-hint {
        margin: 0 0 16px;
        font-size: 13px;
        font-weight: 600;
        color: #64748b;
      }
      .history-day-toggle {
        font-family: inherit;
      }
      .history-day-detail {
        background: #fafbfc;
      }
      .history-meal-group {
        margin-top: 12px;
      }
      .history-meal-group-title {
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--nutri-primary-dark, #1e40af);
      }
      .history-day-empty-detail {
        margin: 12px 0 0;
        padding: 12px 14px;
        border-radius: 12px;
        background: rgba(148, 163, 184, 0.12);
        font-size: 13px;
        font-weight: 600;
        line-height: 1.55;
        color: #64748b;
      }

      @media (max-width: 640px) {
        .log-list-header--food {
          display: none;
        }
        .log-entry-row--food {
          grid-template-columns: minmax(0, 1fr) auto 44px;
          align-items: start;
          padding: 12px 10px;
        }
        .log-entry-row--food .log-entry-time {
          display: none;
        }
        .log-entry-name {
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
          line-height: 1.35;
        }
        .log-entry-delete {
          width: 44px !important;
          height: 44px !important;
          border-radius: 12px !important;
        }
        .log-entry-kcal {
          font-size: 13px;
          padding-top: 2px;
        }
        .history-chart-meta {
          flex-direction: column;
          align-items: flex-start !important;
          gap: 6px !important;
        }
        .history-combined-chart-wrap {
          height: 280px !important;
          min-height: 280px;
        }
        .log-list-header--activity,
        .log-entry-row--activity {
          grid-template-columns: 48px 1fr 56px 28px;
        }
        .log-list-header--activity span:nth-child(2),
        .log-list-header--activity span:nth-child(4),
        .log-entry-row--activity .log-entry-meal,
        .log-entry-row--activity .log-entry-meta {
          display: none;
        }
        .daily-totals-main,
        .activity-totals-bar {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
