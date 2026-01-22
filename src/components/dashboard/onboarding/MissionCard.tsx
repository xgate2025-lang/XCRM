/**
 * MissionCard - Individual mission card for the onboarding carousel.
 * 
 * Displays mission title, description, subtask checklist, and action button.
 */

import React from 'react';
import { Clock, Check, SkipForward, ChevronRight } from 'lucide-react';
import type { MissionData } from '../../../types';

interface MissionCardProps {
    mission: MissionData;
    isActive: boolean;
    onAction: () => void;
    onSkip: () => void;
}

export function MissionCard({ mission, isActive, onAction, onSkip }: MissionCardProps) {
    const completedCount = mission.subtasks.filter((s) => s.isDone).length;
    const totalCount = mission.subtasks.length;

    // Determine card state
    const isComplete = mission.isComplete;
    const isSkipped = mission.isSkipped;

    // Dynamic styles based on state
    const cardClasses = `
    relative rounded-2xl bg-white p-6 shadow-sm border transition-all duration-300
    ${isActive ? 'border-primary-200 shadow-lg' : 'border-slate-100'}
    ${isComplete ? 'border-green-300 bg-green-50/30' : ''}
    ${isSkipped ? 'border-yellow-300 bg-yellow-50/30' : ''}
    ${!isActive ? 'hover:border-primary-200 cursor-pointer' : ''}
    min-w-[320px] max-w-[360px] flex-shrink-0 h-full
  `;

    return (
        <div className={cardClasses}>
            {/* Status Badge */}
            {isComplete && (
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    <Check className="h-3 w-3" />
                    Completed
                </div>
            )}
            {isSkipped && !isComplete && (
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                    <SkipForward className="h-3 w-3" />
                    Skipped
                </div>
            )}

            {/* Meta Data */}
            <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                    {mission.tag}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {mission.timeEstimate}
                </span>
            </div>

            {/* Title & Description */}
            <h3 className="mb-1 text-lg font-semibold text-slate-900">{mission.title}</h3>
            <p className="mb-4 text-sm text-slate-600">{mission.description}</p>

            {/* Subtask Checklist */}
            <div className="mb-4 space-y-2">
                {mission.subtasks.map((subtask) => (
                    <div
                        key={subtask.id}
                        className={`flex items-center gap-2 text-sm ${subtask.isDone ? 'text-slate-400 line-through' : 'text-slate-700'
                            }`}
                    >
                        <div
                            className={`h-4 w-4 rounded border flex items-center justify-center ${subtask.isDone
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-slate-300'
                                }`}
                        >
                            {subtask.isDone && <Check className="h-3 w-3" />}
                        </div>
                        {subtask.label}
                    </div>
                ))}
            </div>

            {/* Progress indicator */}
            <div className="mb-4 text-xs text-slate-500">
                {completedCount} of {totalCount} tasks complete
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {!isComplete && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction();
                                console.log(`[MissionCard] Action button clicked for mission: ${mission.title}`);
                            }}
                            disabled={!isActive}
                            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary-500 text-white hover:bg-primary-600'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {mission.actionLabel}
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        {!isSkipped && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card selection click
                                    onSkip();
                                    console.log(`[MissionCard] Skip button clicked for mission: ${mission.title}`);
                                }}
                                disabled={!isActive}
                                className={`text-sm text-slate-500 hover:text-slate-700 ${!isActive ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                Skip for now
                            </button>
                        )}
                    </>
                )}
                {isComplete && (
                    <div className="flex items-center gap-1 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                        <Check className="h-4 w-4" />
                        Completed
                    </div>
                )}
            </div>
        </div>
    );
}

export default MissionCard;
