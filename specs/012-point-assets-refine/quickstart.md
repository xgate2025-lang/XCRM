# Quickstart: Point Assets Tab Refinement

**Feature**: `012-point-assets-refine`
**Prerequisites**: Member with point history (Packets and Ledger data).

## 1. Setup

### 1.1. Start the Application
```bash
npm run dev
```

### 1.2. Navigate to Feature
1. Open Browser to `http://localhost:5173` (or configured port).
2. Login (if required) or bypass to Dashboard.
3. Click **Members** in the sidebar.
4. Select any member from the list (e.g., "Elroy").
5. Click the **Point Assets** tab (Icon: `Coins`).

## 2. Validation Steps

### 2.1. Verify Summary Stats
- [ ] Confirm 4 distinct cards: **Available Balance**, **Lifetime Earned**, **Total Used**, **Total Expired**.
- [ ] Verify icons and colors match IA (Primary, Green, Blue, Slate).
- [ ] Check for **Expiration Alert** banner if points are expiring within 30 days.

### 2.2. Verify Detail View (Points Detail)
1. Ensure default view is **Points Detail** (Segmented Control).
2. [ ] Check Columns: `Detail ID`, `Total Value`, `Remaining`, `Earned Time`, `Expiry Time`, `Source`, `Remarks`.
3. [ ] Verify **Expiry Time** shows Amber color for points expiring < 30 days, Red for expired.
4. [ ] Test **Search Filter** (searches ID/Source/Remarks).
5. [ ] Test **Earned Date Filter** (date range inputs).

### 2.3. Verify Ledger View (Points Ledger)
1. Click **Points Ledger** on the segmented control.
2. [ ] Check Columns: `Type`, `Value`, `Pre-bal`, `Post-bal`, `Time`, `Source`, `Remarks`.
3. [ ] Verify **Type** column shows badge with TrendingUp (green) or TrendingDown (red) icon.
4. [ ] Verify **Value** column shows Green `+` for earnings and Red `-` for spendings.
5. [ ] Test **Search Filter** (searches Type/Source/Remarks).
6. [ ] Test **Type Filter** (Select "Earn" -> Only positive transactions should appear).
7. [ ] Test **Date Range Filter** (filter transactions by time period).

### 2.4. Verify Pagination & Sorting
- [ ] Verify pagination controls appear when more than 10 items exist.
- [ ] Test sorting by clicking column headers (Total Value, Earned Time in Packets; Value, Time in Ledger).
- [ ] Confirm page navigation works correctly (Previous/Next buttons).

### 2.5. Verify Responsive/Edge Cases
- [ ] Shrink window: Table should scroll horizontally without breaking layout.
- [ ] Select a member with 0 points: Should show "No point packets available" and "No point transactions recorded" empty states.
- [ ] Apply filters with no matching results: Should show "No packets/transactions match your search criteria" message.
