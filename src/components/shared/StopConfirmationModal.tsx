import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface StopConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    campaignName: string;
}

const StopConfirmationModal: React.FC<StopConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    campaignName
}) => {
    const [confirmInput, setConfirmInput] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (confirmInput === 'STOP') {
            onConfirm();
            setConfirmInput('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">Stop Campaign?</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Stopping <span className="font-bold text-slate-900">"{campaignName}"</span> is permanent. Once ended, the campaign cannot be resumed and all active rules will terminate immediately.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Type "STOP" below to confirm
                            </label>
                            <input
                                type="text"
                                value={confirmInput}
                                onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
                                placeholder="STOP"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-200 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                disabled={confirmInput !== 'STOP'}
                                onClick={handleConfirm}
                                className={`
                  w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg
                  ${confirmInput === 'STOP'
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}
                `}
                            >
                                Permanently Stop Campaign
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StopConfirmationModal;
