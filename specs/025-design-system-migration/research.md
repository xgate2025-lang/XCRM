# Research: Design System Migration

**Feature**: 025-design-system-migration  
**Date**: 2026-01-22  
**Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/025-design-system-migration/spec.md)

---

## Executive Summary

Codebase analysis reveals three documented inconsistencies requiring migration, plus opportunities for style constant adoption. The migration can be executed incrementally with minimal risk.

---

## Issue 1: Gray vs Slate Color Usage

### Decision
Replace all `gray-*` Tailwind classes with equivalent `slate-*` classes.

### Rationale
The Design System standardizes on the Slate scale for neutral colors. Gray classes are legacy inconsistencies.

### Findings

**Files Affected** (5 files, 27 occurrences):

| File | Count | Classes Found |
|------|-------|---------------|
| `src/components/dashboard/onboarding/ProgressHeader.tsx` | 5 | `text-gray-900`, `text-gray-600`, `text-gray-500`, `bg-gray-200` |
| `src/components/dashboard/onboarding/MissionCarousel.tsx` | 5 | `hover:bg-gray-50`, `text-gray-600`, `bg-gray-300` |
| `src/components/dashboard/onboarding/ReturnModal.tsx` | 5 | `text-gray-400`, `text-gray-600`, `text-gray-900`, `border-gray-200`, `hover:bg-gray-50` |
| `src/components/dashboard/onboarding/OnboardingHero.tsx` | 4 | `bg-gray-50`, `text-gray-500` |
| `src/components/dashboard/onboarding/MissionCard.tsx` | 8 | `text-gray-900`, `text-gray-600`, `text-gray-500`, `text-gray-400`, `text-gray-700`, `border-gray-300`, `border-gray-100`, `bg-gray-100` |

### Migration Mapping

| Gray Class | Slate Equivalent |
|------------|------------------|
| `gray-50`  | `slate-50`       |
| `gray-100` | `slate-100`      |
| `gray-200` | `slate-200`      |
| `gray-300` | `slate-300`      |
| `gray-400` | `slate-400`      |
| `gray-500` | `slate-500`      |
| `gray-600` | `slate-600`      |
| `gray-700` | `slate-700`      |
| `gray-900` | `slate-900`      |

---

## Issue 2: Focus Ring Inconsistency

### Decision
- Use `ring-primary-100` for general form inputs (subtle)
- Use `ring-primary-500` for high-emphasis elements (checkboxes, radios)

### Rationale
The Design System specifies subtle focus rings for inputs but allows stronger rings for small interactive elements like checkboxes.

### Findings

**ring-primary-500 Usage** (50+ occurrences in 11 files):

| Component Group | Files | Notes |
|-----------------|-------|-------|
| BasicData Forms | `StoreForm.tsx`, `ProductForm.tsx`, `BrandForm.tsx`, `StoreList.tsx`, `ProductList.tsx` | Text inputs using `ring-primary-500` should migrate to `ring-primary-100` |
| Coupon Sections | `BasicInfoSection.tsx`, `DistributionLimitsSection.tsx`, `RedemptionLimitsSection.tsx`, `UnionValiditySection.tsx` | Checkboxes and radios correctly use `ring-primary-500` |
| Program Wizards | `LogicWizard.tsx`, `TierWizard.tsx`, `PointsWizard.tsx` | Mixed usage - checkboxes OK, text inputs need migration |

**ring-primary-100 Usage** (30+ occurrences - CORRECT):

| Component Group | Files |
|-----------------|-------|
| Settings Pages | `GlobalSettings.tsx`, `CustomerAttributes.tsx` |
| Common Components | `MemberDetail.tsx`, `CouponList.tsx`, `PerformanceHeader.tsx` |
| Constants | `constants.tsx` (SETTINGS_INPUT_STYLES) |

---

## Issue 3: Button Radius Variance

### Decision
Standardize all buttons to `rounded-xl` per `SETTINGS_BUTTON_STYLES.primary`.

### Rationale
The Design System specifies `rounded-xl` for buttons. Legacy code uses `rounded-2xl` which is reserved for inputs and containers.

### Findings

**rounded-2xl Button Usage** (15+ button instances):

| File | Count | Context |
|------|-------|---------|
| `CampaignDashboard.tsx` | 4 | Primary CTA buttons |
| `CreateCoupon.tsx` | 2 | Save/Cancel buttons |
| `CouponList.tsx` | 4 | Action buttons |
| `ProgramTier.tsx` | 3 | Wizard progression buttons |
| `ProgramPoint.tsx` | 1 | Setup button |
| `CreateCouponPage.tsx` | 2 | Footer buttons |

**Note**: Many `rounded-2xl` usages are for containers/inputs which is CORRECT per Design System.

---

## Issue 4: Style Constants Adoption

### Decision
Replace inline Tailwind classes with imports from `src/constants.tsx`.

### Rationale
Using constants reduces duplication and enables centralized design updates.

### Available Constants

```tsx
// Card Styles
SETTINGS_CARD_STYLES.container  // 'bg-white rounded-4xl border border-slate-200 shadow-sm'
SETTINGS_CARD_STYLES.toolbar    // 'bg-white p-3 rounded-2xl shadow-sm border border-slate-200'
SETTINGS_CARD_STYLES.inner      // 'bg-white rounded-3xl border border-slate-200'

// Button Styles
SETTINGS_BUTTON_STYLES.primary   // 'px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl...'
SETTINGS_BUTTON_STYLES.secondary // 'px-4 py-2.5 bg-white border border-slate-200...'
SETTINGS_BUTTON_STYLES.icon      // 'p-2 text-slate-400 hover:text-primary-600...'
SETTINGS_BUTTON_STYLES.danger    // 'px-4 py-2.5 bg-red-600 text-white...'

// Input Styles
SETTINGS_INPUT_STYLES.input  // 'w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl...'
SETTINGS_INPUT_STYLES.select // Same pattern for dropdowns
SETTINGS_INPUT_STYLES.label  // 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2'

// Tab Styles
SETTINGS_TAB_STYLES.container   // 'flex items-center gap-8 border-b border-slate-200 px-2'
SETTINGS_TAB_STYLES.tabActive   // 'text-primary-600 border-primary-500'
SETTINGS_TAB_STYLES.tabInactive // 'text-slate-400 border-transparent hover:text-slate-600'
```

---

## Alternatives Considered

1. **Create new global CSS classes** - Rejected: Project uses Tailwind utility-first approach consistently.
2. **Automated find-replace** - Rejected: Context-specific changes require manual review (e.g., button vs input radius).
3. **Full component library rewrite** - Rejected: Too disruptive; incremental migration preferred.

---

## Migration Strategy

### Phase 1: High-Priority Fixes (P1)
1. Gray to Slate migration (5 files)
2. Style constants documentation review

### Phase 2: Standardization (P2)  
1. Focus ring standardization (text inputs only)
2. Button radius migration (buttons only, not inputs)

### Phase 3: Card & Typography (P2-P3)
1. Card radius verification
2. Typography consistency audit

### Verification Approach
- Grep for eliminated patterns (`gray-*`, incorrect radius on buttons)
- Visual comparison of migrated pages
- No existing automated tests for styling
