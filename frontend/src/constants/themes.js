import { paletteFromAccent } from '../utils/themeColorUtils';

export const THEME_STORAGE_KEY = 'nutri_theme';
export const APPEARANCE_STORAGE_KEY = 'nutri_appearance';
export const FOLLOW_DEVICE_STORAGE_KEY = 'nutri_follow_device';
export const CUSTOM_PRIMARY_STORAGE_KEY = 'nutri_custom_primary';

export const DEFAULT_THEME_ID = 'glass-default';
export const DEFAULT_APPEARANCE = 'light';
export const DEFAULT_CUSTOM_PRIMARY = '#F4A261';
export const CUSTOM_THEME_ID = 'custom';
export const UNSELECTED_THEME_ID = 'unselected';
export const GLASS_DEFAULT_THEME_ID = 'glass-default';

/** Glass / transparent default palette */
export const TRANSPARENT_THEME_VARS = {
  '--nutri-main-bg': '#121212',
  '--nutri-sidebar-bg': '#0F172A',
  '--nutri-primary': '#1E293B',
  '--nutri-primary-light': '#475569',
  '--nutri-primary-dark': '#0F172A',
  '--nutri-secondary': '#0F172A',
  '--nutri-secondary-deep': '#0F172A',
  '--nutri-surface': 'rgba(255,255,255,0.92)',
  '--nutri-bg': 'transparent',
  '--nutri-bg-soft': 'rgba(255,255,255,0.48)',
  '--nutri-border': 'rgba(148, 163, 184, 0.45)',
  '--nutri-accent-muted': 'rgba(30, 41, 59, 0.08)',
  '--nutri-ai-light': 'rgba(255,255,255,0.14)',
  '--nutri-text-dark': '#1E293B',
  '--nutri-text-black': '#0F172A',
  '--nutri-text-muted': '#64748B',
  '--nutri-text-body': '#475569',
  '--nutri-accent-rgb': '30, 41, 59',
  '--nutri-navy-rgb': '30, 41, 59',
  '--nutri-gradient-primary': 'linear-gradient(135deg, #475569 0%, #1E293B 100%)',
  '--nutri-gradient-hero': 'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)',
  '--nutri-gradient-page': 'transparent',
  '--nutri-gradient-ai-shell': 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.18) 100%)',
  '--nutri-gradient-summary': 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)',
  '--nutri-gradient-login-overlay': 'transparent',
  '--nutri-gradient-login-brand': 'linear-gradient(165deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)',
  '--nutri-shadow-primary': '0 8px 16px rgba(15, 23, 42, 0.10)',
  '--nutri-shadow-primary-soft': '0 6px 14px rgba(15, 23, 42, 0.08)',
  '--nutri-shadow-primary-btn': '0 10px 20px rgba(15, 23, 42, 0.12)',
  '--nutri-shadow-sidebar': '8px 0 30px rgba(15, 23, 42, 0.08)',
  '--nutri-shadow-hero': '0 12px 24px rgba(15, 23, 42, 0.10)',
  '--nutri-accent-alpha-12': 'rgba(255, 255, 255, 0.12)',
  '--nutri-accent-alpha-15': 'rgba(255, 255, 255, 0.15)',
  '--nutri-accent-alpha-16': 'rgba(255, 255, 255, 0.16)',
  '--nutri-accent-alpha-22': 'rgba(255, 255, 255, 0.22)',
  '--nutri-accent-alpha-26': 'rgba(255, 255, 255, 0.26)',
  '--nutri-accent-alpha-28': 'rgba(255, 255, 255, 0.28)',
  '--nutri-accent-alpha-32': 'rgba(255, 255, 255, 0.32)',
  '--nutri-nav-active-bg': 'rgba(255, 255, 255, 0.18)',
  '--nutri-mobile-sidebar': 'rgba(255,255,255,0.16)',
  '--nutri-login-form-bg': 'rgba(255,255,255,0.78)',
};

export const GLASS_THEME = {
  label: 'Glass เริ่มต้น',
  preview: ['#1E293B', '#475569', 'rgba(255,255,255,0.65)'],
  swatch: ['#1E293B', '#475569'],
  appearance: 'dark',
  vars: TRANSPARENT_THEME_VARS,
};

const LEGACY_THEME_MAP = {
  'navy-apricot': 'nutri-classic',
  'navy-berry': 'nutri-classic',
  'olive-white': 'nutri-soft',
  'pastel-purple': 'lavender',
  'teal-clean': 'teal',
};

const buildTheme = ({
  label,
  preview,
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
  accentRgb,
  navyRgb,
  appearance = 'light',
}) => ({
  label,
  preview,
  appearance,
  swatch: [secondary, primary],
  vars: {
    '--nutri-primary': primary,
    '--nutri-primary-light': primaryLight,
    '--nutri-primary-dark': primaryDark,
    '--nutri-secondary': secondary,
    '--nutri-secondary-deep': secondaryDeep,
    '--nutri-surface': '#FFFFFF',
    '--nutri-bg': bg,
    '--nutri-bg-soft': bgSoft,
    '--nutri-border': border,
    '--nutri-accent-muted': accentMuted,
    '--nutri-ai-light': aiLight,
    '--nutri-text-dark': secondary,
    '--nutri-text-black': secondaryDeep,
    '--nutri-text-muted': '#6B7A8C',
    '--nutri-text-body': '#3D4F63',
    '--nutri-accent-rgb': accentRgb,
    '--nutri-navy-rgb': navyRgb,
    '--nutri-gradient-primary': `linear-gradient(135deg, ${primaryLight} 0%, ${primary} 100%)`,
    '--nutri-gradient-hero': `linear-gradient(135deg, ${secondaryDeep} 0%, ${secondary} 100%)`,
    '--nutri-gradient-page': bg,
    '--nutri-gradient-ai-shell': `linear-gradient(135deg, rgba(${navyRgb},0.04) 0%, rgba(${accentRgb},0.07) 55%, rgba(255,255,255,0.97) 100%)`,
    '--nutri-gradient-summary': `linear-gradient(135deg, #ffffff 0%, ${bgSoft} 100%)`,
    '--nutri-gradient-login-overlay': `linear-gradient(120deg, rgba(${navyRgb},0.80) 0%, rgba(${navyRgb},0.58) 55%, rgba(15,33,56,0.84) 100%)`,
    '--nutri-gradient-login-brand': `linear-gradient(165deg, ${secondary} 0%, ${secondaryDeep} 100%)`,
    '--nutri-shadow-primary': `0 8px 16px rgba(${accentRgb}, 0.24)`,
    '--nutri-shadow-primary-soft': `0 6px 14px rgba(${accentRgb}, 0.20)`,
    '--nutri-shadow-primary-btn': `0 10px 20px rgba(${accentRgb}, 0.26)`,
    '--nutri-shadow-sidebar': `8px 0 30px rgba(${navyRgb}, 0.16)`,
    '--nutri-shadow-hero': `0 12px 24px rgba(${navyRgb}, 0.20)`,
    '--nutri-accent-alpha-12': `rgba(${accentRgb}, 0.12)`,
    '--nutri-accent-alpha-15': `rgba(${accentRgb}, 0.15)`,
    '--nutri-accent-alpha-16': `rgba(${accentRgb}, 0.16)`,
    '--nutri-accent-alpha-22': `rgba(${accentRgb}, 0.22)`,
    '--nutri-accent-alpha-26': `rgba(${accentRgb}, 0.26)`,
    '--nutri-accent-alpha-28': `rgba(${accentRgb}, 0.28)`,
    '--nutri-accent-alpha-32': `rgba(${accentRgb}, 0.32)`,
    '--nutri-nav-active-bg': `rgba(${accentRgb}, 0.14)`,
    '--nutri-mobile-sidebar': secondary,
    '--nutri-login-form-bg': 'rgba(255,255,255,0.96)',
  },
});

const preset = (id, label, preview, colors) => [id, buildTheme({ label, preview, ...colors })];

/** 15 โทนสีแบบ Chrome + 1 ช่องเลือกสีเอง */
const PRESET_ENTRIES = [
  preset('nutri-classic', 'Nutri Classic', ['#142B4D', '#F4A261', '#FFFFFF'], {
    primary: '#F4A261', primaryLight: '#FFCB9A', primaryDark: '#E07B4A',
    secondary: '#142B4D', secondaryDeep: '#0F2138',
    bg: '#FFFFFF', bgSoft: '#FFF8F3', border: '#E6ECF2',
    accentMuted: '#FFEAD6', aiLight: '#FFF5ED',
    accentRgb: '244, 162, 97', navyRgb: '20, 43, 77',
  }),
  preset('ocean', 'Ocean', ['#1E3A8A', '#3B82F6', '#EFF6FF'], {
    primary: '#3B82F6', primaryLight: '#93C5FD', primaryDark: '#2563EB',
    secondary: '#1E3A8A', secondaryDeep: '#172554',
    bg: '#EFF6FF', bgSoft: '#DBEAFE', border: '#BFDBFE',
    accentMuted: '#DBEAFE', aiLight: '#F0F7FF',
    accentRgb: '59, 130, 246', navyRgb: '30, 58, 138',
  }),
  preset('teal', 'Teal', ['#115E59', '#14B8A6', '#F0FDFA'], {
    primary: '#14B8A6', primaryLight: '#5EEAD4', primaryDark: '#0D9488',
    secondary: '#115E59', secondaryDeep: '#0F3D3A',
    bg: '#F0FDFA', bgSoft: '#CCFBF1', border: '#99F6E4',
    accentMuted: '#CCFBF1', aiLight: '#F0FDFA',
    accentRgb: '20, 184, 166', navyRgb: '17, 94, 89',
  }),
  preset('forest', 'Forest', ['#166534', '#22C55E', '#F0FDF4'], {
    primary: '#22C55E', primaryLight: '#86EFAC', primaryDark: '#16A34A',
    secondary: '#166534', secondaryDeep: '#14532D',
    bg: '#F0FDF4', bgSoft: '#DCFCE7', border: '#BBF7D0',
    accentMuted: '#DCFCE7', aiLight: '#F0FDF4',
    accentRgb: '34, 197, 94', navyRgb: '22, 101, 52',
  }),
  preset('nutri-soft', 'Nutri Soft', ['#1A3347', '#F0B67A', '#FFFCF9'], {
    primary: '#F0B67A', primaryLight: '#FFD9B3', primaryDark: '#D9955E',
    secondary: '#1A3347', secondaryDeep: '#132638',
    bg: '#FFFCF9', bgSoft: '#FFF6EE', border: '#EDE4DA',
    accentMuted: '#FFEFE0', aiLight: '#FFF9F4',
    accentRgb: '240, 182, 122', navyRgb: '26, 51, 71',
  }),
  preset('slate', 'Slate', ['#334155', '#64748B', '#F8FAFC'], {
    primary: '#64748B', primaryLight: '#94A3B8', primaryDark: '#475569',
    secondary: '#334155', secondaryDeep: '#1E293B',
    bg: '#F8FAFC', bgSoft: '#F1F5F9', border: '#E2E8F0',
    accentMuted: '#E2E8F0', aiLight: '#F8FAFC',
    accentRgb: '100, 116, 139', navyRgb: '51, 65, 85',
  }),
  preset('coral', 'Coral', ['#BE123C', '#FB7185', '#FFF1F2'], {
    primary: '#FB7185', primaryLight: '#FDA4AF', primaryDark: '#F43F5E',
    secondary: '#BE123C', secondaryDeep: '#9F1239',
    bg: '#FFF1F2', bgSoft: '#FFE4E6', border: '#FECDD3',
    accentMuted: '#FFE4E6', aiLight: '#FFF1F2',
    accentRgb: '251, 113, 133', navyRgb: '190, 18, 60',
  }),
  preset('lavender', 'Lavender', ['#6D28D9', '#A78BFA', '#F5F3FF'], {
    primary: '#A78BFA', primaryLight: '#C4B5FD', primaryDark: '#8B5CF6',
    secondary: '#6D28D9', secondaryDeep: '#5B21B6',
    bg: '#F5F3FF', bgSoft: '#EDE9FE', border: '#DDD6FE',
    accentMuted: '#EDE9FE', aiLight: '#F5F3FF',
    accentRgb: '167, 139, 250', navyRgb: '109, 40, 217',
  }),
  preset('nutri-bold', 'Nutri Bold', ['#0F2138', '#FF922B', '#FFFFFF'], {
    primary: '#FF922B', primaryLight: '#FFB357', primaryDark: '#E07A12',
    secondary: '#0F2138', secondaryDeep: '#0A1628',
    bg: '#FFFFFF', bgSoft: '#F7F9FC', border: '#DFE6EF',
    accentMuted: '#FFE8CC', aiLight: '#FFF7ED',
    accentRgb: '255, 146, 43', navyRgb: '15, 33, 56',
  }),
  preset('amber', 'Amber', ['#B45309', '#FBBF24', '#FFFBEB'], {
    primary: '#FBBF24', primaryLight: '#FDE68A', primaryDark: '#F59E0B',
    secondary: '#B45309', secondaryDeep: '#92400E',
    bg: '#FFFBEB', bgSoft: '#FEF3C7', border: '#FDE68A',
    accentMuted: '#FEF3C7', aiLight: '#FFFBEB',
    accentRgb: '251, 191, 36', navyRgb: '180, 83, 9',
  }),
  preset('indigo', 'Indigo', ['#3730A3', '#818CF8', '#EEF2FF'], {
    primary: '#818CF8', primaryLight: '#A5B4FC', primaryDark: '#6366F1',
    secondary: '#3730A3', secondaryDeep: '#312E81',
    bg: '#EEF2FF', bgSoft: '#E0E7FF', border: '#C7D2FE',
    accentMuted: '#E0E7FF', aiLight: '#EEF2FF',
    accentRgb: '129, 140, 248', navyRgb: '55, 48, 163',
  }),
  preset('rose', 'Rose', ['#9D174D', '#F472B6', '#FDF2F8'], {
    primary: '#F472B6', primaryLight: '#F9A8D4', primaryDark: '#EC4899',
    secondary: '#9D174D', secondaryDeep: '#831843',
    bg: '#FDF2F8', bgSoft: '#FCE7F3', border: '#FBCFE8',
    accentMuted: '#FCE7F3', aiLight: '#FDF2F8',
    accentRgb: '244, 114, 182', navyRgb: '157, 23, 77',
  }),
  preset('emerald', 'Emerald', ['#047857', '#34D399', '#ECFDF5'], {
    primary: '#34D399', primaryLight: '#6EE7B7', primaryDark: '#10B981',
    secondary: '#047857', secondaryDeep: '#065F46',
    bg: '#ECFDF5', bgSoft: '#D1FAE5', border: '#A7F3D0',
    accentMuted: '#D1FAE5', aiLight: '#ECFDF5',
    accentRgb: '52, 211, 153', navyRgb: '4, 120, 87',
  }),
  preset('wine', 'Wine', ['#7F1D1D', '#DC2626', '#FEF2F2'], {
    primary: '#DC2626', primaryLight: '#F87171', primaryDark: '#B91C1C',
    secondary: '#7F1D1D', secondaryDeep: '#671515',
    bg: '#FEF2F2', bgSoft: '#FEE2E2', border: '#FECACA',
    accentMuted: '#FEE2E2', aiLight: '#FEF2F2',
    accentRgb: '220, 38, 38', navyRgb: '127, 29, 29',
  }),
  preset('sky', 'Sky', ['#0369A1', '#38BDF8', '#F0F9FF'], {
    primary: '#38BDF8', primaryLight: '#7DD3FC', primaryDark: '#0EA5E9',
    secondary: '#0369A1', secondaryDeep: '#075985',
    bg: '#F0F9FF', bgSoft: '#E0F2FE', border: '#BAE6FD',
    accentMuted: '#E0F2FE', aiLight: '#F0F9FF',
    accentRgb: '56, 189, 248', navyRgb: '3, 105, 161',
  }),
];

/** โทนสำหรับโหมดมืด — พื้นหลังเข้มโดยเฉพาะ */
const DARK_PRESET_ENTRIES = [
  preset('midnight', 'Midnight', ['#0F172A', '#64748B', '#1E293B'], {
    primary: '#94A3B8', primaryLight: '#CBD5E1', primaryDark: '#64748B',
    secondary: '#0F172A', secondaryDeep: '#020617',
    bg: '#0F172A', bgSoft: '#1E293B', border: '#334155',
    accentMuted: '#334155', aiLight: '#1E293B',
    accentRgb: '148, 163, 184', navyRgb: '15, 23, 42',
    appearance: 'dark',
  }),
  preset('ocean-night', 'Ocean Night', ['#172554', '#3B82F6', '#0F172A'], {
    primary: '#60A5FA', primaryLight: '#93C5FD', primaryDark: '#3B82F6',
    secondary: '#172554', secondaryDeep: '#0F172A',
    bg: '#0B1220', bgSoft: '#111827', border: '#1E3A8A',
    accentMuted: '#1E3A8A', aiLight: '#111827',
    accentRgb: '96, 165, 250', navyRgb: '23, 37, 84',
    appearance: 'dark',
  }),
  preset('teal-night', 'Teal Night', ['#0F3D3A', '#14B8A6', '#0F172A'], {
    primary: '#2DD4BF', primaryLight: '#5EEAD4', primaryDark: '#14B8A6',
    secondary: '#0F3D3A', secondaryDeep: '#042F2E',
    bg: '#0A1614', bgSoft: '#0F2623', border: '#115E59',
    accentMuted: '#134E4A', aiLight: '#0F2623',
    accentRgb: '45, 212, 191', navyRgb: '15, 61, 58',
    appearance: 'dark',
  }),
  preset('forest-night', 'Forest Night', ['#14532D', '#22C55E', '#0F172A'], {
    primary: '#4ADE80', primaryLight: '#86EFAC', primaryDark: '#22C55E',
    secondary: '#14532D', secondaryDeep: '#052E16',
    bg: '#07140D', bgSoft: '#0F2418', border: '#166534',
    accentMuted: '#14532D', aiLight: '#0F2418',
    accentRgb: '74, 222, 128', navyRgb: '20, 83, 45',
    appearance: 'dark',
  }),
  preset('violet-night', 'Violet Night', ['#4C1D95', '#A78BFA', '#0F172A'], {
    primary: '#C4B5FD', primaryLight: '#DDD6FE', primaryDark: '#A78BFA',
    secondary: '#4C1D95', secondaryDeep: '#2E1065',
    bg: '#120826', bgSoft: '#1A1033', border: '#5B21B6',
    accentMuted: '#4C1D95', aiLight: '#1A1033',
    accentRgb: '196, 181, 253', navyRgb: '76, 29, 149',
    appearance: 'dark',
  }),
  preset('ember-night', 'Ember Night', ['#7F1D1D', '#F87171', '#0F172A'], {
    primary: '#FCA5A5', primaryLight: '#FECACA', primaryDark: '#F87171',
    secondary: '#7F1D1D', secondaryDeep: '#450A0A',
    bg: '#160808', bgSoft: '#241010', border: '#991B1B',
    accentMuted: '#7F1D1D', aiLight: '#241010',
    accentRgb: '252, 165, 165', navyRgb: '127, 29, 29',
    appearance: 'dark',
  }),
  preset('amber-night', 'Amber Night', ['#78350F', '#FBBF24', '#0F172A'], {
    primary: '#FCD34D', primaryLight: '#FDE68A', primaryDark: '#FBBF24',
    secondary: '#78350F', secondaryDeep: '#451A03',
    bg: '#171005', bgSoft: '#241808', border: '#92400E',
    accentMuted: '#78350F', aiLight: '#241808',
    accentRgb: '252, 211, 77', navyRgb: '120, 53, 15',
    appearance: 'dark',
  }),
  preset('indigo-night', 'Indigo Night', ['#312E81', '#818CF8', '#0F172A'], {
    primary: '#A5B4FC', primaryLight: '#C7D2FE', primaryDark: '#818CF8',
    secondary: '#312E81', secondaryDeep: '#1E1B4B',
    bg: '#0C0A1A', bgSoft: '#15122B', border: '#3730A3',
    accentMuted: '#312E81', aiLight: '#15122B',
    accentRgb: '165, 180, 252', navyRgb: '49, 46, 129',
    appearance: 'dark',
  }),
  preset('coral-night', 'Coral Night', ['#881337', '#FB7185', '#0F172A'], {
    primary: '#FDA4AF', primaryLight: '#FECDD3', primaryDark: '#FB7185',
    secondary: '#881337', secondaryDeep: '#4C0519',
    bg: '#180810', bgSoft: '#241018', border: '#9F1239',
    accentMuted: '#881337', aiLight: '#241018',
    accentRgb: '253, 164, 175', navyRgb: '136, 19, 55',
    appearance: 'dark',
  }),
  preset('rose-night', 'Rose Night', ['#831843', '#F472B6', '#0F172A'], {
    primary: '#F9A8D4', primaryLight: '#FBCFE8', primaryDark: '#F472B6',
    secondary: '#831843', secondaryDeep: '#500724',
    bg: '#160812', bgSoft: '#22101A', border: '#9D174D',
    accentMuted: '#831843', aiLight: '#22101A',
    accentRgb: '249, 168, 212', navyRgb: '131, 24, 67',
    appearance: 'dark',
  }),
  preset('slate-night', 'Slate Night', ['#1E293B', '#94A3B8', '#0F172A'], {
    primary: '#CBD5E1', primaryLight: '#E2E8F0', primaryDark: '#94A3B8',
    secondary: '#1E293B', secondaryDeep: '#0F172A',
    bg: '#0B1120', bgSoft: '#111827', border: '#334155',
    accentMuted: '#1E293B', aiLight: '#111827',
    accentRgb: '203, 213, 225', navyRgb: '30, 41, 59',
    appearance: 'dark',
  }),
  preset('sky-night', 'Sky Night', ['#075985', '#38BDF8', '#0F172A'], {
    primary: '#7DD3FC', primaryLight: '#BAE6FD', primaryDark: '#38BDF8',
    secondary: '#075985', secondaryDeep: '#0C4A6E',
    bg: '#061018', bgSoft: '#0C1824', border: '#0369A1',
    accentMuted: '#075985', aiLight: '#0C1824',
    accentRgb: '125, 211, 252', navyRgb: '7, 89, 133',
    appearance: 'dark',
  }),
  preset('emerald-night', 'Emerald Night', ['#065F46', '#34D399', '#0F172A'], {
    primary: '#6EE7B7', primaryLight: '#A7F3D0', primaryDark: '#34D399',
    secondary: '#065F46', secondaryDeep: '#022C22',
    bg: '#061410', bgSoft: '#0C2018', border: '#047857',
    accentMuted: '#065F46', aiLight: '#0C2018',
    accentRgb: '110, 231, 183', navyRgb: '6, 95, 70',
    appearance: 'dark',
  }),
  preset('cyan-night', 'Cyan Night', ['#155E75', '#22D3EE', '#0F172A'], {
    primary: '#67E8F9', primaryLight: '#A5F3FC', primaryDark: '#22D3EE',
    secondary: '#155E75', secondaryDeep: '#083344',
    bg: '#061318', bgSoft: '#0C1E24', border: '#0E7490',
    accentMuted: '#155E75', aiLight: '#0C1E24',
    accentRgb: '103, 232, 249', navyRgb: '21, 94, 117',
    appearance: 'dark',
  }),
  preset('graphite-night', 'Graphite Night', ['#18181B', '#71717A', '#0F172A'], {
    primary: '#A1A1AA', primaryLight: '#D4D4D8', primaryDark: '#71717A',
    secondary: '#18181B', secondaryDeep: '#09090B',
    bg: '#09090B', bgSoft: '#18181B', border: '#3F3F46',
    accentMuted: '#27272A', aiLight: '#18181B',
    accentRgb: '161, 161, 170', navyRgb: '24, 24, 27',
    appearance: 'dark',
  }),
  preset('plum-night', 'Plum Night', ['#701A75', '#E879F9', '#0F172A'], {
    primary: '#F0ABFC', primaryLight: '#F5D0FE', primaryDark: '#E879F9',
    secondary: '#701A75', secondaryDeep: '#4A044E',
    bg: '#140818', bgSoft: '#1E0C22', border: '#86198F',
    accentMuted: '#701A75', aiLight: '#1E0C22',
    accentRgb: '240, 171, 252', navyRgb: '112, 26, 117',
    appearance: 'dark',
  }),
  preset('lime-night', 'Lime Night', ['#3F6212', '#A3E635', '#0F172A'], {
    primary: '#BEF264', primaryLight: '#D9F99D', primaryDark: '#A3E635',
    secondary: '#3F6212', secondaryDeep: '#1A2E05',
    bg: '#0E1406', bgSoft: '#162008', border: '#4D7C0F',
    accentMuted: '#3F6212', aiLight: '#162008',
    accentRgb: '190, 242, 100', navyRgb: '63, 98, 18',
    appearance: 'dark',
  }),
  preset('copper-night', 'Copper Night', ['#7C2D12', '#FB923C', '#0F172A'], {
    primary: '#FDBA74', primaryLight: '#FED7AA', primaryDark: '#FB923C',
    secondary: '#7C2D12', secondaryDeep: '#431407',
    bg: '#160C06', bgSoft: '#221408', border: '#9A3412',
    accentMuted: '#7C2D12', aiLight: '#221408',
    accentRgb: '253, 186, 116', navyRgb: '124, 45, 18',
    appearance: 'dark',
  }),
];

export const THEMES = {
  [GLASS_DEFAULT_THEME_ID]: GLASS_THEME,
  ...Object.fromEntries(PRESET_ENTRIES),
  ...Object.fromEntries(DARK_PRESET_ENTRIES),
};

export const THEME_LIST = Object.entries(THEMES).map(([id, theme]) => ({ id, ...theme }));

/** โทนที่แสดงตอนยังไม่กดขยาย — โหมดสว่าง */
export const FEATURED_LIGHT_THEME_IDS = [
  'rose',
  'nutri-classic',
  'ocean',
  'teal',
  'forest',
  'nutri-soft',
  'coral',
  'lavender',
];

/** โทนที่แสดงตอนยังไม่กดขยาย — โหมดมืด */
export const FEATURED_DARK_THEME_IDS = [
  'glass-default',
  'midnight',
  'graphite-night',
  'ocean-night',
  'teal-night',
  'forest-night',
  'violet-night',
  'ember-night',
];

/** @deprecated ใช้ FEATURED_LIGHT_THEME_IDS / FEATURED_DARK_THEME_IDS แทน */
export const FEATURED_THEME_IDS = FEATURED_LIGHT_THEME_IDS;

export const normalizeAppearance = (appearance) =>
  appearance === 'dark' ? 'dark' : 'light';

export const getThemesForAppearance = (appearance) => {
  const mode = normalizeAppearance(appearance);
  return THEME_LIST.filter((theme) => (theme.appearance || 'light') === mode);
};

export const getFeaturedThemeIds = (appearance) =>
  normalizeAppearance(appearance) === 'dark'
    ? FEATURED_DARK_THEME_IDS
    : FEATURED_LIGHT_THEME_IDS;

export const pickDefaultThemeForAppearance = (appearance) => {
  if (normalizeAppearance(appearance) === 'light') return DEFAULT_THEME_ID;
  const featured = getFeaturedThemeIds(appearance);
  const available = getThemesForAppearance(appearance);
  const match = featured.find((id) => available.some((theme) => theme.id === id));
  return match || available[0]?.id || GLASS_DEFAULT_THEME_ID;
};

export const buildCustomTheme = (accentHex) =>
  buildTheme({
    label: 'กำหนดเอง',
    ...paletteFromAccent(accentHex),
    appearance: 'light',
  });

export const resolveThemeId = (savedId) => {
  if (savedId === CUSTOM_THEME_ID) return CUSTOM_THEME_ID;
  if (savedId === UNSELECTED_THEME_ID) return GLASS_DEFAULT_THEME_ID;
  if (THEMES[savedId]) return savedId;
  if (LEGACY_THEME_MAP[savedId]) return LEGACY_THEME_MAP[savedId];
  return DEFAULT_THEME_ID;
};

export const isGlassTheme = (themeId) =>
  !themeId || themeId === UNSELECTED_THEME_ID || themeId === GLASS_DEFAULT_THEME_ID;

export const getThemeById = (themeId, customPrimary) => {
  if (isGlassTheme(themeId)) return GLASS_THEME;
  if (themeId === CUSTOM_THEME_ID && customPrimary) {
    return buildCustomTheme(customPrimary);
  }
  return THEMES[themeId] || GLASS_THEME;
};

export const DARK_APPEARANCE_VARS = {
  '--nutri-surface': '#1E293B',
  '--nutri-bg': '#0F172A',
  '--nutri-bg-soft': '#1E293B',
  '--nutri-border': '#334155',
  '--nutri-text-dark': '#E2E8F0',
  '--nutri-text-black': '#F8FAFC',
  '--nutri-text-muted': '#94A3B8',
  '--nutri-text-body': '#CBD5E1',
  '--nutri-ai-light': '#1E293B',
  '--nutri-gradient-page': '#0F172A',
  '--nutri-gradient-ai-shell': 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.85) 55%, rgba(15,23,42,0.95) 100%)',
  '--nutri-gradient-summary': 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
};
