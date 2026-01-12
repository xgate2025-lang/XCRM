# Quickstart: Relationship Intelligence Refinement

## Prerequisites
- Node.js & npm installed
- XCRM Repository cloned

## Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

## Functional Verification

### Scenario A: Membership Distribution (Left Widget)
1. Open Browser to `http://localhost:5173/dashboard`.
2. Scroll to **Relationship Intelligence** (Zone 2).
3. **Check Header**:
   - Verify "Membership Distribution" title.
   - Verify "Total Members" metric matches the aggregate (e.g., 12k).
   - Verify "Active Members" metric matches the aggregate (e.g., 8k) with a % rate.
4. **Interact**:
   - Hover over the **Total** bar for "Gold" tier. Tooltip should show total count.
   - Hover over the **Active** bar/line for "Gold" tier. Tooltip should show active count.
5. **Visual**: Confirm chart is a **Stacked Column** (Active stacked on Total or overlaid).

### Scenario B: Value Contribution (Right Widget)
1. In the same Zone 2 area, look at the right card.
2. **Check Header**:
   - Verify "Value Contribution" title.
3. **Visual**:
   - Confirm chart is a **Donut** or **Horizontal Bar**.
   - Confirm Legend lists all tiers (Bronze, Silver, Gold, etc.).
4. **Data Verification**:
   - Check that each legend item shows a **Sales Amount** (e.g., $50,000).
   - Check that each legend item shows a **Contribution %** (e.g., 40%).
   - Verify visually that the chart slices/bars correspond to the contribution %.

## Troubleshooting
- If widgets show "loading" indefinitely, check console for `mock-service` errors.
- If data looks flat/uniform, verify `MockDashboardService` was updated with randomized tier distributions.
