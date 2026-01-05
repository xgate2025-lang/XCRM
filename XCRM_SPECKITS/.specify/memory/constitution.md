<!--
SYNC IMPACT REPORT
Version: 2.4.0 -> 2.5.0
Modified Principles:
- None
Added Sections:
- Section 12: The IA + UX "Handshake" Rule
- Section 13: UI Persistence Rule
Removed Sections:
- None
Templates requiring updates:
- None
-->

# 🏛️ Digital Factory Constitution (Local Vite Edition)

## 1. Tech Stack & Build System
- **Build System**: **Vite**. This project MUST NOT use Next.js, Webpack, or any other build system.
- **UI Library**: **React (v19)**.
- **Language**: **TypeScript**. All production code must be typed.
- **AI Integration**: AI capabilities are integrated via direct REST calls or the Google AI Gemini SDK as configured in the build system.

## 2. Environment & Configuration
- **Standard Access**: Use **`import.meta.env`** to access environment variables (Standard Vite). 
    - Example: `import.meta.env.VITE_GOOGLE_API_KEY`
- **Legacy Support**: If `process.env` is absolutely required by existing Google Studio code, it must be explicitly polyfilled in `vite.config.ts`, but `import.meta.env` is preferred for new code.
- **Secret Naming**: All client-accessible keys MUST be prefixed with **`VITE_`** (e.g., `VITE_GOOGLE_API_KEY`).
- **Security**: Never commit `.env` files. Ensure secrets are restricted to `.env.local`.

## 3. Styling Strategy
- **Standard**: **Tailwind CSS (PostCSS)**.
- **Constraint**: If `tailwind.config.js` exists, use standard utility classes. If using CDN (script tag), ensure no custom `npm` UI libraries that rely on build-step Tailwind are introduced.
- **Iconography**: Use **Lucide React** (`lucide-react`) for all icons. Do not import other icon libraries unless a specific icon is missing.
- **Implementation**: Utility classes are the primary method for styling. Configuration is managed within the Global Styling Zone in `index.html` or `tailwind.config.js`.

## 4. Routing & Navigation
- **Architecture**: **Single-Page Application (SPA)** architecture only.
- **Routing**: Use manual state management or `react-router-dom` (if installed). 
- **CRITICAL PROHIBITION**: The use of **Next.js App Router**, Server Components, `getStaticProps`, `getServerSideProps`, or any Server-Side Rendering (SSR) patterns is **STRICTLY FORBIDDEN**.

## 5. Project Structure
- **Source Root**: The **`src/`** directory is the mandatory root for all application source code.
- **AI Service Isolation**: 
  - All direct calls to the Gemini API must live in `src/lib/` (e.g., `src/lib/gemini.ts`).
  - UI components should never instantiate the `GoogleGenerativeAI` client directly; they should import functions from `src/lib/`.
- **Organization**:
  - `src/components/`: Reusable UI components.
  - `src/pages/`: Page-level components.
  - `src/context/`: State management providers.
  - `src/lib/`: Shared utilities, API clients, and core logic.
  - `src/types.ts`: Shared TypeScript definitions.
  - `src/constants.tsx`: Shared application constants.

## 6. Development Workflow
- **Spec-First**: Code must only be written after analysis of the relevant `.specify/specs/*.md` files.
- **Surgical Engineering**: Prioritize specific line-level modifications over full-file rewrites.

## 7. Robustness & AI Patterns
- **Service Isolation**: API logic lives in `src/lib/gemini.ts`, not inside UI components.
- **Streaming**: Prefer **`generateContentStream`** for long text outputs to improve perceived latency.
- **Rendering**: Use **`react-markdown`** (if installed) for displaying AI-generated text safely.
- **Validation**: Do not trust AI JSON output blindly; validate structure before rendering.
- **API Failures**: All AI API calls must be wrapped in `try/catch` blocks.
- **User Feedback**: UI must display a user-friendly "Toast" or alert when an API call fails (no silent console errors).

## 8. Adaptive Learning Protocol (The "Journal")
- **File Authority**: Maintain a **`Journal.md`** file at the project root.
- **Trigger**: Whenever a build fails, an API hallucinates, or the user corrects a logical error, you MUST append an entry to this journal.
- **Format**: Entries must follow the **"Incident/Root Cause/Correction"** pattern.
- **Pre-flight Check**: Before generating any new code or plans, you MUST read `Journal.md` to ensure previous mistakes are not repeated.
- **Self-Correction**: If you encounter a recurring error, update this Constitution to explicitly ban the pattern causing it.

## 9. Visual Integrity & Design Consistency
- **Design Source of Truth**: The existing UI in `index.html` (CDN Tailwind config) and `src/App.jsx` serves as the master style guide.
- **Component Anatomy**: New components MUST inherit the specific padding, rounding (`rounded-lg`, etc.), and shadow patterns of existing elements.
- **Color Palette**: Use only the hex codes or Tailwind shades defined in the "Global Styling Zone" of `index.html`. Do not introduce brand colors that clash with the current theme.
- **Atomic Consistency**:
    - **Buttons**: Copy the exact class string from the primary button in the current project.
    - **Inputs**: Use the same border-focus states as existing form elements.
    - **Typography**: Maintain the font-family and scale (e.g., `text-2xl font-bold`) used in headers.
- **Pre-UI Check**: Before adding a new UI element, scan the existing codebase for a similar pattern and duplicate its Tailwind class structure exactly.

## 10. IA Integrity & Coverage Rule
- **Mapping Requirement**: Every node/endpoint/page in `IA.md` MUST map to at least one file in `.specify/tasks/`.
- **Zero-Loss Policy**: During the `saas-gen` workflow, you are FORBIDDEN from omitting IA details for the sake of brevity. If a task list is too long, split it into sub-tasks (e.g., `auth-001-ui.md`, `auth-001-logic.md`) rather than deleting items.
- **Visual Check**: If the IA defines a UI hierarchy, the generated tasks MUST specify the Tailwind classes needed to maintain the "Visual Integrity" established in Rule 9.

## 11. Clarification & Edge-Case Policy
- **Blocking Step**: The `/clarify` command is NOT optional. It must be performed after every `/specify` run.
- **Deep Analysis**: During clarification, the agent MUST look specifically for:
  - **Negative Paths**: What happens when an API fails or data is missing?
  - **Permissions**: Which SaaS user roles can access this specific feature?
  - **Data Lifecycle**: How is the data created, updated, and deleted (CRUD)?
- **Ambiguity Marking**: Any detail from the IA that is not 100% clear must be tagged with `[TODO: CLARIFY]` in the spec until answered.

## 12. The IA + UX "Handshake" Rule
- **No Orphan Pages**: Every page listed in the `IA.md` MUST have a corresponding entry in `UserFlows.md` describing how a user gets there and where they go next.
- **State Completeness**: A task is considered "incomplete" if it only builds the UI but ignores the states. Every functional component must handle:
    - `isLoading`: Shimmer/Spinner.
    - `isError`: User-friendly alert/toast.
    - `isEmpty`: "No data found" illustration/call-to-action.
- **Navigation Safety**: Use `react-router-dom` for all transitions. Logic for protected routes (e.g., "Must be logged in to see /settings") must be explicitly defined in the task.

## 13. UI Persistence Rule
- **Visual Continuity**: When moving between pages (User Flow), the Navigation Sidebar and Header must persist. Do not re-render global layouts within feature tasks.

**Version**: 2.5.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-01-05