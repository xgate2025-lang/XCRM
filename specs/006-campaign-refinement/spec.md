# Feature Specification: Campaign Refinement

**Feature Branch**: `006-campaign-refinement`
**Created**: 2026-01-06
**Status**: Draft
**Input**: Campaign Refresh: List metrics, Status filters, Creation flow (Store/Tier/Stacking), and Detail View analytics.

## User Scenarios & Testing

### User Story 1 - Optimized Campaign List Management (Priority: P1)

Marketing managers need a clear overview of campaign performance and precise control over campaign states without cluttered UIs.

**Why this priority**: The list page is the command center. current metrics are insufficient, and the "priority" field adds noise.

**Independent Test**: Verify the list page displays the new metrics and that status filters match the strict lifecycle states.

**Acceptance Scenarios**:

1. **Given** the campaign list loads, **Then** the top summary bar MUST show "Active Campaigns", "Cumulative Participants", and "Attributed Sales".
2. **Given** the filter dropdown, **When** opened, **Then** it MUST strictly list: `Draft`, `Running`, `Pause`, `Finish`, `Stop`.
3. **Given** a campaign row, **Then** the "Priority" column MUST BE removed.
4. **Given** a `Running` campaign, **When** checking actions, **Then** "Pause" and "End" options MUST be available (no toggle switch).
5. **Given** a `Paused` campaign, **When** checking actions, **Then** "Resume" and "End" options MUST be available.

---

### User Story 2 - Enhanced Campaign Creation Scope (Priority: P2)

Managers need to target specific stores and member tiers accurately and understand if a new campaign conflicts or stacks with others.

**Why this priority**: Correct targeting is essential for campaign effectiveness and budget control.

**Independent Test**: Create a campaign and verify multi-select for stores/tiers and the stacking toggle behavior.

**Acceptance Scenarios**:

1. **Given** the "Participating Stores" section, **When** interacting, **Then** the user MUST be able to multi-select stores from a list.
2. **Given** the "Select All" option for stores, **When** clicked, **Then** it selects all *currently listed* stores (snapshot), not a dynamic "all future stores" rule.
3. **Given** the "Member Levels" section, **When** interacting, **Then** the user MUST be able to multi-select tiers (e.g., Gold, Platinum).
4. **Given** the "Stacking Rules" section, **When** "Allow Stacking" is enabled, **Then** the system MUST display a list/warning of other currently active campaigns that might overlap.

---

### User Story 3 - Spending Campaign Analytics (Priority: P2)

For "Spending" type campaigns (e.g., "Spend $100 get $10"), managers need ROI-focused metrics.

**Why this priority**: "Spending" campaigns are directly tied to revenue; ROI visibility is critical.

**Independent Test**: Open a "Spending" campaign detail page and verify the specific metrics and log columns.

**Acceptance Scenarios**:

1. **Given** a "Spending" campaign detail page, **Then** the "Performance" section MUST show:
    - Total Participation Count
    - Estimated Cost (Budget Burn)
    - Attributed Sales Amount
    - ROI (Return on Investment)
2. **Given** the "Participation Log" table, **Then** columns MUST include: Member (ID/Name), Time, Reward Content, Attributed Sales Amt, Participation Count.

---

### User Story 4 - Referral Campaign Analytics (Priority: P2)

For "Referral" type campaigns (e.g., "Refer a friend"), managers need growth-focused metrics.

**Why this priority**: Referral campaigns are about acquisition; "New Members" and "Acquisition Cost" are the key KPIs.

**Independent Test**: Open a "Referral" campaign detail page and verify the specific metrics and log columns.

**Acceptance Scenarios**:

1. **Given** a "Referral" campaign detail page, **Then** the "Performance" section MUST show:
    - Total Participation Count
    - Estimated Cost
    - New Members Acquired
    - Average Acquisition Cost
2. **Given** the "Participation Log" table, **Then** columns MUST include: Referrer (ID/Name), Time, Referee (New Member), Participation Count.

---

## Edge Cases

- **Campaign Stacking Conflicts**: If two campaigns allow stacking but have conflicting logic (e.g., both set fixed price), how does the calculation engine prioritize? *Assumption: Engine applies best value to customer or follows creation date order. Feature focuses on UI warning only.*
- **Store List Changes**: If a store is closed/removed after campaign creation, it should remain in historical logs but be invalid for new transactions.

## Requirements

### Functional Requirements

- **FR-001**: List Page MUST display 3 summary metrics: Count of `Running` campaigns, Sum of total participants across all campaigns, Sum of attributed sales.
- **FR-002**: List Page filter MUST support 5 states: `draft`, `running`, `pause`, `finish`, `stop`.
- **FR-003**: Campaign Creation Form MUST support multi-select for Stores (simulated data).
- **FR-004**: Campaign Creation Form MUST support multi-select for Member Tiers.
- **FR-005**: Campaign Creation Form MUST have a "Stackable" boolean toggle.
- **FR-006**: Detail Page MUST render different KPI cards based on Campaign Type (`spending` vs `referral`).
- **FR-007**: Detail Page "Participation Log" columns MUST change dynamically based on Campaign Type.

### Key Entities

- **Campaign**: Added fields: `stackable` (boolean), `targetStores` (array of IDs), `targetTiers` (array of strings). Removed: `priority`.
- **CampaignLog**: Needs to support polymorphic data (Spending transaction ref vs Referral ref).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can view "ROI" for a spending campaign within 1 click (Detail page load).
- **SC-002**: Users can filter the campaign list by any of the 5 strict states.
- **SC-003**: Campaign attribution data (sales/members) is visible in the detail view without navigating to reports.
