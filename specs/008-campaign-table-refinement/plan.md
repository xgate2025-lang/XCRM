# Implementation Plan: Campaign Table Refinement

**Branch**: `008-campaign-table-refinement` | **Date**: 2026-01-06 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/008-campaign-table-refinement/spec.md)

## Summary
Refine the Campaign List page to support polymorphic metrics, operational safety, and a "Quick Look" drawer. Connect Zone A (Pulse Header) and Zone B (Smart Filters) to ensure a cohesive data experience where filters update summary counts and clicking summary cards applies filters.

## Technical Context
- **Language/Version**: TypeScript / React 19
- **Primary Dependencies**: `lucide-react`, Tailwind CSS, `framer-motion` (for drawer)
- **Project Type**: Frontend Vite SPA
- **Performance Goals**: Filter updates < 200ms
- **Constraints**: Maintain Style Cheat Sheet from `Journal.md` (e.g., `rounded-2xl` for lists).

## Constitution Check
- **Vite Standard**: Using `import.meta.env` for any API needs.
- **Styling**: Tailwind utility classes.
- **Lucide Iconography**: Only Lucide React icons allowed.
- **Surgical Engineering**: Only modifying `CampaignDashboard.tsx` and related components.

## Proposed Changes

### [Component] Campaign Dashboard Refinement
#### [MODIFY] [CampaignDashboard.tsx](file:///Users/elroyelroy/XCRM/src/pages/CampaignDashboard.tsx)
- Lift `activeFilter` and `searchQuery` state to be used by Zone A calculation logic.
- Rename metrics calculation to use `filteredCampaigns` instead of all `campaigns`.
- Add `selectedCampaignId` state for the new drawer.
- Implement `handleMetricClick` to set `activeFilter`.
- Update Table row click behavior to open the Quick Look drawer instead of direct navigation to editor.
- Implement `getCampaignKPI` helper for Column 4 metrics.

### [Component] Quick Look Drawer
#### [NEW] [QuickLookDrawer.tsx](file:///Users/elroyelroy/XCRM/src/components/campaign/QuickLookDrawer.tsx)
- Implementation of a slide-over drawer using `framer-motion`.
- Content: Mini scorecard (ROI/Participants), Rule summary text, and Recent activity list.
- Action: "Open Full Analytics" button.

### [Component] Operational Safety
#### [NEW] [StopConfirmationModal.tsx](file:///Users/elroyelroy/XCRM/src/components/shared/StopConfirmationModal.tsx)
- Modal requiring the user to type "STOP" to confirm campaign termination.
#### [MODIFY] [Table Action Column](file:///Users/elroyelroy/XCRM/src/pages/CampaignDashboard.tsx)
- Disable/Hide "Edit" for `Active` status.
- Show "Analytics" as primary action for `Active`.

## Verification Plan

### Manual Verification
1. **Filter Synchronization**:
   - Filter by "Reference" in search.
   - Verify Pulse Header metrics update to count only matching campaigns.
   - Click "Active" card in Pulse Header.
   - Verify table filters to active campaigns only.
2. **Polymorphic Metrics**:
   - Check "Boost Sales" row: verify "ROI" metric is visible.
   - Check "Referral" row: verify "New Members" metric is visible.
3. **Safety Check**:
   - Click "Stop" on an active campaign.
   - Verify "STOP" confirmation modal works.
4. **Quick Look**:
   - Click table row: Verify drawer opens with correct campaign data.

### Automated Tests
- No existing automated tests for this page found. Manual verification is the primary path due to mock data environment.
