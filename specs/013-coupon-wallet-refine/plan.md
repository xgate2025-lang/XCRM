# Implementation Plan: Refine Coupon Wallet Tab

**Branch**: `013-coupon-wallet-refine` | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-coupon-wallet-refine/spec.md`

## Summary

This feature refines the `CouponWalletTab` component to strictly adhere to the updated Information Architecture (v2). It involves removing the "Resend" functionality and enhancing the "Manual Redemption" and "Manual Void" workflows with specific form fields (Store, Time, Reason) and validation logic.

## Technical Context

**Language/Version**: TypeScript 5+ (Vite/React)
**Primary Dependencies**: React 19, Tailwind CSS, Lucide React
**Storage**: Mock Services (Local State / In-Memory)
**Testing**: Manual Verification via Quickstart scenarios
**Target Platform**: Browser (Desktop/Tablet)
**Project Type**: Single Page Application
**Performance Goals**: Instant modal interactions (<100ms)
**Constraints**: Strict adherence to `CouponWalletTab_Wireframe_v2.md`

## Constitution Check

*GATE: Passed*

- **Tech Stack**: Uses Vite, React 19, Tailwind, Lucide. No Next.js or prohibited frameworks.
- **Styling**: Uses standard Tailwind utility classes.
- **IA Integrity**: Plan addresses all FRs from Spec.
- **Visual Integrity**: Component updates will follow existing UI patterns.
- **UI Persistence**: Feature is local to `MemberDetail`, preserving global layout.

## Project Structure

### Documentation (this feature)

```text
specs/013-coupon-wallet-refine/
├── plan.md              # This file
├── research.md          # Output of Phase 0
├── data-model.md        # Output of Phase 1
├── quickstart.md        # Output of Phase 1
├── contracts/           # Output of Phase 1
│   └── member-service.ts
└── tasks.md             # To be created by /speckit.tasks
```

### Source Code

```text
src/
├── components/
│   └── member/
│       └── detail/
│           ├── CouponWalletTab.tsx       # [MODIFY] UI Updates
│           ├── CouponDetailView.tsx      # [MODIFY] Sub-component updates (if split)
│           └── tabConfig.ts              # [NO CHANGE]
├── types.ts                              # [VERIFY] Ensure types match contracts
└── lib/
    └── mock/                             # [Hypothetical]
        └── MemberService.ts              # [MODIFY] Update mock implementation
```

**Structure Decision**: Standard Single-Project Structure. Modifying existing components in `src/components/member/detail`.

## Complexity Tracking

No violations found.
