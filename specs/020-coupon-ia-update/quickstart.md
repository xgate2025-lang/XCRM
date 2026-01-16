# Quickstart: Coupon Management Update

**Branch**: `020-coupon-ia-update`

## Prerequisites
- Node.js & npm installed
- Project running (`npm run dev`)

## 1. Setup
No special setup required. The feature uses "Client-Side Mock" storage.

## 2. Accessing the Feature
1.  Navigate to `http://localhost:5173/coupons/new` (or click "Coupons" -> "New Coupon" in sidebar).
2.  You should see the "Create Coupon" wizard with the Vertical Accordion on the left and Live Preview on the right.

## 3. Verification Steps

### Scenario A: Create a Cash Coupon (Basic)
1.  **Essentials**: Name="Welcome Back", Type="Cash", Value="10". Click Continue.
2.  **Lifecycle**: Select "Dynamic", Duration="30 Days". Click Continue.
3.  **Restrictions**: Min Spend="50". Click Continue.
4.  **Inventory**: Random Codes, Unlimited Quota. Click Continue.
5.  **Distribution**: Select "Public App".
6.  Click "Publish".
7.  **Verify**: You are redirected to the Coupon List (or receive a success toast), and the coupon is saved in LocalStorage.

### Scenario B: Unique Codes Export
1.  Follow steps above until **Inventory**.
2.  Select "Unique Codes".
3.  Proceed to Distribution.
4.  Verify the button says "Publish & Generate CSV".
5.  Click it.
6.  **Verify**: A CSV file (e.g., `coupon-codes-[timestamp].csv`) is downloaded.
