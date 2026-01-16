# Implementation Plan: Basic Data Settings

**Branch**: `018-basic-data-settings` | **Date**: 2026-01-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/018-basic-data-settings/spec.md`
**Existing Files**: `src/pages/settings/BasicData.tsx` (Pre-existing placeholder?)

## Summary

Implement the "Basic Data" settings module to manage Stores, Products, Categories, and Brands. This feature enables defining the foundational data required for order processing and inventory management. The implementation will use React 19 for the UI and a Mock Service pattern (backed by LocalStorage) for persistence, ensuring rapid development and testing without a live backend.

## Technical Context

**Language/Version**: TypeScript (React 19)
**Primary Dependencies**: Tailwind CSS, Lucide React, `react-router-dom`, `framer-motion` (for transitions)
**Storage**: Mock Service with LocalStorage persistence (Pattern: `src/lib/services/mock/`)
**Testing**: Manual verification via browser (Unit/Component testing framework not yet established)
**Target Platform**: Web (Single Page Application)
**Project Type**: Single project (src/)
**Performance Goals**: List views load < 1s, smooth drag-and-drop interactions
**Constraints**: Zero server-side code (Mock only), Strict UI consistency with existing Settings pages
**Rich Text**: Use `react-quill` for Product Description (FR-013). Install via `npm install react-quill`.
**Image Mock**: Store image as Base64 Data URL in LocalStorage. Real implementation would use S3 or similar.
**Coordinates Input**: Use numeric text fields (Latitude/Longitude) for MVP. Map picker is out of scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Build System**: Vite (Confirmed)
- **UI Library**: React 19 (Confirmed)
- **Styling**: Tailwind CSS + Lucide React (Confirmed)
- **Routing**: `react-router-dom` (Confirmed)
- **Architecture**: SPA, No SSR (Confirmed)
- **Services**: All logic in `src/lib/`, no direct logic in components (Confirmed)
- **IA Rules**: Every IA node will have a task (Confirmed)
- **States**: Loading, Error, Empty states will be implemented (Confirmed)

*PRE-FLIGHT*: checked `Journal.md`.

## Project Structure

### Documentation (this feature)

```text
specs/018-basic-data-settings/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (Mock Interfaces)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   └── settings/
│       └── BasicData/
│           ├── StoreList.tsx
│           ├── StoreForm.tsx
│           ├── ProductList.tsx
│           ├── ProductForm.tsx
│           ├── CategoryTree.tsx
│           └── BrandList.tsx
├── pages/
│   └── settings/
│       └── BasicData.tsx      # Entry point (Main Page)
├── lib/
│   └── services/
│       └── mock/
│           ├── MockBasicDataService.ts      # Mock Service Logic
└── types.ts                 # Shared Types
```

**Structure Decision**: Reuse existing `src/pages/settings/BasicData.tsx` as the main route entry. Create a new subdirectory `BasicData` in `src/components/settings/` to nest the complex components (Lists, Forms, Trees). Mock logic will be isolated in `src/lib/services/mock/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |
