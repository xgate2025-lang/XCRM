/**
 * MissionCarousel - Horizontal scrollable carousel of mission cards.
 * 
 * Uses CSS scroll-snap for smooth navigation with "peeking" adjacent cards.
 */

import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MissionCard } from './MissionCard';
import type { MissionData, MissionId } from '../../../types';

interface MissionCarouselProps {
    missions: Record<MissionId, MissionData>;
    currentIndex: number;
    onNavigate: (index: number) => void;
    onAction: (missionId: MissionId) => void;
    onSkip: (missionId: MissionId) => void;
}

const MISSION_ORDER: MissionId[] = ['identity', 'currency', 'tiers', 'launch'];

export function MissionCarousel({
    missions,
    currentIndex,
    onNavigate,
    onAction,
    onSkip,
}: MissionCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to current card when index changes
    useEffect(() => {
        if (scrollRef.current) {
            const cardWidth = 360 + 16; // card width + gap
            scrollRef.current.scrollTo({
                left: currentIndex * cardWidth,
                behavior: 'smooth',
            });
        }
    }, [currentIndex]);

    const handlePrev = () => {
        if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < MISSION_ORDER.length - 1) {
            onNavigate(currentIndex + 1);
        }
    };

    return (
        <div className="relative">
            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-opacity ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
            >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            <button
                onClick={handleNext}
                disabled={currentIndex === MISSION_ORDER.length - 1}
                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-opacity ${currentIndex === MISSION_ORDER.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
            >
                <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth px-10 py-2 scrollbar-hide"
                style={{
                    scrollSnapType: 'x mandatory',
                    scrollPaddingLeft: '40px',
                }}
            >
                {MISSION_ORDER.map((missionId, index) => {
                    const mission = missions[missionId];
                    return (
                        <div
                            key={missionId}
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <MissionCard
                                mission={mission}
                                isActive={index === currentIndex}
                                onAction={() => onAction(missionId)}
                                onSkip={() => onSkip(missionId)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Dot Indicators */}
            <div className="mt-4 flex justify-center gap-2">
                {MISSION_ORDER.map((missionId, index) => {
                    const mission = missions[missionId];
                    return (
                        <button
                            key={missionId}
                            onClick={() => onNavigate(index)}
                            className={`h-2 w-2 rounded-full transition-all ${index === currentIndex
                                ? 'w-6 bg-primary-500'
                                : mission.isComplete
                                    ? 'bg-green-400'
                                    : mission.isSkipped
                                        ? 'bg-yellow-400'
                                        : 'bg-gray-300'
                                }`}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default MissionCarousel;
