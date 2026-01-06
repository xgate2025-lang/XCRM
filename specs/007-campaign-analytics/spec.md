# Feature Specification: Campaign Analytics (Polymorphic)

**Feature Branch**: `001-campaign-analytics`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "Implement Polymorphic Campaign Analytics based on provided IA and UF. Features include dynamic routing between Purchase and Referral views. Purchase View: ROI, Attributed GMV metrics, Revenue vs Cost chart, and Transaction Ledger. Referral View: CPA, New Member metrics, Signups vs Cost chart, and Referral Ledger. Common elements: Strategy Receipt accordion, Member Drill-down history. Requires specific routing logic and distinct data visualizations for each campaign type."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Campaign Analytics (Polymorphic) (Priority: P1)

As a campaign manager, I want the analytics interface to automatically adapt its metrics and layout based on the campaign goal (Purchase vs. Referral), so that I am not distracted by irrelevant data (e.g., ROI for a growth campaign).

**Why this priority**: Useability is critical. Showing sales metrics for a referral campaign or vice versa would be confusing and misleading. This is the core differentiator of the feature.

**Independent Test**: Can be tested by creating one Purchase campaign and one Referral campaign, then navigating to the analytics page for each and verifying the UI structure matches the specific type.

**Acceptance Scenarios**:

1. **Given** a "Purchase" type campaign, **When** I click "Analytics", **Then** I see the "Consumption View" with ROI and GMV metrics.
2. **Given** a "Referral" type campaign, **When** I click "Analytics", **Then** I see the "Growth View" with CPA and New Member metrics.
3. **Given** a campaign page is loading, **When** I first look at the screen, **Then** I see a skeleton loader preventing layout shift.

---

### User Story 2 - Analyze Campaign Performance (Scorecard & Charts) (Priority: P1)

As a campaign manager, I want to see a high-level scorecard and trend charts relevant to my campaign type, so that I can instantly judge if the campaign is successful (profitable or growing).

**Why this priority**: The primary purpose of an analytics dashboard is to provide immediate performance insights.

**Independent Test**: Can be tested by verifying verify that the numbers on the cards match a known data set of participation records.

**Acceptance Scenarios**:

1. **Given** the Purchase View, **When** I inspect the Scorecard, **Then** I see Card 1: ROI%, Card 2: Sales Generated ($), Card 3: Total Cost, Card 4: Participation Count.
2. **Given** the Purchase View, **When** I inspect the Chart, **Then** I see "Revenue vs. Cost" over time.
3. **Given** the Referral View, **When** I inspect the Scorecard, **Then** I see Card 1: CPA ($/Member), Card 2: New Members, Card 3: Total Cost, Card 4: Successful Referrals.
4. **Given** the Referral View, **When** I inspect the Chart, **Then** I see "New Signups vs. Cost" over time.

---

### User Story 3 - Inspect Participation Details (Ledger & Drawers) (Priority: P2)

As an auditor, I want to audit specific partcipation records and drill down into the evidence (transaction or new member profile), so that I can verify the legitimacy of the rewards issued.

**Why this priority**: Essential for trust and verification of the system's automated rewarding logic.

**Independent Test**: Can be tested by clicking on rows in the ledger and confirming the correct detailed view opens.

**Acceptance Scenarios**:

1. **Given** the Purchase View Ledger, **When** I click the "Linked Sales" value (e.g., $120.00), **Then** the Transaction Detail Drawer opens showing the receipt.
2. **Given** the Referral View Ledger, **When** I click the "Invitee" name, **Then** the Member Profile Drawer opens showing the new user's details.
3. **Given** any campaign type, **When** I click the "Strategy Receipt" header, **Then** the accordion expands to show the rule configuration summary.

---

### User Story 4 - Drill-down Member History (Priority: P3)

As a fraud analyst, I want to see a specific member's history with this campaign, so that I can spot potential abuse (e.g., someone triggering the same reward 50 times).

**Why this priority**: Adds depth for power users but basic functionality exists without it.

**Independent Test**: Can be tested by clicking a member's name and selecting "View Campaign History" from the menu.

**Acceptance Scenarios**:

1. **Given** the Participation Ledger, **When** I click a Member/Inviter's name, **Then** a context menu appears with "View Campaign History".
2. **Given** the context menu, **When** I select "View Campaign History", **Then** a modal appears summarizing their total triggers and rewards for this specific campaign.

---

### Edge Cases

- What happens when a campaign has zero participation data?
    - System should exhibit "Empty State" behavior (e.g., "No data yet" in charts, empty ledger with friendly message).
- What happens if the `Campaign.Type` is unknown or invalid?
    - System should fallback to a safe default (likely Purchase view) or show a comprehensive error message.
- How does the system handle high-volume ledgers (e.g., 10,000 rows)?
    - Ledger should support pagination or virtual scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST route `/campaigns/:id/analytics` to the analytics container, which dynamically renders the specific view based on `Campaign.Type`.
- **FR-002**: "Purchase View" MUST be displayed for campaigns with `Type = Consumption`.
- **FR-003**: "Referral View" MUST be displayed for campaigns with `Type = Referral`.
- **FR-004**: Purchase Scorecard MUST display: ROI (calc), Attributed GMV (sum), Total Liability (sum), Unique Participants (count).
- **FR-005**: Referral Scorecard MUST display: CPA (calc), New Signups (count), Total Liability (sum), Successful Referrals (count).
- **FR-006**: Both views MUST include a standardized "Strategy Receipt" (Zone B) accordion that summarizes the campaign rules.
- **FR-007**: Purchase Chart (Zone C) MUST visualize Revenue (Sales) vs. Cost (Rewards) over time.
- **FR-008**: Referral Chart (Zone C) MUST visualize Growth (Signups) vs. Cost (Rewards) over time.
- **FR-009**: Purchase Ledger (Zone D) MUST include columns: Member Info, Time, Reward Value, Linked Sales Amount, Participation Count.
- **FR-010**: Referral Ledger (Zone D) MUST include columns: Inviter Info, Time, Reward Split, Invitee Name/Link, Participation Count.
- **FR-011**: System MUST provide a "Transaction Detail Drawer" triggered by clicking the Linked Sales amount.
- **FR-012**: System MUST provide a "Member Profile Drawer" triggered by clicking the Invitee name.
- **FR-013**: System MUST provide a context menu on Member/Inviter names with an option to "View Campaign History".

### Key Entities *(include if feature involves data)*

- **Campaign**: The parent entity, determining the `Type` (Purchase/Referral) and holding the configuration/rules.
- **ParticipationLog**: A record of a successful trigger. Contains:
    - `MemberId` (Who triggered it / Inviter)
    - `NewMemberId` (If referral - Invitee)
    - `Timestamp`
    - `RewardValue` (Points/Coupons cost)
    - `LinkedTransactionId` (If purchase)
    - `AttributedSalesValue` (If purchase)
- **Transaction**: The external sales record linked to a participation log.
- **Member**: The user profile entity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tested campaigns load the correct View Variant (Purchase vs. Referral) based on their type.
- **SC-002**: Scorecard "ROI" and "CPA" calculations are accurate to within 2 decimal places compared to raw ledgers.
- **SC-003**: Users can successfully navigate from a Ledger entry to the correct Evidence Drawer (Transaction or Profile) in under 2 seconds.
- **SC-004**: The Page Load Time (LCP) for the Analytics Dashboard is under 1.5 seconds for a campaign with <1000 records.
