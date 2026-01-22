# Tasks: Wizard-Settings Integration

**Input**: Design documents from `/specs/024-wizard-settings-integration/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Not requested - no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup ✅ COMPLETE

**Purpose**: No new project initialization needed - feature modifies existing files only.

- [x] T001 Review current navigation patterns in `src/App.tsx` and verify NavigationPayload extends correctly
- [x] T002 [P] Review current OnboardingContext navigation in `src/context/OnboardingContext.tsx`

### Phase 1 Findings

**T001 - App.tsx:**
- `NavigationPayload` interface (line 31-33) is simple and extendable
- `setCurrentPage` already accepts optional payload parameter
- Settings pages (`settings-global`, `settings-basic`) currently receive no props - need updating in Phase 3/4

**T002 - OnboardingContext.tsx:**
- `navigateToMission` (line 160-178) currently calls `navigateFn(targetPage)` without payload
- Type signature needs updating to pass `{source: 'onboarding', tab: '...'}` in Phase 2
- `setCurrentPage` in App.tsx already supports payload, so changes are compatible

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure changes that ALL user stories depend on.

**⚠️ CRITICAL**: User Story phases cannot begin until this phase is complete.

- [x] T003 Extend `NavigationPayload` interface to add `source?: 'onboarding' | 'normal'` and `tab?: string` in `src/App.tsx`
- [x] T004 Update `MockOnboardingService.ts` Step 1 (identity) `actionRoute` from `'setting'` to `'settings-global'` in `src/lib/services/mock/MockOnboardingService.ts`
- [x] T005 [P] Update `MockOnboardingService.ts` Step 2 (tier_method) `actionRoute` from `'setting'` to `'settings-basic'` in `src/lib/services/mock/MockOnboardingService.ts`

**Checkpoint**: ✅ Routes point to correct settings pages - user story implementation can now begin.

---

## Phase 3: User Story 1 - Complete Step 1: Set Timezone & Currency (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: Users clicking Step 1 "Go to Settings" navigate to Global Settings Currency tab and can return to Dashboard.

**Independent Test**: Click Step 1 action → verify `/settings-global` opens with Currency tab active → click Return → verify Dashboard loads.

### Implementation for User Story 1

- [x] T006 [US1] Update `navigateToMission()` in `src/context/OnboardingContext.tsx` to pass navigation payload with `source: 'onboarding'` and `tab: 'currency'` for identity mission
- [x] T007 [US1] Update `GlobalSettings.tsx` to accept optional `navigationPayload` prop and `onNavigate` callback in `src/pages/settings/GlobalSettings.tsx`
- [x] T008 [US1] Add `useEffect` in GlobalSettings to set `activeTab` to 'currency' when payload.tab === 'currency' in `src/pages/settings/GlobalSettings.tsx`
- [x] T009 [US1] Add "Return to Dashboard" button (visible when `source === 'onboarding'`) in `src/pages/settings/GlobalSettings.tsx`
- [x] T010 [US1] Update `renderContent()` case for 'settings-global' to pass `navigationPayload` and `onNavigate` props in `src/App.tsx`

**Checkpoint**: ✅ Step 1 flow complete - Currency tab opens, return button works.

---

## Phase 4: User Story 2 & 3 - Complete Step 2: Import Store List & Product Catalog (Priority: P1) ✅ COMPLETE

**Goal**: Users clicking Step 2 "Import Data" navigate to Basic Data Stores tab, can import data, and return to Dashboard.

**Independent Test**: Click Step 2 action → verify `/settings-basic` opens with Stores tab active → switch to Products → import data → click Return → verify Dashboard loads.

### Implementation for User Stories 2 & 3

- [x] T011 [US2] Update `navigateToMission()` in `src/context/OnboardingContext.tsx` to pass navigation payload with `source: 'onboarding'` and `tab: 'stores'` for tier_method mission
- [x] T012 [US2] Update `BasicData.tsx` to accept optional `navigationPayload` prop and `onNavigate` callback in `src/pages/settings/BasicData.tsx`
- [x] T013 [US2] Add `useEffect` in BasicData to set `activeTab` to 'stores' when payload.tab === 'stores' in `src/pages/settings/BasicData.tsx`
- [x] T014 [P] [US2] Add "Return to Dashboard" button (visible when `source === 'onboarding'`) in `src/pages/settings/BasicData.tsx`
- [x] T015 [US2] Update `renderContent()` case for 'settings-basic' to pass `navigationPayload` and `onNavigate` props in `src/App.tsx`

> **⚠️ Note**: T006 and T011 both modify `src/context/OnboardingContext.tsx`. Execute T011 immediately after T006 or merge changes in a single edit to avoid conflicts.

**Checkpoint**: ✅ Step 2 flow complete - Stores tab opens, return button works.

---

## Phase 5: User Story 4 - Deep Link Navigation with Source Tracking (Priority: P2) ✅ COMPLETE

**Goal**: Query parameters and contextual UI enhance the onboarding experience.

**Independent Test**: Navigate from onboarding → verify URL context is correct → verify conditional UI elements appear.

### Implementation for User Story 4

- [x] T016 [US4] Add visual indicator (banner or tooltip) in GlobalSettings when accessed from onboarding explaining what to do in `src/pages/settings/GlobalSettings.tsx`
- [x] T017 [P] [US4] Add visual indicator (banner or tooltip) in BasicData when accessed from onboarding explaining what to do in `src/pages/settings/BasicData.tsx`

**Checkpoint**: ✅ Deep link experience enhanced with contextual guidance.

---

## Phase 6: Polish & Cross-Cutting Concerns ✅ COMPLETE

**Purpose**: Final verification and documentation.

- [x] T018 Browser verification: Reset onboarding, click Step 1 → verify Global Settings Currency tab opens
- [x] T019 Browser verification: Click "Return to Dashboard" → verify navigation back to Dashboard
- [x] T020 Browser verification: Click Step 2 → verify Basic Data Stores tab opens
- [x] T021 [P] Browser verification: Click "Return to Dashboard" from Basic Data → verify navigation
- [x] T022 Run `quickstart.md` validation steps from `specs/024-wizard-settings-integration/quickstart.md`
- [x] T023 Update `Journal.md` with any lessons learned during implementation

### Browser Verification Checklist ✅ VERIFIED 2026-01-22

**Dev server running at: http://localhost:3000/**

**Reset onboarding state (run in browser console):**
```javascript
localStorage.removeItem('xcrm:demo_tenant:demo_user:mock_onboarding_state');
location.reload();
```

**T018-T021 Manual Verification Steps:**
1. ✅ Reset onboarding using console command above
2. ✅ On Dashboard, find Step 1 card ("Establish your Identity")
3. ✅ Click "Go to Settings" → Verify Global Settings opens with Currency tab
4. ✅ Verify blue guidance banner appears
5. ✅ Click "Return to Dashboard" → Verify navigation back
6. ✅ Navigate to Step 2 card ("Load Master Data")
7. ✅ Click "Import Data" → Verify Basic Data opens with Stores tab
8. ✅ Verify blue guidance banner appears
9. ✅ Click "Return to Dashboard" → Verify navigation back

**Checkpoint**: ✅ All verification passed - Feature complete!

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Stories 2 & 3 (Phase 4)**: Depends on Foundational (Phase 2), can run parallel to US1
- **User Story 4 (Phase 5)**: Depends on US1 and US2/3 completion
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent after Foundational - tests Step 1 navigation only
- **User Stories 2 & 3 (P1)**: Independent after Foundational - tests Step 2 navigation only
- **User Story 4 (P2)**: Optional enhancement - can ship without it

### Parallel Opportunities

- T002 and T001 can run in parallel (Setup phase)
- T004 and T005 can run in parallel (same file, different lines)
- T014 and T016/T017 can run in parallel (different files)
- Phase 3 and Phase 4 can run in parallel (different settings pages)

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tasks together where possible:
Task T004: "Update Step 1 actionRoute in MockOnboardingService.ts"
Task T005: "Update Step 2 actionRoute in MockOnboardingService.ts"
```

## Parallel Example: User Story Implementation

```bash
# Once Foundational is complete, launch US1 and US2 in parallel:
# Developer A: Phase 3 (GlobalSettings.tsx)
# Developer B: Phase 4 (BasicData.tsx)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (T003, T004, T005)
3. Complete Phase 3: User Story 1 (T006-T010)
4. **STOP and VALIDATE**: Test Step 1 flow independently
5. Deploy/demo if ready

### Full Delivery

1. Complete Setup + Foundational → Routes updated
2. Add User Story 1 → Step 1 navigation works
3. Add User Stories 2 & 3 → Step 2 navigation works
4. Add User Story 4 → Enhanced guidance banners
5. Polish → Verification and documentation

---

## Notes

- This feature has NO new files - all modifications to existing code
- Total: 23 tasks across 6 phases
- Core functionality: 15 tasks (T001-T015)
- Polish/Enhancement: 8 tasks (T016-T023)
- [P] tasks can run in parallel with same-phase tasks
- Verify browser console logs: `[OnboardingContext] 🚀 Navigation Triggered`
