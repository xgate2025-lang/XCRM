# Implementation Plan: Fix Coupon Actions Refinement

**Branch**: `005-fix-coupon-actions` | **Date**: 2026-01-06 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/005-fix-coupon-actions/spec.md)

## Summary

This feature refines the coupon list interaction by removing redundant actions, making the entire row clickable for editing, and resolving a synchronization issue that caused "Coupon not found" errors on the edit page. It also defines the destination for the coupon analytics action.

## Technical Context

**Language/Version**: TypeScript / React 19
**Primary Dependencies**: lucide-react, react-router-dom
**Storage**: LocalStorage (via MockCouponService)
**Testing**: Manual smoke tests (per Quickstart)
**Project Type**: Vite Web App
**Performance Goals**: Instant navigation (<200ms)
**Constraints**: Must maintain visual consistency with existing Tailwind patterns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Tech Stack: Uses Vite/React/TS (Rule 1)
- [x] Styling: Uses Tailwind/Lucide (Rule 3, 9)
- [x] Routing: Uses SPA navigation (Rule 4, 12, 13)
- [x] Project Structure: Files in `src/` (Rule 5)
- [x] Design: Inherits existing card/button patterns (Rule 9)

*PRE-FLIGHT*: Read `Journal.md`. Previous lessons on "Monolith Decomposition" and "Wizard State Complexity" are noted.

## Project Structure

### Documentation (this feature)

```text
specs/005-fix-coupon-actions/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # State synchronization plan
├── quickstart.md        # Verification steps
└── spec.md              # Feature specification
```

### Source Code

```text
src/
├── pages/
│   ├── CouponList.tsx   # Row navigation and action cleanup
│   └── CreateCoupon.tsx # Potential loading state tweaks
├── context/
│   └── CouponContext.tsx # Synchronization with MockCouponService
└── services/
    └── MockCouponService.ts # Persistence layer
```

## Proposed Changes

### Component: Analytics Link & Interaction
#### [MODIFY] [CouponList.tsx](file:///Users/elroyelroy/XCRM/src/pages/CouponList.tsx)
- Remove `Eye` icon and "View Details" button.
- Change row `onClick` from opening a modal to `onNavigate('coupon-edit', { id: coupon.id })`.
- Update `BarChart2` icon `onClick` to `onNavigate('performance-analytics')`.

### Component: Data Synchronization
#### [MODIFY] [CouponContext.tsx](file:///Users/elroyelroy/XCRM/src/context/CouponContext.tsx)
- Change `INITIAL_COUPONS` initialization to load from `MockCouponService` in a `useEffect`.
- Ensure all mutation methods also update `MockCouponService` to maintain persistence parity.

## Verification Plan

### Manual Verification
- Follow [quickstart.md](file:///Users/elroyelroy/XCRM/specs/005-fix-coupon-actions/quickstart.md) for navigation and data integrity checks.
- Verify "View" icon absence in the actions column.
- Verify row-click redirects to the correct edit page.
- Verify analytics icon redirects to Performance Analytics.
