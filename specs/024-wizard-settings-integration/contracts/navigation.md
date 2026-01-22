# Contracts: Wizard-Settings Integration

**Feature**: `024-wizard-settings-integration`  
**Date**: 2026-01-22

## Overview

This feature does not introduce new API endpoints. All changes are internal to the frontend SPA. This document defines the internal contracts between components.

---

## Internal Contract: Navigation Payload

### Interface Definition

```typescript
// Location: src/App.tsx

export interface NavigationPayload {
  /** ID of entity being navigated to (e.g., coupon ID for edit) */
  id?: string;
  
  /** Source of navigation for contextual UI */
  source?: 'onboarding' | 'normal';
  
  /** Target tab to open on destination page */
  tab?: string;
}
```

### Usage Examples

**Step 1 Navigation (Go to Settings)**:
```typescript
// OnboardingContext.tsx
navigateFn('settings-global', { 
  source: 'onboarding', 
  tab: 'currency' 
});
```

**Step 2 Navigation (Import Data)**:
```typescript
// OnboardingContext.tsx
navigateFn('settings-basic', { 
  source: 'onboarding', 
  tab: 'stores' 
});
```

---

## Internal Contract: Settings Page Props

### GlobalSettings Component

```typescript
interface GlobalSettingsProps {
  /** Navigation payload passed from App.tsx */
  navigationPayload?: NavigationPayload;
  
  /** Callback to navigate back to dashboard */
  onNavigate?: (id: NavItemId) => void;
}
```

### BasicData Component

```typescript
interface BasicDataProps {
  /** Navigation payload passed from App.tsx */
  navigationPayload?: NavigationPayload;
  
  /** Callback to navigate back to dashboard */
  onNavigate?: (id: NavItemId) => void;
}
```

---

## Mock Service Contract

### MockOnboardingService.getOnboardingState()

**No changes** - existing contract sufficient.

### Mission actionRoute Values

| Mission ID | Current actionRoute | New actionRoute |
|------------|--------------------|-----------------| 
| identity | `'setting'` | `'settings-global'` |
| tier_method | `'setting'` | `'settings-basic'` |
| currency | `'program-point'` | *(unchanged)* |
| tiers | `'coupon-create'` | *(unchanged)* |
| launch | `'program-tier'` | *(unchanged)* |
