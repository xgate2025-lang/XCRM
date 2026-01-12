# Quickstart: Refine Coupon Wallet Tab

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

### Scenario A: View Coupon Details
1. Open Browser to `http://localhost:5173/member/list`.
2. Click on any member to enter Member Detail.
3. Select the **Coupons** tab (My Wallet).
4. **Action**: Click the Chevron `>` or the card body of an **Active** coupon.
5. **Verify**: Modal opens. Details tab is active. All fields (Code, Name, Issue/Expiry, etc.) are visible.

### Scenario B: Manual Redemption
1. In the **Coupons** tab, find an **Active** coupon.
2. **Action**: Click **Redeem** button.
3. **Verify**:
   - Modal opens to "Redeem" tab.
   - Form fields: Store (Select), Time (Picker), Reason (Select), Notes (Text).
   - "Confirm" is disabled until Store and Reason are selected.
4. **Action**: Fill form and click **Confirm**.
5. **Verify**: Coupon status updates to **Used**. UI refreshes. Used Date/Store visible in Details.

### Scenario C: Manual Void
1. In the **Coupons** tab, find an **Active** coupon.
2. **Action**: Click **Void** button.
3. **Verify**:
   - Modal opens to "Void" tab.
   - Form fields: Reason (Select), Notes (Text).
   - "Confirm" is disabled until Reason is selected.
4. **Action**: Fill form and click **Confirm**.
5. **Verify**: Coupon status updates to **Voided**. Actions disabled.

### Scenario D: Resend Absence
1. scan all coupon cards.
2. **Verify**: No "Resend" button exists anywhere in the UI.
