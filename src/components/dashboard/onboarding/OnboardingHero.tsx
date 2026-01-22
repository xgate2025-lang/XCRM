/**
 * OnboardingHero - Main container widget for the Day Zero onboarding experience.
 * 
 * Renders the ProgressHeader and MissionCarousel, managing the "State A" view.
 * Shows Launchpad when 100% complete.
 */

import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../../context/OnboardingContext';
import { ProgressHeader } from './ProgressHeader';
import { MissionCarousel } from './MissionCarousel';
import { Launchpad } from './Launchpad';
import { SuccessAnimation } from './SuccessAnimation';
import { Loader2 } from 'lucide-react';
import type { MissionId } from '../../../types';

const MISSION_ORDER: MissionId[] = ['identity', 'tier_method', 'currency', 'tiers', 'launch'];

export function OnboardingHero() {
    const {
        state,
        isLoading,
        error,
        currentMissionIndex,
        setCurrentMissionIndex,
        skipMission,
        dismissOnboarding,
        navigateToMission,
    } = useOnboarding();

    // Track if we just hit 100% to trigger confetti
    const [showConfetti, setShowConfetti] = useState(false);
    const [wasComplete, setWasComplete] = useState(false);

    // Count completed missions
    const completedMissions = state
        ? MISSION_ORDER.filter((id) => state.missions[id] && state.missions[id].isComplete).length
        : 0;

    const isFullyComplete = state?.completionPercentage === 100;

    // Trigger confetti when we first hit 100%
    useEffect(() => {
        if (isFullyComplete && !wasComplete) {
            setShowConfetti(true);
            setWasComplete(true);
        }
    }, [isFullyComplete, wasComplete]);

    // Handle action button click - navigate to the mission's route
    const handleAction = (missionId: MissionId) => {
        navigateToMission(missionId);
    };

    // Handle skip
    const handleSkip = async (missionId: MissionId) => {
        await skipMission(missionId);
    };

    // Handle reveal dashboard (dismiss onboarding)
    const handleRevealDashboard = () => {
        dismissOnboarding();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="rounded-2xl bg-slate-50 p-8">
                <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading your setup guide...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !state) {
        return (
            <div className="rounded-2xl bg-red-50 p-8 text-center">
                <p className="text-red-600">{error || 'Failed to load onboarding state'}</p>
            </div>
        );
    }

    // Don't render if dismissed
    if (state.isDismissed) {
        return null;
    }

    // Victory Lap - Show Launchpad when 100% complete
    if (isFullyComplete) {
        return (
            <>
                <SuccessAnimation isActive={showConfetti} />
                <Launchpad onRevealDashboard={handleRevealDashboard} />
            </>
        );
    }

    // Normal carousel view
    return (
        <div className="rounded-2xl bg-slate-50 p-6">
            <ProgressHeader
                completionPercentage={state.completionPercentage}
                currentStep={completedMissions}
                totalSteps={MISSION_ORDER.length}
            />

            <MissionCarousel
                missions={state.missions}
                currentIndex={currentMissionIndex}
                onNavigate={setCurrentMissionIndex}
                onAction={handleAction}
                onSkip={handleSkip}
            />
        </div>
    );
}

export default OnboardingHero;

