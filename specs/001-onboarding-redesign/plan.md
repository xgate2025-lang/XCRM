# Implementation Plan: Day Zero Onboarding Redesign

**Branch**: `001-onboarding-redesign` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-onboarding-redesign/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan covers the redesign of the "Day Zero" Onboarding experience ("State A") for the Dashboard. It introduces a gamified "Hero Carousel" and a "Boomerang Loop" interaction pattern. The implementation will focus on a frontend-first architecture using a strict `MockOnboardingService` to enable immediate UX verification without backend dependencies, and `LocalStorage` for session persistence.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: React (v19), Lucide React (Icons), Tailwind CSS (Styling)  
**Storage**: `LocalStorage` (Namespaced: `xcrm:onboarding:last_card:{userId}`) for UI state; Mock Service for data persistence simulation.  
**Testing**: Vitest (Unit), Manual UX Verification (Scenario-based)  
**Target Platform**: Web (Responsive SPA)  
**Project Type**: Single-Page Application (SPA)  
**Performance Goals**: Dashboard Initial Load < 500ms; Carousel Scroll Animation ~300-500ms; Progress Update < 100ms.  
**Constraints**: strictly matching "Sharia OS" visual style; no immediate backend API dependencies (Mock only).  
**Scale/Scope**: ~5-7 new components, 1 new Context/Service, 1 modified Page (Dashboard).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Tech Stack**: Uses Vite + React + TypeScript. No Next.js.
- [x] **Environment**: Uses `import.meta.env` if needed (though Mock Service mainly).
- [x] **Styling**: Uses Tailwind CSS + `lucide-react`. Matches "Global Styling Zone" rules.
- [x] **Routing**: SPA architecture; deep links use `react-router-dom` query params (`?source=onboarding`).
- [x] **Structure**: Source code in `src/`. Logic isolated in `src/lib/`.
- [x] **AI Patterns**: No direct AI calls in components (N/A for this ui feature, but principle holds).
- [x] **Visual Integrity**: Design will match existing padding/shadow/rounding from `index.html`.
- [x] **IA Integrity**: All 4 Missions maps to tasks.
- [x] **UX Handshake**: "Boomerang" loop handles state transitions (Loading, Success).
- [x] **UI Persistence**: Sidebar/Header remain static during "Loop".

*PRE-FLIGHT*: checked `Journal.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-onboarding-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   └── dashboard/
│       ├── onboarding/
│       │   ├── OnboardingHero.tsx         # Main Widget Container
│       │   ├── MissionCarousel.tsx        # The Scrollable Card Rail
│       │   ├── MissionCard.tsx            # Individual Card UI
│       │   ├── ProgressHeader.tsx         # The Global Progress Bar
│       │   └── Launchpad.tsx              # "Victory Lap" Success View
│       └── DashboardV2.tsx                # Modified to switch State A/B
├── context/
│   └── OnboardingContext.tsx              # State Management (Progress, Active Card)
├── lib/
│   ├── services/
│   │   └── mock/
│   │       └── MockOnboardingService.ts   # The "Boomerang" Logic Simulation
│   └── storage/
│       └── LocalStorageClient.ts          # Persistence Helper
└── types.ts                               # Updated with Onboarding types
```

**Structure Decision**: Standard "Single project" SPA layout. New components nested under `components/dashboard/onboarding` to keep the top-level clean. Logic isolated in `MockOnboardingService`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Mocks in `src/lib` | Decoupling FE from BE delivery | Waiting for BE would block P1 User Story verification |
