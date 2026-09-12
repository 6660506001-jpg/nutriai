import React from "react";

export default function LoginVisualEffects() {
  return (
    <style>{`
      .login-input-pro {
        transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
      }
      .login-input-pro:focus {
        outline: none;
        border-color: var(--nutri-accent-alpha-28) !important;
        box-shadow: 0 0 0 4px var(--nutri-accent-alpha-12);
        background: #ffffff !important;
      }
      .login-tab-btn {
        transition: all 180ms ease;
      }
      .login-tab-btn:hover {
        color: var(--nutri-primary);
      }
      .login-submit-btn {
        transition: transform 160ms ease, box-shadow 180ms ease;
        min-height: 52px;
        touch-action: manipulation;
        position: relative;
        z-index: 5;
        -webkit-appearance: none;
        cursor: pointer;
      }
      .login-form-panel-touch {
        position: relative;
        z-index: 4;
        pointer-events: auto;
      }
      .login-form-touch {
        position: relative;
        z-index: 1;
      }
      .login-page-mobile {
        min-height: 100dvh;
        overflow-y: auto;
        touch-action: manipulation;
        align-items: center;
        justify-content: flex-start;
        padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
        box-sizing: border-box;
      }
      .login-page-mobile .login-shell-responsive {
        overflow: visible;
        width: 100%;
        max-width: 440px;
        margin: auto 0;
      }
      .login-form-header-mobile {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }
      .login-form-theme-slot {
        flex-shrink: 0;
        margin-top: 2px;
      }
      .login-form-theme-slot .theme-fab-root {
        width: auto !important;
      }
      .login-form-theme-slot .theme-fab-launch {
        width: auto;
        padding: 8px 10px 8px 8px;
        border-color: #e2e8f0;
        background: #f8fafc;
      }
      .login-form-theme-slot .theme-fab-launch:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }
      .login-form-theme-slot .theme-fab-launch-title {
        color: #1e293b;
        font-size: 13px;
      }
      .login-form-theme-slot .theme-fab-launch-sub {
        color: #64748b;
        font-size: 11px;
      }
      .login-form-theme-slot .theme-fab-launch-icon {
        width: 40px;
        height: 40px;
      }
      .theme-fab-launch {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.22);
        background: rgba(255, 255, 255, 0.1);
        cursor: pointer;
        text-align: left;
        transition: background 160ms ease, border-color 160ms ease;
      }
      .theme-fab-launch:hover {
        background: rgba(255, 255, 255, 0.16);
        border-color: rgba(255, 255, 255, 0.32);
      }
      .theme-fab-launch-icon {
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border: 2px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
      }
      .theme-fab-launch-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .theme-fab-launch-title {
        font-size: 14px;
        font-weight: 800;
        line-height: 1.25;
      }
      .theme-fab-launch-sub {
        font-size: 11px;
        font-weight: 600;
        line-height: 1.35;
        opacity: 0.88;
      }
      .login-brand-theme-slot .theme-fab-launch-title,
      .login-brand-theme-slot .theme-fab-launch-sub {
        color: rgba(255, 255, 255, 0.95);
      }
      .login-error-msg {
        margin: 0 0 12px;
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: #b91c1c;
        font-size: 13px;
        line-height: 1.45;
        text-align: center;
      }
      .login-error-msg-top {
        margin-top: 0;
      }
      .login-mobile-brand {
        display: none;
        margin: 0;
        font-size: 12px;
        font-weight: 800;
        color: var(--nutri-primary, #1E293B);
      }
      .login-mobile-brand-row {
        display: none;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
      }
      .login-mobile-brand-icon {
        width: 28px;
        height: 28px;
        border-radius: 9px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--nutri-accent-alpha-12, rgba(244, 114, 182, 0.12));
        color: var(--nutri-primary, #1E293B);
        flex-shrink: 0;
      }
      .login-mobile-header-main {
        flex: 1;
        min-width: 0;
      }
      .login-submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--nutri-shadow-primary-btn);
      }
      .login-shell-theme-live {
        transition: box-shadow 0.45s ease, border-color 0.45s ease;
      }
      .login-brand-panel-theme-live {
        transition: background 0.45s ease;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-shell-responsive {
        background: rgba(255, 255, 255, 0.58) !important;
        backdrop-filter: blur(22px) saturate(1.12);
        -webkit-backdrop-filter: blur(22px) saturate(1.12);
        border: 1px solid rgba(255, 255, 255, 0.55) !important;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-theme-live,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-responsive {
        position: relative;
        backdrop-filter: blur(22px) saturate(1.15);
        -webkit-backdrop-filter: blur(22px) saturate(1.15);
        border-right: 1px solid rgba(255, 255, 255, 0.22);
        color: #1E293B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-theme-live::before,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-responsive::before {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.62);
        pointer-events: none;
        z-index: 0;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-theme-live > *,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-responsive > * {
        position: relative;
        z-index: 1;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-responsive h1 {
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-responsive p,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-responsive div {
        color: #334155 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-panel-responsive svg {
        color: #1E293B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-brand-logo-wrap {
        color: #1E293B !important;
        background: rgba(255, 255, 255, 0.72) !important;
        border-color: rgba(148, 163, 184, 0.45) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .theme-fab-root > p {
        color: #475569 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-form-panel-responsive {
        background: rgba(255, 255, 255, 0.42) !important;
        backdrop-filter: blur(24px) saturate(1.1);
        -webkit-backdrop-filter: blur(24px) saturate(1.1);
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-tab-row {
        background: rgba(255, 255, 255, 0.55) !important;
        border-color: rgba(255, 255, 255, 0.45) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-tab-btn.login-tab-active-theme.is-active {
        background: linear-gradient(135deg, #475569 0%, #1E293B 100%) !important;
        color: #ffffff !important;
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-tab-btn.login-tab-active-theme:not(.is-active) {
        background: transparent !important;
        color: #475569 !important;
        box-shadow: none !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-submit-btn {
        background: linear-gradient(135deg, #475569 0%, #1E293B 100%) !important;
        color: #ffffff !important;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.2) !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-label-pro,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-form-panel-responsive label {
        color: #334155 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-input-pro {
        background: rgba(255, 255, 255, 0.72) !important;
        border-color: rgba(148, 163, 184, 0.55) !important;
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-input-pro:focus {
        background: rgba(255, 255, 255, 0.92) !important;
        border-color: #64748B !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-form-panel-responsive h2 {
        color: #0F172A !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-form-panel-responsive p,
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-footer-text {
        color: #475569 !important;
      }
      :is(html[data-theme="glass-default"], html[data-theme="unselected"]) .login-footer-link {
        color: #1E293B !important;
        font-weight: 800 !important;
      }
      .login-brand-panel-responsive {
        transition: background 0.45s ease;
      }
      .login-tab-active-theme {
        transition: background 0.4s ease, box-shadow 0.4s ease;
      }
      @keyframes themeLivePulse {
        0% { box-shadow: 0 0 0 0 var(--nutri-accent-alpha-32), 0 30px 70px rgba(15, 23, 42, 0.35); }
        45% { box-shadow: 0 0 0 10px var(--nutri-accent-alpha-15), 0 30px 70px rgba(15, 23, 42, 0.35); }
        100% { box-shadow: 0 0 0 0 transparent, 0 30px 70px rgba(15, 23, 42, 0.35); }
      }
      .theme-live-pulse {
        animation: themeLivePulse 0.75s ease;
      }
      .login-theme-fab-slot {
        display: none !important;
      }
      .login-theme-portal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
        background: rgba(15, 23, 42, 0.48);
        box-sizing: border-box;
      }
      .login-theme-portal-panel {
        width: min(380px, calc(100vw - 32px)) !important;
        max-height: min(78vh, 620px) !important;
        overflow-y: auto !important;
        padding: 18px !important;
        border-radius: 20px !important;
        opacity: 1 !important;
        transform: none !important;
        margin: 0 !important;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
      }
      .login-theme-portal-panel.theme-fab-panel {
        max-height: min(78vh, 620px) !important;
      }
      @media (min-width: 861px) {
        .login-theme-portal-panel {
          width: min(420px, calc(100vw - 48px)) !important;
        }
      }
      .login-theme-portal-panel .theme-picker-grid-compact,
      .login-theme-portal-panel .theme-picker-chrome-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }
      .login-theme-portal-panel .theme-picker-modal-hint {
        white-space: normal;
        line-height: 1.4;
      }
      .login-theme-portal-close {
        position: fixed;
        top: max(12px, env(safe-area-inset-top));
        right: 12px;
        z-index: 10000;
        width: 44px;
        height: 44px;
        border-radius: 999px;
        border: none;
        background: var(--nutri-gradient-primary);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.22);
        cursor: pointer;
        padding: 0;
      }
      @media (max-width: 860px) {
        .login-shell-responsive {
          grid-template-columns: 1fr !important;
        }
        .login-brand-panel-responsive {
          display: none !important;
        }
        .login-form-panel-responsive {
          padding: 24px 20px 28px !important;
          border-radius: 20px;
        }
        .login-form-header-mobile .login-form-title-mobile,
        .login-form-header-mobile h2 {
          font-size: 26px !important;
          line-height: 1.2;
          margin: 0 !important;
        }
        .login-form-header-mobile p {
          margin-top: 6px !important;
          font-size: 13px !important;
          line-height: 1.45;
        }
        .login-mobile-brand-row {
          display: flex;
        }
        .login-mobile-brand {
          display: block;
        }
        .login-form-theme-slot .theme-fab-launch-sub {
          display: none;
        }
        .login-form-theme-slot .theme-fab-launch-title {
          font-size: 12px;
        }
        .login-form-theme-slot .theme-fab-launch-icon {
          width: 38px;
          height: 38px;
        }
        .login-shell-theme-live.theme-live-pulse {
          animation: none !important;
        }
        .login-page-mobile {
          padding-top: max(12px, env(safe-area-inset-top));
        }
      }
      @media (max-width: 480px) {
        .login-form-panel-responsive {
          padding: 20px 16px 24px !important;
          border-radius: 18px !important;
        }
        .login-form-header-mobile h2 {
          font-size: 22px !important;
        }
        .login-input-pro,
        .login-form-touch select {
          font-size: 16px !important;
          min-height: 48px;
        }
        .login-submit-btn {
          min-height: 48px;
          font-size: 16px !important;
        }
        .login-tab-btn {
          min-height: 44px;
        }
        .share-access-mobile-only {
          margin-top: 14px;
        }
      }
      .theme-fab-panel {
        max-height: 0;
        opacity: 0;
        transform: scale(0.72);
        transform-origin: bottom left;
        transition:
          max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.28s ease,
          transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
          padding 0.32s ease,
          margin-bottom 0.32s ease;
      }
      .theme-fab-shell.is-expanded .theme-fab-panel {
        max-height: min(85vh, 720px);
        opacity: 1;
        transform: scale(1);
        padding: 14px !important;
        margin-bottom: 10px !important;
        overflow-y: auto;
      }
      .theme-fab-trigger {
        transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s ease;
      }
      .theme-fab-shell.is-expanded .theme-fab-trigger {
        transform: rotate(90deg);
      }
      .theme-fab-trigger:hover {
        transform: scale(1.06);
      }
      .theme-fab-shell.is-expanded .theme-fab-trigger:hover {
        transform: rotate(90deg) scale(1.06);
      }
    `}</style>
  );
}
