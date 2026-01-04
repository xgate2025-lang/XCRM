# Feature Specification: Tenant Onboarding & Dashboard

**Feature Branch**: `001-tenant-dashboard`
**Created**: 2026-01-04
**Status**: Draft
**Input**: User description: "State A: The Day Zero Onboarding (New Tenant). Goal: Guide new users to set up the system. Components: Setup Guide widget. State B: Daily Operation Dashboard. Health Check metrics."

## User Scenarios & Testing

### User Story 1 - Day Zero Onboarding (Priority: P1)

As a new tenant administrator, I want to be guided through the initial system setup so that I can quickly launch my loyalty program without getting overwhelmed.

**Why this priority**: Essential for first-time user experience and adoption. Reduces support burden and time-to-value.

**Independent Test**: Can be tested by creating a fresh tenant account and verifying the presence and functionality of the Setup Guide widget.

**Acceptance Scenarios**:

1. **Given** a new tenant logs in for the first time, **When** they view the dashboard, **Then** they see the "Setup Guide" widget prominently displayed.
2. **Given** the Setup Guide widget, **When** the user clicks "Basic Settings", **Then** they are taken to the relevant settings page, and the step is marked complete upon saving.
3. **Given** the Setup Guide widget, **When** the user completes all steps (Basic Settings, Master Data Entry, Loyalty Setup), **Then** the widget disappears from the dashboard.
4. **Given** the Setup Guide widget, **When** the user clicks "Skip/Hide", **Then** the widget is removed from the dashboard view.

---

### User Story 2 - Daily Operational Intelligence (Priority: P1)

As a tenant administrator, I want a "Command Center" view that provides actionable insights with global context (time and store scope) so that I can monitor trends and respond to performance shifts immediately.

**Why this priority**: Core value proposition. Transforms the dashboard from a static report into an active management tool.

**Independent Test**: Can be tested by changing the Global Date Filter and Store Scope and verifying that all metrics and trend indicators update accurately.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** the Global Date Filter is changed (e.g., "Last 7 Days" vs "Last 30 Days"), **Then** all metrics (Core, Insights, Assets) MUST recalculate relative to that period.
2. **Given** a metric like "New Members", **When** viewed, **Then** it MUST show a Trend Indicator (e.g., +5% vs previous period) to provide context for the number.
3. **Given** the dashboard, **When** the Store Scope is modified, **Then** the view filters data to the selected stores/regions.
4. **Given** an empty section (e.g., no active campaigns), **When** viewed, **Then** it MUST present an actionable CTA (e.g., "Create Your First Campaign") rather than just a zero.

---

### User Story 3 - Customizing Quick Actions (Priority: P2)

As a tenant administrator, I want to customize my dashboard shortcuts so that I can quickly access the features I use most frequently.

**Why this priority**: Enhances user efficiency and personalization.

**Independent Test**: Can be tested by adding a new shortcut and verifying it appears in the specific user's dashboard.

**Acceptance Scenarios**:

1. **Given** the "Quick Actions" panel, **When** viewed, **Then** it shows default static links: View Members, Add Coupon, Create Campaign, View Reports.
2. **Given** the "Quick Actions" panel, **When** the user clicks "Custom Add", **Then** they can select a system page to add as a shortcut.
3. **Given** a custom shortcut is added, **When** the dashboard is reloaded, **Then** the new shortcut persists.

### Edge Cases

- **Empty State (Actionable)**: Sections with no data MUST provide a "Quick Start" CTA (e.g., "No Points Issued Yet? [Configure Points Rule]").
- **Active Member Logic**: What happens if "Active Member" criteria are not defined? (System should use a default definition or prompt user to configure it via a Dashboard Alert).
- **Time Comparison Bound**: What happens when comparing "This Year" if last year has no data? (Trend indicator should show "N/A" or "First Period").
- **Permissions**: What happens if a user tries to access a Quick Action they don't have permission for? (Shortcut should be hidden or disabled).

## Requirements

### Functional Requirements

#### Onboarding View (State A)
- **FR-001**: System MUST display a "Setup Guide" widget for tenants who have not completed setup or dismissed it.
- **FR-002**: The Setup Guide MUST track progress of three specific steps: "Basic Settings", "Master Data Entry", and "Loyalty Setup".
- **FR-003**: System MUST allow users to "Skip/Hide" the Setup Guide, persisting this preference.
- **FR-004**: System MUST automatically hide the Setup Guide when all steps are completed.

#### Operational View (State B - Command Center)
- **FR-005**: System MUST provide a **Global Context Navigator** (Date Range Picker and Store/Region Selector) that controls all dashboard data.
- **FR-006**: System MUST display "Core Business Metrics" with **Trend Indicators** (percentage change vs. previous equivalent period): New Members, First-Purchase Conversion, Repurchase Rate, Member Sales GMV, and Member AOV.
- **FR-007**: System MUST display "Member Insights": Total Scale, Active Count (based on configuration), Tier Distribution, and Sales by Tier.
- **FR-008**: System MUST allow configuration of "Active Member" definition; if unconfigured, dashboard MUST display a CTA to define it.
- **FR-009**: System MUST display "Asset Overview" with Trends: Points (Redemption Rate, Sales from Redemption, AOV) and Coupons (Usage Rate, Sales from Coupons, AOV).
- **FR-010**: System MUST display "Campaign Pulse": Number of Active Campaigns, Total Participation Count. If zero, MUST display "Create Campaign" CTA.

#### Performance & Flow
- **FR-014**: Dashboard metrics MUST be pre-calculated or cached (e.g., via hourly snapshots) for high-volume tenants to ensure the dashboard consistently loads in under 2 seconds.
- **FR-015**: When a user navigates to a drill-down page (e.g., clicking 'Campaign Pulse'), the system MUST persist and pass the current Global Context Navigator parameters (Date Range and Store Scope) to the destination page.

#### Quick Actions
- **FR-011**: System MUST provide default shortcuts: "View Members", "Add Coupon", "Create Campaign", "View Reports".
- **FR-012**: System MUST allow users to add custom shortcuts to internal system pages.
- **FR-013**: Custom shortcuts MUST be saved per user profile.

### Key Entities

- **DashboardConfiguration**: Stores user preferences for shortcuts and widget visibility.
- **MetricDefinition**: Stores rules for calculating dynamic metrics (specifically "Active Member").
- **OnboardingProgress**: Tracks completion status of setup steps for the tenant.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete the "Day Zero" setup flow (3 steps) in under 30 minutes on average.
- **SC-002**: Dashboard loads all metrics within 2 seconds for a tenant with 100k members.
- **SC-003**: 50% of daily active users engage with "Quick Actions" at least once per session.
- **SC-004**: 80% of new tenants complete the Onboarding Guide before dismissing it.
