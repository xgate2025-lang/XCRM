# Data Model: Wizard-Settings Integration

**Feature**: `024-wizard-settings-integration`  
**Date**: 2026-01-22

## Overview

This feature requires minimal data model changes. The primary modification is extending the existing `NavigationPayload` interface to support source tracking and tab selection.

---

## Existing Entities (No Changes Required)

### MissionData
**Location**: `src/lib/services/mock/MockOnboardingService.ts` (lines 22-101)

```typescript
interface MissionData {
  id: MissionId;
  title: string;
  description: string;
  tag: string;           // e.g., "Step 1"
  timeEstimate: string;  // e.g., "⏱️ 2 mins"
  actionLabel: string;   // e.g., "Go to Settings"
  actionRoute: string;   // NavItemId - THIS WILL BE UPDATED
  isSkipped: boolean;
  isComplete: boolean;
  subtasks: { id: string; label: string; isDone: boolean }[];
}
```

**Changes**: Only the `actionRoute` string values will be updated:
- Step 1 (identity): `'setting'` → `'settings-global'`
- Step 2 (tier_method): `'setting'` → `'settings-basic'`

---

### OnboardingState
**Location**: `src/types.ts`

No changes required. Existing structure supports all requirements.

---

## Modified Entities

### NavigationPayload
**Location**: `src/App.tsx` (lines 31-33)

**Current**:
```typescript
interface NavigationPayload {
  id?: string;
}
```

**Proposed**:
```typescript
interface NavigationPayload {
  id?: string;
  source?: 'onboarding' | 'normal';  // Where navigation originated
  tab?: string;                       // Target tab to open
}
```

**Rationale**: Enable settings pages to detect onboarding context and open correct tab.

---

## State Transitions

### Onboarding Mission Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Mission State Machine                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [PENDING]  ──── Skip ────>  [SKIPPED]                         │
│       │                           │                              │
│   Navigate                     Resume                            │
│       │                           │                              │
│       v                           v                              │
│  [IN_PROGRESS] ──────────────────>                              │
│       │                                                          │
│   Complete All                                                   │
│   Subtasks                                                       │
│       │                                                          │
│       v                                                          │
│  [COMPLETED]                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Navigation Flow

```
┌──────────────┐    navigateToMission()   ┌──────────────────┐
│   Dashboard  │ ───────────────────────> │  Settings Page   │
│  (Onboarding │       with payload:      │  (Global/Basic)  │
│   Carousel)  │   {source:'onboarding',  │                  │
└──────────────┘    tab:'currency'}       └──────────────────┘
       ^                                          │
       │                                          │
       │         onNavigate('dashboard')          │
       └──────────────────────────────────────────┘
               "Return to Dashboard" click
```

---

## Validation Rules

1. **actionRoute**: Must be a valid `NavItemId` from the union type
2. **source**: Optional, only 'onboarding' or 'normal' allowed
3. **tab**: Optional string matching a valid tab ID in the target page

---

## No New Entities Required

This feature uses existing data structures with minor extensions. No new entities, services, or contexts need to be created.
