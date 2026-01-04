import React from 'react';
import { X, TrendingUp, Users, Gift, Code2, ArrowRight, Sparkles, Lock, Zap, Layers, BarChart, Ticket, Workflow } from 'lucide-react';
import { CampaignType } from '../../types';

interface TemplateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: CampaignType) => void;
}

const TemplateDrawer: React.FC<TemplateDrawerProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Drawer Container */}
      <div className="bg-white w-full sm:w-[480px] h-[80vh] sm:h-full sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300 relative">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Campaign</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Select a goal to get started</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            
            {/* Template 1: Boost Sales - Extra Rewards */}
            <button 
              onClick={() => onSelect('boost_sales')}
              className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={80} className="text-blue-600" />
              </div>
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Boost Sales - Extra Rewards</h4>
                  <p className="text-sm text-slate-500 leading-snug mt-1 mb-3">
                    Instant gratification. Drive revenue with point multipliers (2x) or direct bonuses on specific items.
                  </p>
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    Select Template <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </button>

            {/* Template 2: Boost Sales - Accumulated Rewards */}
            <button 
              onClick={() => onSelect('accumulated')}
              className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart size={80} className="text-indigo-600" />
              </div>
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Layers size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Boost Sales - Accumulated</h4>
                  <p className="text-sm text-slate-500 leading-snug mt-1 mb-3">
                    Gamified progress. "Spend $500 this month to unlock a $50 Voucher".
                  </p>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    Select Template <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </button>

            {/* Template 3: Refer Friends */}
            <button 
              onClick={() => onSelect('referral')}
              className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} className="text-purple-600" />
              </div>
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Refer Friends</h4>
                  <p className="text-sm text-slate-500 leading-snug mt-1 mb-3">
                    Viral growth. Reward existing members for bringing in new customers.
                  </p>
                  <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                    Select Template <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </button>

            <div className="pt-4 border-t border-slate-200/50">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">For Developers</h5>
              {/* Template 5: Advanced / Custom - DISABLED */}
              <button 
                disabled
                className="w-full bg-slate-100 p-5 rounded-2xl border border-slate-200 shadow-none cursor-not-allowed text-left relative overflow-hidden opacity-75 select-none"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Workflow size={80} className="text-slate-500" />
                </div>
                
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 bg-slate-200/80 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-slate-300 backdrop-blur-sm">
                    Coming Soon
                </div>

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 border border-slate-300 text-slate-500 grayscale">
                    <Workflow size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-500">Advanced Automation</h4>
                    <p className="text-sm text-slate-400 leading-snug mt-1 mb-3">
                      Build complex multi-step workflows with triggers, conditions, delays, and webhooks.
                    </p>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      Builder Locked <Lock size={12} />
                    </span>
                  </div>
                </div>
              </button>
            </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Need help choosing? <a href="#" className="text-primary-600 hover:underline">Read the Campaign Guide</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default TemplateDrawer;