<!--
🎨 STYLE CHEAT SHEET (Visual Anchor)
=====================================
PRIMARY COLORS:
- Brand Blue: #055DDB (primary-500)
- Dark Navy:  #0F172A (slate-900)
- Background: #FDFDFD (Almost White)

BUTTON CLASSES:
- Primary Action: "bg-slate-900 text-white rounded-2xl font-semibold shadow-lg hover:bg-slate-800 transition-all"
- Secondary Icon: "bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-slate-600 rounded-full"
- Ghost Link:     "text-primary-500 font-bold hover:text-primary-700 uppercase tracking-wide text-xs"

CARD PATTERNS:
- Standard: "bg-white rounded-4xl p-6 shadow-sm border border-slate-200 hover:border-primary-300 transition-colors"
- Gradient: "bg-brand-gradient text-white rounded-4xl shadow-xl"
- Hover Interaction: "Color shift only (No Lift)"

TYPOGRAPHY:
- Headers: "font-extrabold tracking-tight text-slate-900" (Satoshi)
- Labels:  "text-xs font-bold text-slate-500 uppercase tracking-wider"

INPUTS:
- Search: "bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm"
-->

# 📓 Project Journal & Lessons Learned

## 2026-01-04: Environment Variable Access

- **Incident**: App crashed because `process.env.API_KEY` was undefined in the browser.
- **Root Cause**: Vite exposes env vars on `import.meta.env`, not `process.env`.
- **Correction**: Used `import.meta.env.VITE_GOOGLE_API_KEY`.
- **Rule**: All client-side env vars must use `import.meta.env`.

## [Date]: [Short Title]

- **Incident**: [What broke?]
- **Root Cause**: [Why did the AI think it would work?]
- **Correction**: [The fix]

## 2026-01-04: Dashboard V2 Implementation

- **Pattern**: Successfully implemented modular dashboard with DashboardContext provider.
- **Lesson**: Wrapping page components with a provider requires separating the content into a child component (e.g., `DashboardContent`) to use hooks.
- **Visual Anchor**: Following the Journal Style Cheat Sheet ensured consistent styling across all new components.
- **Persistence**: localStorage works well for user preferences when no backend is available.

## 2026-01-05: Coupon Page Card Radius Inconsistency

- **Incident**: Applied `border-radius: 2rem` (card-premium) to Coupon Page cards, which was inconsistent with the desired `1rem`.
- **Root Cause**: Over-generalized the "Premium Card" design token (`rounded-[2rem]`) to a page that required tighter spacing (`rounded-2xl` / `1rem`).
- **Correction**: Reverted to `rounded-2xl` (1rem).
- **Lesson**: While consistency is good, specific interfaces (like dense data tables or lists) may require tighter border radii (`1rem`) than the "marketing-style" dashboard widgets (`2rem`). Always verify if a specific page deviates from the global "premium" standard.
## 2026-01-05: Onboarding Persistence & Flicker Issue

- **Incident**: UI flickered between legacy `SetupGuide` and new `OnboardingHero` on refresh, and progress was lost.
- **Root Cause**: 
    1. `MockOnboardingService` used in-memory state that vanished on reload.
    2. `Dashboard.tsx` lacked a loading state for the async `OnboardingContext`, causing it to render the legacy component by default while the new state was being fetched.
    3. Redundant state management in `DashboardContext` conflicted with the dedicated `OnboardingContext`.
- **Correction**: 
    1. Implemented `LocalStorage` persistence in `MockOnboardingService`.
    2. Added a centralized loading indicator in `Dashboard.tsx` to handle the asynchronous initialization of onboarding state.
    3. Performed a "Deep Fix" by completely removing legacy components and state from `DashboardContext`.
- **Lesson**: When introducing a new async state provider, ensure the UI handles the "Loading" state gracefully to prevent flickering. Always decommission legacy state paths to prevent "ghost" components from rendering during edge case transitions (like a fast refresh).

## 2026-01-05: Member Page UI Refinement - Monolith Decomposition

- **Pattern**: Successfully decomposed 680+ line `EditProfileModal.tsx` into modular components.
- **Architecture Decisions**:
    1. **Component Extraction**: Created `MemberForm.tsx` (main form), `MemberCodeToggle.tsx` (strategy pattern), `MarketingPreferences.tsx` (dynamic opt-ins).
    2. **Tab Modularization**: Extracted from `MemberDetail.tsx` into dedicated components (`ProfileTab`, `TransactionTab`, `TierHistoryTab`, `PointDetailTab`, `CouponWalletTab`).
    3. **Shared Infrastructure**: Created `OperationRemarks.tsx` for unified audit trail across point adjustments, tier changes, and coupon actions.
    4. **Service Layer**: Created `MockAssetService.ts` with LocalStorage persistence for asset logs and point packets.
- **Key Lessons**:
    1. **Zone-Based Form Design**: Grouping form fields into logical zones (Core Identity, Address, Marketing, Membership) improves UX and maintainability.
    2. **Auto-Calculation Logic**: Age-group calculation from birthday should live in the form component, not the parent modal.
    3. **Export Barrel Files**: Using `index.ts` exports simplifies imports and makes refactoring easier.
    4. **Types First**: Defining types (`AssetLog`, `PointPacket`, etc.) before implementation ensures type safety throughout.
- **Rule**: For any component exceeding ~300 lines, consider breaking into smaller, focused components with clear props interfaces.

## 2026-01-06: Coupon Refinement - Create Coupon Wizard

- **Pattern**: Successfully implemented a 5-step accordion wizard for coupon creation with live preview.
- **Architecture Decisions**:
    1. **State Management**: Created `CouponWizardContext` with reducer-based state, validation tracking, and smart navigation.
    2. **Section Validation**: Each section has a dedicated validation function with field-specific error messages.
    3. **Smart Navigation**: `continueFromCurrentSection()` handles both normal progression and returning from editing earlier sections.
    4. **Accordion Pattern**: `AccordionSection` component with Tailwind transitions, visual states (active/complete/error), and ARIA accessibility.
    5. **Live Preview**: Mobile device simulation showing real-time updates as user fills the form.
    6. **CSV Export**: Blob API-based CSV generation for unique code strategy with automatic download on publish.

- **Key Lessons**:
    1. **Wizard State Complexity**: Tracking `activeSection`, `furthestSection`, `previousSection`, and per-section `isTouched`/`isValid` enables sophisticated UX (e.g., "Editing" badge, smart return navigation).
    2. **Auto-Save Pattern**: Using `useEffect` with debounce (2s delay) for draft persistence provides good UX without excessive writes.
    3. **Context + Reducer**: For multi-step forms, combining React Context with `useReducer` provides cleaner state updates than multiple `useState` calls.
    4. **Validation on Navigate**: Validating the current section before allowing navigation prevents data loss and provides immediate feedback.
    5. **ARIA Toggle Buttons**: Using `aria-pressed` on selection buttons and `aria-label` with descriptions makes wizard accessible.
    6. **CSV Blob Download**: Creating a hidden anchor, triggering click, and cleaning up with `URL.revokeObjectURL()` is the standard browser pattern.

- **Components Created**:
    - `src/context/CouponWizardContext.tsx` - State management with validation
    - `src/components/coupon/AccordionSection.tsx` - Animated accordion wrapper
    - `src/components/coupon/sections/EssentialsSection.tsx` - Name, type, value
    - `src/components/coupon/sections/LifecycleSection.tsx` - Validity period
    - `src/components/coupon/sections/GuardrailsSection.tsx` - Min spend, stacking
    - `src/components/coupon/sections/InventorySection.tsx` - Codes, quotas
    - `src/components/coupon/sections/DistributionSection.tsx` - Channels
    - `src/components/coupon/LivePreview.tsx` - Mobile preview simulation
    - `src/services/MockCouponService.ts` - LocalStorage persistence
    - `src/utils/csv_utils.ts` - CSV generation utilities

- **Rule**: For multi-step wizards, define a clear `SECTION_ORDER` array and derive all navigation logic from it. This makes adding/removing/reordering steps trivial.

