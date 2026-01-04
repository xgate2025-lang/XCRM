# Implementation Plan: Dashboard Changes

**Branch**: `XCRM_Dashboard_v2` | **Date**: 2026-01-04
**Input**: Feature specification from `specs/XCRM_Dashboard_v2/spec.md`

## Summary

Implement a new Dashboard with a "Day Zero" Onboarding Guide and an "Operational Command Center" view. Introduce `DashboardContext` for global state (Date Range, Store Scope) and use `localStorage` for persisting user preferences.

## Technical Context

**Language/Version**: TypeScript / React 19
**Primary Dependencies**: Vite, TailwindCSS, Lucide React, Recharts
**Storage**: `localStorage` (Client-side persistence)
**Testing**: Manual Verification (Independent Tests defined in Spec)
**Target Platform**: Web (Modern Browsers)
**Project Type**: Single Page Application (SPA)
**Performance Goals**: <2s load time (Mock data generation)
**Constraints**: Visual Integrity (Constitution Section 9)

## Constitution Check

*GATE: Passed.*

### Visual Integrity & Design Consistency (Section 9)
- **Check**: Will use `Dashboard.tsx` existing styles.
- **Colors**: Primary `#055DDB`, Slate `#0F172A`.
- **Components**: Reusing `PastelCard` (or similar) from existing dashboard.

## Project Structure

### Documentation (this feature)
`specs/XCRM_Dashboard_v2/` contains `plan.md`, `research.md`, `data-model.md`.

### Source Code

```text
src/
├── components/
│   ├── dashboard/ [NEW]
│   │   ├── SetupGuide.tsx
│   │   ├── GlobalNavigator.tsx
│   │   ├── QuickActions.tsx
│   │   └── TrendMetric.tsx
├── pages/
│   └── Dashboard.tsx    # MODIFY (Integration point)
├── context/
│   └── DashboardContext.tsx [NEW]
├── lib/ [NEW]
│   └── mockData.ts [NEW]
```

**Structure Decision**: modularize dashboard components into `src/components/dashboard/` to avoid a massive `Dashboard.tsx`.

## Complexity Tracking

| Violation | Why Needed |
|-----------|------------|
| New `src/lib` directory | Required by Constitution for logic separation, even if just for mock data. |
