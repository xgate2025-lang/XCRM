<!--
SYNC IMPACT REPORT
Version: 2.1.0 -> 2.2.0
Modified Principles:
- Added Section 8: Adaptive Learning Protocol (The "Journal")
Added Sections:
- Section 8: Adaptive Learning Protocol (The "Journal")
Removed Sections:
- None
Templates requiring updates:
- .specify/templates/plan-template.md (✅ updated)
- .specify/templates/tasks-template.md (✅ updated)
- Journal.md (✅ created)
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

**Version**: 2.2.0 | **Ratified**: 2026-01-04 | **Last Amended**: 2026-01-04