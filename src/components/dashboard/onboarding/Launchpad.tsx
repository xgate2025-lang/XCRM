/**
 * Launchpad - Victory Lap view shown when all missions are complete.
 * 
 * Replaces the carousel when 100% completion is reached.
 */

import React from 'react';
import { Rocket, Sparkles, ArrowRight } from 'lucide-react';

interface LaunchpadProps {
    onRevealDashboard: () => void;
}

export function Launchpad({ onRevealDashboard }: LaunchpadProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-8 text-white">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

                {/* Animated sparkles */}
                <div className="absolute top-10 left-1/4 animate-pulse">
                    <Sparkles className="h-6 w-6 text-yellow-300/60" />
                </div>
                <div className="absolute top-20 right-1/3 animate-pulse delay-300">
                    <Sparkles className="h-4 w-4 text-yellow-300/40" />
                </div>
                <div className="absolute bottom-16 left-1/3 animate-pulse delay-500">
                    <Sparkles className="h-5 w-5 text-yellow-300/50" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-6 rounded-full bg-white/20 p-4 backdrop-blur-sm animate-bounce">
                    <Rocket className="h-12 w-12 text-white" />
                </div>

                {/* Headline */}
                <h2 className="mb-2 text-3xl font-bold">
                    🎉 You're Ready for Takeoff!
                </h2>

                {/* Body */}
                <p className="mb-8 max-w-md text-lg text-primary-100">
                    Your loyalty program is fully configured. The operational dashboard is now active and ready to track your success.
                </p>

                {/* CTA */}
                <button
                    onClick={onRevealDashboard}
                    className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                    Reveal Dashboard
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Confetti hint */}
                <p className="mt-4 text-sm text-primary-200/70">
                    All 4 missions complete • 100% Ready
                </p>
            </div>
        </div>
    );
}

export default Launchpad;
