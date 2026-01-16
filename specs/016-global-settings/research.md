# Research Findings: Global Settings Feature

**Branch**: `016-global-settings` (Spec Renamed from 001)
**Date**: 2026-01-13
**Spec**: [specs/016-global-settings/spec.md](../spec.md)

## Decisions

### Data Persistence
**Decision**: Use `MockGlobalSettingsService` implementing a singleton pattern with `localStorage` persistence.
**Rationale**: Aligns with existing `MockMemberService` and `MockCouponService` patterns (inferred from `src/lib/services`). Use `localStorage` to persist across reloads as per Constitution Rule 13 (Persistence).
**Alternatives Considered**: Hardcoded mock data (rejected: need CRUD), Real API (rejected: current phase focuses on frontend specific logic without backend readiness).

### State Management
**Decision**: Create `GlobalSettingsContext.tsx`.
**Rationale**: Exchange rates are needed globally (e.g. for potential receipt calculations). Customer Attributes are needed in Member Detail and Registration forms. A centralized context is best.
**Structure**:
- `currencies`: `CurrencyConfig[]`
- `attributes`: `CustomerAttribute[]`
- `addCurrency`, `deleteCurrency`, `addAttribute`, `deleteAttribute`, `updateAttribute` methods.

### UI Components
**Decision**: Use shared `Layout` and `Sidebar`.
**Rationale**: Already established in `015-settings-pages-setup`.

## Unknowns Resolved

- **Existing Services**: Found `src/lib/services` containing other mock services. Will replicate pattern.
- **Context Pattern**: Found `src/context/` containing domain-specific contexts. Will create new domain context `GlobalSettingsContext`.

## Action Items

- Create `src/lib/services/MockGlobalSettingsService.ts`.
- Create `src/context/GlobalSettingsContext.tsx`.
- Update `App.tsx` (or `MainLayout` wrapper) to provide `GlobalSettingsContext`.
