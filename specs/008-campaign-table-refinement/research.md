# Research: Campaign Table Refinement

## Decision 1: Zone A & B Connection
- **Approach**: Lift the `activeFilter` and `searchQuery` state closer to the `CampaignDashboard` root if not already. 
- **Rationale**: The spec requires Zone A (Pulse Header) to be derived from the *filtered* state. This means the metrics in Zone A should be calculated from `filteredCampaigns`.
- **Interaction**: Clicking a Zone A card will trigger a state update for `activeFilter` in Zone B.

## Decision 2: Polymorphic Row Metrics
- **Approach**: Implement a utility function `getCampaignPrimaryMetric(campaign: Campaign)` in `src/pages/CampaignDashboard.tsx` or a shared utility.
- **Rationale**: Different campaign types have different KPIs. Centralizing this logic ensures consistency between the table view and the Quick Look drawer.
- **Mapping**:
  - `boost_sales` | `spending` -> ROI / Sales
  - `referral` -> New Members Count
  - `coupon` (custom) -> Redemption Rate (if available)

## Decision 3: Quick Look Drawer State
- **Approach**: Local state `selectedCampaignId` in `CampaignDashboard.tsx`.
- **Rationale**: The drawer only exists within the list context. No need to pollute the global `CampaignContext` with transient UI state like "which row is open".

## Decision 4: Operational Safety (STOP Confirmation)
- **Approach**: Create a reusable `ConfirmationModal` component that takes an optional `confirmText` prop. 
- **Rationale**: Prevents accidental termination of campaigns.

## Alternatives Considered
- **Global Context for Filters**: Considered moving filters to `CampaignContext`, but since filters are specific to the "Studio" (list) view, local page state is more encapsulated.
- **Separate Components for Row Metrics**: Considered `SalesMetricCard` vs `ReferralMetricCard` but a single dynamic column is cleaner for the table structure.
