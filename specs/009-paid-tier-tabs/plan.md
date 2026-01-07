# Implementation Plan: Paid Tier Tabs

**Branch**: `009-paid-tier-tabs` | **Date**: 2026-01-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/009-paid-tier-tabs/spec.md`

## Summary

This feature introduces a top-level tab navigation to the **Loyalty Tier** page (`ProgramTier.tsx`). It segregates the existing tier configuration into a "Standard" tab and adds a new "Paid" tab. The "Paid" tab will display a "Coming Soon" placeholder to signal future roadmap availability to users.

## Technical Context

**Language/Version**: TypeScript 5.0+ (React 19)
**Primary Dependencies**: `react`, `lucide-react`, `tailwindcss`
**State Management**: Local React State (`useState`)
**Styling**: Tailwind CSS (Utility classes)
**Target Platform**: Web (Responsive)

## Constitution Check

- [x] **Tech Stack**: Uses React + Tailwind + Lucide as mandated.
- [x] **Routing**: No new routes; modifies existing `program-tier` page state.
- [x] **Visual Integrity**: Tabs will match existing `PointsWizard` style for consistency.
- [x] **IA Integrity**: Preserves existing functionality within the "Standard" tab.
- [x] **Safe AI**: No AI Service calls involved in this UI-only change.
- [x] **Complexity**: Simple state switch, no complex reducers needed.

*PRE-FLIGHT*: Checked `Journal.md`. No relevant regressions found for simple UI tabs.

## Project Structure

### Documentation

```text
specs/009-paid-tier-tabs/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── checklists/
└── tasks.md             
```

### Source Code

```text
src/
└── pages/
    └── ProgramTier.tsx  # [MODIFY] Add Tab State and Navigation
```

## Proposed Changes

### UI Component: `ProgramTier.tsx`

#### 1. Add Tab State
- Introduce `activeTab` state: `'standard' | 'paid'`.
- Default to `'standard'`.

#### 2. Insert Tab Navigation
- Place tab controls below the Header (Zone A).
- Use Tailwind styling consistent with `PointsWizard.tsx` tabs (underline style).
- Icons: `Layers` for Standard, `Crown` (or similar premium icon) for Paid.

#### 3. Content Segregation
- **Standard Tab**: Wrap existing Zone B (Narrative Hero) and Zone C (Matrix) in a conditional render (`activeTab === 'standard'`).
- **Paid Tab**: Create a new placeholder view container (`activeTab === 'paid'`).
  - Content: "Paid Memberships Coming Soon".
  - Visuals: Hero section similar to Standard but with "Premium" copy and styling.

## Verification Plan

### Automated Tests
*None for this UI-only change. Logic is trivial state switching.*

### Manual Verification
1.  **Navigate to Loyalty Tier**:
    - Go to `http://localhost:5173/` (or current dev port).
    - Click "Loyalty Program" > "Tier System".
2.  **Verify Initial State**:
    - Confirm "Standard" tab is active.
    - Confirm existing Tier Matrix and Hero are visible.
3.  **Switch Tabs**:
    - Click "Paid" tab.
    - Confirm content area clears existing matrix.
    - Confirm "Coming Soon" placeholder appears.
4.  **Switch Back**:
    - Click "Standard" tab.
    - Confirm original content is restored without state loss.
