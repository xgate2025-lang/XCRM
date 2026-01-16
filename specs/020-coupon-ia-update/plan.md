# Implementation Plan: Coupon Management Update

**Branch**: `020-coupon-ia-update` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-coupon-ia-update/spec.md`

## Summary

This feature implements the **Create Coupon Wizard** using a Vertical Accordion pattern. It replaces the legacy/simple form with a 5-step guided process (Essentials, Lifecycle, Restrictions, Inventory, Distribution) and a sticky Live Preview. It also introduces the `CouponTemplate` data model and "Unique Code" generation capability.

## Technical Context

**Language/Version**: TypeScript 5+ (Vite/React)
**Primary Dependencies**: React 19, Tailwind CSS, Lucide React, `react-router-dom`
**Storage**: Mock Services (`src/lib/services/mock/MockCouponService.ts`)
**Testing**: Manual Verification via Quickstaff
**Target Platform**: Browser (Desktop/Tablet)
**Performance Goals**: Instant accordion transitions (<300ms)
**Constraints**: Strict adherence to the "Accordion" interaction model (one open at a time).

## Constitution Check

*GATE: Passed*

- **Tech Stack**: Uses Vite, React 19, Tailwind. No prohibited frameworks.
- **Styling**: Uses standard Tailwind utility classes and `AccordionSection` shell.
- **IA Integrity**: Plan addresses usage of all 5 accordion steps.
- **Visual Integrity**: Live Preview component acts as the visual source of truth.
- **UI Persistence**: Wizard is a full-page experience but respects the global Layout.

## Proposed Changes

### 1. Data Layer & Types

#### [NEW] [types.ts](file:///Users/elroyelroy/XCRM/src/types.ts)
- Add `CouponTemplate` interface (as defined in data-model.md).
- Update `CouponType` to include `sku` and `shipping`.

#### [NEW] [MockCouponService.ts](file:///Users/elroyelroy/XCRM/src/lib/services/mock/MockCouponService.ts)
- Implement `getTemplates`, `getTemplateById`, `createTemplate`, `updateTemplate`.
- Access `localStorage` key `xcrm_coupon_templates`.

### 2. UI Components (Wizard)

#### [NEW] [CreateCouponPage.tsx](file:///Users/elroyelroy/XCRM/src/pages/coupon/CreateCouponPage.tsx)
- Main entry point.
- Manages `useReducer` state for the wizard.
- Renders the Layout (Left Rail + Right Rail).

#### [NEW] [WizardSteps](file:///Users/elroyelroy/XCRM/src/components/coupon/wizard/)
- `StepEssentials.tsx`: Form for Name, Type, Value, Image.
- `StepLifecycle.tsx`: Form for Validity Mode (Dynamic/Fixed).
- `StepRestrictions.tsx`: Form for Min Spend, Stacking.
- `StepInventory.tsx`: Form for Quota, Code Strategy.
- `StepDistribution.tsx`: Form for Channels.

### 3. Shared Components

#### [MODIFY] [LivePreview.tsx](file:///Users/elroyelroy/XCRM/src/components/coupon/LivePreview.tsx)
- Update to support full `CouponTemplate` props.
- Add support for "Product Text" display (SKU type).
- Add support for "Unique Code" badge.

## Verification Plan

### Automated Tests
*None (Mock Environment)*

### Manual Verification

1.  **Wizard Flow**:
    - Open `/coupons/new` (or navigate via Sidebar).
    - Complete Step 1 (Essentials) -> Verify Step 2 expands.
    - Click Step 1 Header -> Verify Step 1 re-expands.

2.  **Live Preview**:
    - Change Type to "Product" -> Verify Preview card updates.
    - Set Validity to "Dynamic" (30 days) -> Verify Preview shows "Valid for 30 Days".

3.  **Persistence**:
    - Complete all steps and click "Publish".
    - Check Browsers DevTools -> Application -> Local Storage -> `xcrm_coupon_templates`.
    - Verify new record exists.

4.  **Unique Codes**:
    - Select "Unique Codes" in Step 4.
    - Click "Publish & Generate CSV".
    - Verify CSV file downloads.
