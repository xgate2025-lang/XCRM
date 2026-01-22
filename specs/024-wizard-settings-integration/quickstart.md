# Quickstart: Wizard-Settings Integration

**Feature**: `024-wizard-settings-integration`  
**Date**: 2026-01-22

## Prerequisites

- Node.js 18+
- XCRM development environment set up
- Dev server running (`npm run dev`)

## Quick Verification Steps

### 1. Reset Onboarding State

Open browser console and run:
```javascript
localStorage.removeItem('xcrm:demo_tenant:demo_user:mock_onboarding_state');
location.reload();
```

### 2. Test Step 1 Navigation

1. On Dashboard, locate the Onboarding Carousel
2. Find Step 1 card ("Establish your Identity")
3. Click "Go to Settings" button
4. **Expected**: Navigate to Global Settings with Currency tab active
5. Look for "Return to Dashboard" button (if implemented)

### 3. Test Step 2 Navigation

1. Return to Dashboard (click logo or Return button)
2. Navigate to Step 2 card ("Load Master Data")
3. Click "Import Data" button
4. **Expected**: Navigate to Basic Data with Stores tab active

### 4. Verify Subtask Completion

1. On Basic Data > Stores tab, click "Import"
2. Import any CSV with store data
3. Return to Dashboard
4. **Expected**: Step 2 "Import Store List" subtask shows as checked

## File Changes Summary

| File | Change |
|------|--------|
| `MockOnboardingService.ts` | Update `actionRoute` values |
| `OnboardingContext.tsx` | Pass navigation payload |
| `GlobalSettings.tsx` | Handle onboarding source |
| `BasicData.tsx` | Handle onboarding source |

## Troubleshooting

### Navigation Not Working
- Check browser console for `[OnboardingContext] 🚀 Navigation Triggered` logs
- Verify `actionRoute` values match valid `NavItemId` types

### Return Button Not Showing
- Ensure navigation payload includes `source: 'onboarding'`
- Check `GlobalSettings.tsx` / `BasicData.tsx` for payload handling

### Progress Not Updating
- Refresh Dashboard to trigger `refreshState()`
- Check LocalStorage for `mock_onboarding_state` key
