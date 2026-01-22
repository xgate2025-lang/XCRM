# Implementation Plan: Wizard-Settings Integration

**Branch**: `024-wizard-settings-integration` | **Date**: 2026-01-22 | **Spec**: [spec.md](file:///Users/elroyelroy/XCRM/specs/024-wizard-settings-integration/spec.md)

## Summary

Connect Setup Wizard Steps 1 and 2 to their corresponding Settings pages. Step 1 ("Establish Identity") will navigate to Global Settings Currency tab; Step 2 ("Load Master Data") will navigate to Basic Data Stores tab. Auto-completion detection will mark subtasks complete when currency is configured or data is imported.

## Technical Context

**Language/Version**: TypeScript (React 19)  
**Primary Dependencies**: React, Tailwind CSS, Lucide React, react-router-dom (SPA navigation)  
**Storage**: LocalStorage (MockOnboardingService persistence)  
**Testing**: Browser-based manual verification  
**Target Platform**: Web browser (SPA)  
**Project Type**: Single project (Vite)  
**Performance Goals**: Navigation < 100ms, state updates < 500ms  
**Constraints**: Must work with existing MockOnboardingService and settings pages  
**Scale/Scope**: 2 onboarding steps, 3 subtasks, 2 settings pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Status | Notes |
|------|--------|-------|
| Rule 1: Vite/React 19/TypeScript | ✅ PASS | Using existing stack |
| Rule 3: Tailwind CSS + Lucide | ✅ PASS | Existing patterns |
| Rule 4: SPA Architecture | ✅ PASS | NavItemId routing |
| Rule 5: Project Structure | ✅ PASS | `src/lib/services/mock/` for service |
| Rule 8: Journal Pre-flight | ✅ PASS | No relevant recurring errors |
| Rule 9: Visual Integrity | ✅ PASS | Minor UI changes only |
| Rule 12: IA + UX Handshake | ✅ PASS | Navigation flow defined |

*PRE-FLIGHT*: Reviewed `Journal.md` - no recurring errors affect this feature.

## Project Structure

### Documentation (this feature)

```text
specs/024-wizard-settings-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/tasks command)
```

### Source Code (affected files)

```text
src/
├── lib/
│   └── services/
│       └── mock/
│           └── MockOnboardingService.ts    # [MODIFY] Update actionRoute values
├── context/
│   └── OnboardingContext.tsx               # [MODIFY] Support query params in navigation
├── pages/
│   └── settings/
│       ├── GlobalSettings.tsx              # [MODIFY] Add source detection & return button
│       └── BasicData.tsx                   # [MODIFY] Add source detection & return button
└── App.tsx                                 # [REVIEW] Verify routing supports params
```

## Proposed Changes

### Component 1: Onboarding Service Updates

#### [MODIFY] [MockOnboardingService.ts](file:///Users/elroyelroy/XCRM/src/lib/services/mock/MockOnboardingService.ts)

- Update Step 1 (identity) `actionRoute` from `'setting'` to `'settings-global'`
- Update Step 2 (tier_method) `actionRoute` from `'setting'` to `'settings-basic'`

---

### Component 2: Navigation Enhancement

#### [MODIFY] [OnboardingContext.tsx](file:///Users/elroyelroy/XCRM/src/context/OnboardingContext.tsx)

- Update `navigateToMission()` to pass `?source=onboarding` as navigation payload
- Enable settings pages to detect onboarding source for contextual UI

---

### Component 3: Settings Page Integration

#### [MODIFY] [GlobalSettings.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/GlobalSettings.tsx)

- Detect `?source=onboarding` from navigation context
- Add "Return to Dashboard" button when accessed from onboarding
- Default to Currency tab when source is onboarding

#### [MODIFY] [BasicData.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/BasicData.tsx)

- Detect `?source=onboarding` from navigation context
- Add "Return to Dashboard" button when accessed from onboarding
- Default to Stores tab when source is onboarding

---

### Component 4: Auto-Completion Detection (Optional P2)

Add optional hooks to detect when currency is configured or data is imported, enabling automatic subtask completion. This can be implemented in Phase 2 if time permits.

## Verification Plan

### Automated Tests
- Browser verification: Click Step 1 → verify navigation to Global Settings Currency tab
- Browser verification: Click Step 2 → verify navigation to Basic Data Stores tab
- Browser verification: Return to Dashboard → verify progress updates

### Manual Verification
1. Start app fresh (reset onboarding)
2. Click Step 1 "Go to Settings" → confirm `/settings-global` with Currency tab
3. Click "Return to Dashboard" → confirm navigation back
4. Click Step 2 "Import Data" → confirm `/settings-basic` with Stores tab
5. Import a store → return to Dashboard → verify subtask checked
