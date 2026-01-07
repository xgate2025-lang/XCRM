# Research: Paid Tier Tabs

**Status**: Complete
**Date**: 2026-01-06

## Decisions

### 1. Tab Navigation Pattern

- **Decision**: Reuse the tab visual style from `src/components/program/PointsWizard.tsx`.
- **Rationale**: Maintain visual consistency across the "Program" domain. The `PointsWizard` uses a simple button row with a bottom border for the active state (`border-primary-500` text-primary-600) and gray for inactive (`text-slate-400`).
- **Implementation**:
  - Use `lucide-react` icons: `Layers` (Standard), `Crown` (Paid).
  - Use standard Tailwind utility classes.
  - No new dependencies or complex components needed.

### 2. State Management

- **Decision**: Local `useState` in `ProgramTier.tsx`.
- **Rationale**: The tab state (`standard` vs `paid`) is ephemeral page-level UI state. It does not need to persist in the URL (Navigation Sidebar handles page routing) or Global Context.
- **Reference**: `PointsWizard.tsx` uses `const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);`. We will use string literals `'standard' | 'paid'` for better readability.

## Alternatives Considered

- **React Router Nested Routes**:
  - *Rejected*: Overkill for a simple view toggle where the header remains identical. Preserves the SPA feel without complex routing config changes.
- **Sub-components for Tabs**:
  - *Rejected*: The specific layout of the Paid Tier placeholder is unique enough to just inline or abstract slightly, but a generic "Tab" component isn't strictly necessary given the project's "Surgical Engineering" preference (avoid over-abstraction).
