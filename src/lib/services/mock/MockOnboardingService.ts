/**
 * MockOnboardingService - Simulates backend API for Day Zero Onboarding.
 * 
 * This service provides deterministic mock data for UX verification
 * without requiring real backend endpoints.
 */

import type { MissionId, MissionData, OnboardingState, IOnboardingService } from '../../../types';
import { LocalStorageClient } from '../../storage/LocalStorageClient';

// Storage keys
const STORAGE_KEY = 'mock_onboarding_state';
const TENANT_ID = 'demo_tenant';
const USER_ID = 'demo_user';

// Simulate network latency (ms)
const MOCK_DELAY = 500;

const MISSION_ORDER: MissionId[] = ['identity', 'tier_method', 'currency', 'tiers', 'launch'];

// Default mission definitions (the 4 cards from IA.md)
const DEFAULT_MISSIONS: Record<MissionId, MissionData> = {
    identity: {
        id: 'identity',
        title: 'Establish your Identity',
        description: 'Upload your logo and set your timezone & currency.',
        tag: 'Step 1',
        timeEstimate: '⏱️ 2 mins',
        actionLabel: 'Go to Settings',
        actionRoute: 'setting', // NavItemId
        isSkipped: false,
        isComplete: false,
        subtasks: [
            { id: 'upload_logo', label: 'Upload Store Logo', isDone: false },
            { id: 'set_timezone', label: 'Set Timezone & Currency', isDone: false },
        ],
    },
    tier_method: {
        id: 'tier_method',
        title: 'Decide Physics',
        description: 'Setup how members progress (Revenue vs Engagement).',
        tag: 'Step 2',
        timeEstimate: '⏱️ 3 mins',
        actionLabel: 'Setup Method',
        actionRoute: 'program-tier', // NavItemId
        isSkipped: false,
        isComplete: false,
        subtasks: [
            { id: 'define_base_tier', label: 'Setup Tier Upgrade method', isDone: false },
        ],
    },
    currency: {
        id: 'currency',
        title: 'Define Point Logic',
        description: 'Set your base earn rate and redemption value.',
        tag: 'Step 3',
        timeEstimate: '⏱️ 5 mins',
        actionLabel: 'Configure Points',
        actionRoute: 'program-point', // NavItemId
        isSkipped: false,
        isComplete: false,
        subtasks: [
            { id: 'set_earn_rate', label: 'Set Base Earn Rate', isDone: false },
            { id: 'set_redemption', label: 'Set Redemption Value', isDone: false },
        ],
    },
    tiers: {
        id: 'tiers',
        title: 'Build the Ladder',
        description: 'Define your tier structure and benefits.',
        tag: 'Step 4',
        timeEstimate: '⏱️ 10 mins',
        actionLabel: 'Open Tier Matrix',
        actionRoute: 'program-tier', // NavItemId
        isSkipped: false,
        isComplete: false,
        subtasks: [
            { id: 'create_premium_tier', label: 'Create Premium Tier (Gold)', isDone: false },
            { id: 'add_benefit', label: 'Add One Benefit to Gold', isDone: false },
        ],
    },
    launch: {
        id: 'launch',
        title: 'Create Welcome Offer',
        description: 'Create your first coupon and launch your program.',
        tag: 'Step 5',
        timeEstimate: '⏱️ 3 mins',
        actionLabel: 'Create Coupon',
        actionRoute: 'coupon-create', // NavItemId
        isSkipped: false,
        isComplete: false,
        subtasks: [
            { id: 'create_coupon', label: 'Create "New Member" Coupon', isDone: false },
            { id: 'activate_campaign', label: 'Activate the Campaign', isDone: false },
        ],
    },
};

// In-memory state (simulates database)
let mockState: OnboardingState = ((): OnboardingState => {
    const saved = LocalStorageClient.get<OnboardingState>(TENANT_ID, USER_ID, STORAGE_KEY);

    // Default system state
    const defaultState: OnboardingState = {
        completionPercentage: 10,
        currentStepIndex: 0,
        isDismissed: false,
        missions: JSON.parse(JSON.stringify(DEFAULT_MISSIONS)),
    };

    if (saved) {
        // Merge saved progress into current definitions
        // This ensures new missions added to code are available but progress for old ones is kept
        const mergedMissions = JSON.parse(JSON.stringify(DEFAULT_MISSIONS));
        Object.keys(saved.missions).forEach((id) => {
            const missionId = id as MissionId;
            if (mergedMissions[missionId]) {
                const savedMission = saved.missions[missionId];
                mergedMissions[missionId].isSkipped = savedMission.isSkipped;
                mergedMissions[missionId].isComplete = savedMission.isComplete;

                // Merge subtasks progress
                mergedMissions[missionId].subtasks.forEach((subtask: { id: string; isDone: boolean }) => {
                    const savedSubtask = savedMission.subtasks.find((s: { id: string; isDone: boolean }) => s.id === subtask.id);
                    if (savedSubtask) {
                        subtask.isDone = savedSubtask.isDone;
                    }
                });
            }
        });

        const mergedState = {
            ...saved,
            missions: mergedMissions,
            // Recalculate completion based on merged subtasks
            completionPercentage: calculateCompletion(mergedMissions)
        };

        return mergedState;
    }

    return defaultState;
})();

/**
 * Persists the current state to local storage.
 */
function persistState(): void {
    LocalStorageClient.set(TENANT_ID, USER_ID, STORAGE_KEY, mockState);
}

/**
 * Calculates completion percentage based on subtask completion.
 */
function calculateCompletion(missions: Record<MissionId, MissionData>): number {
    const allSubtasks = Object.values(missions).flatMap((m) => m.subtasks);
    const completed = allSubtasks.filter((s) => s.isDone).length;
    const total = allSubtasks.length;

    // Base 10% for account creation, remaining 90% for subtasks
    const subtaskProgress = total > 0 ? (completed / total) * 90 : 0;
    return Math.round(10 + subtaskProgress);
}

/**
 * Checks if a mission is complete (all subtasks done).
 */
function checkMissionComplete(mission: MissionData): boolean {
    return mission.subtasks.every((s) => s.isDone);
}

/**
 * Simulates async delay.
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const MockOnboardingService: IOnboardingService = {
    async getOnboardingState(): Promise<OnboardingState> {
        await delay(MOCK_DELAY);
        console.log('[MockOnboardingService] 📦 Returning state:', {
            completion: mockState.completionPercentage,
            stepIndex: mockState.currentStepIndex,
            missionCount: Object.keys(mockState.missions).length
        });
        return { ...mockState };
    },

    async skipMission(missionId: MissionId): Promise<OnboardingState> {
        await delay(MOCK_DELAY);

        const mission = mockState.missions[missionId];
        if (mission) {
            mission.isSkipped = true;
            // Move to next step if currently on this one
            const currentIndex = MISSION_ORDER.indexOf(missionId);
            if (mockState.currentStepIndex === currentIndex && currentIndex < MISSION_ORDER.length - 1) {
                mockState.currentStepIndex = currentIndex + 1;
            }
        }

        persistState();
        return { ...mockState };
    },

    async resumeMission(missionId: MissionId): Promise<OnboardingState> {
        await delay(MOCK_DELAY);

        const mission = mockState.missions[missionId];
        if (mission) {
            mission.isSkipped = false;
        }

        persistState();
        return { ...mockState };
    },

    async dismissOnboarding(): Promise<OnboardingState> {
        await delay(MOCK_DELAY);
        mockState.isDismissed = true;
        persistState();
        return { ...mockState };
    },

    async debugToggleSubtask(
        missionId: MissionId,
        subtaskId: string,
        isDone: boolean
    ): Promise<OnboardingState> {
        await delay(MOCK_DELAY);

        const mission = mockState.missions[missionId];
        if (mission) {
            const subtask = mission.subtasks.find((s) => s.id === subtaskId);
            if (subtask) {
                subtask.isDone = isDone;
                mission.isComplete = checkMissionComplete(mission);
                mockState.completionPercentage = calculateCompletion(mockState.missions);

                // Auto-advance if current mission completes
                const currentIndex = MISSION_ORDER.indexOf(missionId);
                if (mission.isComplete && mockState.currentStepIndex === currentIndex && currentIndex < MISSION_ORDER.length - 1) {
                    mockState.currentStepIndex = currentIndex + 1;
                }
            }
        }

        persistState();
        return { ...mockState };
    },

    async resetOnboarding(): Promise<OnboardingState> {
        await delay(MOCK_DELAY);
        MockDebug.resetState();
        return { ...mockState };
    },
};

// Debug utilities (for development only)
export const MockDebug = {
    resetState(): void {
        mockState = {
            completionPercentage: 10,
            currentStepIndex: 0,
            isDismissed: false,
            missions: JSON.parse(JSON.stringify(DEFAULT_MISSIONS)),
        };
        persistState();
    },

    completeAll(): void {
        Object.values(mockState.missions).forEach((mission) => {
            mission.subtasks.forEach((s) => (s.isDone = true));
            mission.isComplete = true;
        });
        mockState.completionPercentage = 100;
        mockState.currentStepIndex = MISSION_ORDER.length - 1;
        persistState();
    },
};

export default MockOnboardingService;
