# Quickstart: Day Zero Onboarding

## How to Run
This feature is effectively "Always On" for new tenants. To force-view it for development:

1. Open `src/lib/services/mock/MockOnboardingService.ts` (once created).
2. Set `DEBUG_FORCE_RESET = true` to clear your LocalStorage state on load.
3. Reload Dashboard.

## Key Components

- **`OnboardingContext`**: The brain. Wraps the Dashboard.
- **`MockOnboardingService`**: The data source. Change `getOnboardingState` return values here to test "All Complete" vs "Zero State".

## Testing Scenarios

### 1. The "Happy Path Loop"
1. Click "Go to Settings" on Card 1.
2. (Mock) Wait 500ms.
3. Observation: Card 1 should turn Green, Progress moves to 35%, Carousel slides to Card 2.

### 2. The "Skip" Path
1. Click "Skip" on Card 2.
2. Observation: Card 2 dims (Yellow), Progress does NOT move, Carousel slides to Card 3.
