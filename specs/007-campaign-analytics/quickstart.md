# Quickstart: Campaign Analytics

## Prerequisites

- Node.js 18+
- npm installed
- Active workspace in `XCRM`

## Running the App

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the Dev Server**:
   ```bash
   npm run dev
   ```

3. **Open the App**:
   Navigate to `http://localhost:5173`.

## Verifying the Feature

### 1. View Purchase Analytics
1. Go to the **Campaigns** top-nav item.
2. Find a campaign with type **"Boost Sales"** (or create one).
3. Click the **Analytics** (Chart) icon in the action column.
4. **Verify**:
   - URL is `/campaigns/:id/analytics`.
   - Scorecard shows **ROI** and **Sales**.
   - Chart shows **Revenue vs Cost**.
   - Ledger columns include **Linked Sales**.

### 2. View Referral Analytics
1. Go to the **Campaigns** top-nav item.
2. Find a campaign with type **"Referral"** (or create one).
3. Click the **Analytics** (Chart) icon.
4. **Verify**:
   - Scorecard shows **CPA** and **New Members**.
   - Chart shows **Signups vs Cost**.
   - Ledger columns include **Invitee**.

### 3. Drill Down
1. In the Ledger, click on a **Linked Sales** amount (purchase) or **Invitee Name** (referral).
2. **Verify**: A drawer opens with details.

## Troubleshooting

- **"No Data"**: The mock service seed data might be empty. Try clicking actions in the app to generate logs or check `MockCampaignService.ts` to ensure seed data is loading.
- **Wrong View**: Check the `type` of the campaign in the Campaign List. It must be "boost_sales" for Purchase view or "referral" for Referral view.
