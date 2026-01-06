# Quickstart Validation: Campaign Refinement

**Goal**: Verify the new Campaign metrics, persistence, and creation flows.

## 1. Environment Setup
- Ensure dependencies are installed: `npm install`
- Start dev server: `npm run dev`

## 2. Persistence Verification (Smoke Test)
1. Navigate to **Campaigns**.
2. Note the number of campaigns.
3. Reload the page (Cmd+R).
4. **Pass**: The number of campaigns remains the same (Data is persisting via Mock Service).

## 3. List Page Verification
1. Check the top summary bar.
   - **Pass**: Shows "Active Campaigns", "Cumulative Participants", "Attributed Sales".
2. Click the **Filter** dropdown.
   - **Pass**: Options are strictly `Draft`, `Running`, `Pause`, `Finish`, `Stop`.
3. Locate a **Running** campaign (e.g., "Summer Sale").
   - **Pass**: "Priority" column is GONE.
   - Click "Context Menu" (...): **Pass**: Shows "Pause" and "End".

## 4. Creation Flow Verification
1. Click **+ Create Campaign**.
2. Select **Boost Sales** template.
3. Scroll to **Scope / Targeting**.
   - **Pass**: "Participating Stores" allows selecting multiple stores.
   - **Pass**: "Member Levels" allows selecting multiple tiers.
4. Find **Stacking Rules**.
   - Toggle "Allow Stacking" to ON.
   - **Pass**: UI shows a warning or list of potential overlaps.
5. Click **Draft** or **Save**.
6. Go back to List, then click **Edit** on the new campaign.
   - **Pass**: Store/Tier selections and Stacking toggle are preserved.

## 5. Analytics Verification
1. Open a **Spending** campaign (e.g., "Summer Sale").
   - **Pass**: Dashboard shows "ROI" card.
2. Open a **Referral** campaign (e.g., "Referral Drive").
   - **Pass**: Dashboard shows "New Members" card.
