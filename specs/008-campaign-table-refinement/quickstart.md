# Quickstart: Campaign Table Refinement

## Prerequisite
Ensure `npm run dev` is running and the `CampaignContext` is seeded with at least 3 types of campaigns (Sales, Referral, Coupon).

## Verification Steps

### 1. Zone Sync Check
- **Action**: Open Campaign Studio.
- **Action**: Click the "Running" button in Zone B.
- **Expectation**: Zone A metrics (Pulse) update to show only metrics for Running campaigns.
- **Action**: Click the "Active Campaigns" card in Zone A.
- **Expectation**: Zone B filter switches to "Running" (or "Active").

### 2. Polymorphic Table Check
- **Observation**: Scan the table rows.
- **Expectation**: A row with a "Referral" icon shows "New Members" in the Primary Metric column.
- **Expectation**: A row with a "Boost Sales" icon shows "ROI / Sales".

### 3. Quick Look Drawer
- **Action**: Click a row in the table (not on a button).
- **Expectation**: Drawer slides open from the right.
- **Expectation**: Shows a scorecard and recent activity matching that specific campaign.

### 4. Operational Safety
- **Action**: Find an "Active" campaign.
- **Action**: Try to click the "Edit" button (if visible) or navigate to `/campaign/edit/[id]`.
- **Expectation**: Modal appears: "Campaign is Live. Please Pause the campaign to make changes."
- **Action**: Click "Stop" in the meatball menu.
- **Expectation**: Confirmation modal appears requiring typing "STOP".
