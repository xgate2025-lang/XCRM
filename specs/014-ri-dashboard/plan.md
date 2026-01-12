# Implementation Plan: Relationship Intelligence Refinement (Dashboard Zone 2)

**Branch**: `014-ri-dashboard` | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-ri-dashboard/spec.md`

## Summary

This feature updates the "Relationship Intelligence" section (Zone 2) of the Dashboard to provide deeper insights into membership health and value. It refactors the existing scale and distribution widgets to show:
1.  **Membership Distribution**: A stacked bar visualization of Total vs. Active members per tier.
2.  **Value Contribution**: A chart showing sales revenue and percentage share per tier.

## Technical Context

**Language/Version**: TypeScript 5+ (Vite/React)
**Primary Dependencies**: Recharts (for stacked bar/donut charts), Tailwind CSS, Lucide React
**Storage**: Mock Services (Local State / In-Memory `MockDashboardService`)
**Testing**: Manual Verification via Quickstart scenarios
**Target Platform**: Browser (Desktop/Tablet/Mobile)
**Project Type**: Single Page Application
**Performance Goals**: Client-side chart rendering in <200ms
**Constraints**: Match `RI_Wireframe_v2.md` layout and colors

## Constitution Check

*GATE: Passed*

- **Tech Stack**: Uses Vite, React 19, Tailwind, Lucide, Recharts.
- **Styling**: Standard Tailwind + Recharts customization.
- **IA Integrity**: Plan addresses all FRs from Spec and follows `RI_IA_v2.md`.
- **Visual Integrity**: Updates will respect existing dashboard design language (card-premium, font-black headers).
- **UI Persistence**: Local to `Dashboard` page.

## Project Structure

### Documentation (this feature)

```text
specs/014-ri-dashboard/
├── plan.md              # This file
├── research.md          # Output of Phase 0
├── data-model.md        # Output of Phase 1
├── quickstart.md        # Output of Phase 1
├── contracts/           # Output of Phase 1
│   └── dashboard-service.ts
└── tasks.md             # To be created by /speckit.tasks
```

### Source Code

```text
src/
├── components/
│   └── dashboard/
│       └── widgets/
│           ├── MemberScaleWidget.tsx       # [MODIFY] Rename to MembershipDistributionWidget or refactor in place
│           └── TierDistributionWidget.tsx  # [MODIFY] Rename to ValueContributionWidget or refactor in place
├── types.ts                                # [MODIFY] Update DashboardMetrics and TierMetric interface
└── lib/
    └── mock/
        └── MockDashboardService.ts         # [MODIFY] Generate enriched TierMetric data (active/sales)
```

**Structure Decision**: Standard Single-Project Structure. Refactoring existing widgets in `src/components/dashboard/widgets`.

## Complexity Tracking

No violations found.
