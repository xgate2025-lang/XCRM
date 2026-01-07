import React, { useState, useRef, useEffect } from 'react';
import {
    X, ArrowRight, ArrowLeft, CheckCircle2, Shield, Zap, Gift,
    Crown, Lock, ChevronDown, Check, Coins, Calendar, ArrowUp, AlertCircle, Image as ImageIcon, Plus,
    Hash, Users, TrendingUp, TrendingDown, Clock, AlertTriangle, ShieldCheck, RefreshCw, Scale, RotateCw
} from 'lucide-react';
import { TierDefinition, ProgramLogic, TierBenefit, ProgramStatus } from '../../types';
import SentenceInput from './SentenceInput';
import AddRewardModal from './AddRewardModal';

interface TierWizardProps {
    programLogic: ProgramLogic | null;
    initialData?: TierDefinition | null;
    onClose: () => void;
    onSave: (tier: TierDefinition) => void;
    programStatus: ProgramStatus;
    tiers: TierDefinition[];
}

const THEMES = [
    { id: 'bronze', label: 'Bronze', color: 'bg-orange-600', border: 'border-orange-200', bg: 'bg-orange-50' },
    { id: 'silver', label: 'Silver', color: 'bg-slate-400', border: 'border-slate-200', bg: 'bg-slate-50' },
    { id: 'gold', label: 'Gold', color: 'bg-yellow-500', border: 'border-yellow-200', bg: 'bg-yellow-50' },
    { id: 'platinum', label: 'Platinum', color: 'bg-cyan-500', border: 'border-cyan-200', bg: 'bg-cyan-50' },
    { id: 'diamond', label: 'Diamond', color: 'bg-blue-600', border: 'border-blue-200', bg: 'bg-blue-50' },
    { id: 'black', label: 'Black', color: 'bg-slate-900', border: 'border-slate-300', bg: 'bg-slate-100' },
];

// --- Sub-Component: Impact Simulator Bar ---
const ImpactSimulationBar = ({
    originalEntry,
    newEntry,
    currencyLabel
}: {
    originalEntry: number;
    newEntry: number;
    currencyLabel: string;
}) => {
    // Mock Impact Calculation
    const diff = newEntry - originalEntry;
    const isHarder = diff > 0;
    const percentageChange = Math.round((Math.abs(diff) / (originalEntry || 1)) * 100);
    const mockTotalMembers = 1240; // This would come from a real DB count

    // Simulate affected count based on magnitude of change
    const affectedCount = Math.min(mockTotalMembers, Math.floor(mockTotalMembers * (percentageChange / 200)));

    if (diff === 0) return null;

    return (
        <div className="sticky bottom-6 left-0 right-0 mx-6 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-6 duration-500 z-30 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isHarder ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {isHarder ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                </div>
                <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide opacity-80">
                        {isHarder ? 'Negative Member Impact' : 'Positive Opportunity'}
                    </h4>
                    <div className="text-sm font-medium">
                        Increasing requirement by <span className="font-bold">{percentageChange}%</span> puts
                        <span className="font-bold mx-1">{affectedCount} members</span>
                        at risk of downgrade.
                    </div>
                </div>
            </div>
            <div className="text-right pl-6 border-l border-slate-700">
                <div className="text-xs font-bold opacity-50 uppercase mb-1">Current Tier Population</div>
                <div className="text-xl font-bold flex items-center gap-2 justify-end">
                    <Users size={16} /> {mockTotalMembers.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Migration Strategy Modal ---
const MigrationModal = ({
    onConfirm,
    onCancel,
    changes
}: {
    onConfirm: (strategy: string) => void;
    onCancel: () => void;
    changes: { field: string, old: string, new: string }[];
}) => {
    const [selectedStrategy, setSelectedStrategy] = useState<string>('grandfather');

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <AlertTriangle size={18} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Transition Strategy Required</h3>
                    </div>
                    <p className="text-slate-500 text-sm">
                        You are changing critical rules for a Live Tier. How should these changes apply to the <strong>1,240 existing members</strong> currently in this tier?
                    </p>

                    {/* Change Summary */}
                    <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                        {changes.map((change, idx) => (
                            <div key={idx} className="flex-shrink-0 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 shadow-sm">
                                <span className="uppercase font-bold text-slate-400 mr-2">{change.field}:</span>
                                <span className="line-through opacity-50 mr-2">{change.old}</span>
                                <ArrowRight size={10} className="inline mx-1" />
                                <span className="font-bold text-slate-900">{change.new}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 space-y-4">
                    {/* Strategy 1: Grandfathering */}
                    <label
                        className={`block relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedStrategy === 'grandfather' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}
                        onClick={() => setSelectedStrategy('grandfather')}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${selectedStrategy === 'grandfather' ? 'border-primary-500 bg-primary-500' : 'border-slate-300 bg-white'}`}>
                                {selectedStrategy === 'grandfather' && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-slate-900">Legacy Protection (Grandfathering)</h4>
                                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Recommended</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    New rules apply to <strong>new members/renewals only</strong>. Existing members keep their current status until their expiration date.
                                </p>
                            </div>
                            <ShieldCheck size={24} className="text-slate-400" />
                        </div>
                    </label>

                    {/* Strategy 2: Grace Period */}
                    <label
                        className={`block relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedStrategy === 'grace' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}
                        onClick={() => setSelectedStrategy('grace')}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${selectedStrategy === 'grace' ? 'border-primary-500 bg-primary-500' : 'border-slate-300 bg-white'}`}>
                                {selectedStrategy === 'grace' && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 mb-1">Grace Period Extension</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Apply new rules, but give existing members <strong>3 months</strong> to meet the new requirements before downgrading them.
                                </p>
                            </div>
                            <Clock size={24} className="text-slate-400" />
                        </div>
                    </label>

                    {/* Strategy 3: Hard Reset */}
                    <label
                        className={`block relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedStrategy === 'reset' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
                        onClick={() => setSelectedStrategy('reset')}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${selectedStrategy === 'reset' ? 'border-red-500 bg-red-500' : 'border-slate-300 bg-white'}`}>
                                {selectedStrategy === 'reset' && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 mb-1">Immediate Recalculation (Hard Reset)</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Run the new rules against the entire database immediately. <strong>Warning: This may cause mass downgrades.</strong>
                                </p>
                            </div>
                            <RefreshCw size={24} className="text-red-400" />
                        </div>
                    </label>
                </div>

                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                    <button
                        onClick={() => onConfirm(selectedStrategy)}
                        className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200"
                    >
                        Confirm & Apply Strategy
                    </button>
                </div>
            </div>
        </div>
    );
};


const TierWizard: React.FC<TierWizardProps> = ({ programLogic, initialData, onClose, onSave, programStatus, tiers }) => {
    const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
    const [showRewardModal, setShowRewardModal] = useState<TierBenefit['category'] | null>(null);

    // Locking & Safety Logic
    const isLive = programStatus === 'live';
    const [isCriticalLocked, setIsCriticalLocked] = useState(isLive && !!initialData); // Only lock if editing existing live tier
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [showMigrationModal, setShowMigrationModal] = useState(false);

    // Auto-generate Code State
    const [autoGenerateCode, setAutoGenerateCode] = useState(!initialData);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State - Initialize with initialData if provided, else default template
    const [tierData, setTierData] = useState<TierDefinition>(() => {
        if (initialData) {
            return JSON.parse(JSON.stringify(initialData)); // Deep copy to prevent mutating prop
        }
        return {
            id: `tier_${Math.random().toString(36).substr(2, 9)}`,
            name: 'Gold',
            code: 'GD',
            type: 'standard',
            design: { mode: 'color', colorTheme: 'gold', customColor: '#6366f1' },
            entryThreshold: 1000,
            // Default to rolling 12 months if undefined
            qualificationWindow: { type: 'rolling_period', months: 12 },
            validity: { type: 'rolling', durationMonths: 12, expirationMode: 'end_of_month' },
            retentionThreshold: 800,
            downgradeLogic: 'hard_reset',
            multiplier: 1.5,
            benefits: []
        };
    });

    // Derived Logic
    const isRevenue = programLogic?.upgradeMethod === 'total_spend';
    const currencyUnit = isRevenue ? '$' : (programLogic?.engagementConfig?.currencyName || 'Stars');
    const currencyLabel = isRevenue ? 'Spend' : (programLogic?.engagementConfig?.currencyName || 'Stars');
    const isBaseTier = tierData.type === 'base';

    // --- Ladder Validation Logic ---
    // 1. Identify neighbors
    // If editing: Find index of initialData in the existing list. Prev = index-1, Next = index+1.
    // If creating: Prev = last item in existing list. Next = null.

    const currentTierIndex = initialData
        ? tiers.findIndex(t => t.id === initialData.id)
        : tiers.length; // New tier assumes end of list logic for now, though conceptually it could be inserted.

    // Important: We should filter out the current tier from the neighbors check if we are just looking for bounds
    // But finding index is cleaner.

    const prevTier = currentTierIndex > 0 ? tiers[currentTierIndex - 1] : null;
    const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

    const minThreshold = prevTier ? prevTier.entryThreshold + 1 : 0;
    const maxThreshold = nextTier ? nextTier.entryThreshold - 1 : null;

    const validationError = (() => {
        if (isBaseTier) return null; // Base tier is always 0
        if (tierData.entryThreshold < minThreshold) {
            return `Threshold must be higher than ${prevTier?.name} (${prevTier?.entryThreshold})`;
        }
        if (maxThreshold !== null && tierData.entryThreshold > maxThreshold) {
            return `Threshold must be lower than ${nextTier?.name} (${nextTier?.entryThreshold})`;
        }
        return null;
    })();


    // --- Helpers ---
    const updateTier = (updates: Partial<TierDefinition>) => {
        setTierData(prev => ({ ...prev, ...updates }));
    };

    // Effect to handle auto-generation
    useEffect(() => {
        if (autoGenerateCode && tierData.name) {
            const words = tierData.name.trim().split(/\s+/);
            let code = '';
            if (words.length >= 2) {
                code = (words[0][0] + words[1][0]).toUpperCase();
            } else {
                code = tierData.name.substring(0, 2).toUpperCase();
            }

            // Prevent unnecessary updates
            setTierData(prev => {
                if (prev.code === code) return prev;
                return { ...prev, code };
            });
        }
    }, [tierData.name, autoGenerateCode]);

    const updateValidity = (updates: Partial<TierDefinition['validity']>) => {
        setTierData(prev => ({ ...prev, validity: { ...prev.validity, ...updates } }));
    };

    const handleStepClick = (step: 1 | 2 | 3 | 4) => {
        setActiveStep(step);
    };

    const addBenefit = (benefit: TierBenefit) => {
        updateTier({ benefits: [...tierData.benefits, benefit] });
        setShowRewardModal(null);
    };

    const updateBenefit = (id: string, updates: Partial<TierBenefit>) => {
        updateTier({
            benefits: tierData.benefits.map(b => b.id === id ? { ...b, ...updates } : b)
        });
    };

    const removeBenefit = (id: string) => {
        updateTier({ benefits: tierData.benefits.filter(b => b.id !== id) });
    };

    const confirmUnlock = () => {
        setIsCriticalLocked(false);
        setShowUnlockModal(false);
    };

    // --- Save Handler with Impact Check ---
    const handleSaveAttempt = () => {
        // Block if validation fails
        if (validationError) return;

        // 1. If not live, just save
        if (!isLive || !initialData) {
            onSave(tierData);
            return;
        }

        // 2. Check for critical changes
        const entryChanged = tierData.entryThreshold !== initialData.entryThreshold;
        const retentionChanged = tierData.retentionThreshold !== initialData.retentionThreshold;
        // We could add more checks here like Validity changes

        if ((entryChanged || retentionChanged) && !isCriticalLocked) {
            setShowMigrationModal(true);
        } else {
            onSave(tierData);
        }
    };

    const handleMigrationConfirm = (strategy: string) => {
        // In a real app, we would attach the strategy to the payload
        console.log("Saving with Strategy:", strategy);
        setShowMigrationModal(false);
        onSave(tierData);
    };


    // --- Contrast Calculation (WCAG YIQ) ---
    const getContrastColor = (hexColor: string) => {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'text-slate-900' : 'text-white';
    };

    // --- File Upload Logic ---
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setTierData(prev => ({
                    ...prev,
                    design: { ...prev.design, imageUrl: result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Renderers ---

    const renderRewardList = (category: TierBenefit['category']) => {
        const rewards = tierData.benefits.filter(b => b.category === category);
        if (rewards.length === 0) return null;

        return (
            <div className="space-y-2 mb-3">
                {rewards.map(ben => (
                    <div key={ben.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-sm font-bold text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-primary-500 rounded-full"></div>
                            {ben.label}
                        </div>
                        <button onClick={() => removeBenefit(ben.id)} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                    </div>
                ))}
            </div>
        );
    };

    const renderPreviewCard = () => {
        const isCustom = tierData.design.colorTheme === 'custom';
        const theme = THEMES.find(t => t.id === tierData.design.colorTheme) || THEMES[2];
        const isImageMode = tierData.design.mode === 'image' && tierData.design.imageUrl;

        // Determine styles based on customization
        const customBgStyle = isCustom ? { backgroundColor: tierData.design.customColor } : {};
        const textColorClass = isCustom
            ? getContrastColor(tierData.design.customColor || '#000000')
            : (isImageMode ? 'text-white' : 'text-white'); // Preset themes are usually dark enough for white text

        // Dynamic classes
        const cardBgClass = !isImageMode && !isCustom ? theme.color : '';

        return (
            <div className="w-full max-w-xs mx-auto animate-in fade-in slide-in-from-right-8 duration-500 sticky top-10">

                {/* Device Simulation */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative min-h-[600px] flex flex-col">
                    {/* Status Bar */}
                    <div className="h-6 bg-slate-900 w-full shrink-0 flex justify-center items-center">
                        <div className="w-20 h-4 bg-black rounded-b-xl"></div>
                    </div>

                    {/* App Header */}
                    <div className="pt-8 pb-4 px-6 bg-slate-50 flex justify-between items-center border-b border-slate-100 shrink-0">
                        <span className="font-bold text-slate-800">Member Center</span>
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    </div>

                    {/* Content Scroll */}
                    <div className="p-4 space-y-6 overflow-y-auto flex-1 no-scrollbar">

                        {/* The Card */}
                        <div
                            className={`relative aspect-[1.586] rounded-2xl shadow-xl overflow-hidden transition-all duration-500 bg-cover bg-center ${cardBgClass} ${textColorClass} shrink-0`}
                            style={isImageMode ? { backgroundImage: `url(${tierData.design.imageUrl})` } : customBgStyle}
                        >
                            {/* Overlays for legibility if image */}
                            {isImageMode && <div className="absolute inset-0 bg-black/40"></div>}

                            {!isImageMode && !isCustom && (
                                <>
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
                                </>
                            )}

                            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg tracking-wide drop-shadow-md">{tierData.name}</h3>
                                        <span className={`text-[10px] font-mono opacity-90 border px-1 rounded backdrop-blur-sm ${isCustom && textColorClass === 'text-slate-900' ? 'border-slate-900/30' : 'border-white/50'}`}>{tierData.code}</span>
                                    </div>
                                    <Shield size={20} className="opacity-90 drop-shadow-sm" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase opacity-90 mb-1 font-medium">Current Balance</div>
                                    <div className="text-2xl font-bold drop-shadow-md">1,250 {isRevenue ? 'Pts' : currencyLabel}</div>
                                </div>
                            </div>
                        </div>

                        {/* Progress / Retention */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Status Retention</span>
                                <span className="text-xs font-bold text-slate-900">
                                    {tierData.validity.type === 'lifetime'
                                        ? 'Forever'
                                        : `${tierData.retentionThreshold} ${currencyLabel} needed`
                                    }
                                </span>
                            </div>
                            {tierData.validity.type !== 'lifetime' && (
                                <>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full w-1/3 rounded-full ${isCustom ? '' : theme.color}`}
                                            style={isCustom ? { backgroundColor: tierData.design.customColor } : {}}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2">
                                        Earn {tierData.retentionThreshold} {currencyLabel} before expiry to keep {tierData.name}.
                                    </p>
                                </>
                            )}
                            {tierData.validity.type === 'lifetime' && (
                                <p className="text-[10px] text-slate-400 mt-0">
                                    You have achieved lifetime status. Enjoy your benefits forever!
                                </p>
                            )}
                        </div>

                        {/* Benefits List */}
                        <div className="space-y-3 shrink-0">
                            <h4 className="text-sm font-bold text-slate-900">Your Privileges</h4>

                            {/* Multiplier */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isCustom && textColorClass === 'text-slate-900' ? 'text-slate-900' : 'text-white'} ${isCustom ? '' : theme.color}`}
                                    style={isCustom ? { backgroundColor: tierData.design.customColor } : {}}
                                >
                                    <Zap size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{tierData.multiplier}x Earning</div>
                                    <div className="text-[10px] text-slate-400">Accelerator</div>
                                </div>
                            </div>
                        </div>

                        {/* Milestones */}
                        {tierData.benefits.filter(b => ['upgrade', 'welcome'].includes(b.category)).length > 0 && (
                            <div className="space-y-3 shrink-0">
                                <h4 className="text-sm font-bold text-slate-900">Upcoming Milestones</h4>
                                {tierData.benefits.filter(b => ['upgrade', 'welcome'].includes(b.category)).map(ben => (
                                    <div key={ben.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                            <ArrowUp size={14} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-700">{ben.label}</div>
                                            <div className="text-[10px] text-slate-400 capitalize">{ben.category === 'welcome' ? 'Onboarding Gift' : 'Upgrade Bonus'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden animate-in fade-in duration-300">

            {/* Helper Modal */}
            {showRewardModal && (
                <AddRewardModal
                    category={showRewardModal}
                    onClose={() => setShowRewardModal(null)}
                    onSave={addBenefit}
                />
            )}

            {/* Danger Unlock Modal */}
            {showUnlockModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative animate-in zoom-in-95 duration-200 border border-slate-100">
                        <button
                            onClick={() => setShowUnlockModal(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Critical Action</h3>
                            <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                                Changing entry rules or logic for a Live Tier will trigger a recalculation for all members in the database.
                            </p>
                            <p className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-8 border border-amber-100">
                                This action cannot be undone and may affect active member statuses.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowUnlockModal(false)}
                                    className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUnlock}
                                    className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
                                >
                                    Unlock Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Migration Strategy Modal */}
            {showMigrationModal && initialData && (
                <MigrationModal
                    onCancel={() => setShowMigrationModal(false)}
                    onConfirm={handleMigrationConfirm}
                    changes={[
                        tierData.entryThreshold !== initialData.entryThreshold
                            ? { field: 'Entry', old: initialData.entryThreshold.toString(), new: tierData.entryThreshold.toString() }
                            : null,
                        tierData.retentionThreshold !== initialData.retentionThreshold
                            ? { field: 'Retention', old: (initialData.retentionThreshold || 0).toString(), new: (tierData.retentionThreshold || 0).toString() }
                            : null
                    ].filter((x): x is { field: string, old: string, new: string } => x !== null)}
                />
            )}

            {/* 1. Global Wrapper */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0 z-40">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold transition-colors">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <div className="text-sm font-bold text-slate-900">
                        {initialData ? 'Edit Tier' : 'Create Tier'} <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">{tierData.type === 'base' ? 'System Base' : 'Draft'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {validationError && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 animate-in fade-in">
                            <AlertCircle size={12} />
                            {validationError}
                        </div>
                    )}
                    <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        Strategy: <span className="font-bold text-slate-900">{isRevenue ? 'Revenue Based' : `Engagement (${currencyLabel})`}</span>
                    </div>
                    <button
                        onClick={handleSaveAttempt}
                        disabled={!!validationError}
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg ${validationError ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
                    >
                        Save & Close Tier
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* 2. The Wizard (Left Rail) */}
                <div className="w-2/3 h-full overflow-y-auto bg-slate-50/50 p-10 relative">
                    <div className="max-w-3xl mx-auto space-y-4 pb-20"> {/* pb-20 for simulator space */}

                        {/* STEP 1: IDENTITY */}
                        <div
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeStep === 1 ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer"
                                onClick={() => handleStepClick(1)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 1 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>1</div>
                                    <h3 className={`text-lg font-bold ${activeStep === 1 ? 'text-slate-900' : 'text-slate-600'}`}>Identity & Visuals</h3>
                                </div>
                                {activeStep !== 1 && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                            <div
                                                className={`w-2 h-2 rounded-full ${tierData.design.colorTheme === 'custom' ? '' : THEMES.find(t => t.id === tierData.design.colorTheme)?.color}`}
                                                style={tierData.design.colorTheme === 'custom' ? { backgroundColor: tierData.design.customColor } : {}}
                                            ></div>
                                            <span className="text-xs font-bold text-slate-700">{tierData.name} ({tierData.code})</span>
                                        </div>
                                        <ChevronDown size={20} className="text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {activeStep === 1 && (
                                <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tier Name</label>
                                            <input
                                                type="text"
                                                value={tierData.name}
                                                onChange={(e) => updateTier({ name: e.target.value })}
                                                className="w-full text-lg font-bold border-b-2 border-slate-200 py-2 focus:border-primary-500 outline-none bg-transparent placeholder:text-slate-300 transition-colors"
                                                placeholder="e.g. Gold"
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">System Code</label>
                                                {isCriticalLocked && (
                                                    <button onClick={() => setShowUnlockModal(true)} title="Unlock Critical Field" className="text-slate-400 hover:text-amber-500 transition-colors">
                                                        <Lock size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={tierData.code}
                                                    onChange={(e) => !isCriticalLocked && updateTier({ code: e.target.value })}
                                                    disabled={isCriticalLocked || autoGenerateCode}
                                                    className={`w-20 text-lg font-bold border-b-2 py-2 outline-none bg-transparent uppercase transition-colors ${isCriticalLocked || autoGenerateCode ? 'border-slate-100 text-slate-400 cursor-not-allowed' : 'border-slate-200 focus:border-primary-500'}`}
                                                    placeholder="GD"
                                                />
                                                {!isCriticalLocked && (
                                                    <label className="flex items-center gap-2 text-xs font-medium text-slate-500 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={autoGenerateCode}
                                                            onChange={(e) => setAutoGenerateCode(e.target.checked)}
                                                            className="rounded text-primary-500 focus:ring-primary-500"
                                                        />
                                                        Auto-generate
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Card Style</label>
                                        <div className="flex gap-4 mb-4">
                                            <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${tierData.design.mode === 'color' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <input
                                                    type="radio" name="designMode" className="hidden"
                                                    checked={tierData.design.mode === 'color'}
                                                    onChange={() => setTierData(p => ({ ...p, design: { ...p.design, mode: 'color' } }))}
                                                />
                                                <div className="font-bold text-sm text-center">Solid Color</div>
                                            </label>
                                            <label className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${tierData.design.mode === 'image' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <input
                                                    type="radio" name="designMode" className="hidden"
                                                    checked={tierData.design.mode === 'image'}
                                                    onChange={() => setTierData(p => ({ ...p, design: { ...p.design, mode: 'image' } }))}
                                                />
                                                <div className="font-bold text-sm text-center">Custom Image</div>
                                            </label>
                                        </div>

                                        {tierData.design.mode === 'color' ? (
                                            <div className="flex flex-wrap items-center gap-3 animate-in fade-in duration-200">
                                                {THEMES.map(theme => (
                                                    <button
                                                        key={theme.id}
                                                        onClick={() => setTierData(prev => ({ ...prev, design: { ...prev.design, colorTheme: theme.id as any } }))}
                                                        className={`
                                                        group relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all
                                                        ${tierData.design.colorTheme === theme.id ? 'border-primary-500 scale-110 shadow-md' : 'border-transparent hover:scale-105'}
                                                    `}
                                                    >
                                                        <div className={`w-full h-full rounded-full ${theme.color} border-2 border-white`}></div>
                                                    </button>
                                                ))}

                                                {/* Custom Color Button */}
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setTierData(prev => ({ ...prev, design: { ...prev.design, colorTheme: 'custom' } }))}
                                                            className={`
                                                            group relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all bg-white
                                                            ${tierData.design.colorTheme === 'custom' ? 'border-primary-500 scale-110 shadow-md' : 'border-slate-200 hover:scale-105 hover:border-slate-300'}
                                                        `}
                                                        >
                                                            {tierData.design.colorTheme === 'custom' ? (
                                                                <div
                                                                    className="w-full h-full rounded-full border-2 border-white"
                                                                    style={{ backgroundColor: tierData.design.customColor }}
                                                                ></div>
                                                            ) : (
                                                                <Plus size={20} className="text-slate-400" />
                                                            )}
                                                        </button>

                                                        {tierData.design.colorTheme === 'custom' && (
                                                            <input
                                                                type="color"
                                                                value={tierData.design.customColor || '#6366f1'}
                                                                onChange={(e) => setTierData(prev => ({ ...prev, design: { ...prev.design, customColor: e.target.value } }))}
                                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Hex Input */}
                                                    {tierData.design.colorTheme === 'custom' && (
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all animate-in slide-in-from-left-2 duration-200">
                                                            <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ background: tierData.design.customColor }}></div>
                                                            <Hash size={14} className="text-slate-400" />
                                                            <input
                                                                type="text"
                                                                value={tierData.design.customColor?.replace('#', '') || ''}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                                                                        setTierData(prev => ({ ...prev, design: { ...prev.design, customColor: '#' + val } }))
                                                                    }
                                                                }}
                                                                className="w-16 bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 uppercase placeholder:text-slate-300 outline-none"
                                                                placeholder="HEX"
                                                                maxLength={6}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={handleUploadClick}
                                                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-slate-50 transition-all cursor-pointer group animate-in fade-in duration-200"
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                {tierData.design.imageUrl ? (
                                                    <div className="relative w-full h-32 rounded-lg overflow-hidden group-hover:opacity-80 transition-opacity">
                                                        <img src={tierData.design.imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white font-bold text-sm">Change Image</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-primary-500 text-slate-400 transition-colors">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-700">Click to upload card background</div>
                                                        <div className="text-xs text-slate-400 mt-1">Recommended: 1000x525px (JPG/PNG)</div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={() => setActiveStep(2)}
                                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Next Step <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STEP 2: ENTRY */}
                        <div
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeStep === 2 ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'} ${validationError && activeStep === 2 ? 'border-red-500' : ''}`}
                        >
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer"
                                onClick={() => handleStepClick(2)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 2 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
                                    <h3 className={`text-lg font-bold ${activeStep === 2 ? 'text-slate-900' : 'text-slate-600'}`}>Entry Qualifications</h3>
                                </div>
                                {activeStep !== 2 && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-900">
                                            {isRevenue ? '$' : ''}{tierData.entryThreshold.toLocaleString()} {isRevenue ? '' : currencyLabel}
                                        </span>
                                        {isCriticalLocked && <Lock size={12} className="text-slate-300" />}
                                        <ChevronDown size={20} className="text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {activeStep === 2 && (
                                <div className="px-6 pb-8 pl-[4.5rem] space-y-6 animate-in slide-in-from-top-2 duration-300 relative">
                                    {isCriticalLocked && (
                                        <div className="absolute top-0 right-6 flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                            <Lock size={12} /> Live & Locked
                                        </div>
                                    )}

                                    {isBaseTier ? (
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                                <Lock size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Auto-Enrollment Tier</h4>
                                                <p className="text-xs text-slate-500">This is the base tier. All members start here automatically with 0 requirements.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="text-xl font-medium text-slate-700 leading-relaxed flex flex-wrap items-baseline gap-2">
                                                To enter this tier, a customer must {isRevenue ? 'spend' : 'accumulate'}
                                                <div className="flex items-center">
                                                    <SentenceInput
                                                        type="number"
                                                        value={tierData.entryThreshold}
                                                        onChange={(v) => updateTier({ entryThreshold: Number(v) })}
                                                        prefix={isRevenue ? '$' : undefined}
                                                        suffix={isRevenue ? undefined : currencyLabel}
                                                        className={`mx-0 ${validationError ? 'border-red-400 text-red-600' : ''}`}
                                                        width="w-28"
                                                        disabled={isCriticalLocked}
                                                    />
                                                    {isCriticalLocked && (
                                                        <button onClick={() => setShowUnlockModal(true)} className="ml-2 p-1 bg-slate-100 rounded-full text-slate-400 hover:text-amber-500 hover:bg-amber-50">
                                                            <Lock size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Dynamic Qualification Window Dropdown */}
                                                <div className="inline-flex items-center gap-2">
                                                    <select
                                                        className="bg-transparent border-b-2 border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-primary-500 py-0.5 cursor-pointer"
                                                        value={tierData.qualificationWindow?.type || 'rolling_period'}
                                                        onChange={(e) => updateTier({
                                                            qualificationWindow: {
                                                                type: e.target.value as any,
                                                                months: tierData.qualificationWindow?.months || 12
                                                            }
                                                        })}
                                                        disabled={isCriticalLocked}
                                                    >
                                                        <option value="rolling_period">in the past</option>
                                                        <option value="membership_year">within their current membership year</option>
                                                    </select>

                                                    {(!tierData.qualificationWindow || tierData.qualificationWindow.type === 'rolling_period') && (
                                                        <SentenceInput
                                                            type="number"
                                                            value={tierData.qualificationWindow?.months || 12}
                                                            onChange={(v) => updateTier({
                                                                qualificationWindow: {
                                                                    type: 'rolling_period',
                                                                    months: Number(v)
                                                                }
                                                            })}
                                                            width="w-12"
                                                            suffix="months."
                                                            disabled={isCriticalLocked}
                                                        />
                                                    )}
                                                    {tierData.qualificationWindow?.type === 'membership_year' && (
                                                        <span>.</span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Error Feedback */}
                                            {validationError && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 animate-in slide-in-from-top-1">
                                                    <AlertCircle size={14} />
                                                    Ladder Conflict: {validationError}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={() => setActiveStep(3)}
                                            disabled={!!validationError}
                                            className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${validationError ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg'}`}
                                        >
                                            Next Step <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STEP 3: LIFECYCLE */}
                        <div
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeStep === 3 ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer"
                                onClick={() => handleStepClick(3)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 3 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>3</div>
                                    <h3 className={`text-lg font-bold ${activeStep === 3 ? 'text-slate-900' : 'text-slate-600'}`}>Lifecycle & Retention</h3>
                                </div>
                                {activeStep !== 3 && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-500">
                                            {tierData.validity.type === 'lifetime' ? 'Lifetime' : `${tierData.validity.durationMonths} Mo Validity`}
                                        </span>
                                        {tierData.validity.type !== 'lifetime' && (
                                            <>
                                                <div className="h-4 w-px bg-slate-200"></div>
                                                <span className="text-xs font-bold text-slate-500">
                                                    Goal: {tierData.retentionThreshold}
                                                </span>
                                            </>
                                        )}
                                        <ChevronDown size={20} className="text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {activeStep === 3 && (
                                <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300 relative">
                                    {isCriticalLocked && (
                                        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-500 mb-4">
                                            <Lock size={14} className="text-slate-400" />
                                            <span>Lifecycle settings are locked to prevent customer downgrade errors.</span>
                                            <button onClick={() => setShowUnlockModal(true)} className="ml-auto font-bold text-amber-600 hover:underline">Unlock</button>
                                        </div>
                                    )}

                                    {/* Validity */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Validity Period</label>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 p-4 rounded-xl border-2 transition-all ${isCriticalLocked ? 'opacity-60 cursor-not-allowed border-slate-200' : 'cursor-pointer'} ${tierData.validity.type === 'lifetime' && !isCriticalLocked ? 'border-primary-500 bg-primary-50 text-primary-700' : ''} ${tierData.validity.type === 'lifetime' && isCriticalLocked ? 'bg-slate-100 border-slate-300' : ''}`}>
                                                <input
                                                    type="radio" name="validity" className="hidden"
                                                    checked={tierData.validity.type === 'lifetime'}
                                                    onChange={() => !isCriticalLocked && updateValidity({ type: 'lifetime' })}
                                                    disabled={isCriticalLocked}
                                                />
                                                <div className="font-bold text-sm mb-1">Lifetime</div>
                                                <div className="text-xs opacity-70">Never expires once earned.</div>
                                            </label>
                                            <label className={`flex-1 p-4 rounded-xl border-2 transition-all ${isCriticalLocked ? 'opacity-60 cursor-not-allowed border-slate-200' : 'cursor-pointer'} ${tierData.validity.type === 'rolling' && !isCriticalLocked ? 'border-primary-500 bg-primary-50 text-primary-700' : ''} ${tierData.validity.type === 'rolling' && isCriticalLocked ? 'bg-slate-100 border-slate-300' : ''}`}>
                                                <input
                                                    type="radio" name="validity" className="hidden"
                                                    checked={tierData.validity.type === 'rolling'}
                                                    onChange={() => !isCriticalLocked && updateValidity({ type: 'rolling' })}
                                                    disabled={isCriticalLocked}
                                                />
                                                <div className="font-bold text-sm mb-1">Rolling Period</div>
                                                <div className="text-xs opacity-70">Expires after set months.</div>
                                            </label>
                                        </div>
                                    </div>

                                    {tierData.validity.type === 'rolling' && (
                                        <>
                                            <div className="space-y-6 pl-4 border-l-2 border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm font-medium ${isCriticalLocked ? 'text-slate-400' : 'text-slate-700'}`}>Status lasts for</span>
                                                    <SentenceInput
                                                        type="number"
                                                        value={tierData.validity.durationMonths || 12}
                                                        onChange={(v) => updateValidity({ durationMonths: Number(v) })}
                                                        width="w-16"
                                                        disabled={isCriticalLocked}
                                                    />
                                                    <span className={`text-sm font-medium ${isCriticalLocked ? 'text-slate-400' : 'text-slate-700'}`}>Months</span>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <label className={`flex items-center gap-2 ${isCriticalLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                                        <input
                                                            type="radio"
                                                            checked={tierData.validity.expirationMode === 'exact_date'}
                                                            onChange={() => !isCriticalLocked && updateValidity({ expirationMode: 'exact_date' })}
                                                            className="text-primary-600 focus:ring-primary-500"
                                                            disabled={isCriticalLocked}
                                                        />
                                                        <span className="text-sm text-slate-700">Expires exactly 365 days after entry</span>
                                                    </label>
                                                    <label className={`flex items-center gap-2 ${isCriticalLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                                        <input
                                                            type="radio"
                                                            checked={tierData.validity.expirationMode === 'end_of_month'}
                                                            onChange={() => !isCriticalLocked && updateValidity({ expirationMode: 'end_of_month' })}
                                                            className="text-primary-600 focus:ring-primary-500"
                                                            disabled={isCriticalLocked}
                                                        />
                                                        <span className="text-sm text-slate-700">Expires end of month (Round up)</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Retention Rule */}
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Retention Goal</label>
                                                <div className={`text-lg font-medium ${isCriticalLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                                                    To renew, member must {isRevenue ? 'spend' : 'earn'}
                                                    <SentenceInput
                                                        type="number"
                                                        value={tierData.retentionThreshold || 0}
                                                        onChange={(v) => updateTier({ retentionThreshold: Number(v) })}
                                                        prefix={isRevenue ? '$' : undefined}
                                                        className="mx-2"
                                                        width="w-24"
                                                        disabled={isCriticalLocked}
                                                    />
                                                    during their validity period.
                                                </div>
                                            </div>

                                            {/* Downgrade Logic */}
                                            <div className="pt-6 border-t border-slate-100">
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Failure Logic (Downgrade)</label>

                                                <div className="grid grid-cols-1 gap-4">
                                                    {/* Option 1: Soft Landing */}
                                                    <div
                                                        onClick={() => !isCriticalLocked && updateTier({ downgradeLogic: 'soft_landing' })}
                                                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-5 ${tierData.downgradeLogic === 'soft_landing'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                            } ${isCriticalLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className={`p-3 rounded-full shrink-0 ${tierData.downgradeLogic === 'soft_landing' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            <ShieldCheck size={24} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-900 text-base mb-1">Soft Landing</h4>
                                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                                Member drops exactly 1 tier (e.g. Gold → Silver). Safe and predictable.
                                                            </p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${tierData.downgradeLogic === 'soft_landing' ? 'border-primary-500' : 'border-slate-300'}`}>
                                                            {tierData.downgradeLogic === 'soft_landing' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                                                        </div>
                                                    </div>

                                                    {/* Option 2: Hard Reset */}
                                                    <div
                                                        onClick={() => !isCriticalLocked && updateTier({ downgradeLogic: 'hard_reset' })}
                                                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-5 ${tierData.downgradeLogic === 'hard_reset'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                            } ${isCriticalLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className={`p-3 rounded-full shrink-0 ${tierData.downgradeLogic === 'hard_reset' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            <AlertTriangle size={24} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-900 text-base mb-1">Hard Reset</h4>
                                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                                Member returns to base tier immediately if they fail retention. High stakes.
                                                            </p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${tierData.downgradeLogic === 'hard_reset' ? 'border-primary-500' : 'border-slate-300'}`}>
                                                            {tierData.downgradeLogic === 'hard_reset' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                                                        </div>
                                                    </div>

                                                    {/* Option 3: Dynamic */}
                                                    <div
                                                        onClick={() => !isCriticalLocked && updateTier({ downgradeLogic: 'dynamic_matching' })}
                                                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-5 ${tierData.downgradeLogic === 'dynamic_matching'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                                            } ${isCriticalLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className={`p-3 rounded-full shrink-0 ${tierData.downgradeLogic === 'dynamic_matching' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            <Scale size={24} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-900 text-base mb-1">Dynamic Re-qualification</h4>
                                                            <p className="text-sm text-slate-500 leading-relaxed">
                                                                System recalculates status based on actual activity. Example: A Diamond member who only spent enough for Gold will drop directly to Gold.
                                                            </p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${tierData.downgradeLogic === 'dynamic_matching' ? 'border-primary-500' : 'border-slate-300'}`}>
                                                            {tierData.downgradeLogic === 'dynamic_matching' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            onClick={() => setActiveStep(4)}
                                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Next Step <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* STEP 4: REWARDS */}
                        <div
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeStep === 4 ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer"
                                onClick={() => handleStepClick(4)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 4 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>4</div>
                                    <h3 className={`text-lg font-bold ${activeStep === 4 ? 'text-slate-900' : 'text-slate-600'}`}>Rewards & Benefits</h3>
                                </div>
                                {activeStep !== 4 && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2">
                                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">{tierData.multiplier}x Pts</span>
                                            {tierData.benefits.length > 0 && (
                                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">+{tierData.benefits.length} More</span>
                                            )}
                                        </div>
                                        <ChevronDown size={20} className="text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {activeStep === 4 && (
                                <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300">

                                    {/* Section 1: Ongoing */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Zap size={16} className="text-slate-400" />
                                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Ongoing Privileges</h4>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4 ml-6">What perks do they enjoy continuously while they hold this status?</p>

                                        <div className="space-y-3">
                                            {/* 1. Base Multiplier (Fixed) */}
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl relative">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm text-yellow-500">
                                                    <Zap size={14} className="fill-yellow-500" />
                                                </div>
                                                <div className={`flex-1 font-medium ${isCriticalLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                                                    Earn <SentenceInput value={tierData.multiplier} onChange={(v) => updateTier({ multiplier: Number(v) })} width="w-12" className="mx-1" disabled={isCriticalLocked} />x Base Rate on all purchases.
                                                </div>
                                                {isCriticalLocked && (
                                                    <div className="absolute right-3 top-3" title="Locked Live Setting">
                                                        <Lock size={12} className="text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Triggers (The Hybrid Design) */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 pt-6 border-t border-slate-100">
                                            <Gift size={16} className="text-slate-400" />
                                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                                {isBaseTier ? 'Onboarding Gift' : 'Lifecycle Events'}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4 ml-6">What happens when specific events occur?</p>

                                        <div className="space-y-4">

                                            {/* SCENARIO A: Standard Tier (Status Milestones) */}
                                            {!isBaseTier && (
                                                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                                                    <div className="grid grid-cols-2 divide-x divide-slate-200">

                                                        {/* Upgrade (Entry) */}
                                                        <div className="p-5">
                                                            <div className="flex items-start gap-4 mb-4">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                                    <ArrowUp size={20} />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-bold text-slate-900">On Upgrade (Entry)</h5>
                                                                    <p className="text-xs text-slate-500 mt-1">One-time bonus when they first qualify.</p>
                                                                </div>
                                                            </div>
                                                            {renderRewardList('upgrade')}
                                                            <button
                                                                onClick={() => setShowRewardModal('upgrade')}
                                                                className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-white transition-all"
                                                            >
                                                                + Add Reward
                                                            </button>
                                                        </div>

                                                        {/* Renewal (Retention) */}
                                                        <div className="p-5">
                                                            <div className="flex items-start gap-4 mb-4">
                                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                                    <RotateCw size={20} />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-bold text-slate-900">On Renewal</h5>
                                                                    <p className="text-xs text-slate-500 mt-1">Bonus for retaining status another year.</p>
                                                                </div>
                                                            </div>
                                                            {renderRewardList('renewal')}
                                                            <button
                                                                onClick={() => setShowRewardModal('renewal')}
                                                                className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-white transition-all"
                                                            >
                                                                + Add Reward
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}

                                            {/* SCENARIO B: Base Tier (Onboarding) */}
                                            {isBaseTier && (
                                                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">

                                                    {/* Welcome */}
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                                                                <Gift size={14} />
                                                            </div>
                                                            <span className="font-bold text-slate-900 text-sm">Onboarding Gift</span>
                                                        </div>
                                                        {renderRewardList('welcome')}
                                                        <button
                                                            onClick={() => setShowRewardModal('welcome')}
                                                            className="text-xs font-bold text-primary-600 hover:text-primary-700 ml-9 flex items-center gap-1"
                                                        >
                                                            <PlusIcon /> Add Reward
                                                        </button>
                                                    </div>

                                                </div>
                                            )}


                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Live Impact Simulation Bar --- */}
                    {isLive && initialData && !isCriticalLocked && (
                        <ImpactSimulationBar
                            originalEntry={initialData.entryThreshold}
                            newEntry={tierData.entryThreshold}
                            currencyLabel={currencyLabel}
                        />
                    )}
                </div>

                {/* 4. Live Preview (Right Rail) */}
                <div className="w-1/3 h-full bg-slate-50 border-l border-slate-200 relative">
                    <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                    <div className="relative h-full flex flex-col items-center justify-center p-8">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Live Member Experience</div>
                        {renderPreviewCard()}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Mini Icon
const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mr-1">
        <path d="M6 2.5V9.5M2.5 6H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default TierWizard;