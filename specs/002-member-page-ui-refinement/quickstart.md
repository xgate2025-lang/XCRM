# Quickstart: Member Page UI Refinement

## Development Setup

1. **Prerequisites**:
   - Ensure you are on the `002-member-page-ui-refinement` branch.
   - Run `npm install` to ensure all dependencies (React 19, Lucide React, etc.) are available.

2. **Feature Components**:
   The refactoring splits `MemberDetail.tsx` into multiple modules. Key entry points:
   - `src/pages/MemberDetail.tsx`: Main container and tab manager.
   - `src/components/member/form/MemberForm.tsx`: New structured profile form.
   - `src/components/shared/OperationRemarks.tsx`: Shared UI for adjustments.

3. **Running the App**:
   ```bash
   npm run dev
   ```
   Navigate to the **Members** section and select a member to see the new layout.

## Verification Checklist

### 1. Member Creation
- [ ] Select "System Auto" -> Code is read-only.
- [ ] Select "Manual" -> Code is editable.
- [ ] Toggle Email Opt-in -> Date picker appears.
- [ ] Toggle SMS Opt-in -> Second date picker appears.

### 2. Asset Adjustments
- [ ] Adjust Points -> "Reason Category" dropdown is visible.
- [ ] Issue Coupon -> "Reason Category" dropdown is visible.
- [ ] Submit Adjustment -> Verify log entry in "Change Log" tab.

### 3. Order Details
- [ ] Open Order Detail -> No print/export buttons visible.
- [ ] Verify settlement breakdown matches the transaction.

### 4. Coupon Wallet
- [ ] Manual Redemption -> Verify store and time are captured.
- [ ] Manual Invalidation -> Status updates to "Invalid".
