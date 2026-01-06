# Implementation Plan: Campaign Analytics

**Branch**: `001-campaign-analytics` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-campaign-analytics/spec.md`

## Summary

Implement a polymorphic analytics dashboard for campaigns that adapts its visualization based on the campaign type ('Consumption' vs 'Referral'). This involves creating a container-presenter architecture where a main `CampaignAnalyticsPage` selects the appropriate view (`ConsumptionView` or `GrowthView`) and injects the relevant data dynamically fetched from a new `MockAnalyticsService`. Visualization will be handled by `recharts`.

## Technical Context

**Language/Version**: TypeScript (React 19)
**Primary Dependencies**: React, Tailwind CSS, Lucide React, Recharts (New)
**Storage**: LocalStorage (via Mock Services)
**Testing**: Manual Verification (Quickstart)
**Target Platform**: Web (SPA)
**Project Type**: Single-Page Application (Vite)
**Performance Goals**: < 1.5s LCP for analytics page.
**Constraints**: Must use `import.meta.env`, strict component isolation.
**Scale/Scope**: ~10 new components, 1 new service.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Build System**: Vite (Confirmed)
- **Styling**: Tailwind CSS (Confirmed)
- **Routing**: react-router-dom (Confirmed)
- **AI Service Isolation**: N/A (No AI used in this feature)
- **Polymorphism**: Uses "Container/Presenter" pattern to keep logic clean.

*PRE-FLIGHT*: Read `Journal.md` - Confirmed no recent blocking recurring errors relevant to this feature (mostly specific UI bugs and env var handling).

## Project Structure

### Documentation (this feature)

```text
specs/001-campaign-analytics/
├── plan.md              # This file
├── research.md          # Research & Decisions
├── data-model.md        # Entities
├── quickstart.md        # Verification Steps
├── contracts/           # Interfaces
└── tasks.md             # Task Breakdown (generated next)
```

### Source Code

```text
src/
├── components/
│   └── campaign/
│       └── analytics/         # [NEW] Analytics Components
│           ├── AnalyticsContainer.tsx
│           ├── ConsumptionView.tsx
│           ├── GrowthView.tsx
│           ├── Scorecard.tsx
│           ├── TrendChart.tsx
│           └── ParticipationLedger.tsx
├── pages/
│   └── CampaignAnalytics.tsx  # [NEW] Page Wrapper
├── services/
│   └── MockAnalyticsService.ts # [NEW] Data Service
└── types.ts                    # [UPDATE] Analytics Types
```

## Implementation Phases

### Phase 1: Foundation (Dependencies & Data)
1.  **Dependencies**: Install `recharts`.
2.  **Types**: Update `types.ts` with `AnalyticsSummary` and `CampaignLog` extensions.
3.  **Service**: Implement `MockAnalyticsService` to generate realistic mock data (ROI, CPA, Logs) based on Campaign ID.

### Phase 2: Components (Shared)
1.  **Scorecard**: Create a reusable 4-card grid component.
2.  **TrendChart**: Create a reusable Recharts wrapper for Area/Line charts.
3.  **ParticipationLedger**: Create a table component with pagination and "Drill-down" callbacks.
4.  **StrategyReceipt**: Create the accordion summary component (Zone B).

### Phase 3: Views (Polymorphic Logic)
1.  **ConsumptionView**: Assemble shared components for Purchase campaigns.
2.  **GrowthView**: Assemble shared components for Referral campaigns.
3.  **AnalyticsContainer**: Implement the switching logic based on `campaign.type`.
4.  **Route**: Register `/campaigns/:id/analytics` in `App.tsx`.

### Phase 4: Verification
1.  **Manual Test**: Follow `quickstart.md` to verify both campaign types.
2.  **Drill-down**: Verify drawers open correctly (Transaction & Member Profile).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |
