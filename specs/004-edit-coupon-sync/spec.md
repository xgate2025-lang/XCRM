# Feature Specification: Sync Edit Coupon with Add Coupon Full Page

**Feature Branch**: `004-edit-coupon-sync`  
**Created**: 2026-01-06  
**Status**: Draft  
**Input**: User description: "Sync edit/view coupon with add coupon full page. Sync the edit coupon (old - modal) with add coupon (new - full page)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full Page Coupon Editing (Priority: P1)

As a Marketing Manager, I want to edit an existing coupon using the same immersive, multi-step interface I use to create coupons, so that I have a consistent experience and can easily manage complex coupon configurations.

**Why this priority**: Essential for UI consistency and feature parity. The current modal is too limited for the expanded coupon data model introduced in the "Add Coupon" refactor.

**Independent Test**: Navigate to the Coupon Library, click "Edit" on a coupon, and verify it opens a full-page wizard with pre-populated data.

**Acceptance Scenarios**:

1. **Given** I am on the Coupon Library page, **When** I click the "Edit" icon on a coupon row, **Then** I should be navigated to a full-page editor matching the "Create Coupon" layout.
2. **Given** I am in the Full Page Editor, **When** I view the sections (Essentials, Lifecycle, etc.), **Then** all fields should be pre-populated with the coupon's current data.
3. **Given** I have modified a field in the editor, **When** I click "Save & Exit", **Then** the changes should be persisted, and I should be returned to the Coupon Library.
4. **Given** I am editing a coupon, **When** I click "Discard Changes", **Then** I should be returned to the library without any changes being saved.

---

### User Story 2 - Integrated Live Preview (Priority: P2)

As a user editing a coupon, I want to see a live preview of the changes I'm making in real-time on the right side of the screen, just like in the "Create Coupon" flow.

**Why this priority**: High value for user confidence during editing.

**Independent Test**: Change the discount value while editing a coupon and observe the Live Preview updating immediately.

**Acceptance Scenarios**:

1.  **Given** the Coupon Editor is open, **When** I update the discount value or type, **Then** the "Live Member Experience" preview on the right should reflect the change instantly.

---

## Assumptions

-   **A-001**: The full-page editor will use the existing `CouponWizardProvider` and `CouponWizardContext` to manage state.
-   **A-002**: Data persistence will continue to use `MockCouponService` and `localStorage`.
-   **A-003**: The `Coupon` type defined in `src/types.ts` covers all fields required for the full-page editor.

### Edge Cases

-   **What happens when the coupon ID is invalid?** The system should show an error or redirect back to the library if a user manually enters an invalid ID in the URL.
-   **How does the system handle "Live" coupons?** Certain fields (like code strategy) might need to be read-only if the coupon is already Live to prevent corruption of existing redemptions (to be clarified).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a full-page editing interface for coupons that is visually identical to the "Create Coupon" page.
- **FR-002**: System MUST load existing coupon data into the `CouponWizardContext` when the editor is opened.
- **FR-003**: System MUST support the same section-based navigation (Essentials, Lifecycle, Guardrails, Inventory, Distribution) as the creation flow.
- **FR-004**: System MUST allow users to save modifications and return to the Coupon Library.
- **FR-005**: System MUST provide a way to cancel editing and return to the library without saving.
- **FR-006**: System MUST update the Live Preview in real-time during editing.
- **FR-007**: System MUST replace the current small modal with this new full-page experience when "Edit" is clicked.

### Key Entities *(include if feature involves data)*

- **Coupon**: Represents the digital value asset (Cash, Percentage, SKU, Shipping) with its lifecycle, guardrails, and distribution rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% UI consistency between the "Add Coupon" and "Edit Coupon" paths (headers, sidebar, sections, preview).
- **SC-002**: No data loss when transitioning from the library list into the full-page editor and back.
- **SC-003**: Navigation from Library to Editor completes in under 300ms.
