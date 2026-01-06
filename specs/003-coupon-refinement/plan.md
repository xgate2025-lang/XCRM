# Implementation Plan: Coupon Refinement - CreateCoupon.tsx

**Branch**: `003-coupon-refinement` | **Date**: 2026-01-05 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/003-coupon-refinement/spec.md)
**Input**: Feature specification for a Vertical Accordion-based Create Coupon Wizard.

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The goal is to refactor the existing `CreateCoupon.tsx` (currently ~29k characters) into a modern, 5-step Vertical Accordion wizard. The technical approach involves decomposing the monolithic page into a state machine managing accordion transitions, a sticky live preview component, and modular form sections (Essentials, Lifecycle, Guardrails, Inventory, Distribution). Refinement will use Tailwind CSS for the accordion animations and Lucide React for consistent iconography.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript, React 19  
**Primary Dependencies**: `lucide-react`, `react-router-dom`, `framer-motion` (optional for accordion animations, or Vanilla Tailwind transitions as per Journal).  
**Storage**: N/A (Mock Service with LocalStorage persistence to be updated in Phase 2).  
**Testing**: Manual verification using the Live Preview and browser testing.  
**Target Platform**: Web (Vite SPA)  
**Project Type**: Single project (src/ structure)  
**Performance Goals**: Live preview updates < 200ms lag.  
**Constraints**: < 1s validation time per accordion section.  
**Scale/Scope**: Refactoring `src/pages/CreateCoupon.tsx`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Tech Stack**: React 19 + TypeScript + Vite.
- [x] **Styling**: Tailwind CSS (PostCSS) utility classes only.
- [x] **Iconography**: Lucide React only.
- [x] **Project Structure**: `src/` as root, components in `src/components/`, pages in `src/pages/`.
- [x] **Service Isolation**: Form logic and mock interactions to be isolated from UI components.
- [x] **IA+UX Handshake**: `UserFlows.md` reviewed (referenced as `coupon_re-UF.md`).

*PRE-FLIGHT*: Read `Journal.md`. Note from Journal: Card radius should be `rounded-2xl` (1rem) for dense UI. Buttons must use slate-900 style. Avoid `rounded-4xl`.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

src/
├── components/
│   └── coupon/
│       ├── AccordionSection.tsx
│       ├── LivePreview.tsx
│       ├── sections/
│       │   ├── EssentialsSection.tsx
│       │   ├── LifecycleSection.tsx
│       │   ├── GuardrailsSection.tsx
│       │   ├── InventorySection.tsx
│       │   └── DistributionSection.tsx
├── pages/
│   └── CreateCoupon.tsx (Refactored to orchestrate sections)
├── context/
│   └── CouponWizardContext.tsx
├── types.ts (Update with Coupon types)
└── App.tsx (Routing)

**Structure Decision**: Option 1: Single project. We will modularize the `CreateCoupon.tsx` page by moving its sub-components into `src/components/coupon/` to maintain Rule 81 (Monolith Decomposition).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
