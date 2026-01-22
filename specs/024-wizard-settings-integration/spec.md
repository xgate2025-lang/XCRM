# Feature Specification: Wizard-Settings Integration

**Feature Branch**: `024-wizard-settings-integration`  
**Created**: 2026-01-22  
**Status**: Draft  
**Input**: User description: "Connect Setup Wizard Steps 1 and 2 to Settings pages: Step 1 for Timezone & Currency, Step 2 for Store and Product Import"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Step 1: Set Timezone & Currency (Priority: P1)

A new user on the Day Zero Onboarding Dashboard clicks "Go to Settings" on Step 1 ("Establish your Identity") and is navigated directly to the Global Settings page where they can set the timezone and currency. Upon completion, the onboarding progress updates automatically.

**Why this priority**: Step 1 is the first action in the onboarding journey and must work correctly to establish user confidence and set the foundation for subsequent steps.

**Independent Test**: Can be tested by clicking the Step 1 action button on the Onboarding Carousel and verifying navigation to Global Settings with the Currency tab active. Setting a currency and returning to Dashboard should show the subtask as complete.

**Acceptance Scenarios**:

1. **Given** user is on the Onboarding Dashboard with Step 1 active, **When** clicking "Go to Settings", **Then** the user navigates to `/settings-global` with the Currency tab active.
2. **Given** user is on Global Settings Currency tab, **When** a valid currency is already configured (default THB), **Then** the "Set Timezone & Currency" subtask can be marked complete.
3. **Given** user adds or modifies a currency, **When** returning to Dashboard, **Then** the Step 1 subtask "Set Timezone & Currency" shows as complete (checked).
4. **Given** Step 1's only subtask is complete, **When** viewing the Dashboard, **Then** Step 1 card shows as "Completed" and the Carousel auto-advances to Step 2.

---

### User Story 2 - Complete Step 2: Import Store List (Priority: P1)

A new user on Step 2 ("Load Master Data") clicks "Import Data" and is navigated to the Basic Data page where they can import their store list. Upon successful import, the corresponding subtask updates automatically.

**Why this priority**: Without store data, subsequent features like point redemption and campaign targeting cannot function meaningfully.

**Independent Test**: Can be tested by clicking Step 2 action button, navigating to Basic Data Stores tab, importing a store CSV, and verifying the subtask completion on Dashboard.

**Acceptance Scenarios**:

1. **Given** user is on the Onboarding Dashboard with Step 2 active, **When** clicking "Import Data", **Then** the user navigates to `/settings-basic` with the Stores tab active.
2. **Given** user is on Basic Data Stores tab, **When** clicking "Import" and successfully uploading a store CSV, **Then** the stores appear in the list and the import is saved.
3. **Given** user has imported at least one store, **When** returning to Dashboard, **Then** the Step 2 subtask "Import Store List" shows as complete (checked).

---

### User Story 3 - Complete Step 2: Import Product Catalog (Priority: P1)

Continuing from Step 2, the user imports their product catalog to complete the second subtask of the master data loading mission.

**Why this priority**: Product data is essential for coupon and campaign creation, which are later steps in the onboarding journey.

**Independent Test**: Can be tested by navigating to Basic Data Products tab, importing a product CSV, and verifying subtask completion.

**Acceptance Scenarios**:

1. **Given** user is on Basic Data page, **When** switching to Products tab and clicking "Import", **Then** the Import Wizard opens for product CSV upload.
2. **Given** user successfully imports products, **When** the import completes, **Then** the products appear in the Product list.
3. **Given** user has imported at least one product, **When** returning to Dashboard, **Then** the Step 2 subtask "Import Product Catalog" shows as complete (checked).
4. **Given** both Step 2 subtasks are complete (stores and products), **When** viewing the Dashboard, **Then** Step 2 card shows as "Completed" and Carousel auto-advances to Step 3.

---

### User Story 4 - Deep Link Navigation with Source Tracking (Priority: P2)

When navigating from the onboarding wizard, the system passes a `?source=onboarding` query parameter to enable contextual UI hints and "Return to Dashboard" prompts.

**Why this priority**: Enhances user experience by making the connection between onboarding and settings pages explicit, but the core functionality works without it.

**Independent Test**: Can be tested by clicking action buttons and verifying URL parameters and contextual UI elements.

**Acceptance Scenarios**:

1. **Given** user clicks "Go to Settings" from Step 1, **When** the Global Settings page loads, **Then** the page receives navigation payload with `source: 'onboarding'` and `tab: 'currency'`, opening the Currency tab.
2. **Given** user clicks "Import Data" from Step 2, **When** the Basic Data page loads, **Then** the page receives navigation payload with `source: 'onboarding'` and `tab: 'stores'`, opening the Stores tab.
3. **Given** user is on a settings page with `source === 'onboarding'` in payload, **When** viewing the page, **Then** a "Return to Dashboard" button becomes visible.

---

### Edge Cases

- **No Data Imported Yet**: If user navigates to Basic Data but doesn't import anything, returning to Dashboard should show subtasks as incomplete.
- **Partial Completion**: If user imports stores but not products, only the stores subtask should be marked complete.
- **Re-visiting Completed Steps**: User should be able to navigate back to completed settings pages to make changes without affecting completion status.
- **Browser Refresh**: Navigation state and source parameter should persist across page refreshes within the same session.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST update `MockOnboardingService` Step 1 (identity) to route to `settings-global` NavItemId instead of generic `setting`.
- **FR-002**: System MUST update `MockOnboardingService` Step 2 (tier_method) to route to `settings-basic` NavItemId instead of generic `setting`.
- **FR-003**: System MUST pass navigation payload with `source` and `tab` fields to enable direct tab navigation on settings pages.
- **FR-004** *(P2 - Deferred)*: System SHOULD detect when user has configured currency data and mark the Step 1 subtask (`set_timezone`) as completable. *(MVP uses manual toggle)*
- **FR-005** *(P2 - Deferred)*: System SHOULD detect when user has imported store data (at least 1 store exists) and mark Step 2 subtask (`import_stores`) as complete. *(MVP uses manual toggle)*
- **FR-006** *(P2 - Deferred)*: System SHOULD detect when user has imported product data (at least 1 product exists) and mark Step 2 subtask (`import_products`) as complete. *(MVP uses manual toggle)*
- **FR-007**: The navigation handler MUST support parsing tab parameters from `actionRoute` to open the correct tab on settings pages.
- **FR-008**: System MUST provide a visual indicator or button to "Return to Dashboard" when accessed via onboarding source.

### Key Entities

- **MissionData**: Existing type in `MockOnboardingService` containing `actionRoute` that maps to NavItemId for navigation.
- **OnboardingState**: Tracks subtask completion status (`set_timezone`, `import_stores`, `import_products`).
- **GlobalSettingsContext**: Provides currency data to determine Step 1 completion eligibility.
- **BasicDataService**: Provides store and product counts to determine Step 2 completion eligibility.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users clicking Step 1 "Go to Settings" are navigated to Global Settings Currency tab **100%** of the time.
- **SC-002**: Users clicking Step 2 "Import Data" are navigated to Basic Data Stores tab **100%** of the time.
- **SC-003**: Onboarding progress updates within **500ms** of returning to Dashboard after completing a settings action.
- **SC-004**: Users can complete Steps 1 and 2 of onboarding entirely through the wizard-to-settings flow without needing to manually navigate.
- **SC-005**: Step completion status persists correctly across browser sessions (LocalStorage persistence).

## Assumptions

- The Global Settings page with Currency tab is fully functional and can display/add currencies.
- The Basic Data page with Store and Product import functionality is fully implemented.
- `MockOnboardingService` subtask toggle mechanism (`debugToggleSubtask`) works correctly for marking subtasks complete.
- The existing navigation system in `App.tsx` correctly handles NavItemId routing.
- LocalStorage persistence for onboarding state is already implemented.

## Clarifications

### Session 2026-01-22

- Q: Should timezone selection be part of Step 1? → A: The current implementation focuses on currency setup only. Timezone is noted in the label but the currency configuration is the actionable item. Timezone can be addressed in a future enhancement if needed.
- Q: How to determine "completion" of currency setup? → A: If at least one currency exists in the system (default THB is pre-configured), consider it complete. User confirmation or explicit save action triggers completion.
