# Feature Specification: Coupon Management Update (Accordion IA)

**Feature Branch**: `020-coupon-ia-update`
**Created**: 2026-01-16
**Status**: Draft
**Input**: Synthesized from `Coupon_IA_v3.md` (Field Requirements) and `coupon_re_IA.md` (Interaction Architecture).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Coupon via Accordion Wizard (Priority: P1)

As a Marketing Manager, I want to create a coupon using a step-by-step accordion wizard so that I can configure complex rules (validity, restrictions) without being overwhelmed by a long form.

**Why this priority**: The current form is too complex and leads to configuration errors. The accordion pattern guides the user through logical groups.

**Independent Test**:
1.  Navigate to "Coupons" > "New Coupon".
2.  Verify the page layout shows the **Vertical Accordion** on the left and **Live Preview** on the right.
3.  **Step 1 (Essentials)**: Enter Name, select Type (e.g., Cash), enter Value. Click "Continue".
    *   Verify Step 1 collapses to a Summary view.
    *   Verify Step 2 expands.
    *   Verify Live Preview updates with the name and value.
4.  **Step 2 (Lifecycle)**: Select "Dynamic" validity (e.g., 30 days). Click "Continue".
    *   Verify Summary updates to show "Valid for 30 Days".
5.  **Step 3 (Restrictions)**: Set Minimum Spend ($100) and Stacking (stackable). Click "Continue".
6.  **Step 4 (Inventory)**: Set Code Strategy (Random) and Total Quota (1000). Click "Continue".
7.  **Step 5 (Distribution)**: Select "Public". Click "Review & Publish".
8.  Verify the "Publish" action triggers final validation.

**Acceptance Scenarios**:

1.  **Given** the wizard is open, **When** I complete a section and click Continue, **Then** the next section expands and the previous one collapses into a summary.
2.  **Given** I am in a later step, **When** I click the header of a completed step (e.g., Step 1), **Then** that step re-expands for editing, saving the current state of the active step.
3.  **Given** I change the coupon Type/Value in Step 1, **Then** the Sticky Live Preview must immediately reflect the change.

---

### User Story 2 - Unique Code Generation (Priority: P2)

As a CRM Admin, I want to generate unique codes for a campaign so that I can export them for external distribution (e.g., printing).

**Why this priority**: Required for campaigns where codes are distributed via physical media or third-party partners.

**Independent Test**:
1.  In Step 4 (Inventory), select **"Unique Codes"** strategy.
2.  Complete the wizard.
3.  Verify the bottom action button changes to **"Publish & Generate CSV"**.
4.  Click "Publish & Generate CSV".
5.  Verify the coupon is created and a CSV download is triggered.

**Acceptance Scenarios**:

1.  **Given** "Unique Codes" is selected in Inventory, **Then** the primary action MUST be "Publish & Generate CSV".
2.  **Given** "Random" or "Custom" is selected, **Then** the primary action stays "Publish".

## Requirements *(mandatory)*

### Functional Requirements

#### 1. General Layout and Behavior
- **FR-001**: The specifiction uses a **Two-Column Layout**: Left Rail (Vertical Accordion) and Right Rail (Sticky Live Preview).
- **FR-002**: **Accordion Behavior**: Only one section expands at a time. Clicking "Continue" validates the current section, collapses it, and expands the next.
- **FR-003**: **Summary Mode**: Collapsed sections must display a summary of their configured values (as defined in detailed sections below).
- **FR-004**: **Edit Navigation**: Clicking a collapsed section header expands it and collapses the currently open section.

#### 2. Accordion 1: Essentials & Value (The Offer)
- **FR-005**: MUST include fields:
    - **Name**: Text Input (Required).
    - **Identifier**: Auto-generate (Default) or Custom (Unique check required).
    - **Type**: Selector [Cash / % Discount / Product or Service].
        - *Input changes based on Type*:
        - Cash: Currency Input.
        - Discount: Percentage Input (0-100).
        - Product: Text Description.
    - **Image**: File Upload (Visual asset).
    - **Description**: Text Area (Marketing copy).
    - **Terms & Conditions**: Rich Text.
- **FR-006**: **Summary View**: Display Icon, Name, Type, and Value (e.g., "Summer Sale • $10 Cash").

#### 3. Accordion 2: Lifecycle (The Timeline)
- **FR-007**: MUST include fields:
    - **Validity Mode**: Radio [Dynamic / Fixed].
    - **Dynamic Logic**: "Active [X] days after receipt, valid for [Y] days." (Default Delay: 0).
    - **Fixed logic**: Date Range Picker (Start Date to End Date).
    - **Extension**: Toggle "Extend to end of month/week" (Optional).
- **FR-008**: **Summary View**: Display Duration or Dates (e.g., "Valid for 30 Days (Rolling)" or "Jan 1 - Jan 31").

#### 4. Accordion 3: Guardrails & Stacking (Restrictions)
- **FR-009**: MUST include fields:
    - **Min Spend**: Currency Input.
    - **Stacking**: Radio [Stackable / Exclusive].
    - **Cart Limit**: Checkbox "Max 1 per transaction".
    - **Store Scope** (Exception Engine): Button to "Limit Stores". Default: All Stores.
    - **Block Dates**: Button to "Block Dates".
- **FR-010**: **Summary View**: Display Min Spend and Stacking status (e.g., "Min Spend: $100 • Stackable"). if Exceptions exist, add badge "+ Restrictions".

#### 5. Accordion 4: Inventory & Codes (The Engine)
- **FR-011**: MUST include fields:
    - **Code Strategy**: Radio [Random / Custom / Unique].
        - *Random*: System generates codes.
        - *Custom*: User defines code pattern/single code.
        - *Unique*: System generates unique codes for export.
    - **Total Quota**: Number Input or Unlimited Toggle.
    - **User Quota** (Per Person): Max [X] per [Timeframe] (e.g., 1 per All Time).
- **FR-012**: **Summary View**: Display Quota info (e.g., "1,000 Random Codes • Limit 1/User").

#### 6. Accordion 5: Distribution (The Reach)
- **FR-013**: MUST include channel selection:
    - **Public (App)**: Toggle. If ON, select Audience (e.g., Gold+, All).
    - **Points Mall**: Checkbox.
    - **Manual Issue**: Checkbox.
- **FR-014**: **Summary View**: Display selected channels (e.g., "Channels: Public (App), Manual").

#### 7. Publishing & Actions
- **FR-015**: **Footer Actions**:
    - **Save as Draft**: Always available.
    - **Primary Action**: "Publish Coupon" (or "Review & Publish").
- **FR-016**: **Unique Code Export**: If "Unique Codes" is selected in Accordion 4, Primary Action changes to "Publish & Generate CSV".

### Key Entities

- **CouponTemplate**: Defines the rules (Essentials, Lifecycle, Restrictions).
- **CouponReview**: Current state of the wizard configuration before publishing.
- **CodeInventory**: Manages the generated codes (Random/Unique).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: **Efficiency**: Users can complete the "Essentials" and "Lifecycle" steps in under 30 seconds.
- **SC-002**: **Error Recovery**: If a validation error occurs in a collapsed section during final publish, the system auto-expands that section within 1 second.
- **SC-003**: **Feedback**: The Live Preview updates within 200ms of field input changes (Name, Value, Type).
- **SC-004**: **Completeness**: 100% of defined fields in `Coupon_IA_v3` are mapped to the new Accordion sections.

## Assumptions
- The "Live Preview" is a visual representation and does not reflect exact rendering on all devices.
- "Unique Codes" generation is handled asynchronously if the batch is large, but for the MVP, the CSV download trigger is immediate.
