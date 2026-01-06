import React, { useState } from 'react';
import { ChevronDown, Receipt, Zap, Target, Gift } from 'lucide-react';
import { Campaign } from '../../../types';

interface StrategyReceiptProps {
    campaign: Campaign;
}

export const StrategyReceipt: React.FC<StrategyReceiptProps> = ({ campaign }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-slate-900 rounded-4xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex justify-between items-center text-white hover:bg-slate-800 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 rounded-xl">
                        <Receipt className="text-primary-400" size={20} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold tracking-tight">Strategy Receipt</h3>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">Natural language rules summary</p>
                    </div>
                </div>
                <ChevronDown
                    className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>

            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={10} className="text-primary-400" /> Trigger
                        </label>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                            {campaign.type === 'referral'
                                ? "When a member refers a friend who successfully completes their first purchase."
                                : "When a member completes a qualifying transaction at selected stores."}
                        </p>
                    </div>

                    <div className="space-y-3 border-slate-800 md:border-l md:pl-8">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Target size={10} className="text-primary-400" /> Condition
                        </label>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                            Targeting: <span className="text-primary-400">
                                {campaign.targetTiers.length > 0 ? campaign.targetTiers.join(', ') : 'All Tiers'}
                            </span>
                            <br />
                            Stores: <span className="text-primary-400">
                                {campaign.targetStores.length > 0 ? campaign.targetStores.join(', ') : 'All Stores'}
                            </span>
                        </p>
                    </div>

                    <div className="space-y-3 border-slate-800 md:border-l md:pl-8">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Gift size={10} className="text-primary-400" /> Reward
                        </label>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                            {campaign.type === 'referral'
                                ? "Inviter: 500 Points\nFriend: 10% Welcome Coupon"
                                : "2x Points on all valid items plus a $5 Voucher on next visit."}
                        </p>
                    </div>
                </div>
                <div className="px-8 pb-8">
                    <div className="h-px bg-slate-800 w-full mb-6"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Configuration ID: {campaign.id}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Last Sync: Oct 24, 2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
