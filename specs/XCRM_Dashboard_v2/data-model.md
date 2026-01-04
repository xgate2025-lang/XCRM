# Data Model

## Entities

### DashboardConfiguration
```typescript
interface DashboardConfiguration {
  userId: string;
  quickActions: string[]; // IDs of quick action items
  onboarding: OnboardingProgress;
  widgets: {
    setupGuide: boolean; // visible or hidden
  };
}
```

### OnboardingProgress
```typescript
interface OnboardingProgress {
  isCompleted: boolean;
  isDismissed: boolean;
  steps: {
    basicSettings: boolean;
    masterData: boolean;
    loyaltySetup: boolean;
  };
}
```

### GlobalState
```typescript
interface GlobalState {
  dateRange: {
    start: Date;
    end: Date;
    label: string; // "Last 7 Days", etc.
  };
  storeScope: string[]; // Store IDs, empty = All
}
```

## API / Service Layer (Internal)

### DashboardService (Mock)
- `getMetrics(range: DateRange, stores: string[]): DashboardMetrics`
- `saveConfig(config: DashboardConfiguration): void`
- `loadConfig(): DashboardConfiguration`
