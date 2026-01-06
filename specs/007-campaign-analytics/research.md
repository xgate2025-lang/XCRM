# Research: Campaign Analytics (Polymorphic)

## Technical Decisions

### 1. Polymorphic Component Strategy
- **Decision**: Implement a **Container-Presenter Pattern**.
    - `CampaignAnalyticsContainer`: Fetches campaign data and renders the correct view.
    - `ConsumptionAnalyticsView`: Presentational component for "Purchase" campaigns.
    - `GrowthAnalyticsView`: Presentational component for "Referral" campaigns.
- **Rationale**: Keeps logic separate from UI. Allows purely presentational testing of views. Clarifies the "Switch" logic described in the User Flow.
- **Alternatives**: Single component with many `if` statements (Rejected: messy, hard to maintain).

### 2. Visualization Library
- **Decision**: Use `recharts`.
- **Rationale**: Standard React charting library, likely already in use or lightweight enough to add. Excellent composability for "Zone C" trends.
- **Alternatives**: `chart.js` (Imperative, harder to style with Tailwind), Custom SVG (Too much effort).

### 3. Drawer Persistence
- **Decision**: Use `URLSearchParams` for Drawer state (e.g., `?drawer=transaction&id=123`).
- **Rationale**: Allows deep-linking to specific evidence records (User Story 3: "Auditor needs to verify"). Keeps clean history stack.
- **Alternatives**: React State (Lost on refresh, hard to share links).

### 4. Mock Data Service
- **Decision**: Extend `MockCampaignService` to include `getAnalytics(id)`.
- **Rationale**: Keep campaign logic centralized. The analytics data (ROI, CPA) is derived from the logs, but for the mock we might need to pre-calculate or generate realistic fake logs on the fly.

## Unknowns & Clarifications

### Resolved
- **Routing**: `react-router-dom` is standard. Route: `/campaigns/:id/analytics`.
- **Icons**: Lucide React.
- **Styling**: Tailwind CSS (Utility-first).

### Open Questions (Resolved by Assumptions)
- **Repo Structure**: Assumed `src/pages` for the container and `src/components/campaign/analytics` for the views.
