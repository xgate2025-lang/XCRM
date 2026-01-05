/**
 * OnboardingContext - State management for Day Zero Onboarding.
 * 
 * Connects MockOnboardingService and LocalStorageClient to provide
 * a unified API for the Onboarding UI components.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { MissionId, OnboardingState, NavItemId } from '../types';
import { MockOnboardingService } from '../lib/services/mock/MockOnboardingService';
import { LocalStorageClient } from '../lib/storage/LocalStorageClient';

// Hardcoded for now - in production, get from auth context
const TENANT_ID = 'demo_tenant';
const USER_ID = 'demo_user';
const LAST_CARD_KEY = 'last_card';

interface OnboardingContextValue {
    state: OnboardingState | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    refreshState: () => Promise<void>;
    skipMission: (missionId: MissionId) => Promise<void>;
    resumeMission: (missionId: MissionId) => Promise<void>;
    toggleSubtask: (missionId: MissionId, subtaskId: string, isDone: boolean) => Promise<void>;
    dismissOnboarding: () => void;
    navigateToMission: (missionId: MissionId) => void;
    setNavigateFunction: (fn: (id: NavItemId) => void) => void;

    // Navigation
    currentMissionIndex: number;
    setCurrentMissionIndex: (index: number) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

interface OnboardingProviderProps {
    children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
    const [state, setState] = useState<OnboardingState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMissionIndex, setCurrentMissionIndexInternal] = useState(0);

    // Persist current mission index to LocalStorage
    const setCurrentMissionIndex = useCallback((index: number) => {
        setCurrentMissionIndexInternal(index);
        LocalStorageClient.set(TENANT_ID, USER_ID, LAST_CARD_KEY, index);
    }, []);

    // Fetch initial state
    const refreshState = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newState = await MockOnboardingService.getOnboardingState();
            setState(newState);

            // Restore last card index from LocalStorage
            const savedIndex = LocalStorageClient.get<number>(TENANT_ID, USER_ID, LAST_CARD_KEY);
            if (savedIndex !== null && savedIndex >= 0 && savedIndex <= 3) {
                setCurrentMissionIndexInternal(savedIndex);
            } else {
                setCurrentMissionIndexInternal(newState.currentStepIndex);
            }
        } catch (err) {
            setError('Failed to load onboarding state');
            console.error('[OnboardingContext] Error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Skip a mission
    const skipMission = useCallback(async (missionId: MissionId) => {
        try {
            const newState = await MockOnboardingService.skipMission(missionId);
            setState(newState);
            // Auto-advance to next card
            if (currentMissionIndex < 3) {
                setCurrentMissionIndex(currentMissionIndex + 1);
            }
        } catch (err) {
            setError('Failed to skip mission');
            console.error('[OnboardingContext] Skip error:', err);
        }
    }, [currentMissionIndex, setCurrentMissionIndex]);

    // Resume a skipped mission
    const resumeMission = useCallback(async (missionId: MissionId) => {
        try {
            const newState = await MockOnboardingService.resumeMission(missionId);
            setState(newState);
        } catch (err) {
            setError('Failed to resume mission');
            console.error('[OnboardingContext] Resume error:', err);
        }
    }, []);

    // Toggle a subtask (debug/demo)
    const toggleSubtask = useCallback(async (
        missionId: MissionId,
        subtaskId: string,
        isDone: boolean
    ) => {
        try {
            const newState = await MockOnboardingService.debugToggleSubtask(missionId, subtaskId, isDone);
            setState(newState);

            // Auto-advance if mission becomes complete
            const missionOrder: MissionId[] = ['identity', 'currency', 'tiers', 'launch'];
            const missionIndex = missionOrder.indexOf(missionId);
            const mission = newState.missions[missionId];

            if (mission.isComplete && currentMissionIndex === missionIndex && missionIndex < 3) {
                setCurrentMissionIndex(missionIndex + 1);
            }
        } catch (err) {
            setError('Failed to update subtask');
            console.error('[OnboardingContext] Toggle error:', err);
        }
    }, [currentMissionIndex, setCurrentMissionIndex]);

    // Dismiss onboarding permanently
    const dismissOnboarding = useCallback(() => {
        setState((prev) => prev ? { ...prev, isDismissed: true } : null);
        LocalStorageClient.set(TENANT_ID, USER_ID, 'dismissed', true);
    }, []);

    // Navigation function holder (set by App/Dashboard)
    const [navigateFn, setNavigateFn] = useState<((id: NavItemId) => void) | null>(null);

    const setNavigateFunction = useCallback((fn: (id: NavItemId) => void) => {
        setNavigateFn(() => fn);
    }, []);

    // Navigate to a mission's target page
    const navigateToMission = useCallback((missionId: MissionId) => {
        if (!state || !navigateFn) {
            console.warn('[OnboardingContext] Cannot navigate - no navigate function set');
            return;
        }
        const mission = state.missions[missionId];
        if (mission) {
            const targetPage = mission.actionRoute as NavItemId;
            console.log('[OnboardingContext] Navigating to:', targetPage);
            navigateFn(targetPage);
        }
    }, [state, navigateFn]);

    // Load state on mount
    useEffect(() => {
        refreshState();
    }, [refreshState]);

    const value: OnboardingContextValue = {
        state,
        isLoading,
        error,
        refreshState,
        skipMission,
        resumeMission,
        toggleSubtask,
        dismissOnboarding,
        navigateToMission,
        setNavigateFunction,
        currentMissionIndex,
        setCurrentMissionIndex,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding(): OnboardingContextValue {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}

export default OnboardingContext;
