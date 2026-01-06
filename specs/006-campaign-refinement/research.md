# Phase 0: Research & Technical Decisions

**Feature**: Campaign Refinement (Metrics, Filters, Stacking, Analytics)
**Date**: 2026-01-06

## 1. State Management & Persistence

### Current State
- `CampaignContext` currently initializes with a hardcoded `MOCK_CAMPAIGNS` array.
- State is held in `useState` and resets on reload.
- No interaction with `localStorage`.

### Decision: Implement `MockCampaignService`
We will mirror the `MockCouponService` pattern to provide persistence.
- **Why**: User needs to see created campaigns persist across reloads.
- **Pattern**: `src/services/MockCampaignService.ts` with `localStorage` backing.
- **Interface**: Async methods (`getCampaigns`, `saveCampaign`, `deleteCampaign`).

## 2. Data Model Refinements

### Campaign Entity
We need to extend the `Campaign` interface in `types.ts`.

```typescript
export interface Campaign {
  // ... existing fields
  stackable: boolean;     // New: FR-005
  targetStores: string[]; // New: FR-003 (Store IDs, "ALL" = all stores)
  targetTiers: string[];  // New: FR-004 (Tier codes)
  // priority: Removed per user request
}
```

### Analytics Polymorphism
The Detail Page needs different metrics for "Spending" vs "Referral".
- **Spending**: ROI, Sales.
- **Referral**: New Members, Acquisition Cost.

**Implementation**:
- `CampaignDashboard.tsx` (or Detail View) will switch components based on `campaign.type`.
- We will likely need a `getCampaignMetrics(id)` method in the service that returns a polymorphic result.

## 3. UI Component Strategy

- **List Page**: Remove "Priority" column. Add conditional "Resume/Pause" buttons.
- **Creation Wizard**:
    - Use `MultiSelect` component (need to check if one exists or use standard `<select multiple>` styled with Tailwind).
    - Add "Stacking Rules" toggle section.
- **Detail Page**:
    - Create `SpendingAnalyticsCard` and `ReferralAnalyticsCard`.

## 4. Unknowns Resolved
- **Multi-select**: We will standard HTML/Tailwind patterns as no specific complex UI lib is present.
- **Stacking Warning**: We will simply filter existing active campaigns where `stackable === true` and show a list.

## 5. Constitution Alignment
- **Architecture**: `MockCampaignService` aligns with "Service Isolation" rule.
- **Routing**: SPA only.
- **Styling**: Tailwind CSS.
