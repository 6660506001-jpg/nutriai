const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized;
  const num = parseInt(value, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

export const rgbToHex = (r, g, b) =>
  `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')}`;

export const mixHex = (hexA, hexB, weight = 0.5) => {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const w = clamp(weight, 0, 1);
  return rgbToHex(
    a.r + (b.r - a.r) * w,
    a.g + (b.g - a.g) * w,
    a.b + (b.b - a.b) * w,
  );
};

export const lighten = (hex, amount) => mixHex(hex, '#ffffff', amount);
export const darken = (hex, amount) => mixHex(hex, '#000000', amount);

export const toRgbString = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
};

/** Derive a Nutri-style palette from a single accent pick (Chrome custom color). */
export const paletteFromAccent = (accentHex) => {
  const primary = accentHex;
  const primaryLight = lighten(primary, 0.35);
  const primaryDark = darken(primary, 0.18);
  const secondary = darken(desaturate(primary, 0.55), 0.62);
  const secondaryDeep = darken(secondary, 0.22);
  const bg = lighten(primary, 0.92);
  const bgSoft = lighten(primary, 0.88);
  const border = mixHex(bg, secondary, 0.12);
  const accentMuted = lighten(primary, 0.78);
  const aiLight = lighten(primary, 0.9);

  return {
    primary,
    primaryLight,
    primaryDark,
    secondary,
    secondaryDeep,
    bg,
    bgSoft,
    border,
    accentMuted,
    aiLight,
    accentRgb: toRgbString(primary),
    navyRgb: toRgbString(secondary),
    preview: [secondary, primary, bg],
  };
};

function desaturate(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  const w = clamp(amount, 0, 1);
  return rgbToHex(
    r + (gray - r) * w,
    g + (gray - g) * w,
    b + (gray - b) * w,
  );
}
