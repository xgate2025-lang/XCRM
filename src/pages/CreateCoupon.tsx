
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Ticket, Percent, Package, Truck,
  Calendar, Info, AlertCircle, CheckCircle2,
  Trash2, Plus, Zap, ShieldCheck, Clock,
  Smartphone, ChevronRight, Save, Rocket, X, Tag, Users,
  ChevronDown, ArrowRight, Loader2
} from 'lucide-react';
import { NavItemId, CouponType, CouponData } from '../types';
import SentenceInput from '../components/program/SentenceInput';
import { useCoupon } from '../context/CouponContext';
import { useOnboarding } from '../context/OnboardingContext';

interface CreateCouponProps {
  onNavigate: (id: NavItemId) => void;
}

const CreateCoupon: React.FC<CreateCouponProps> = ({ onNavigate }) => {
  const { addCoupon } = useCoupon();
  const { toggleSubtask } = useOnboarding();

  // --- Wizard Step State ---
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // --- Form State ---
  const [name, setName] = useState('New Spring Voucher');
  const [internalCode, setInternalCode] = useState(`SPR-${Math.floor(1000 + Math.random() * 9000)}-X`);
  const [type, setType] = useState<CouponType>('cash');
  const [value, setValue] = useState(10);
  const [minSpend, setMinSpend] = useState(50);
  const [totalInventory, setTotalInventory] = useState(5000);
  const [perUserLimit, setPerUserLimit] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [neverExpires, setNeverExpires] = useState(false);

  // --- Derived Data for Preview ---
  const formattedValue = useMemo(() => {
    if (type === 'cash') return `$${value}`;
    if (type === 'percentage') return `${value}%`;
    if (type === 'shipping') return `FREE`;
    return 'GIFT';
  }, [type, value]);

  const getTypeIcon = (t: CouponType) => {
    switch (t) {
      case 'cash': return <Ticket size={24} />;
      case 'percentage': return <Percent size={24} />;
      case 'sku': return <Package size={24} />;
      case 'shipping': return <Truck size={24} />;
    }
  };

  const getTypeColor = (t: CouponType) => {
    switch (t) {
      case 'cash': return 'from-green-500 to-emerald-700';
      case 'percentage': return 'from-blue-500 to-indigo-700';
      case 'sku': return 'from-purple-500 to-fuchsia-700';
      case 'shipping': return 'from-orange-500 to-amber-700';
    }
  };

  const handleStepClick = (step: 1 | 2 | 3 | 4) => {
    setActiveStep(step);
  };

  const constructCouponObject = (status: 'Live' | 'Draft'): CouponData => {
    return {
      id: `cpn_${Math.random().toString(36).substr(2, 9)}`,
      code: internalCode,
      name: name,
      displayName: formattedValue + (type === 'shipping' ? '' : ' Voucher'),
      type: type,
      value: formattedValue,
      audience: ['All Tiers'],
      inventory: { total: totalInventory, used: 0 },
      validity: {
        start: startDate,
        end: neverExpires ? null : endDate,
        isRolling: neverExpires
      },
      status: status,
      revenue: 0
    };
  };

  // --- Action Handlers ---
  const handleLaunch = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const newCoupon = constructCouponObject('Live');
      addCoupon(newCoupon);
      setIsProcessing(false);
      setShowSuccessToast(true);

      // Mark onboarding subtasks as complete
      toggleSubtask('launch', 'create_coupon', true);
      toggleSubtask('launch', 'activate_campaign', true);

      setTimeout(() => {
        onNavigate('assets-coupon');
      }, 1500);
    }, 1200);
  };

  const handleSave = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newCoupon = constructCouponObject('Draft');
      addCoupon(newCoupon);
      setIsProcessing(false);
      onNavigate('assets-coupon');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white overflow-hidden animate-in fade-in duration-300">

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm">Asset Launched Successfully!</span>
        </div>
      )}

      {/* 1. Global Header (Matching Tier Wizard) */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('assets-coupon')}
            className="text-slate-400 hover:text-slate-900 flex items-center gap-1 text-sm font-bold transition-colors"
          >
            <ArrowLeft size={16} /> Back to Library
          </button>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="text-sm font-bold text-slate-900">
            Create Digital Asset <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Draft</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isProcessing}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
        >
          {isProcessing ? <Loader2 size={16} className="animate-spin" /> : 'Save & Exit'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* 2. The Wizard (Left Rail - Matching Tier Wizard Vertical Accordion Pattern) */}
        <div className="w-2/3 h-full overflow-y-auto bg-slate-50/50 p-10 relative">
          <div className="max-w-3xl mx-auto space-y-4 pb-20">

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
                  <h3 className={`text-lg font-bold ${activeStep === 1 ? 'text-slate-900' : 'text-slate-600'}`}>Asset Identity</h3>
                </div>
                {activeStep !== 1 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[200px]">{name}</span>
                    <ChevronDown size={20} className="text-slate-300" />
                  </div>
                )}
              </div>

              {activeStep === 1 && (
                <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name (Visible to Member)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xl font-bold border-b-2 border-slate-100 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors placeholder:text-slate-200"
                        placeholder="e.g. $10 Welcome Voucher"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Internal Audit Code</label>
                      <input
                        type="text"
                        value={internalCode}
                        onChange={(e) => setInternalCode(e.target.value)}
                        className="w-full text-sm font-mono font-bold border-b border-slate-100 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors placeholder:text-slate-200"
                        placeholder="C-XXXX-2024"
                      />
                    </div>
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

            {/* STEP 2: VALUE LOGIC */}
            <div
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeStep === 2 ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => handleStepClick(2)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 2 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
                  <h3 className={`text-lg font-bold ${activeStep === 2 ? 'text-slate-900' : 'text-slate-600'}`}>Value Logic</h3>
                </div>
                {activeStep !== 2 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900">{formattedValue} • Min ${minSpend} Order</span>
                    <ChevronDown size={20} className="text-slate-300" />
                  </div>
                )}
              </div>

              {activeStep === 2 && (
                <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Coupon Strategy</label>
                      <div className="grid grid-cols-4 gap-3">
                        {(['cash', 'percentage', 'sku', 'shipping'] as CouponType[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${type === t
                                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                                : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                              }`}
                          >
                            {getTypeIcon(t)}
                            <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                      <div className="text-lg font-medium text-slate-700 leading-relaxed">
                        This coupon grants
                        {type === 'shipping' ? (
                          <span className="mx-2 font-black text-slate-900 uppercase underline decoration-primary-500 decoration-2 underline-offset-4">Free Standard Shipping</span>
                        ) : (
                          <>
                            <SentenceInput
                              value={value}
                              onChange={(v) => setValue(Number(v))}
                              prefix={type === 'cash' ? '$' : undefined}
                              suffix={type === 'percentage' ? '%' : undefined}
                              width="w-20"
                              className="mx-2"
                            />
                            <span className="font-bold text-slate-900">{type === 'cash' ? 'Off Order' : 'Discount'}</span>
                          </>
                        )}
                        whenever the total spend exceeds
                        <SentenceInput
                          value={minSpend}
                          onChange={(v) => setMinSpend(Number(v))}
                          prefix="$"
                          width="w-20"
                          className="mx-2"
                        />.
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: GOVERNANCE */}
            <div
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeStep === 3 ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => handleStepClick(3)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 3 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>3</div>
                  <h3 className={`text-lg font-bold ${activeStep === 3 ? 'text-slate-900' : 'text-slate-600'}`}>Governance & Scarcity</h3>
                </div>
                {activeStep !== 3 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[200px]">Stock: {totalInventory.toLocaleString()} • User Limit: {perUserLimit}</span>
                    <ChevronDown size={20} className="text-slate-300" />
                  </div>
                )}
              </div>

              {activeStep === 3 && (
                <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Global Inventory</label>
                      <div className="flex items-center gap-3">
                        <SentenceInput
                          value={totalInventory}
                          onChange={(v) => setTotalInventory(Number(v))}
                          width="w-32"
                        />
                        <span className="text-xs font-bold text-slate-400">Tickets</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">Max redemptions across entire database.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Per Member Limit</label>
                      <div className="flex items-center gap-3">
                        <SentenceInput
                          value={perUserLimit}
                          onChange={(v) => setPerUserLimit(Number(v))}
                          width="w-20"
                        />
                        <span className="text-xs font-bold text-slate-400">Use(s)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">Times a single member can redeem.</p>
                    </div>
                  </div>
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

            {/* STEP 4: TIMELINE */}
            <div
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${activeStep === 4 ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => handleStepClick(4)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 4 ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>4</div>
                  <h3 className={`text-lg font-bold ${activeStep === 4 ? 'text-slate-900' : 'text-slate-600'}`}>Validity Timeline</h3>
                </div>
                {activeStep !== 4 && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate max-w-[200px]">
                      {neverExpires ? 'Permanent Asset' : `Ends ${endDate || 'TBD'}`}
                    </span>
                    <ChevronDown size={20} className="text-slate-300" />
                  </div>
                )}
              </div>

              {activeStep === 4 && (
                <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Start Distributing From</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                        />
                      </div>
                      {!neverExpires && (
                        <div className="animate-in fade-in slide-in-from-right-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Redemption Date</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
                          />
                        </div>
                      )}
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${neverExpires ? 'bg-primary-500 border-primary-500' : 'border-slate-200 group-hover:border-slate-400'}`}>
                        {neverExpires && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={neverExpires} onChange={() => setNeverExpires(!neverExpires)} />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Never expires (Permanent Asset)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. High Fidelity Preview (Right Rail - Matching Tier Wizard Simulation) */}
        <div className="w-1/3 h-full bg-slate-50 border-l border-slate-200 relative">
          <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Live Member Experience</div>

            {/* Device Simulation (Exact Match to Tier Wizard) */}
            <div className="w-full max-w-xs mx-auto animate-in fade-in slide-in-from-right-8 duration-500 sticky top-10">
              <div className="bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative min-h-[600px] flex flex-col">
                {/* Status Bar */}
                <div className="h-6 bg-slate-900 w-full absolute top-0 z-20 flex justify-center">
                  <div className="w-20 h-4 bg-black rounded-b-xl"></div>
                </div>

                {/* App Header */}
                <div className="pt-10 pb-4 px-6 bg-slate-50 flex justify-between items-center border-b border-slate-100">
                  <span className="font-bold text-slate-800">My Rewards</span>
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                </div>

                {/* Content Scroll */}
                <div className="p-5 space-y-6 overflow-y-auto flex-1 no-scrollbar pb-10">

                  {/* The Voucher Card (Visualizing the Asset) */}
                  <div className={`relative aspect-[1.8] rounded-2xl p-5 text-white overflow-hidden shadow-xl transition-all duration-700 bg-gradient-to-br ${getTypeColor(type)}`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-black opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="flex justify-between items-start relative z-10">
                      <div className="min-w-0">
                        <h4 className="text-sm font-black tracking-tight leading-tight truncate drop-shadow-md">{name}</h4>
                        <span className="text-[8px] font-mono font-bold opacity-75 mt-1 border border-white/30 px-1 rounded bg-white/10 uppercase tracking-widest">{internalCode}</span>
                      </div>
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                        {getTypeIcon(type)}
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
                      <div>
                        <div className="text-[8px] font-black uppercase tracking-widest opacity-80 mb-0.5">Value</div>
                        <div className="text-2xl font-black tracking-tighter drop-shadow-lg leading-none">{formattedValue}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[7px] font-black uppercase tracking-widest opacity-80 mb-0.5">Expires</div>
                        <div className="text-[10px] font-bold whitespace-nowrap">{neverExpires ? 'Infinite' : endDate || 'TBD'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Usage Summary Text */}
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary-500"><Info size={14} /></div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">Usage Rule</div>
                        <div className="text-xs font-bold text-slate-700 leading-snug">Valid on orders over HKD ${minSpend}.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary-500"><Users size={14} /></div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">Redemption</div>
                        <div className="text-xs font-bold text-slate-700 leading-snug">Limited to {perUserLimit} use(s) per member.</div>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Context Simulation */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">In your wallet</h4>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm group/wallet hover:border-primary-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getTypeColor(type)} flex items-center justify-center text-white shadow-sm`}>
                          {getTypeIcon(type)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{name}</div>
                          <div className="text-[9px] text-slate-400 font-medium">Valid until {neverExpires ? 'Infinite' : endDate || 'TBD'}</div>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Use</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Global Footer Actions (Exact Structural Match to Tier Wizard) */}
      <div className="h-20 border-t border-slate-100 bg-white px-8 flex items-center justify-between shrink-0 z-40">
        <button
          onClick={() => onNavigate('assets-coupon')}
          className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 group"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform" />
          Discard Draft
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save for later
          </button>
          <button
            onClick={handleLaunch}
            disabled={isProcessing}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-slate-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-70"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin text-primary-400" />
            ) : (
              <Rocket size={18} className="text-primary-400" />
            )}
            {isProcessing ? 'Launching...' : 'Launch Asset'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default CreateCoupon;
