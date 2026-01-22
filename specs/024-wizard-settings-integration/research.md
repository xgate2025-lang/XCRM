# Research: Wizard-Settings Integration

**Feature**: `024-wizard-settings-integration`  
**Date**: 2026-01-22

## Research Summary

This feature has minimal unknowns as it integrates existing, well-tested components. Research focused on understanding current navigation patterns and identifying the simplest integration approach.

---

## Decision 1: Navigation Mechanism

**Question**: How should the wizard navigate to specific settings pages with tab selection?

**Decision**: Use existing `navigateToMission()` with updated `actionRoute` values in `MockOnboardingService`.

**Rationale**:
- `OnboardingContext.navigateToMission()` already extracts `actionRoute` from mission data and calls the navigation function
- `App.tsx` already routes `settings-global` to `GlobalSettings` and `settings-basic` to `BasicData`
- Simply updating the `actionRoute` in `MockOnboardingService` from `'setting'` to specific NavItemIds is sufficient

**Alternatives Considered**:
- Custom URL-based routing with react-router → Rejected: Project uses NavItemId state-based routing, not URL routing
- Passing tab as URL query param → Rejected: Current architecture doesn't support query params; would require significant refactoring

---

## Decision 2: Source Tracking for Return Navigation

**Question**: How should settings pages know they were accessed from onboarding?

**Decision**: Extend `NavigationPayload` in App.tsx to include a `source?: string` field.

**Rationale**:
- `App.tsx` already has `NavigationPayload` interface with optional `id` field
- Adding `source?: 'onboarding'` follows existing patterns
- Settings pages can check payload to conditionally render "Return to Dashboard" button

**Alternatives Considered**:
- URL query params (`?source=onboarding`) → Rejected: Not compatible with current SPA state routing
- Global context variable → Rejected: Overcomplicates simple use case

---

## Decision 3: Tab Selection on Settings Pages

**Question**: How should settings pages open the correct tab when accessed from onboarding?

**Decision**: Pass `tab` in navigation payload; settings pages check payload on mount.

**Rationale**:
- Both `GlobalSettings.tsx` and `BasicData.tsx` use internal `useState` for `activeTab`
- Pages can check for navigation payload on mount and set initial tab accordingly
- Requires minimal code changes (one `useEffect` per page)

**Alternatives Considered**:
- Always default to correct tab → Rejected: Would change behavior for non-onboarding navigation
- Store tab preference in localStorage → Rejected: Adds unnecessary complexity

---

## Decision 4: Subtask Auto-Completion

**Question**: How should subtasks be marked complete automatically?

**Decision**: Defer to Phase 2 - use manual toggle for MVP.

**Rationale**:
- Auto-detection requires cross-context communication (GlobalSettings → Onboarding)
- Manual toggle via debug panel already works and can be used for demo
- Auto-completion can be added later without breaking changes

**Alternatives Considered**:
- Event system for cross-context updates → Deferred: Too complex for MVP
- Polling for data changes → Rejected: Inefficient and unnecessary for single-user app

---

## Technical Findings

### Existing Code Analysis

1. **MockOnboardingService.ts** (Lines 22-53):
   - Step 1 (`identity`): `actionRoute: 'setting'` → needs to be `'settings-global'`
   - Step 2 (`tier_method`): `actionRoute: 'setting'` → needs to be `'settings-basic'`

2. **OnboardingContext.tsx** (Lines 160-178):
   - `navigateToMission()` casts `actionRoute` to `NavItemId` and calls navigation function
   - No payload support currently; need to extend to pass source/tab

3. **App.tsx** (Lines 31-33, 90-95):
   - `NavigationPayload` interface exists with `id?: string`
   - Routes already handle `settings-global` and `settings-basic`

4. **GlobalSettings.tsx / BasicData.tsx**:
   - Both use `useState<TabId>` for tab management
   - Neither currently receives navigation payload

### Integration Points

| Source File | Change Type | Complexity |
|-------------|-------------|------------|
| MockOnboardingService.ts | String update (2 lines) | Low |
| OnboardingContext.tsx | Extend navigation call | Low |
| App.tsx | Extend NavigationPayload type | Low |
| GlobalSettings.tsx | Add payload handling + return button | Medium |
| BasicData.tsx | Add payload handling + return button | Medium |

---

## Conclusion

All technical questions resolved. No blockers identified. Feature can proceed to Phase 1 design.
