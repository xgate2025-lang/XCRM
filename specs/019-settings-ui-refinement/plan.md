# Implementation Plan: Settings UI Refinement

**Branch**: `019-settings-ui-refinement` | **Date**: 2026-01-16 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/019-settings-ui-refinement/spec.md)
**Input**: Feature specification from `specs/019-settings-ui-refinement/spec.md`

## Summary

Standardize the UI of Global Settings, Integration Settings, and Basic Data pages to align with the application's established brand guidelines (based on the Member Detail page and Digital Factory Constitution). This involves refactoring Tailwind classes to use standard tokens for typography, spacing, cards, and input elements.

## Technical Context

**Language/Version**: TypeScript, React 19
**Primary Dependencies**: Tailwind CSS, Lucide React, react-router-dom, framer-motion
**Storage**: Mock Service with LocalStorage persistence (`src/lib/services/mock/`)
**Testing**: Playwright (for E2E visual verification)
**Target Platform**: Web (Vite SPA)
**Project Type**: Single project
**Performance Goals**: Instant interaction feedback (<100ms)
**Constraints**: Must use standard Tailwind utilities; no arbitrary hex codes; must persist Navigation Sidebar.
**Scale/Scope**: 3 major settings pages and their sub-components.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Vite Only**: Using standard Vite SPA structure.
- [x] **React 19**: Adhering to React 19 patterns.
- [x] **Tailwind CSS**: Using standard utility classes.
- [x] **Lucide React**: Using Lucide for all iconography.
- [x] **SPA Architecture**: No SSR/Next.js.
- [x] **Service Isolation**: Mock services already isolated in `src/lib/services/mock/`.

*PRE-FLIGHT*: Must read `Journal.md` to prevent recurring errors.

## Project Structure

### Documentation (this feature)

```text
specs/019-settings-ui-refinement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A for this feature, but created for consistency)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - UI only)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/          # Reusable UI components
│   └── settings/        # Feature-specific components for settings
├── pages/
│   └── settings/        # GlobalSettings, IntegrationSettings, BasicData
├── context/             # GlobalSettingsContext, IntegrationContext
├── lib/
│   └── services/mock/   # Mock services
└── App.tsx              # Main entry with layout
```

**Structure Decision**: Single project structure follows the existing pattern in `src/`. Refinement focused on `src/pages/settings/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
