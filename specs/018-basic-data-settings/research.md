# Research: Basic Data Settings

**Branch**: `018-basic-data-settings` | **Date**: 2026-01-16
**Status**: Complete

## 1. Existing Architecture Analysis

### Routing
- **Current State**: `App.tsx` defines a route case `'settings-basic'` rendering `BasicData` component.
- **Component**: `src/pages/settings/BasicData.tsx` exists as a placeholder.
- **Decision**: Reuse the existing route and component. Refactor `BasicData.tsx` to serve as the layout/container for the new feature.

### Data Persistence (Mock Pattern)
- **Pattern Identified**: `src/lib/services/mock/Mock[Feature]Service.ts`.
- **Implementation**:
    - Uses `localStorage` for persistence.
    - Implements an interface (likely defined in types).
    - Exports a singleton instance.
    - Uses `loadFromStorage` and `saveToStorage` helpers (internal to the file, but should be shared if possible. *Note: They are defined inside `MockGlobalSettingsService.ts` currently. I will duplicate them or extract them to a shared utility if scope permits. For now, duplication to keep isolation is acceptable as per "Surgical Engineering" principle to avoid refactoring unrelated files, unless `LocalStorageClient.ts` works genericly.*)
- **Decision**: Create `src/lib/services/mock/MockBasicDataService.ts` implementing `IBasicDataService` (to be defined).

### Component Structure
- **Current**: `src/components/settings/` contains feature-specific folders (e.g., `GlobalSettings.tsx` is a file, but `BasicData` is complex so it needs a folder).
- **Decision**: Create `src/components/settings/BasicData/` to house:
    - `StoreList.tsx`, `StoreForm.tsx`
    - `ProductList.tsx`, `ProductForm.tsx`
    - `CategoryTree.tsx` (Recursive component)
    - `BrandList.tsx`, `BrandForm.tsx`

## 2. Technology Choices

### State Management
- **Local State**: `useState` for form handling.
- **Service Layer**: Async calls to `MockBasicDataService` which simulates network delay (optional) and persistence.
- **Shared State**: Not strictly needed unless other modules need this data immediately. If so, a Context might be needed. `spec.md` implies these are settings used elsewhere.
- **Decision**: Build the Service first. If other components need valid stores/products, they will import the singleton service. No global Context needed *yet* for purely managing these settings, unless we want to broadcast updates. *Refinement*: The Mock Service is the source of truth.

### UI Libraries
- **Icons**: `lucide-react` (standard).
- **Styling**: Tailwind CSS (standard).
- **Tree View**: Custom recursive component using Tailwind (avoid heavy 3rd party libs for simple category tree).

## 3. Unknowns & Clarifications

- **Resolved**: "Mock Service with LocalStorage persistence" is the confirmed pattern.
- **Resolved**: "App.tsx routing" is confirmed.
- **Resolved**: "Project Structure" fits into `src/pages/settings` and `src/components/settings`.

## 4. Implementation Strategy

1.  **Define Types**: `src/types.ts` (or `src/types/basicData.ts` if `types.ts` is too large. *Check `types.ts` size first.*)
2.  **Create Mock Service**: `MockBasicDataService.ts`.
3.  **Implement Components**: Bottom-up (Forms -> Lists -> Main Page).
4.  **Integration**: Wire up `BasicData.tsx`.
