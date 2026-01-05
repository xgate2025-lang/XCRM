# Feature Specification: Day Zero Onboarding Redesign

**Feature Branch**: `001-onboarding-redesign`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "redesign for ## 2. State A: The 'Day Zero' Onboarding (The Setup Hero) based on the IA.md and UF.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The First Encounter (Priority: P1)

New users logging in for the first time are presented with the "State A" Dashboard, featuring the Onboarding Carousel as the primary "Hero" element.

**Why this priority**: Sets the initial impression and establishes the "Quest Line" mental model for the user, guiding them immediately into value-creation actions.

**Independent Test**: Can be tested by creating a new tenant account and verifying the initial dashboard state, ensuring the Carousel is centered, Card 1 is active, and progress starts at 10%.

**Acceptance Scenarios**:

1. **Given** a new user logs in, **When** the dashboard loads, **Then** the Onboarding Carousel is the focused element (State A).
2. **Given** the carousel is visible, **When** viewing Card 1 ("Establish Identity"), **Then** it is visually highlighted, while Cards 2 and 3 are visible ("peeking") but dimmed.
3. **Given** the initial state, **When** inspecting the Progress Bar, **Then** it shows "10% Completed" and "2 of 5 missions completed" (based on account creation credit).

---

### User Story 2 - The Action Loop (The Boomerang) (Priority: P1)

Users perform setup tasks (e.g., "Establish Identity") and are guided back to the dashboard to see instant progress updates.

**Why this priority**: This is the core interaction loop ("The Loop") that builds momentum and gamifies the setup process.

**Independent Test**: Can be tested by clicking an action on a card, completing the task on the settings page, and verifying the "Return to Dashboard" guidance and subsequent dashboard update.

**Acceptance Scenarios**:

1. **Given** user is on Card 1, **When** clicking "Go to Settings", **Then** the Basic Settings page opens with `?source=onboarding` query parameter.
2. **Given** user successfully saves settings (e.g., uploads logo), **When** save is complete, **Then** a modal appears inviting them to "Return to Dashboard".
3. **Given** user returns to dashboard, **When** page loads, **Then** Card 1 marks as "Completed" (green badge/checklist), animations trigger, and Carousel auto-scrolls to Card 2.

---

### User Story 3 - Handling Edge Cases (Skip & Partial) (Priority: P2)

Users can partially complete tasks or skip them entirely to proceed at their own pace.

**Why this priority**: Prevents users from getting stuck if they lack specific information (e.g., Logo) immediately.

**Independent Test**: Test by completing one sub-task but not all, and by explicitly clicking "Skip".

**Acceptance Scenarios**:

1. **Given** user uploads a logo but skips currency, **When** returning to dashboard, **Then** Card 1 remains active, showing partial checklist completion (`[x] Logo`, `[ ] Currency`), and DOES NOT auto-advance.
2. **Given** user is on Card 1, **When** clicking "Skip for now", **Then** Card 1 is marked "Skipped" (yellow badge), progress does NOT increase, and Carousel advances to Card 2.
3. **Given** a skipped card, **When** user clicks the "Back" arrow later, **Then** they can return to Card 1 to complete it.

---

### User Story 4 - The Victory Lap (Completion) (Priority: P1)

Completing all 4 mission cards triggers a celebration and transitions the dashboard to "State B" (Operational).

**Why this priority**: Provides the payoff for the user's effort and unlocks the full functionality of the platform.

**Independent Test**: Can be tested by manually completing all 4 missions and verifying the final state transition.

**Acceptance Scenarios**:

1. **Given** user completes the final task on Card 4, **When** returning to dashboard, **Then** progress bar hits 100% and a success animation plays.
2. **Given** the success state, **When** animation finishes, **Then** the Carousel is replaced by a "Launchpad" view with a "Reveal Dashboard" button.
3. **Given** the Launchpad view, **When** clicking "Reveal Dashboard", **Then** the State A widget disappears, revealing the State B (Operational) Dashboard.

---

### Edge Cases

- **Session Persistence**: If a user logs out and back in mid-onboarding, the Carousel MUST remember exactly which card was focused and the state of all checklists.
- **Deep Links**: If a user navigates away via sidebar, returning to Dashboard MUST restore the Onboarding view state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the "State A" Dashboard for tenants with `< 100%` onboarding completion.
- **FR-002**: The Onboarding Widget MUST consist of a Global Progress Header and a Carousel of 4 Mission Cards (Foundation, Currency, Hierarchy, Launch).
- **FR-003**: The Carousel MUST display one active card centered, with adjacent cards partially visible ("peeking") to indicate continuity.
- **FR-004**: System MUST calculate aggregate progress based on sub-task completion (not just card completion) and display it as a percentage and step counter.
- **FR-005**: Each Mission Card MUST display a dynamic checklist of sub-tasks (e.g., `[ ] Upload Logo`) that reflects real-time data from the database.
- **FR-006**: The System MUST accept `?source=onboarding` on settings pages to trigger a specific "Post-Save Modal" guiding users back to the dashboard.
- **FR-007**: The Carousel MUST automatically scroll to the next card `IF AND ONLY IF` the current card status becomes `Completed` during the detailed view update.
- **FR-008**: System MUST allow users to "Skip" cards, which visually marks them as skipped/pending but allows navigation to the next step.
- **FR-009**: The "Victory Lap" state MUST be triggered only when all 4 critical Mission Cards are fully accepted/completed.
- **FR-010**: System MUST persist the "Last Focused Card" index in the user's session or local storage to resume onboarding where they left off.

### Key Entities

- **OnboardingTracker**: Singleton entity per tenant tracking `completion_percentage`, `current_step_index`, and status of specific milestones (`logo_uploaded`, `currency_set`, etc.).
- **MissionCard**: UI Model definitions for the 4 fixed steps (Title, Description, Time Estimate, Sub-tasks list).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **100%** of new users landing on State A see the focused Onboarding Carousel.
- **SC-002**: **Return Loop Reliability**: Users clicking "Go to Settings" and saving are prompted to return to dashboard **100%** of the time.
- **SC-003**: **Visual Feedback**: Progress bar and card checklist updates appear within **< 500ms** of dashboard load/refresh.
- **SC-004**: **Completion**: Users can successfully unlock "State B" dashboard by completing all 4 missions.

## Assumptions

- "State B" (Operational Dashboard) view components exist or are handled separately.
- The underlying API endpoints for saving Tenant Settings (Logo, Currency, Tiers) already exist.
- We are using the existing authentications system; no new auth work is required.

## Clarifications

### Session 2026-01-05

- Q: How should we interact with the backend APIs for onboarding save actions? → A: **Build Mock Services** (Frontend Only). We will implement a strictly typed client-side `MockOnboardingService` to simulate API delays and errors, allowing full UX verification without immediate backend dependencies.
- Q: How should we persist the "Last Focused Card" index? → A: **LocalStorage** (Namespaced). We will use `xcrm:onboarding:last_card:{userId}` to store the state client-side, ensuring it survives browser restarts without requiring new backend schema.
