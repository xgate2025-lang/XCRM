# Research & Technical Decisions: Day Zero Onboarding

## Decision: Mock Service Strategy
- **Decision**: Use a singleton `MockOnboardingService` class with `setTimeout` to simulate async operations (500-1500ms latency).
- **Rationale**: Real APIs are opaque or non-existent for this flow. We need deterministic behavior ("always succeed" or "always fail") to test edge cases like "Partial Completion" or "Skip".
- **Alternatives Considered**:
    - *Real API*: Too risky, dependencies unknown.
    - *Hardcoded Component State*: Too tightly coupled; hard to refactor later.

## Decision: Animation Library
- **Decision**: Use `CSS Transitions` and `Tailwind` classes (e.g., `transition-all duration-500 ease-out`, `translate-x`) for the Carousel.
- **Rationale**: Lightweight, no extra bundle size vs. Framer Motion. Sufficient for simple "slide to center" effects required by FR-007.
- **Alternatives Considered**:
    - *Framer Motion*: Powerful but adds weight; overkill for a simple horizontal scroll.

## Decision: Persistence Key Namespace
- **Decision**: `xcrm:onboarding:{tenantId}:{userId}:last_card`
- **Rationale**: Multi-tenant safety. If a user switches tenants or accounts, we don't want state leakage.
- **Alternatives Considered**:
    - `last_card`: Too generic, prone to collision.

## Decision: Card "Peeking" Implementation
- **Decision**: Use CSS Grid or Flex with `scroll-snap-type: x mandatory` and padding-right to show the next card. Center active card using `scroll-margin`.
- **Rationale**: Native browser momentum scrolling is performant and accessible.
