# Quickstart: Coupon Flow Adjustments

## Prerequisite
Ensure dependencies are installed:
```bash
npm install
```

## Running the Coupon Wizard
1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:5173/assets/coupon`.
3. Click "Create Coupon" to enter the wizard.

## Validating New Features

### Dynamic Validity
1. In the **Lifecycle** section, select "Dynamic Duration" mode.
2. Enter a "Delay" (e.g., 2 days) and "Duration" (e.g., 30 days).
3. Save and verify the summary shows "After 2d, 30 Days Rolling".

### Product Coupons
1. In **Essentials**, select "Gift" as the Coupon Strategy.
2. Enter "Free Coffee" in the Product Name field.
3. Verify `value` defaults to 0.

### Quotas & Personal Limits
1. Go to **Guardrails** section.
2. Set "Per User" limit: 1 per 1 Month (select "per Month(s)" and enter 1).
3. Verify the example text updates to show the frequency.

### Store Restrictions
1. Go to **Distribution** section.
2. Change "Store Restrictions" from "All Stores" to "Include" or "Exclude".
3. Select specific stores and verify the selection is persisted.
