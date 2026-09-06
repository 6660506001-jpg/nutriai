export const getSystemPrefersDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const resolveAppearanceMode = (appearanceMode, followDevice) => {
  if (followDevice) return 'light';
  if (appearanceMode === 'system') return 'light';
  return appearanceMode === 'dark' ? 'dark' : 'light';
};
export const getChromePickerStyles = (isDark) => {
  const accent = isDark ? '#60A5FA' : '#2563EB';
  const accentText = isDark ? '#0F172A' : '#FFFFFF';

  return {
    wrap: {
      background: isDark ? '#2A2A2A' : '#FFFFFF',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
      boxShadow: isDark ? 'none' : '0 1px 3px rgba(15,23,42,0.06)',
    },
    title: { color: isDark ? '#F1F5F9' : '#1E293B' },
    modeToggle: {
      background: isDark ? '#383838' : '#F1F5F9',
      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
    },
    modeBtn: { color: isDark ? '#94A3B8' : '#64748B' },
    modeBtnActive: {
      background: accent,
      color: accentText,
      boxShadow: isDark ? 'none' : '0 2px 8px rgba(37,99,235,0.28)',
    },
    tile: {
      background: isDark ? '#404040' : '#E8EDF2',
      border: '1px solid transparent',
    },
    tileActive: {
      border: `2px solid ${accent}`,
      background: isDark ? '#404040' : '#FFFFFF',
      boxShadow: isDark ? 'none' : '0 0 0 1px rgba(37,99,235,0.12)',
    },
    customInner: {
      background: isDark ? '#333333' : '#FFFFFF',
      border: isDark ? '1px dashed #64748B' : '1px dashed #CBD5E1',
    },
    eyedropperColor: isDark ? '#94A3B8' : '#64748B',
    followLabel: { color: isDark ? '#E2E8F0' : '#334155' },
    badge: { background: accent, color: accentText },
    switchTrack: { background: isDark ? '#52525B' : '#CBD5E1' },
    switchTrackOn: { background: accent },
  };
};

/** การ์ดบนพanel กรมท่า — ใช้พื้นขาวเสมอให้มองเห็นชัด */
export const getBrandPanelPickerStyles = () => {
  const base = getChromePickerStyles(false);
  return {
    ...base,
    wrap: {
      background: 'rgba(255,255,255,0.97)',
      border: '1px solid rgba(255,255,255,0.55)',
      boxShadow: '0 10px 28px rgba(15,23,42,0.22)',
    },
  };
};
