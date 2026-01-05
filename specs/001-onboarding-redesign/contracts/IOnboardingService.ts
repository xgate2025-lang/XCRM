
// This contract defines the interface for the Service that powers the "Boomerang Loop".
// Since we are deciding to Mock this first, this interface acts as the contract 
// between our UI components and the (eventual) real API.

export type MissionId = 'identity' | 'currency' | 'tiers' | 'launch';

export interface IOnboardingService {
    /**
     * Gets the current state of onboarding validation.
     * Simulates a GET /api/v1/tenant/onboarding/status
     */
    getOnboardingState(): Promise<OnboardingState>;

    /**
     * Marks a specific card as "Skipped" by the user.
     * Simulates POST /api/v1/tenant/onboarding/skip { missionId }
     */
    skipMission(missionId: MissionId): Promise<OnboardingState>;

    /**
     * Resets a skipped mission to active.
     */
    resumeMission(missionId: MissionId): Promise<OnboardingState>;

    /**
     * Completes a specific subtask (Debug/Demo only).
     * In real life, this happens via side-effect of saving settings,
     * but the Mock needs to allow toggling for testing.
     */
    debugToggleSubtask(missionId: MissionId, subtaskId: string, isDone: boolean): Promise<OnboardingState>;
}

export interface OnboardingState {
    completionPercentage: number;
    currentStepIndex: number; // 0-based
    isDismissed: boolean;
    missions: Record<MissionId, MissionData>;
}

export interface MissionData {
    id: MissionId;
    isSkipped: boolean;
    isComplete: boolean;
    subtasks: {
        id: string;
        label: string;
        isDone: boolean;
    }[];
}
