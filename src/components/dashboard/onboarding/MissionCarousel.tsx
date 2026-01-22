/**
 * MissionCarousel - Horizontal scrollable carousel of mission cards.
 * 
 * Uses CSS scroll-snap for smooth navigation with "peeking" adjacent cards.
 */

import React, { useRef, useEffect, useState } from 'react';
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

const MISSION_ORDER: MissionId[] = ['identity', 'tier_method', 'currency', 'tiers', 'launch'];

export function MissionCarousel({
    missions,
    currentIndex,
    onNavigate,
    onAction,
    onSkip,
}: MissionCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasDragged, setHasDragged] = useState(false);

    // Scroll to current card when index changes
    useEffect(() => {
        const centerCard = () => {
            if (scrollRef.current && !isDragging) {
                const container = scrollRef.current;
                const cards = container.children;
                if (cards[currentIndex]) {
                    const card = cards[currentIndex] as HTMLElement;
                    const containerWidth = container.offsetWidth;
                    const cardWidth = card.offsetWidth;
                    const scrollPos = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);

                    container.scrollTo({
                        left: scrollPos,
                        behavior: 'smooth',
                    });
                }
            }
        };

        centerCard();
        window.addEventListener('resize', centerCard);
        return () => window.removeEventListener('resize', centerCard);
    }, [currentIndex, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setHasDragged(false);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) setHasDragged(true);

        const newScrollLeft = scrollLeft - walk;

        // Boundaries: 0 to (scrollWidth - clientWidth)
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        scrollRef.current.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
    };

    const handleMouseUp = () => {
        if (!isDragging || !scrollRef.current) return;
        setIsDragging(false);

        // After drag ends, snap to the most visible card
        const container = scrollRef.current;
        const containerCenter = container.scrollLeft + container.offsetWidth / 2;

        let closestIndex = 0;
        let minDistance = Infinity;

        Array.from(container.children).forEach((child, index) => {
            const card = child as HTMLElement;
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== currentIndex) {
            onNavigate(closestIndex);
        }
    };

    const handleCardClick = (index: number) => {
        if (!hasDragged) {
            onNavigate(index);
        }
    };

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
        <div className="relative group/carousel">
            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all opacity-0 group-hover/carousel:opacity-100 ${currentIndex === 0 ? 'hidden' : 'hover:bg-slate-50'
                    }`}
            >
                <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>

            <button
                onClick={handleNext}
                disabled={currentIndex === MISSION_ORDER.length - 1}
                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all opacity-0 group-hover/carousel:opacity-100 ${currentIndex === MISSION_ORDER.length - 1 ? 'hidden' : 'hover:bg-slate-50'
                    }`}
            >
                <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
                className={`flex gap-4 overflow-x-auto py-4 select-none scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingLeft: 'calc(50% - 180px)',
                    paddingRight: 'calc(50% - 180px)'
                }}
            >
                {MISSION_ORDER.map((missionId, index) => {
                    const mission = missions[missionId];
                    if (!mission) return null;

                    return (
                        <div
                            key={missionId}
                            onClick={() => handleCardClick(index)}
                            className="transition-transform duration-300 transform"
                            style={{
                                scale: index === currentIndex ? '1' : '0.9',
                                opacity: index === currentIndex ? '1' : '0.5'
                            }}
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
                    if (!mission) return null;

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
                                        : 'bg-slate-300'
                                }`}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default MissionCarousel;
