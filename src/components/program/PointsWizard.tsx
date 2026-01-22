import React, { useState } from 'react';
import {
    X, ArrowRight, ArrowLeft, CheckCircle2, Circle,
    Trash2, Plus, AlertCircle, Info, ToggleLeft, ToggleRight, Coins, TrendingUp, ShieldAlert, Activity,
    ChevronUp, ChevronDown, DollarSign, Percent
} from 'lucide-react';
import { PointsConfig, EarnRule, AttributeCondition, ExclusionGroup } from '../../types';
import SentenceInput from './SentenceInput';

interface PointsWizardProps {
    initialData: PointsConfig | null;
    onClose: () => void;
    onSave: (data: PointsConfig, shouldPublish?: boolean) => void;
    // Context from Step 1 (Mocked for now as 'points_accumulated' to show Scenario B)
    programType?: 'total_spend' | 'points_accumulated';
    onPrevStep?: () => void;
}

const DEFAULT_POINTS_CONFIG: PointsConfig = {
    enabled: true,
    currencyName: 'Points',
    earnStrategy: 'sync_stars', // Default to Hybrid
    customRatio: { points: 1, spend: 1 },
    earnRules: [],
    expirationPolicy: 'no_expiration',
    fixedDateConfig: { month: 12, day: 31, gracePeriodDays: 30 },
    dynamicConfig: {
        durationValue: 12,
        durationUnit: 'months',
        extendOnActivity: true,
        expirationSchedule: 'end_of_month'
    },
    exchangeRate: { points: 100, cash: 1 },
    minRedemptionPoints: 100,
    maxRedemptionType: 'percentage',
    maxRedemptionValue: 20,
    excludeGiftCards: true,
    exclusionRules: [],
};

// --- Financial Impact Simulator Component ---
const FinancialImpactSimulator = ({ policy }: { policy: PointsConfig['expirationPolicy'] }) => {
    const isHighRisk = policy === 'no_expiration';
    const isBalanced = policy === 'dynamic_validity';

    const styles = isHighRisk
        ? { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-900', sub: 'text-red-600', stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.1)' }
        : { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', sub: 'text-blue-600', stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.1)' };

    // SVG Paths for 200x60 viewbox
    const getPath = () => {
        if (isHighRisk) return "M 0,60 L 200,5"; // Linear up
        return "M 0,60 C 40,60 60,20 200,20"; // Logistic curve / plateau
    };

    const getFillPath = () => {
        if (isHighRisk) return "M 0,60 L 200,5 L 200,60 Z";
        return "M 0,60 C 40,60 60,20 200,20 L 200,60 Z";
    };

    return (
        <div className={`mt-4 rounded-xl border ${styles.bg} ${styles.border} p-5 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden`}>
            {/* Background Decoration */}
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                {isHighRisk && <TrendingUp size={120} />}
                {isBalanced && <Activity size={120} />}
            </div>

            {/* Left: Graph */}
            <div className="relative w-full md:w-48 h-24 shrink-0 bg-white/50 rounded-lg border border-white/60 p-2 shadow-sm">
                <div className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider opacity-50">Liability (Debt)</div>
                <svg viewBox="0 0 200 65" className="w-full h-full overflow-visible">
                    <path d={getFillPath()} fill={styles.fill} stroke="none" />
                    <path d={getPath()} fill="none" stroke={styles.stroke} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="absolute bottom-1 right-2 text-[10px] font-bold uppercase tracking-wider opacity-50">Time</div>
            </div>

            {/* Right: Data */}
            <div className="flex-1 space-y-2 z-10">
                <div className="flex items-center gap-2">
                    {isHighRisk && <ShieldAlert size={18} className="text-red-600" />}
                    {isBalanced && <Activity size={18} className="text-blue-600" />}
                    <h4 className={`font-bold text-sm uppercase tracking-wide ${styles.text}`}>
                        {isHighRisk ? 'Accumulating Debt' : 'Stabilized Liability'}
                    </h4>
                </div>

                <p className={`text-sm ${styles.sub} font-medium leading-snug`}>
                    {isHighRisk && "Liability grows indefinitely as points are never removed. Recommended only for high-margin luxury brands."}
                    {isBalanced && "Active members keep points; inactive accounts clear automatically. The industry standard balance."}
                </p>

                <div className="flex items-center gap-6 pt-1">
                    <div>
                        <span className="block text-[10px] font-bold opacity-60 uppercase">Financial Risk</span>
                        <span className={`text-lg font-extrabold ${styles.text}`}>
                            {isHighRisk ? 'High' : 'Medium'}
                        </span>
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold opacity-60 uppercase">Est. Breakage</span>
                        <span className={`text-lg font-extrabold ${styles.text}`}>
                            {isHighRisk ? '0%' : '~15%'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PointsWizard: React.FC<PointsWizardProps> = ({
    initialData,
    onClose,
    onSave,
    programType = 'points_accumulated', // Defaulting to the "Engagement" scenario (Hybrid)
    onPrevStep
}) => {
    const [config, setConfig] = useState<PointsConfig>(initialData || DEFAULT_POINTS_CONFIG);
    const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0); // 0: Earn, 1: Expiration, 2: Redemption

    // --- Helpers ---
    const updateConfig = (updates: Partial<PointsConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        if (activeTab < 2) {
            setActiveTab((prev) => (prev + 1) as 0 | 1 | 2);
        } else {
            // Just Save, Do NOT Publish
            onSave(config, false);
        }
    };

    const handleBack = () => {
        if (activeTab > 0) {
            setActiveTab((prev) => (prev - 1) as 0 | 1 | 2);
        } else if (onPrevStep) {
            onPrevStep();
        } else {
            onClose();
        }
    };

    // --- Renderers for Complex Sub-Logic ---

    // Renders the "Exception Engine" (Inclusion Rules) for Earn Tab
    const renderEarnRules = () => {
        const addRule = () => {
            const newRule: EarnRule = {
                id: Math.random().toString(36).substr(2, 9),
                storeScope: '',
                conditions: [],
                multiplier: 2
            };
            updateConfig({ earnRules: [...config.earnRules, newRule] });
        };

        const removeRule = (id: string) => {
            updateConfig({ earnRules: config.earnRules.filter(r => r.id !== id) });
        };

        const updateRuleConditions = (ruleId: string, conditions: AttributeCondition[]) => {
            const updatedRules = config.earnRules.map(r =>
                r.id === ruleId ? { ...r, conditions } : r
            );
            updateConfig({ earnRules: updatedRules });
        };

        const moveRule = (index: number, direction: 'up' | 'down') => {
            if (direction === 'up' && index === 0) return;
            if (direction === 'down' && index === config.earnRules.length - 1) return;

            const newRules = [...config.earnRules];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            // Swap
            [newRules[index], newRules[targetIndex]] = [newRules[targetIndex], newRules[index]];

            updateConfig({ earnRules: newRules });
        };

        return (
            <div className="space-y-6">

                {/* Logic Banner */}
                {config.earnRules.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 mb-6">
                        <Info size={18} className="shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm">Rules are evaluated Top-to-Bottom</h4>
                            <p className="text-xs mt-1 text-indigo-700">
                                The system checks each transaction against these rules in order. The <strong className="font-bold">first rule that matches</strong> will be applied, and no subsequent rules will be checked. Use the arrows to prioritize specific campaigns.
                            </p>
                        </div>
                    </div>
                )}

                {config.earnRules.map((rule, index) => (
                    <div key={rule.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative group transition-all hover:border-slate-300">

                        {/* Priority Badge */}
                        <div className="absolute top-0 left-0 bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-br-xl rounded-tl-xl border-r border-b border-white shadow-sm z-10">
                            Priority {index + 1}
                        </div>

                        {/* Reorder Controls */}
                        <div className="absolute top-4 right-14 flex flex-col gap-1">
                            <button
                                onClick={() => moveRule(index, 'up')}
                                disabled={index === 0}
                                className={`p-1 rounded hover:bg-white hover:shadow-sm transition-all ${index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500'}`}
                                title="Move Up"
                            >
                                <ChevronUp size={16} />
                            </button>
                            <button
                                onClick={() => moveRule(index, 'down')}
                                disabled={index === config.earnRules.length - 1}
                                className={`p-1 rounded hover:bg-white hover:shadow-sm transition-all ${index === config.earnRules.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500'}`}
                                title="Move Down"
                            >
                                <ChevronDown size={16} />
                            </button>
                        </div>

                        <button
                            onClick={() => removeRule(rule.id)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="space-y-6 pt-4">
                            {/* Condition A: Location */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-slate-900 font-bold text-sm">Where</span>
                                </div>
                                <div className="ml-3 flex items-center gap-3">
                                    <span className="text-slate-500 font-medium text-sm">Customer shops at</span>
                                    <div className="relative">
                                        <select
                                            className="appearance-none bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 pl-3 pr-10 py-2 font-bold cursor-pointer"
                                            value={rule.storeScope || ''}
                                            onChange={(e) => {
                                                const updated = config.earnRules.map(r => r.id === rule.id ? { ...r, storeScope: e.target.value } : r);
                                                updateConfig({ earnRules: updated });
                                            }}
                                        >
                                            <option value="">Any Store</option>
                                            <option value="K11">K11 Musea</option>
                                            <option value="IFC">IFC Mall</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Outcome */}
                            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
                                <span className="text-slate-900 font-bold">Then Earn</span>
                                <SentenceInput
                                    type="number"
                                    value={rule.multiplier}
                                    onChange={(v) => {
                                        const updated = config.earnRules.map(r => r.id === rule.id ? { ...r, multiplier: Number(v) } : r);
                                        updateConfig({ earnRules: updated });
                                    }}
                                    width="w-12"
                                />
                                <span className="text-slate-900 font-medium">Points per $1 Spent.</span>
                                <span className="ml-2 bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {rule.multiplier}x Multiplier
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addRule}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Add Bonus Rule
                </button>
            </div>
        );
    };

    // Renders the Expiration Card Content
    const renderExpirationContent = () => {
        return (
            <div className="animate-in fade-in slide-in-from-top-2">
                {/* Dynamic Financial Simulator */}
                <FinancialImpactSimulator policy={config.expirationPolicy} />

                {/* Configuration Fields */}

                {config.expirationPolicy === 'dynamic_validity' && (
                    <div className="mt-6 space-y-6 pl-4 border-l-2 border-slate-100">
                        {/* Step 1: Timer */}
                        <div className="text-lg text-slate-600 font-medium flex items-center flex-wrap gap-1">
                            Points remain valid for
                            <SentenceInput
                                value={config.dynamicConfig?.durationValue || 12}
                                onChange={(v) => updateConfig({ dynamicConfig: { ...config.dynamicConfig!, durationValue: Number(v) } })}
                                width="w-12"
                                className="mx-2"
                            />
                            <div className="relative inline-block mx-1">
                                <select
                                    className="appearance-none bg-transparent border-b-2 border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-primary-500 py-0.5 pr-6 cursor-pointer"
                                    value={config.dynamicConfig?.durationUnit}
                                    onChange={(e) => updateConfig({ dynamicConfig: { ...config.dynamicConfig!, durationUnit: e.target.value as any } })}
                                >
                                    <option value="months">Months</option>
                                    <option value="days">Days</option>
                                    <option value="years">Years</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                            after they are earned.
                        </div>

                        {/* Step 3: Cleanup */}
                        <div className="flex items-center gap-3 pt-2">
                            <span className="text-sm font-medium text-slate-500">Unused points are removed on</span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-3 pr-10 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
                                    value={config.dynamicConfig?.expirationSchedule}
                                    onChange={(e) => updateConfig({ dynamicConfig: { ...config.dynamicConfig!, expirationSchedule: e.target.value as any } })}
                                >
                                    <option value="anniversary">The exact anniversary day</option>
                                    <option value="end_of_month">The end of the Month</option>
                                    <option value="end_of_quarter">The end of the Quarter</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="w-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

            {/* Zone A: Global Wrapper */}
            <div className="px-10 py-8 border-b border-slate-100 bg-white shrink-0 rounded-t-3xl">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-wide">
                                Step 2 of 3
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                                {activeTab === 0 && "Define the redeemable points for your program."}
                                {activeTab === 1 && "Manage your financial liability. Create urgency."}
                                {activeTab === 2 && "Turn points into purchasing power."}
                            </span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                            Points Configuration
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onSave(config, false)}
                            className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            Save & Finish later
                        </button>
                    </div>
                </div>

                {/* Tabs / Progress */}
                <div className="flex items-center gap-8 border-b border-slate-100">
                    {[
                        { id: 0, label: 'Earn Rules' },
                        { id: 1, label: 'Expiration Rules' },
                        { id: 2, label: 'Redemption Rules' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            disabled={tab.id > activeTab} // Strict Linear Flow? Or allow jump? Assuming linear for Wizard.
                            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${activeTab === tab.id
                                ? 'text-primary-600 border-primary-500'
                                : activeTab > tab.id
                                    ? 'text-slate-800 border-transparent hover:text-primary-500 cursor-pointer'
                                    : 'text-slate-400 border-transparent cursor-not-allowed'
                                }`}
                            onClick={() => { if (tab.id < activeTab) setActiveTab(tab.id as 0 | 1 | 2) }}
                        >
                            <div className="flex items-center gap-2">
                                {activeTab > tab.id && <CheckCircle2 size={16} className="text-green-500" />}
                                {tab.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Zone B: Dynamic Content Area */}
            <div className="flex-1 p-10 bg-slate-50/50 overflow-y-auto">
                <div className="max-w-3xl mx-auto">

                    {/* TAB 1: EARN RULES */}
                    {activeTab === 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">

                        {/* L2: Identity */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name displayed to customers</label>
                            <input
                                type="text"
                                value={config.currencyName}
                                onChange={(e) => updateConfig({ currencyName: e.target.value })}
                                className="w-full text-lg font-bold border-b-2 border-slate-200 py-2 focus:border-primary-500 outline-none bg-transparent"
                            />
                        </div>

                        {/* L3: Strategy Selector (Conditional) */}
                        {programType === 'points_accumulated' ? (
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900">Earning Strategy</h4>

                                <div
                                    onClick={() => updateConfig({ earnStrategy: 'sync_stars' })}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${config.earnStrategy === 'sync_stars' ? 'border-primary-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.earnStrategy === 'sync_stars' ? 'border-primary-500' : 'border-slate-300'}`}>
                                            {config.earnStrategy === 'sync_stars' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                                        </div>
                                        <span className="font-bold text-slate-900">Sync with Stars (1:1 Ratio)</span>
                                    </div>
                                    <p className="text-sm text-slate-500 ml-8">Every time a user earns 1 Star for status, they also get 1 Point to spend.</p>
                                </div>

                                <div
                                    onClick={() => updateConfig({ earnStrategy: 'custom_ratio' })}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${config.earnStrategy === 'custom_ratio' ? 'border-primary-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${config.earnStrategy === 'custom_ratio' ? 'border-primary-500' : 'border-slate-300'}`}>
                                            {config.earnStrategy === 'custom_ratio' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                                        </div>
                                        <span className="font-bold text-slate-900">Custom Ratio</span>
                                    </div>
                                    {config.earnStrategy === 'custom_ratio' && (
                                        <div className="ml-8 mt-2 text-slate-600 font-medium">
                                            Customers earn
                                            <SentenceInput
                                                value={config.customRatio?.points || 1}
                                                onChange={(v) => updateConfig({ customRatio: { ...config.customRatio!, points: Number(v) } })}
                                                width="w-12"
                                                className="mx-2"
                                            />
                                            Point per $
                                            <SentenceInput
                                                value={config.customRatio?.spend || 1}
                                                onChange={(v) => updateConfig({ customRatio: { ...config.customRatio!, spend: Number(v) } })}
                                                width="w-12"
                                                className="mx-2"
                                            />
                                            Spent.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Revenue Only Scenario */
                            <div className="bg-slate-100 p-6 rounded-2xl">
                                <div className="text-lg text-slate-900 font-medium">
                                    Customers earn
                                    <SentenceInput
                                        value={config.customRatio?.points || 1}
                                        onChange={(v) => updateConfig({ customRatio: { ...config.customRatio!, points: Number(v) } })}
                                        width="w-12"
                                        className="mx-2"
                                    />
                                    Point per $
                                    <SentenceInput
                                        value={config.customRatio?.spend || 1}
                                        onChange={(v) => updateConfig({ customRatio: { ...config.customRatio!, spend: Number(v) } })}
                                        width="w-12"
                                        className="mx-2"
                                    />
                                    Spent.
                                </div>
                            </div>
                        )}

                        {/* L4: Exception Engine */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h4 className="font-bold text-slate-900">Bonus Rules (Exceptions)</h4>
                            {renderEarnRules()}
                        </div>
                    </div>
                    )}

                    {/* TAB 2: EXPIRATION RULES */}
                    {activeTab === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">

                            {/* Option A: Friendly */}
                            <div
                                onClick={() => updateConfig({ expirationPolicy: 'no_expiration' })}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${config.expirationPolicy === 'no_expiration' ? 'border-primary-500 bg-white shadow-lg' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                            <span className="text-xl">∞</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">No Expiration (Lifetime Validity)</h3>
                                            <p className="text-sm text-slate-500 mt-1">Points never expire. Best for high-value VIP programs.</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.expirationPolicy === 'no_expiration' ? 'border-primary-500' : 'border-slate-300'}`}>
                                        {config.expirationPolicy === 'no_expiration' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                                    </div>
                                </div>
                                {config.expirationPolicy === 'no_expiration' && renderExpirationContent()}
                            </div>

                            {/* Option B: Retail Standard (Dynamic Validity) */}
                            <div
                                onClick={() => updateConfig({ expirationPolicy: 'dynamic_validity' })}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${config.expirationPolicy === 'dynamic_validity' ? 'border-primary-500 bg-white shadow-lg' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                            <ArrowRight size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Dynamic Validity (Rolling Model)</h3>
                                            <p className="text-sm text-slate-500 mt-1">Points expire after a set period of time, unless new activity occurs.</p>
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${config.expirationPolicy === 'dynamic_validity' ? 'border-primary-500' : 'border-slate-300'}`}>
                                        {config.expirationPolicy === 'dynamic_validity' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                                    </div>
                                </div>
                                {config.expirationPolicy === 'dynamic_validity' && renderExpirationContent()}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: REDEMPTION RULES */}
                    {activeTab === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">

                            {/* 1. Exchange Rate */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Cash Equivalent</h3>
                                <div className="text-lg font-medium text-slate-600">
                                    When used at checkout,
                                    <SentenceInput
                                        value={config.exchangeRate.points}
                                        onChange={(v) => updateConfig({ exchangeRate: { ...config.exchangeRate, points: Number(v) } })}
                                        width="w-16"
                                        className="mx-2"
                                    />
                                    Points are worth $
                                    <SentenceInput
                                        value={config.exchangeRate.cash}
                                        onChange={(v) => updateConfig({ exchangeRate: { ...config.exchangeRate, cash: Number(v) } })}
                                        width="w-12"
                                        className="mx-2"
                                    />
                                    HKD.
                                </div>
                                <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                                    <Info size={14} className="text-slate-500" />
                                    <span className="text-xs font-bold text-slate-600">
                                        Effective Rate: 1 Point = ${(config.exchangeRate.cash / config.exchangeRate.points).toFixed(3)}
                                    </span>
                                </div>
                            </div>

                            {/* 2. Transaction Limits */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                                <h3 className="text-lg font-bold text-slate-900">Transaction Limits (Cart Controls)</h3>

                                {/* Floor */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Minimum Threshold</label>
                                    <div className="text-slate-700 font-medium">
                                        Minimum redemption amount:
                                        <SentenceInput
                                            value={config.minRedemptionPoints}
                                            onChange={(v) => updateConfig({ minRedemptionPoints: Number(v) })}
                                            width="w-16"
                                            className="mx-2"
                                        />
                                        Points.
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Prevents micro-transactions.</p>
                                </div>

                                {/* Ceiling */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Maximum Cap (Liability Control)</label>
                                    <div className="space-y-3">
                                        {/* Fixed Amount Option */}
                                        <div
                                            onClick={() => updateConfig({ maxRedemptionType: 'fixed' })}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${config.maxRedemptionType === 'fixed' ? 'border-primary-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl ${config.maxRedemptionType === 'fixed' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        <DollarSign size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Fixed Amount ($ Limit)</h4>
                                                        <p className="text-sm text-slate-500">Set a maximum dollar discount per order.</p>
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${config.maxRedemptionType === 'fixed' ? 'border-primary-500' : 'border-slate-300'}`}>
                                                    {config.maxRedemptionType === 'fixed' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                                                </div>
                                            </div>
                                            {config.maxRedemptionType === 'fixed' && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 text-slate-700 font-medium">
                                                    Max discount of $HK
                                                    <SentenceInput
                                                        value={config.maxRedemptionValue}
                                                        onChange={(v) => updateConfig({ maxRedemptionValue: Number(v) })}
                                                        width="w-16"
                                                        className="mx-2"
                                                    />
                                                    per order.
                                                </div>
                                            )}
                                        </div>

                                        {/* Percentage Cap Option */}
                                        <div
                                            onClick={() => updateConfig({ maxRedemptionType: 'percentage' })}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${config.maxRedemptionType === 'percentage' ? 'border-primary-500 bg-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl ${config.maxRedemptionType === 'percentage' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Percent size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Percentage Cap (% of Subtotal)</h4>
                                                        <p className="text-sm text-slate-500">Limit redemption to a percentage of cart value.</p>
                                                    </div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${config.maxRedemptionType === 'percentage' ? 'border-primary-500' : 'border-slate-300'}`}>
                                                    {config.maxRedemptionType === 'percentage' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                                                </div>
                                            </div>
                                            {config.maxRedemptionType === 'percentage' && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 text-slate-700 font-medium">
                                                    Points can cover up to
                                                    <SentenceInput
                                                        value={config.maxRedemptionValue}
                                                        onChange={(v) => updateConfig({ maxRedemptionValue: Number(v) })}
                                                        width="w-12"
                                                        className="mx-2"
                                                    />
                                                    % of subtotal.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>

            {/* Zone D: Footer Navigation */}
            <div className="px-10 py-6 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0 rounded-b-3xl">
                <button
                    onClick={handleBack}
                    className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors flex items-center gap-2"
                >
                    {activeTab === 0 ? <><ArrowLeft size={18} /> Back to Step 1</> : <><ArrowLeft size={18} /> Back</>}
                </button>
                <button
                    onClick={handleNext}
                    className="px-10 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200 hover:shadow-2xl hover:scale-[1.01]"
                >
                    {activeTab === 2 ? "Save & Continue" : "Next Step"}
                    {activeTab < 2 && <ArrowRight size={20} />}
                </button>
            </div>

        </div>
    );
};

export default PointsWizard;