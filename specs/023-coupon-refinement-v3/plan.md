# Implementation Plan: Add/Edit Coupon Refinement (v3)

**Branch**: `023-coupon-refinement-v3` | **Date**: 2026-01-20 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/023-coupon-refinement-v3/spec.md)
**Input**: Feature specification from `/specs/023-coupon-refinement-v3/spec.md`

## Summary

The goal is to refine the "Add/Edit Coupon" feature to strictly follow the `Coupon_IA_v3.md` and `Coupon_Wireframe_v3.md`. This involves consolidating the `Coupon` and `CouponTemplate` types, updating the 4-step accordion wizard to support new fields (Identifier Mode, Validity Mode, Product Text, Store Scope), and standardizing the mock service layer. The current UI design style (4xl rounding, slate-900 buttons, etc.) will be maintained.

## Technical Context

**Language/Version**: TypeScript (React 19)
**Primary Dependencies**: Tailwind CSS, Lucide React, Framer Motion (optional transitions)
**Storage**: Mock Service with LocalStorage persistence
**Testing**: Vitest / React Testing Library (implied by project norms)
**Target Platform**: Web (SaaS)
**Project Type**: web
**Performance Goals**: Fast local persistence, smooth accordion transitions
**Constraints**: DO NOT CHANGE THE CURRENT UI DESIGN STYLE

## Constitution Check

- **Rule 9 (Visual Integrity)**: New fields must inherit padding (`p-10` in wizard) and rounding (`rounded-4xl`/`rounded-2xl`).  
- **Rule 10 (IA Coverage)**: Every field in `Coupon_IA_v3.md` must be mapped to the `Coupon` interface and wizard fields.  
- **Rule 13 (UI Persistence)**: Sidebar and Header must persist during coupon creation.

## Project Structure

### Documentation (this feature)

```text
specs/023-coupon-refinement-v3/
├── plan.md              # This file
├── research.md          # Implementation decisions and findings
├── data-model.md        # Refined Coupon entity definition
├── quickstart.md        # Developer setup and verification guide
└── contracts/           # API contract definitions
    └── coupon-api.md
```

### Source Code (repository root)

```text
src/
├── types.ts             # Refine Coupon interface
├── context/
│   └── CouponWizardContext.tsx # Update validation and state logic
├── lib/
│   └── services/
│       └── mock/
│           └── MockCouponService.ts # Consolidated mock service
├── pages/
│   └── coupon/
│       └── CreateCouponPage.tsx # Main refinement target
└── components/
    └── coupon/
        └── sections/    # Individual wizard sections
            ├── BasicInfoSection.tsx
            ├── UnionValiditySection.tsx
            ├── DistributionLimitsSection.tsx
            └── RedemptionLimitsSection.tsx
```

**Structure Decision**: Single project structure (Option 1). We will refine existing components and services within their current locations, prioritizing `src/lib/services/mock` for the service and `src/pages/coupon` for the UI.

## Complexity Tracking

No violations found.
