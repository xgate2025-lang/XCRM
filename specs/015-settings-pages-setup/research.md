# Research Findings: Settings Navigation

**Branch**: `015-settings-pages-setup`
**Date**: 2026-01-13
**Spec**: [specs/015-settings-pages-setup/spec.md](../spec.md)

## Decisions

### Navigation Structure
**Decision**: Use `src/constants.tsx` to define nested navigation.
**Rationale**: Existing pattern `CONFIG_NAV` uses nested `children` array for "Program" section. We will replicate this for "Setting".
**Alternatives Considered**: Hardcoding links in Sidebar. Rejected because `Sidebar` component iterates over `navItemsConfig` prop.

### Routing Logic
**Decision**: Use `src/App.tsx` manual state management (`currentPage`).
**Rationale**: Application uses a custom `renderContent()` switch statement rather than `react-router-dom` `<Routes>`. To maintain consistency (Constitution Rule 13), we will extend this pattern.
**Note**: Constitution mentions `react-router-dom` is allowed, but `App.tsx` clearly uses state-based conditional rendering. We must follow the existing pattern in `App.tsx`.

## Unknowns Resolved

- **Where is SideNav?**: Logic is in `src/components/Sidebar.tsx` (called from `Layout.tsx`), data is in `src/constants.tsx`.
- **How is routing handled?**: `App.tsx` using `useState<NavItemId>`.

## Action Items

- Modify `src/constants.tsx`.
- Modify `src/App.tsx`.
- Create placeholder pages.
