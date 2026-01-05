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
