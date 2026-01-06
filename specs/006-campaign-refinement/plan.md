# Implementation Plan: Campaign Refinement

**Branch**: `006-campaign-refinement` | **Date**: 2026-01-06 | **Spec**: [Link](spec.md)
**Input**: Feature specification from `/specs/006-campaign-refinement/spec.md`

## Summary

We will refine the Campaign module to support "spending" vs "referral" analytics, improve the list view (metrics, strict states), and enhance the creation flow (targeting, stacking). Technically, we will migrate `CampaignContext` from in-memory state to a persistent `MockCampaignService`.

## Technical Context

**Language/Version**: TypeScript / React 19
**Primary Dependencies**: `lucide-react` (icons), Tailwind CSS (styling)
**Storage**: `localStorage` (via Mock Service)
**Testing**: Manual Validation (Quickstart)
**Project Type**: Single-Page Application (SPA)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Build System**: Vite used. No Next.js patterns.
- [x] **Styling**: Tailwind utility classes only. 
- [x] **Project Structure**: Service logic isolated in `src/services/`.
- [x] **Development Workflow**: Spec-first approach followed.
- [x] **Robustness**: `try/catch` will be used in Service calls.
- [x] **Persistence**: `MockCampaignService` ensures data survives reload.

*PRE-FLIGHT*: checked `Journal.md`. Previous lesson: "Context providers that wrap pages using persistent services MUST treat those services as the source of truth." -> Applies here for `CampaignContext`.

## Project Structure

### Documentation (this feature)

```text
specs/006-campaign-refinement/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
└── tasks.md             
```

### Source Code

```text
src/
├── context/
│   └── CampaignContext.tsx       # [MODIFY] Connect to Service, update Types
├── services/
│   └── MockCampaignService.ts    # [NEW] Persistent storage logic
├── pages/
│   ├── CampaignDashboard.tsx     # [MODIFY] List view metrics, filters, actions
│   ├── CampaignEditor.tsx        # [MODIFY] Creation flow updates (stacking, targeting)
│   └── CampaignDetail.tsx        # [NEW/MODIFY] Analytics view (polymorphic)
└── types.ts                      # [MODIFY] Entity updates
```

## Proposed Changes

### 1. Data Layer (Foundational)
- **`src/types.ts`**: Add `stackable`, `targetStores`, `targetTiers`. Remove `priority`.
- **`src/services/MockCampaignService.ts`**: Create service with `localStorage` persistence.
- **`src/context/CampaignContext.tsx`**: Refactor to use `MockCampaignService` instead of `useState` array. Sync `draftCampaign` to storage.

### 2. Campaign List View
- **`src/pages/CampaignDashboard.tsx`**:
    - Update Summary Metrics (Active, Participants, Sales).
    - Update Filter Dropdown (Strict states).
    - Remove "Priority" column.
    - Update Row Actions (Resume/Pause/End).

### 3. Creation Flow
- **`src/pages/CampaignEditor.tsx`**:
    - Add "Participating Stores" multi-select.
    - Add "Member Levels" multi-select.
    - Add "Stacking Rules" boolean toggle + warning logic.

### 4. Detail View & Analytics
- **`src/pages/CampaignDetail.tsx`** (or extract from Dashboard if inline):
    - Implement polymorphic ROI cards (Spending vs Referral).
    - Implement Participation Log table.

## Verification Plan

### Automated Tests
- N/A (Project relies on manual verification per current setup).

### Manual Verification
1. **Persistence Test**: Create a campaign, reload page. Verify it remains.
2. **List Logic**:
    - Filter by "Running", verify only running campaigns show.
    - Click "Pause", verify status changes to "Paused".
3. **Creation Logic**:
    - Create a campaign with specific Stores + Stacking = True.
    - Edit it again, verify checks are preserved.
4. **Analytics**:
    - Open a "Spending" campaign -> Verify "ROI" card exists.
    - Open a "Referral" campaign -> Verify "New Members" card exists.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New Service | Persistence | In-memory state wipes data on reload, bad UX |
