import React from 'react';
import { Hash } from 'lucide-react';

interface MemberCodeToggleProps {
    mode: 'auto' | 'manual';
    value: string;
    onModeChange: (mode: 'auto' | 'manual') => void;
    onValueChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

/**
 * Toggle component for Member Code / Card Number generation strategy.
 * - Auto mode: System generates and input is read-only
 * - Manual mode: User can input custom value
 */
const MemberCodeToggle: React.FC<MemberCodeToggleProps> = ({
    mode,
    value,
    onModeChange,
    onValueChange,
    label = 'Member Identification Strategy',
    placeholder = 'Enter unique ID...',
}) => {
    const generateAutoId = () => `SYS-${Math.floor(1000 + Math.random() * 9000)}`;

    const handleModeSwitch = (newMode: 'auto' | 'manual') => {
        if (newMode === 'auto') {
            onValueChange(generateAutoId());
        }
        onModeChange(newMode);
    };

    return (
        <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">
                {label}
            </label>

            {/* Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    type="button"
                    onClick={() => handleModeSwitch('auto')}
                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${mode === 'auto'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    System Auto
                </button>
                <button
                    type="button"
                    onClick={() => handleModeSwitch('manual')}
                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${mode === 'manual'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Manual Entry
                </button>
            </div>

            {/* Input Field */}
            <div className="relative">
                <Hash
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
                />
                <input
                    type="text"
                    readOnly={mode === 'auto'}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${mode === 'auto'
                            ? 'bg-slate-50 border-slate-100 text-slate-400 italic font-mono cursor-not-allowed'
                            : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 outline-none'
                        }`}
                    placeholder={placeholder}
                />
                {mode === 'auto' && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase text-slate-300 tracking-widest bg-white/50 px-1.5 py-0.5 rounded">
                        Locked
                    </span>
                )}
            </div>
        </div>
    );
};

export default MemberCodeToggle;
