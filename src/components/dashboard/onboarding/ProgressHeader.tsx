/**
 * ProgressHeader - Global progress bar for onboarding.
 * 
 * Displays completion percentage and step counter.
 */

import React from 'react';
import { Rocket } from 'lucide-react';

interface ProgressHeaderProps {
    completionPercentage: number;
    currentStep: number;
    totalSteps: number;
}

export function ProgressHeader({ completionPercentage, currentStep, totalSteps }: ProgressHeaderProps) {
    return (
        <div className="mb-6">
            {/* Title */}
            <div className="mb-2 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary-500" />
                <h2 className="text-xl font-bold text-gray-900">Get started with your Loyalty Program</h2>
            </div>

            {/* Subtitle */}
            <p className="mb-4 text-sm text-gray-600">
                Follow these steps to launch your first tier and reward. You are minutes away from going live.
            </p>

            {/* Progress Bar */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-primary-500 transition-all duration-500 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-primary-500">{completionPercentage}%</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">
                        <strong>{currentStep}</strong> of <strong>{totalSteps}</strong> missions completed
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;
