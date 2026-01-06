# Quickstart: Verifying Edit Coupon Sync

## Prerequisites
- Feature branch: `004-edit-coupon-sync`
- Terminal 1: `npm run dev`

## Verification Flow

### 1. Verification of Navigation (P1)
1. Open the dashboard.
2. Click **Coupon** in the sidebar.
3. Observe the coupon list. 
4. Click the **Edit** (pencil) icon on an existing "Draft" or "Live" coupon.
5. **Expected**: The page transitions to a full-page wizard. The title shows "Edit Coupon".

### 2. Verification of Data Loading (P1)
1. In the Edit page, check the **Essentials** section.
2. **Expected**: The name and value match the coupon you clicked.
3. Navigate through **Lifecycle** and **Inventory**.
4. **Expected**: All existing settings are correctly populated.

### 3. Verification of Live Preview (P2)
1. Modify the **Value** in the Essentials section.
2. **Expected**: The preview card on the right updates instantly to reflect the new discount.

### 4. Verification of Persistence (P1)
1. Change the **Coupon Name**.
2. Click **Save & Exit**.
3. **Expected**: Returned to Coupon Library. The list shows the updated name.

### 5. Verification of Discard (P1)
1. Edit a coupon, change a field.
2. Click **Discard Changes** (or Back).
3. **Expected**: Returned to Library. Original data remains unchanged.
