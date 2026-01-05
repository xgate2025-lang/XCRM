# Implementation Plan: Member Page UI Refinement

**Branch**: `002-member-page-ui-refinement` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-member-page-ui-refinement/spec.md`

## Summary

The Member Page UI Refinement aims to restructure the member creation/edit form into logical sections (Basic, Address, Marketing, Membership), implement a unified "Operation Remarks" component for asset adjustments, and enhance detail views for orders, points, and coupons. The approach involves modularizing the `MemberDetail` and `MemberForm` components, ensuring consistent styling using Tailwind CSS and Lucide React as per the project constitution.

## Technical Context

**Language/Version**: TypeScript (React 19)
**Primary Dependencies**: React, Tailwind CSS, Lucide React, `react-router-dom`
**Storage**: Mock Services
**Testing**: Manual Verification (as per user scenarios in spec)
**Target Platform**: Web (Vite SPA)
**Project Type**: Single project
**Performance Goals**: Instant form section switching, <200ms page transitions
**Constraints**: Visual consistency with existing UI, no print/download actions on order details
**Scale/Scope**: Refactoring existing member-related pages; introducing detailed asset history views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Description |
|------|--------|-------------|
| 1. Tech Stack | PASS | Uses Vite, React 19, TypeScript, Tailwind. |
| 2. Env Config | PASS | Uses `import.meta.env` for environment variables. |
| 3. Styling | PASS | Primary use of Tailwind utility classes and Lucide React icons. |
| 4. Architecture | PASS | SPA architecture, no SSR/Next.js. |
| 5. Structure | PASS | Source code in `src/`, AI logic isolated in `src/lib/`. |
| 6. Workflow | PASS | Spec-first development followed by planning. |
| 9. Design Consistency | PASS | Inherits padding, rounding, and shadow patterns from existing UI. |
| 12. IA+UX Handshake| PASS | Handles loading, error, and empty states. |

*PRE-FLIGHT*: Must read `Journal.md` to prevent recurring errors.

## Project Structure

### Documentation (this feature)

```text
specs/002-member-page-ui-refinement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── member/         # New/Refactored member components
│   │   ├── detail/     # Tab-specific sub-components
│   │   ├── form/       # Member registration/edit form
│   │   └── shared/     # Member-specific shared components
│   └── shared/
│       └── OperationRemarks.tsx
├── pages/
│   ├── MemberListPage.tsx
│   ├── MemberDetailPage.tsx
│   └── OrderDetailPage.tsx
├── context/
│   └── MemberContext.tsx
├── lib/
│   └── mockMemberService.ts
├── App.tsx
├── constants.tsx
└── types.ts
```

**Structure Decision**: Single project structure (Option 1). Source code in `src/`.

## Complexity Tracking

> No constitution violations detected.
