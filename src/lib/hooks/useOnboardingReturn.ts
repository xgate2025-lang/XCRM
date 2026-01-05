/**
 * useOnboardingReturn - Hook to detect ?source=onboarding and manage the Return Modal.
 * 
 * Use this in any settings/configuration page to enable the Boomerang loop.
 */

import { useState, useEffect, useCallback } from 'react';

export function useOnboardingReturn() {
    const [isFromOnboarding, setIsFromOnboarding] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [stepName, setStepName] = useState('Step');

    // Check URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const source = params.get('source');
        if (source === 'onboarding') {
            setIsFromOnboarding(true);
        }
    }, []);

    // Trigger the return modal after a successful save
    const triggerReturnPrompt = useCallback((completedStepName?: string) => {
        if (isFromOnboarding) {
            if (completedStepName) {
                setStepName(completedStepName);
            }
            setShowReturnModal(true);
        }
    }, [isFromOnboarding]);

    // Handle return to dashboard
    const handleReturn = useCallback(() => {
        setShowReturnModal(false);
        // Navigate to dashboard
        window.location.href = '/';
    }, []);

    // Handle staying on current page
    const handleStay = useCallback(() => {
        setShowReturnModal(false);
    }, []);

    return {
        isFromOnboarding,
        showReturnModal,
        stepName,
        triggerReturnPrompt,
        handleReturn,
        handleStay,
    };
}

export default useOnboardingReturn;
