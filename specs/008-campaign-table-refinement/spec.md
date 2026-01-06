# Feature Specification: Campaign Table Refinement

**Feature Branch**: `008-campaign-table-refinement`  
**Created**: 2026-01-06  
**Status**: Draft  
**Input**: campaign table refinement based on Campaign_table_IA.md. Do not change the 1. Zone A: The "Pulse" Header and 2. Zone B: Smart Filters (The Search). But make them connected.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Campaign Overview (Priority: P1)

Managers need a campaign list that automatically adapts its metrics and actions based on the campaign type and status, allowing for efficient management of diverse campaign goals.

**Why this priority**: The table is the core operational interface. Correctly displaying types (Sales vs. Referral vs. Coupon) and enforcing state-based actions is critical for operational safety.

**Independent Test**: Verify that rows for different campaign types (e.g., "Boost Sales" vs "Refer Friends") display different primary metrics (ROI vs New Members) and different available actions based on their status.

**Acceptance Scenarios**:

1. **Given** the campaign table loads, **Then** each row MUST display a **Visual Badge** corresponding to its type (Boost Sales, Refer Friends, Issue Coupons, Accumulation).
2. **Given** a `Boost Sales` campaign row, **Then** the "Primary Metric" column MUST show **ROI / Sales**.
3. **Given** a `Refer Friends` campaign row, **Then** the "Primary Metric" column MUST show **New Members**.
4. **Given** an `Active` campaign row, **Then** the Primary Button MUST be **[ 📊 Analytics ]** and the "Edit" action MUST be disabled/hidden in the menu to prevent live logic changes.
5. **Given** a `Paused` campaign row, **Then** the Primary Button MUST be **[ Resume ]**.

---

### User Story 2 - Integrated Dashboard Experience (Priority: P1)

Users want the list page components (Pulse Header, Smart Filters, and Table) to work as a single cohesive unit, where filtering the list updates the summary metrics and vice versa.

**Why this priority**: Consistent data across the page prevents confusion. If a filter is applied, the "Pulse" (Zone A) should reflect only the filtered subset to provide accurate context.

**Independent Test**: Apply a status filter (e.g., "Active") and verify that both the Table (Zone C) and the Pulse Header (Zone A) update their counts/sums accordingly.

**Acceptance Scenarios**:

1. **Given** a status filter is selected in Zone B (Smart Filters), **When** applied, **Then** the Pulse Header (Zone A) MUST update its metrics (e.g., "Active Campaigns") to match the filtered dataset.
2. **Given** the Pulse Header metrics, **When** a metric card (e.g., "Active") is clicked, **Then** the Smart Filters (Zone B) MUST update to reflect that state, and the Table (Zone C) MUST filter accordingly.
3. **Given** a search query in Zone B, **Then** both the Table and the Pulse Header MUST reflect the items matching the search.

---

### User Story 3 - Rapid Intelligence via Quick Look (Priority: P2)

Power users need to see campaign details and recent activity without full page transitions to maintain flow while scanning the list.

**Why this priority**: Navigating back and forth between list and detail for simple checks is high-friction.

**Independent Test**: Click a row (avoiding action buttons) and verify the "Quick Look" Drawer opens with the correct mini scorecard and activity log.

**Acceptance Scenarios**:

1. **Given** the campaign table, **When** any part of a row (except buttons/links) is clicked, **Then** a **Quick Look Drawer** MUST slide open from the right.
2. **Given** the Quick Look Drawer is open, **Then** it MUST display:
    - Mini Scorecard (Cost, Revenue, Participation).
    - Rule Summary (Trigger/Reward description).
    - Recent Activity (Last triggered event).

---

### Edge Cases

- **"Live Edit" Attempt**: If a user attempts to edit an `Active` campaign via direct URL or menu, the system MUST show a modal explaining the campaign must be paused first.
- **Empty Filter Results**: If Zone B filters result in 0 campaigns, Zone A (Pulse Header) MUST show `0` or appropriate empty states for all metrics.
- **Stop Action**: Clicking "Stop" MUST trigger a confirmation modal requiring the user to type "STOP" to confirm the permanent termination.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: **Polymorphic Table Columns**: The "Primary Metric" column MUST dynamically switch content/format based on the campaign type (Sales ROI vs. Growth Count vs. Redemption %).
- **FR-002**: **State-Aware Actions**: The actions column MUST implement the logic matrix (e.g., `Draft` -> Edit, `Active` -> Analytics, `Paused` -> Resume).
- **FR-003**: **Smart Timeline**: The Timeline column MUST show relative time context (e.g., "Ends in 3 Days", "Starts in 5 Days").
- **FR-004**: **Zone Synchronization**: Zone A (Pulse) metrics MUST be derived from the *filtered* state of the campaign list.
- **FR-005**: **Reverse Filtering**: Clicking a count-based card in Zone A MUST apply the corresponding filter in Zone B.
- **FR-006**: **Quick Preview Drawer**: Implement a slide-over component that fetches and displays a summary of the selected campaign.
- **FR-007**: **Operational Safety**: Logic (Triggers/Rewards) MUST be locked while a campaign is `Active`.

### Key Entities

- **Campaign (Extended)**: 
    - `type`: Enum (Boost Sales, Refer Friends, Issue Coupons, Accumulation).
    - `status`: Enum (Draft, Scheduled, Active, Paused, Ended).
    - `primaryMetric`: Dynamic calculation based on type.
- **CampaignActivity**: Represents the "Recent Activity" stream for the Quick Look drawer.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can distinguish between Sales and Referral campaigns at a glance via visual badges (100% of rows).
- **SC-002**: Verification that no `Active` campaign can have its core logic edited without being `Paused` first.
- **SC-003**: Filter latency: Zone A and Zone C update within < 200ms of a Zone B filter change.
- **SC-004**: Quick Look Drawer provides enough context that users need to click into the full Analytics page 30% less frequently for routine checks.
