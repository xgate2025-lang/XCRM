# Quickstart: Coupon Refinement

## Introduction
This feature refines the `CreateCoupon.tsx` page into a modular, accordion-style wizard. Use this guide to verify the new implementation.

## Verification Steps

### 1. Launch the Wizard
- Navigate to **Assets** -> **Coupon Library**.
- Click **Create Coupon** (or the onboarding mission card).
- Verify you are on the new `CreateCoupon.tsx` with the Vertical Accordion layout.

### 2. Test the Accordion Flow
- Fill out **Accordion 1 (Essentials)**. 
- Click **Continue**.
- Verify:
  - Section 1 collapses and shows a summary (e.g., "$10 Cash").
  - Section 2 (Lifecycle) expands automatically.
  - The sticky **Live Preview** on the right reflects the name and value instantly.

### 3. Test Navigation Refinement (Rule 115)
- Open Section 3 (Guardrails).
- Click the **header** of Section 1.
- Verify Section 3 collapses and Section 1 expands with your previous data preserved.

### 4. Test Unique Code Strategy
- Progress to Section 4 (Inventory).
- Change **Code Strategy** to **Unique**.
- Verify the Primary Action button in the footer changes to **Publish & Generate CSV**.

### 5. Final Validation
- Click **Publish Coupon** with incomplete required fields in a collapsed section.
- Verify the wizard auto-expands the section with the error and scrolls there.

## Design Specs
- **Card Radius:** `rounded-2xl` (1rem) for dense UI components.
- **Buttons:** Slate-900 for primary, White/Slate-200 for secondary.
- **Iconography:** Lucide React icons (Ticket, Percent, Calendar, ShieldCheck, Zap).
