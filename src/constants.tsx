
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Package,
  BarChart2,
  Zap,
  Settings
} from 'lucide-react';
import { NavItem } from './types';

// ============================================================================
// UI STYLE CONSTANTS - Settings Page Design System
// Based on MemberDetail.tsx visual baseline (019-settings-ui-refinement)
// ============================================================================

/**
 * Standard card styles for settings pages
 */
export const SETTINGS_CARD_STYLES = {
  /** Main page container card: rounded-4xl border border-slate-200 shadow-sm */
  container: 'bg-white rounded-4xl border border-slate-200 shadow-sm',
  /** Toolbar/filter bar: rounded-2xl with subtle shadow */
  toolbar: 'bg-white p-3 rounded-2xl shadow-sm border border-slate-200',
  /** Inner content card: rounded-3xl */
  inner: 'bg-white rounded-3xl border border-slate-200',
} as const;

/**
 * Standard typography for settings pages
 */
export const SETTINGS_TYPOGRAPHY = {
  /** Page title: text-2xl font-bold */
  pageTitle: 'text-2xl font-bold text-slate-900',
  /** Page description: text-slate-500 text-sm */
  pageDescription: 'text-slate-500 text-sm',
  /** Section label: uppercase tracking-wider */
  sectionLabel: 'text-sm font-bold text-slate-900 uppercase tracking-wider',
  /** Small label: text-[10px] font-black uppercase */
  smallLabel: 'text-[10px] font-black uppercase tracking-widest text-slate-400',
  /** Table header */
  tableHeader: 'text-[10px] font-black text-slate-400 uppercase tracking-widest',
} as const;

/**
 * Standard icon container styles
 */
export const SETTINGS_ICON_STYLES = {
  /** Accent icon container (primary color) */
  accent: 'bg-primary-50 p-2 rounded-xl text-primary-600',
  /** Subtle icon container (slate/neutral) */
  subtle: 'bg-slate-50 p-2 rounded-lg text-slate-400',
  /** Large accent icon container for page headers */
  accentLarge: 'bg-primary-50 p-3 rounded-xl text-primary-600',
} as const;

/**
 * Standard button styles
 */
export const SETTINGS_BUTTON_STYLES = {
  /** Primary action button (dark) */
  primary: 'px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all',
  /** Secondary action button (white with border) */
  secondary: 'px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all',
  /** Icon-only button */
  icon: 'p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all',
  /** Danger button */
  danger: 'px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all',
} as const;

/**
 * Standard form input styles
 */
export const SETTINGS_INPUT_STYLES = {
  /** Standard text input */
  input: 'w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all',
  /** Select dropdown */
  select: 'w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 appearance-none cursor-pointer',
  /** Form label */
  label: 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2',
} as const;

/**
 * Standard tab navigation styles (border-bottom style)
 */
export const SETTINGS_TAB_STYLES = {
  /** Tab container */
  container: 'flex items-center gap-8 border-b border-slate-200 px-2',
  /** Individual tab button base */
  tab: 'pb-4 px-1 text-sm font-bold transition-all border-b-2 whitespace-nowrap',
  /** Active tab state */
  tabActive: 'text-primary-600 border-primary-500',
  /** Inactive tab state */
  tabInactive: 'text-slate-400 border-transparent hover:text-slate-600',
} as const;

// Zone B: Operational Navigation
export const OPERATIONAL_NAV: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'member-list',
    label: 'Member',
    icon: Users,
  },
  {
    id: 'campaign',
    label: 'Campaign',
    icon: Megaphone,
  },
  {
    id: 'assets-coupon',
    label: 'Coupon',
    icon: Package,
  },
  {
    id: 'performance-analytics',
    label: 'Performance',
    icon: BarChart2,
  },
];

// Zone D: Configuration Navigation
export const CONFIG_NAV: NavItem[] = [
  {
    id: 'program',
    label: 'Program',
    icon: Zap,
    children: [
      { id: 'program-tier', label: 'Tier' },
      { id: 'program-point', label: 'Point' },
    ],
  },
  {
    id: 'setting',
    label: 'Setting',
    icon: Settings,
    children: [
      { id: 'settings-global', label: 'Global Settings' },
      { id: 'settings-integration', label: 'Integration Settings' },
      { id: 'settings-basic', label: 'Basic Data' },
    ],
  },
];
