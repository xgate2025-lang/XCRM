import { TierDefinition } from '../types';

/**
 * Maps Tier Design themes and custom colors to HEX values.
 * Used for Recharts and other non-Tailwind visual components.
 */
export const THEME_HEX_MAP: Record<string, string> = {
    bronze: '#ea580c',   // orange-600
    silver: '#94a3b8',   // slate-400
    gold: '#eab308',     // yellow-500
    platinum: '#06b6d4', // cyan-500
    diamond: '#2563eb',  // blue-600
    black: '#0f172a',    // slate-900
    slate: '#64748b',    // slate-500 (default)
};

/**
 * Returns the hex color for a given tier definition.
 */
export function getTierColor(design: TierDefinition['design']): string {
    if (design.mode === 'color') {
        if (design.colorTheme === 'custom' && design.customColor) {
            return design.customColor;
        }
        return THEME_HEX_MAP[design.colorTheme || 'slate'] || THEME_HEX_MAP.slate;
    }

    // For image mode, we return a fallback color (slate-900)
    return THEME_HEX_MAP.black;
}
