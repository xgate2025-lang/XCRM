# Implementation Plan: Design System Migration

**Branch**: `025-design-system-migration` | **Date**: 2026-01-22 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/025-design-system-migration/spec.md)

---

## Summary

Migrate the XCRM application to consistently use the Tailwind CSS design system documented in `Product/DesignSystem/DesignSystem.md`. This involves:

1. Replacing `gray-*` classes with `slate-*` equivalents
2. Standardizing focus rings (`ring-primary-100` for inputs, `ring-primary-500` for checkboxes)
3. Fixing button radius from `rounded-2xl` to `rounded-xl`
4. Adopting style constants from `constants.tsx`

---

## Technical Context

**Language/Version**: TypeScript 5.x with React 19  
**Primary Dependencies**: Tailwind CSS, React, Lucide React  
**Storage**: N/A (styling only)  
**Testing**: Manual visual verification + grep validation  
**Target Platform**: Web (modern browsers)  
**Project Type**: Single React application  
**Constraints**: No breaking changes to functionality  

---

## Proposed Changes

### Phase 1: Gray to Slate Migration (5 files)

---

#### [MODIFY] [ProgressHeader.tsx](file:///Users/elroyelroy/XCRM/src/components/dashboard/onboarding/ProgressHeader.tsx)

- Replace `text-gray-900` → `text-slate-900`
- Replace `text-gray-600` → `text-slate-600`
- Replace `text-gray-500` → `text-slate-500`
- Replace `bg-gray-200` → `bg-slate-200`

---

#### [MODIFY] [MissionCarousel.tsx](file:///Users/elroyelroy/XCRM/src/components/dashboard/onboarding/MissionCarousel.tsx)

- Replace `hover:bg-gray-50` → `hover:bg-slate-50`
- Replace `text-gray-600` → `text-slate-600`
- Replace `bg-gray-300` → `bg-slate-300`

---

#### [MODIFY] [ReturnModal.tsx](file:///Users/elroyelroy/XCRM/src/components/dashboard/onboarding/ReturnModal.tsx)

- Replace `text-gray-400` → `text-slate-400`
- Replace `text-gray-600` → `text-slate-600`
- Replace `text-gray-900` → `text-slate-900`
- Replace `border-gray-200` → `border-slate-200`
- Replace `hover:bg-gray-50` → `hover:bg-slate-50`

---

#### [MODIFY] [OnboardingHero.tsx](file:///Users/elroyelroy/XCRM/src/components/dashboard/onboarding/OnboardingHero.tsx)

- Replace `bg-gray-50` → `bg-slate-50`
- Replace `text-gray-500` → `text-slate-500`

---

#### [MODIFY] [MissionCard.tsx](file:///Users/elroyelroy/XCRM/src/components/dashboard/onboarding/MissionCard.tsx)

- Replace all `gray-*` with `slate-*` equivalents (8 occurrences)

---

### Phase 2: Focus Ring Standardization

> [!NOTE]
> Only TEXT INPUTS need migration. Checkboxes/radios are correct with `ring-primary-500`.

---

#### [MODIFY] [StoreList.tsx](file:///Users/elroyelroy/XCRM/src/components/settings/BasicData/StoreList.tsx)

- Lines 124, 132, 144: Replace `focus:ring-primary-500` → `focus:ring-primary-100`

---

#### [MODIFY] [StoreForm.tsx](file:///Users/elroyelroy/XCRM/src/components/settings/BasicData/StoreForm.tsx)

- Lines 136, 152, 166, 180, 196, 209, 221, 236, 247: Replace `focus:ring-primary-500` → `focus:ring-primary-100` on text inputs only

---

#### [MODIFY] [ProductList.tsx](file:///Users/elroyelroy/XCRM/src/components/settings/BasicData/ProductList.tsx)

- Lines 129, 137, 149: Replace `focus:ring-primary-500` → `focus:ring-primary-100`

---

#### [MODIFY] [ProductForm.tsx](file:///Users/elroyelroy/XCRM/src/components/settings/BasicData/ProductForm.tsx)

- Lines 158, 173, 192, 205, 223, 240: Replace `focus:ring-primary-500` → `focus:ring-primary-100`

---

#### [MODIFY] [BrandForm.tsx](file:///Users/elroyelroy/XCRM/src/components/settings/BasicData/BrandForm.tsx)

- Lines 128, 144: Replace `focus:ring-primary-500` → `focus:ring-primary-100`

---

### Phase 3: Button Radius Standardization

> [!IMPORTANT]
> Only change radius for **BUTTON** elements with `bg-slate-900` or similar button styling. Do NOT change containers, inputs, or toolbars that correctly use `rounded-2xl`.

---

#### [MODIFY] [CampaignDashboard.tsx](file:///Users/elroyelroy/XCRM/src/pages/CampaignDashboard.tsx)

- Line 183, 431, 438: Update button radius from `rounded-2xl` → `rounded-xl`

---

#### [MODIFY] [CreateCoupon.tsx](file:///Users/elroyelroy/XCRM/src/pages/CreateCoupon.tsx)

- Lines 418, 426: Update button radius from `rounded-2xl` → `rounded-xl`

---

#### [MODIFY] [CouponList.tsx](file:///Users/elroyelroy/XCRM/src/pages/CouponList.tsx)

- Lines 94, 339: Update button radius from `rounded-2xl` → `rounded-xl`

---

#### [MODIFY] [ProgramTier.tsx](file:///Users/elroyelroy/XCRM/src/pages/ProgramTier.tsx)

- Lines 337, 366, 396: Update button radius from `rounded-2xl` → `rounded-xl`

---

#### [MODIFY] [ProgramPoint.tsx](file:///Users/elroyelroy/XCRM/src/pages/ProgramPoint.tsx)

- Line 261: Update button radius from `rounded-2xl` → `rounded-xl`

---

#### [MODIFY] [CreateCouponPage.tsx](file:///Users/elroyelroy/XCRM/src/pages/coupon/CreateCouponPage.tsx)

- Lines 528, 536: Update button radius from `rounded-2xl` → `rounded-xl`

---

#### [MODIFY] [CampaignDetail.tsx](file:///Users/elroyelroy/XCRM/src/pages/CampaignDetail.tsx)

- Line 51: Update button radius from `rounded-2xl` → `rounded-xl`

---

## Verification Plan

### Automated Validation

```bash
# Phase 1: Verify zero gray-* classes remain
grep -r "gray-" --include="*.tsx" src/ | grep -v node_modules

# Phase 2: Verify focus ring migration
# Check that text inputs use ring-primary-100
grep -rn "ring-primary-500" --include="*.tsx" src/components/settings/BasicData/

# Phase 3: Button validation
# Count buttons with rounded-2xl (should decrease)
grep -rn "rounded-2xl.*bg-slate-900" --include="*.tsx" src/
```

**Expected Results**:
- Phase 1: Zero results for `gray-*`
- Phase 2: `ring-primary-500` only on checkboxes/radios (coupon sections)
- Phase 3: Zero results for `rounded-2xl.*bg-slate-900` pattern

### Manual Verification

> [!NOTE]
> Visual testing is required since there are no existing UI tests.

**Steps**:

1. **Start dev server**: `npm run dev`

2. **Phase 1 - Onboarding Pages**:
   - Navigate to Dashboard when onboarding is visible
   - Verify ProgressHeader, MissionCard, MissionCarousel have consistent slate colors
   - Check ReturnModal and OnboardingHero styling

3. **Phase 2 - BasicData Forms**:
   - Navigate to Settings → Basic Data → Stores
   - Add/Edit a store - verify input focus rings are subtle (primary-100)
   - Repeat for Products and Brands

4. **Phase 3 - Button Radius**:
   - Check "Add Coupon" button on CouponList page
   - Check "Create Campaign" button on CampaignDashboard
   - Verify buttons have consistent rounded-xl corners
   - Compare against inputs (should remain rounded-2xl)

---

## Out of Scope

- Creating new reusable components
- Modifying component functionality
- Adding automated UI tests
- Mobile-specific responsive changes
