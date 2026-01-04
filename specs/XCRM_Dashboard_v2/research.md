# Research: Tenant Onboarding & Dashboard

## Decisions

### State Management
- **Decision**: Use `DashboardContext` (React Context) to manage Global State (Date Range, Store Scope) and Onboarding Progress.
- **Rationale**: Avoids prop drilling. Aligns with existing `ProgramContext` pattern.
- **Alternatives**: Redux (Overkill), Zustand (Not in stack).

### Persistence
- **Decision**: Use `localStorage` for user preferences (Quick Actions, Onboarding Status).
- **Rationale**: No backend API specified for user settings. Ensures data persists across reloads.
- **Key**: `xcrm_dashboard_config`.

### Mock Data Strategy
- **Decision**: Implement a `MockService` within `DashboardContext` that generates data based on the selected Date Range.
- **Rationale**: Required to pass "Independent Test" (metrics must recalculate).
- **Implementation**: `src/lib/mockData.ts` (Create `src/lib` as per Constitution).

### Component Library
- **Decision**: Use `recharts` for trends and `lucide-react` for icons.
- **Rationale**: Already installed and used in `Dashboard.tsx`.

## Open Questions Resolved
- **Backend Availability**: Assumed none for this feature; Client-side logic only.
- **Active Member Logic**: Hardcoded definition for now, with a "Configure" placeholder.
