# Data Model: Coupon Management Update

**Branch**: `020-coupon-ia-update`

## 1. Entities

### `CouponTemplate` (New)
Defines the rules and configuration for a coupon.

```typescript
type CouponType = 'cash' | 'percentage' | 'sku' | 'shipping';

interface CouponTemplate {
  id: string; // Unique ID (e.g., COUP-001)
  
  // Essentials
  name: string;
  identifier: string; // Human readable ID (e.g., SUMMER-SALE)
  description?: string;
  type: CouponType;
  value: number; // For cash/percentage
  productText?: string; // For SKU type
  imageUrl?: string;
  termsConditions?: string;

  // Lifecycle
  validityMode: 'dynamic' | 'fixed';
  validityDays?: number; // For dynamic (duration)
  validityDelay?: number; // For dynamic (activation delay)
  startDate?: string; // ISO Date (for fixed)
  endDate?: string; // ISO Date (for fixed)
  
  // Restrictions
  minSpend?: number;
  isStackable: boolean;
  maxPerTransaction?: number;
  storeScope: 'all' | 'specific';
  storeIds?: string[]; // If specific
  
  // Inventory
  totalQuotaType: 'unlimited' | 'capped';
  totalQuota?: number;
  codeStrategy: 'random' | 'custom' | 'unique';
  customCode?: string; // For custom strategy
  
  // Distribution
  userQuotaType: 'unlimited' | 'capped';
  userQuota?: number; // Max per member
  userQuotaTimeframe?: 'lifetime' | 'year' | 'month';
  channels: ('public_app' | 'points_mall' | 'manual_issue')[];
  
  status: 'draft' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

## 2. Component State

### `CouponWizardState`
Manages the form data and navigation step.

```typescript
interface CouponWizardState {
  currentStep: number; // 1-5
  template: Partial<CouponTemplate>;
  validationErrors: Record<string, string>; // Field -> Error
  steps: {
    [key: number]: {
      isComplete: boolean;
      hasError: boolean;
    };
  };
}
```
