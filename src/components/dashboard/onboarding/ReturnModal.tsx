/**
 * ReturnModal - Modal prompting user to return to Dashboard after completing a setup task.
 * 
 * Triggered when ?source=onboarding is present and a save action completes.
 */

import React from 'react';
import { CheckCircle, ArrowLeft, X } from 'lucide-react';

interface ReturnModalProps {
    isOpen: boolean;
    onReturn: () => void;
    onStay: () => void;
    stepName?: string;
}

export function ReturnModal({ isOpen, onReturn, onStay, stepName = 'Step' }: ReturnModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onStay}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                {/* Close button */}
                <button
                    onClick={onStay}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Success Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3 animate-in zoom-in duration-500">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {stepName} Complete! 🎉
                    </h3>
                    <p className="mb-6 text-gray-600">
                        Great progress! Ready to continue your setup journey?
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onReturn}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Return to Dashboard
                    </button>
                    <button
                        onClick={onStay}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                        Stay Here
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReturnModal;
