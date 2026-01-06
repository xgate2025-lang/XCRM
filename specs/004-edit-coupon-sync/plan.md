# Implementation Plan: Edit Coupon Sync

**Branch**: `004-edit-coupon-sync` | **Date**: 2026-01-06 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/004-edit-coupon-sync/spec.md)

## Summary

This plan addresses the requirement to replace the existing "Edit Coupon" modal with a full-page wizard identical to the "Create Coupon" UX. We will refactor `CreateCoupon.tsx` to handle both "Create" and "Edit" modes, update `App.tsx` to support parameter-based navigation, and integrate `MockCouponService` for data persistence.

## Technical Context

**Language/Version**: TypeScript (React 19)
**Primary Dependencies**: `lucide-react`, `react-router-dom` (context), Tailwind CSS
**Storage**: `localStorage` (via `MockCouponService`)
**Testing**: Manual validation (Browser)
**Target Platform**: Web SPA (Vite)
**Project Type**: Single project
**Performance Goals**: UI transitions < 200ms
**Constraints**: Must maintain 100% visual parity with the Add Coupon wizard.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Status | Description |
|------|--------|-------------|
| 1. Vite Build | ✅ | Project uses Vite. |
| 4. SPA Architecture | ✅ | Maintaining single-page app state. |
| 9. Visual Integrity | ✅ | Will reuse existing `AccordionSection` and `LivePreview`. |
| 12. IA+UX Handshake | ✅ | Planning to handle loading states for fetched coupons. |
| 13. UI Persistence | ✅ | Sidebar/Header will be preserved via `Layout` in `App.tsx`. |

*PRE-FLIGHT*: Read `Journal.md` last updated 2026-01-05. (No recent conflicts noted for coupon refinement).

## Project Structure

### Documentation (this feature)

```text
specs/004-edit-coupon-sync/
├── plan.md              # This file
├── research.md          # Research on navigation and data mapping
├── data-model.md        # Alignment of Coupon vs CouponData
├── quickstart.md        # Manual verification guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   └── coupon/          # Reused wizard components
├── pages/
│   ├── CouponList.tsx   # Updated Edit button logic
│   └── CreateCoupon.tsx # Refactored to handle Edit mode
├── App.tsx              # Updated to handle nav params
└── types.ts             # Updated NavItemId
```

**Structure Decision**: Reusing the existing component structure. Refactoring `CreateCoupon.tsx` into a dual-mode component is preferred over creating a new file to ensure SC-001 (100% consistency).
