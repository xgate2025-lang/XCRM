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

## 2026-01-06: Coupon List Refinement - State Sync & Navigation

- **Incident**: "Coupon not found" error when navigating from the coupon list to the edit page, despite the coupon existing in the list.
- **Root Cause**: 
    1. `CouponContext` (used by the list) was initialized with hardcoded data and didn't sync with `MockCouponService` (used by the edit page).
    2. Mutations in the list (Toggle Status, Duplicate) were only updating in-memory context state, not the persistent storage.
- **Correction**: 
    1. Updated `CouponProvider` to load its initial state from `MockCouponService` on mount.
    2. Synchronized all `CouponContext` mutation methods (`add`, `replace`, `delete`, `toggle`, `duplicate`) to also update `MockCouponService`.
    3. Added a `storage` event listener to `CouponContext` to handle cross-navigation state updates.
- **Decision**: Removed the redundant "View Details" modal in favor of direct row-click navigation to the full Edit Page. This simplifies the UI and aligns with modern CRUD patterns.

## 2026-01-06: Campaign Refinement - Service Parity & Polymorphic Analytics

- **Pattern**: Successfully implemented persistent campaign management and polymorphic analytics views.
- **Architecture Decisions**:
    1. **Service Integration**: Created `MockCampaignService.ts` with LocalStorage persistence to replace flaky in-memory state.
    2. **Multi-select Targeting**: Replaced single-select dropdowns with a tag-based multi-select UI for Stores and Member Tiers in `CampaignEditor.tsx`.
    3. **Polymorphic Analytics**: Implemented `CampaignDetail.tsx` which dynamically switches between ROI-focused cards (for Spending) and Acquisition-focused cards (for Referral) based on campaign type.
    4. **Stacking Rule Logic**: Added `stackable` boolean and overlap detection that cross-references active campaigns.
- **Key Lessons**:
    1. **Multi-Select UX**: For small sets (like Tiers/Stores), a row of toggleable buttons often provides better visual confirmation than a dropdown menu.
    2. **Prop-Drilling vs. Context**: For specialized detail views, passing `campaignId` via navigation payload and fetching the specific entity in the detail component maintains a cleaner separation of concerns than passing the whole object.
    3. **Polymorphic Rendering**: Using a simple `isReferral` check within a dedicated component makes for much more readable code than trying to build a "Swiss Army Knife" component that handles both cases via complex prop flags.
    4. **State Parity**: Renaming states from `audienceScope` to `targetTiers` (internal name) to match the external data model (`Campaign` interface) avoids confusion during data mapping and debugging.

- **Components Created/Updated**:
    - `src/services/MockCampaignService.ts` - Persistent storage
    - `src/pages/CampaignDetail.tsx` - New polymorphic analytics page
    - `src/pages/CampaignEditor.tsx` - Updated with multi-select and stacking logic

## 2026-01-06: Campaign Table Refinement - Polymorphic UI & Zone Sync

- **Pattern**: Successfully implemented a high-density, type-aware campaign dashboard with real-time zone synchronization.
- **Architecture Decisions**:
    1. **Polymorphic Metrics**: Used a unified `getCampaignKPI` utility to map campaign types to human-readable primary metrics (ROI vs Growth), ensuring consistent table layout while handling diverse data shapes.
    2. **Zone Synchronization (Pulse Sync)**: Summary metrics (Zone A) are derived directly from the filtered application state (Zone B/C). This ensures that search queries and status filters update the global "Health Score" instantly without redundant API calls.
    3. **Operational Safety (Stop Modal)**: Implemented a mandatory "STOP" input confirmation for terminal actions, protecting active revenue-generating campaigns from accidental deletion.
    4. **Quick Look Interaction**: Implemented a side-drawer triggered by row clicks (Rule 7: IA coverage). Added active row highlighting to maintain context during inspection.
- **Key Lessons**:
    1. **Derived State vs. Sync State**: For analytics dashboards, deriving summary stats from the filtered list in the render cycle is significantly cleaner than attempting to sync multiple state variables manually.
    2. **Contextual Action Logic**: Decoupling the "Action Matrix" (which buttons show when) from the table rendering (using a logic-first approach) makes the UI more robust against status transitions.
    3. **Tailwind Transition Durations**: Using `duration-500` with `ease-out` for side drawers provides a more "premium" feel than the default `300ms` for larger UI shifts.
- **Components Created/Updated**:
    - `src/components/campaign/QuickLookDrawer.tsx` - High-fidelity inspection tool
    - `src/components/shared/StopConfirmationModal.tsx` - Reusable safety component
    - `src/pages/CampaignDashboard.tsx` - Refactored for Zone Sync and Polymorphism
- **Rule**: For table-based apps, avoid "Navigation vs. Interaction" confusion by clearly distinguishing between row clicks (Quick Look) and button clicks (Direct Action) using `e.stopPropagation()`.

## 2026-01-06: Task Synchronization Oversight

- **Incident**: Failed to update the feature-specific `tasks.md` in sync with the global `task.md` after phased implementation.
- **Root Cause**: Synchronization tool call failed due to target content mismatch, and the failure was not immediately corrected before the `notify_user` call.
- **Correction**: Manually verified and updated both task lists to 100% completion and added a specific "Sync all progress trackers" checkpoint to the internal workflow.
- **Lesson**: When working with multiple progress trackers (Brain task.md vs. Feature tasks.md), verify the success of ALL edit calls before proceeding to the next phase or notifying the user.
## 2026-01-07: Workflow Oversight - Speckit Task Generation

- **Incident**: Proceeded to manual task list creation without executing the mandatory `speckit.tasks` workflow after the implementation plan was drafted.
- **Root Cause**: Over-reliance on manual planning and a lapse in checking the local workflow requirements (`speckit.plan` must be followed by `speckit.tasks`).
- **Correction**: Recorded the incident in `Journal.md`, invalidated the manual task list in favor of the workflow-generated one, and immediately executed the `speckit.tasks` command.
- **Lesson**: Standardized workflows (slash commands) are mandatory checkpoints. Always cross-reference the feature's workflow guide before transitioning from planning to execution.

## 2026-01-07: Overall UI Refinement - Phase 1 Setup

- **Pattern**: Added new shared types to support enhanced member asset management and coupon configuration.
- **Types Added**:
    1. `PointsSummary`: Summary statistics interface (Available Balance, Lifetime Earned, Used, Expired) per FR-MEM-03.
    2. `MemberCoupon`: Member wallet coupon instance with status, usage details, and void tracking per FR-MEM-07.
    3. `ManualRedemptionForm` / `ManualVoidForm`: Form data structures for manual coupon actions.
    4. `IdentifierMode`, `QuotaTimeUnit`, `StoreRestriction`, `PersonalQuota`: Extended Coupon types for FR-COUPON-02 requirements (identifier auto/manual, per-person quota with time window, store restrictions).
- **Lesson**: Define types before implementation to ensure type safety and clear contracts between components.

## 2026-01-07: Overall UI Refinement - Phase 2 Foundational

- **Pattern**: Extended MockAssetService and MemberContext to support packet-based point logic and member coupon wallet actions.
- **Service Methods Added** (`MockAssetService.ts`):
    1. `getPointsSummary(memberId)`: Calculates Available Balance, Lifetime Earned, Used, Expired from packets and logs.
    2. `getMemberCoupons(memberId, status?)`: Retrieves wallet coupons with optional status filter.
    3. `getMemberCoupon(couponId)`: Gets a single coupon by ID.
    4. `redeemCouponManually(couponId, form)`: Marks coupon as used with store/time/reason.
    5. `voidCouponManually(couponId, form)`: Marks coupon as voided with reason/notes.
- **Context Methods Added** (`MemberContext.tsx`):
    - Wrapped all new MockAssetService methods with `useCallback` for stable references.
- **Data Added**: Mock `MemberCoupon` records with various statuses (available, used, expired) for testing.
- **Lesson**: Keep service layer and context layer in sync - service handles persistence, context provides React hooks.

## 2026-01-07: Overall UI Refinement - Phase 3 User Story 1

- **Pattern**: Streamlined Dashboard and Onboarding experience by removing non-essential elements.
- **Changes Made**:
    1. **T005 - GlobalNavigator.tsx**: Removed Store Scope Picker per FR-DASH-01. Only Date Range Picker remains.
    2. **T006 - MockOnboardingService.ts**: Updated 5-step onboarding sequence per FR-ONBOARD-01 to FR-ONBOARD-04:
        - Step 1: Establish Identity (removed "Upload Logo" subtask)
        - Step 2: Load Master Data (new - store and product import)
        - Step 3: Define Point Logic (unchanged)
        - Step 4: Define Coupon Library (new - welcome and tier privilege coupons)
        - Step 5: Build the Ladder (moved from step 4 - basic and premium tiers)
    3. **T007 - TierDistributionWidget.tsx**: Changed from "Sales %" to "Active Members" dimension per FR-DASH-02. Now shows Total vs Active members per tier with engagement insights.
    4. **T008 - Dashboard.tsx**: Removed Strategy Pulse section (CampaignPulseWidget import and JSX).
    5. **T008a - CouponList.tsx**: Removed top stats cards and Audience column per FR-COUPON-01.
- **Lesson**: When removing features, also remove unused imports and sub-components to keep bundle size minimal. 

## 2026-01-07: Overall UI Refinement - Phase 4 & 5 Program Wizards

- **Pattern**: Simplified Points and Tier Wizards by stripping non-standard configuration options.
- **Architecture Decisions**:
    1. **Restrictive Form Rendering**: Cleaned up `renderEarnRules` and `renderExpirationContent` in `PointsWizard.tsx` to remove "Product Scope" and "Fixed Date" triggers.
    2. **Term Harmonization**: Renamed "Onboarding Missions" to "Onboarding Gift" globally across `TierWizard.tsx` and `AddRewardModal.tsx` to align with the simplified retention model.
    3. **Privilege Consolidation**: Restricted ongoing tier benefits to "Points Multiplier" only, removing the dynamic "Add Privilege" dropdown and its associated complexity.
- **Key Lessons**:
    1. **Visual Simulation Sync**: When removing features from a configuration form, ensure the "Live Preview" (e.g., the mobile simulator card) is updated in parallel to prevent user confusion.
    2. **Complex Deletions**: Automated multi-line deletions in highly nested JSX (like `renderPreviewCard`) are prone to syntax errors (broken tags/missing imports). Smaller, targeted replacements are safer.
    3. **Term Consistency**: When a fundamental concept changes (e.g., Missions → Gift), propagate the change to all UI labels, tooltips, and modal headers immediately.

## 2026-01-07: Phase 6 Visual Verification & Walkthrough

- **Observation**: Comprehensive visual checks revealed subtle discrepancies in `MemberDetail.tsx`:
    1. **Tier Journey Swap**: The "Privileges" and "Status Timeline" blocks weren't successfully swapped in the layout, leaving Timeline as a secondary element.
    2. **Missing Filters**: Status Timeline was missing the specified "Change Type" and "Time" dropdowns.
    3. **Fragmented Summary**: Member point summaries lacked the "Used" and "Expired" totals in the header despite log implementation.
- **Correction**: These items were documented for a final "Polish" pass before shipping.
- **Lesson**: Automated browser verification is excellent for "Presence/Absence" checks (e.g., Was the button removed?), but "Layout Ordering" and "Content Precision" often require a manual human-in-the-loop check.
