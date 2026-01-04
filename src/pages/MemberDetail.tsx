
import React, { useState } from 'react';
import { NavItemId } from '../types';
import { useMember } from '../context/MemberContext';
import { 
  ArrowLeft, Coins, Ticket, Crown, User, Trash2, 
  ChevronRight, Calendar, ShoppingBag, Clock, Mail, Phone,
  MapPin, Sparkles, TrendingUp, ShieldCheck, CreditCard,
  Edit2, Info, DollarSign, Search, ChevronDown, Download,
  Printer, X, FileText, Plus, Receipt, AlertTriangle,
  Milestone, History, Award, Lock, Star, Shield, CheckCircle2,
  Send, ArrowRight, Package, Tag, Calculator
} from 'lucide-react';
import ActionModal, { ActionType } from '../components/member/ActionModal';
import EditProfileModal from '../components/member/EditProfileModal';

interface MemberDetailProps {
  onNavigate: (id: NavItemId) => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ onNavigate }) => {
  const { selectedMemberId, getMember } = useMember();
  const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'tier' | 'points' | 'coupons' | 'log'>('profile');
  
  // Tab 2 State
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Modal States
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: ActionType }>({ isOpen: false, type: 'adjust_points' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch current member
  const member = selectedMemberId ? getMember(selectedMemberId) : undefined;

  // Enhanced Mock Transactions Data for Strategic Audit
  const allTransactions = [
    { 
      id: 'ORD-99281', 
      date: 'Dec 02, 2024', 
      creationDate: 'Dec 01, 2024 23:45',
      type: 'Purchase', 
      channel: 'POS - K11', 
      staff: 'Admin #042 (Sarah L.)',
      total: 342.50, 
      paid: 342.50, 
      status: 'Completed', 
      points: '+342', 
      pointsUsed: 0,
      vouchers: [
        { code: 'CPN-SALE-10', name: 'Seasonal 10% Off', value: '$34.25', qty: 1 }
      ],
      fees: { tax: 0, shipping: 0, other: 0 },
      remarks: 'Customer used membership points for priority checkout.',
      items: [
        {sku: 'SKU-001', name: 'Premium Skin Care', spec: '500ml', msrp: 280.00, unitPrice: 250.00, qty: 1, discount: 30.00, total: 250.00}, 
        {sku: 'SKU-002', name: 'Face Mask', spec: '5-Pack', msrp: 105.00, unitPrice: 92.50, qty: 1, discount: 12.50, total: 92.50}
      ] 
    },
    { 
      id: 'ORD-99105', 
      date: 'Nov 15, 2024', 
      creationDate: 'Nov 15, 2024 10:12',
      type: 'Purchase', 
      channel: 'Online Store', 
      staff: 'System Auto',
      total: 120.00, 
      paid: 100.00, 
      status: 'Completed', 
      points: '+100', 
      pointsUsed: 2000,
      vouchers: [],
      fees: { tax: 0, shipping: 10.00, other: 0 },
      remarks: 'Point redemption applied at checkout.',
      items: [
        {sku: 'SKU-005', name: 'Travel Kit', spec: 'Standard', msrp: 120.00, unitPrice: 120.00, qty: 1, discount: 0, total: 120.00}
      ] 
    },
    { 
      id: 'ORD-98542', 
      date: 'Oct 22, 2024', 
      creationDate: 'Oct 22, 2024 11:00',
      type: 'Return', 
      channel: 'POS - IFC', 
      staff: 'Staff #011 (Mike R.)',
      total: -45.00, 
      paid: -45.00, 
      status: 'Refunded', 
      originalOrderId: 'ORD-98401',
      points: '-45', 
      pointsUsed: 0,
      vouchers: [],
      fees: { tax: 0, shipping: 0, other: 0 },
      remarks: 'Product defective. Manager override approved.',
      items: [
        {sku: 'SKU-009', name: 'Toner Bottle', spec: '200ml', msrp: 45.00, unitPrice: 45.00, qty: 1, discount: 0, total: 45.00}
      ] 
    },
  ];

  const filteredTransactions = allTransactions.filter(t => 
    t.id.toLowerCase().includes(searchOrderId.toLowerCase())
  );

  // Tier-based Visual Mapping
  const getTierConfig = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return { gradient: 'from-cyan-500 to-blue-700', badge: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: <Crown size={14} /> };
      case 'gold': return { gradient: 'from-yellow-400 to-amber-600', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <Crown size={14} /> };
      case 'silver': return { gradient: 'from-slate-400 to-slate-600', badge: 'bg-slate-100 text-slate-700 border-slate-200', icon: <ShieldCheck size={14} /> };
      case 'bronze': return { gradient: 'from-orange-400 to-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-200', icon: <ShieldCheck size={14} /> };
      default: return { gradient: 'from-primary-500 to-primary-700', badge: 'bg-slate-100 text-slate-600', icon: <User size={14} /> };
    }
  };

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] animate-in fade-in">
        <h2 className="text-2xl font-bold text-slate-800">No Member Selected</h2>
        <p className="text-slate-500 mt-2 mb-6">Please select a member from the list to view details.</p>
        <button onClick={() => onNavigate('member-list')} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
          Return to Member List
        </button>
      </div>
    );
  }

  const tierCfg = getTierConfig(member.tier);
  const daysSinceLastBuy = parseInt(member.id.slice(-1)) * 14 || 14;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Action Modals */}
      <ActionModal 
        isOpen={actionModal.isOpen} 
        onClose={() => setActionModal({ ...actionModal, isOpen: false })} 
        type={actionModal.type} 
        memberId={member.id} 
      />
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={member} 
      />

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onNavigate('member-list')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-lg group-hover:border-slate-300 shadow-sm transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm">Back to Members</span>
        </button>
      </div>

      {/* ### Zone A: The "Vibe" Header ### */}
      <div className="relative rounded-4xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-100">
        <div className={`h-40 bg-gradient-to-r ${tierCfg.gradient} absolute inset-0 z-0 opacity-10`}></div>
        <div className={`h-40 bg-gradient-to-b from-transparent to-white absolute inset-0 z-0`}></div>

        <div className="relative z-10 px-8 pt-10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-tr ${tierCfg.gradient} rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}></div>
              <img src={member.avatar} alt={member.firstName} className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl relative object-cover" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-primary-500 cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
                <Edit2 size={14} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{member.firstName} {member.lastName}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tierCfg.badge}`}>
                  {tierCfg.icon}
                  {member.tier}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-slate-400" /> {member.cardNo}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> Joined {member.joinDate}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-50 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></span>
                  {member.status} Member
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
              <button 
                onClick={() => setActionModal({ isOpen: true, type: 'adjust_points' })}
                className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 text-sm"
              >
                <Coins size={16} className="text-yellow-400" />
                Adjust Points
              </button>
              <button 
                onClick={() => setActionModal({ isOpen: true, type: 'issue_coupon' })}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-sm shadow-sm"
              >
                <Ticket size={16} className="text-purple-500" />
                Issue Coupon
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActionModal({ isOpen: true, type: 'modify_tier' })}
                className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100"
                title="Modify Tier"
              >
                <Crown size={20} />
              </button>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-100"
                title="Edit Profile"
              >
                <User size={20} />
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button 
                onClick={() => setActionModal({ isOpen: true, type: 'delete_account' })}
                className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-100 rounded-xl transition-all border border-transparent hover:border-red-100"
                title="Delete Account"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ### Zone B: Tabs Architecture ### */}
      <div className="flex items-center gap-8 border-b border-slate-200 px-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Profile Overview' },
          { id: 'transactions', label: 'Transactions' },
          { id: 'tier', label: 'Tier Journey' },
          { id: 'points', label: 'Point Assets' },
          { id: 'coupons', label: 'My Wallet' },
          { id: 'log', label: 'Change Log' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? 'text-primary-600 border-primary-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-300">
        {/* ### Tab 1: Profile (Overview) ### */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column: Key Widgets */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Widget 1: Next Best Action */}
              <div className="bg-gradient-to-br from-primary-600 to-indigo-800 rounded-3xl p-6 text-white relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                    <TrendingUp size={32} className="text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-1">Targeting: Platinum Tier</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {member.firstName} is only <strong className="text-white">$750</strong> away from Platinum. 
                      Suggesting <strong>Skin Care Bundle</strong> could trigger the upgrade today.
                    </p>
                  </div>
                  <button className="px-6 py-3 bg-white text-primary-600 font-black rounded-xl text-sm hover:shadow-xl transition-all whitespace-nowrap flex items-center gap-2">
                    Generate Offer <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Widget 2: Dashboard Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3 text-slate-400">
                    <Coins size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Points Balance</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{member.points.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-red-500 mt-1">500 pts expire in 12d</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3 text-slate-400">
                    <Ticket size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Valid Coupons</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">4</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-1">2 expiring soon</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3 text-slate-400">
                    <DollarSign size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Total Spend</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{member.lifetimeSpend}</div>
                  <div className="text-[10px] font-bold text-green-500 mt-1">+12% vs last avg</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3 text-slate-400">
                    <Clock size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Days Since Buy</span>
                  </div>
                  <div className={`text-2xl font-black ${daysSinceLastBuy > 90 ? 'text-red-500' : 'text-slate-900'}`}>
                    {daysSinceLastBuy}
                  </div>
                  <div className={`text-[10px] font-bold mt-1 ${daysSinceLastBuy > 90 ? 'text-red-400' : 'text-slate-400'}`}>
                    {daysSinceLastBuy > 90 ? 'High Risk of Churn' : 'Healthy Engagement'}
                  </div>
                </div>
              </div>

              {/* Widget 4: Purchase Behavior */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-slate-400" />
                  Purchase Behavior
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-1 text-center md:text-left">First Purchase</div>
                    <div className="text-sm font-bold text-slate-700 text-center md:text-left">Jan 15, 2024</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-1 text-center md:text-left">Last Purchase</div>
                    <div className="text-sm font-bold text-slate-700 text-center md:text-left">Dec 02, 2024</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-1 text-center md:text-left">Avg Order Value</div>
                    <div className="text-sm font-bold text-slate-700 text-center md:text-left">$342.50</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-1 text-center md:text-left">Orders Count</div>
                    <div className="text-sm font-bold text-slate-700 text-center md:text-left">24</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Status & Info */}
            <div className="space-y-8">
              
              {/* Widget 3: Membership Status */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShieldCheck size={100} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Tier</div>
                      <div className="text-2xl font-black tracking-tight">{member.tier}</div>
                    </div>
                    <Crown size={24} className="text-yellow-400 fill-yellow-400" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Progress to {member.tier === 'Platinum' ? 'Diamond' : 'Platinum'}</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${tierCfg.gradient}`} style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-white/60 leading-relaxed">
                    Spend <strong className="text-white">$120.00</strong> more by <strong>Dec 31</strong> to retain your status.
                  </div>
                </div>
              </div>

              {/* Widget 5: Personal Info */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    Personal Information
                  </h3>
                  <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                    <Edit2 size={14} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Mail size={14} /></div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</div>
                      <div className="text-sm font-bold text-slate-700 truncate">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Phone size={14} /></div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</div>
                      <div className="text-sm font-bold text-slate-700">{member.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><MapPin size={14} /></div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Shipping Address</div>
                      <div className="text-sm font-bold text-slate-700 leading-snug">123 Nathan Road, Tsim Sha Tsui, Hong Kong</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full mt-6 py-2.5 text-slate-500 font-bold text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Edit Details <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ### Tab 2: Transactions (History) ### */}
        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-400">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
               <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search Order ID..." 
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                  />
               </div>
               <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase text-slate-500 hover:bg-slate-100 transition-colors">
                    <Calendar size={14} />
                    Date Range
                    <ChevronDown size={12} />
                  </button>
                  <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-primary-600 transition-colors">
                    <Download size={18} />
                  </button>
               </div>
            </div>

            {/* Content Logic: Empty vs Table */}
            {filteredTransactions.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-4xl p-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No purchase history found.</h3>
                    <p className="text-sm text-slate-500 max-w-xs mb-8">This member hasn't made any transactions yet, or they were recorded outside the system.</p>
                    <button 
                      onClick={() => setActionModal({ isOpen: true, type: 'adjust_points' })}
                      className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Record Manual Purchase
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Order ID</th>
                                    <th className="px-8 py-5">Type</th>
                                    <th className="px-8 py-5">Channel</th>
                                    <th className="px-8 py-5">Total</th>
                                    <th className="px-8 py-5">Real Paid</th>
                                    <th className="px-8 py-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.map(trx => (
                                    <tr 
                                      key={trx.id} 
                                      onClick={() => setSelectedTransaction(trx)}
                                      className="group hover:bg-slate-50/80 cursor-pointer transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-bold text-slate-600">{trx.date}</div>
                                            <div className="text-[10px] font-black text-primary-500 mt-0.5">{trx.points} pts earned</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-black text-slate-900 font-mono group-hover:text-primary-600 transition-colors">{trx.id}</div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-slate-500">{trx.type}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                <MapPin size={12} className="text-slate-300" />
                                                {trx.channel}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-400">
                                          ${Math.abs(trx.total).toFixed(2)}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-slate-900">
                                          ${Math.abs(trx.paid).toFixed(2)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                trx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full ${trx.status === 'Completed' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                {trx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal: Strategic Order Audit Grid (REWRITTEN FROM THERMAL RECEIPT) */}
            {selectedTransaction && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                  
                  {/* Global Header Metadata */}
                  <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTransaction.id}</h2>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedTransaction.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                {selectedTransaction.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>{selectedTransaction.type}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{selectedTransaction.channel}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4">
                        <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction Date</span>
                            <span className="text-xs font-bold text-slate-900">{selectedTransaction.date}</span>
                        </div>
                        <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Creation Date</span>
                            <span className="text-xs font-bold text-slate-900">{selectedTransaction.creationDate}</span>
                        </div>
                        <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sales Personnel</span>
                            <span className="text-xs font-bold text-slate-900">{selectedTransaction.staff}</span>
                        </div>
                        {selectedTransaction.originalOrderId && (
                            <div className="col-span-2">
                                <span className="block text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Original Order Context</span>
                                <span className="text-xs font-black text-red-600 underline decoration-red-200 underline-offset-4 cursor-pointer">{selectedTransaction.originalOrderId}</span>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setSelectedTransaction(null)} className="p-2 -mr-2 rounded-full hover:bg-white text-slate-300 hover:text-slate-600 transition-all shadow-none hover:shadow-sm">
                        <X size={24} />
                    </button>
                  </div>

                  {/* Central Body: Product Detail Ledger */}
                  <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                    <div className="space-y-10">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Package size={18} className="text-primary-500" />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Product Detail Ledger</h3>
                            </div>
                            <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-6 py-4">SKU Code</th>
                                            <th className="px-6 py-4">Product / Item Name</th>
                                            <th className="px-6 py-4">Spec.</th>
                                            <th className="px-6 py-4 text-right">MSRP</th>
                                            <th className="px-6 py-4 text-right">Unit Price</th>
                                            <th className="px-6 py-4 text-center">Qty</th>
                                            <th className="px-6 py-4 text-right">Line Total</th>
                                            <th className="px-6 py-4 text-right">Discount</th>
                                            <th className="px-6 py-4 text-right bg-slate-100/50">Actual Amt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-sm">
                                        {selectedTransaction.items.map((item: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-400 text-xs">{item.sku}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                                <td className="px-6 py-4 text-slate-500 text-xs">{item.spec}</td>
                                                <td className="px-6 py-4 text-right text-slate-400 line-through decoration-slate-200">${item.msrp.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-700">${item.unitPrice.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-center font-black text-slate-900">{item.qty}</td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-500">${(item.unitPrice * item.qty).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right font-black text-red-500">-${item.discount.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right font-black text-slate-900 bg-slate-50/50">${item.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bottom Grid: Benefit vs Settlement */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            
                            {/* Bottom Left: Benefit Application */}
                            <div className="space-y-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Sparkles size={18} className="text-yellow-500" />
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Benefit Application</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-100">
                                                    <Coins size={20} />
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] font-black text-yellow-700 uppercase tracking-widest">Points Utilization</span>
                                                    <span className="text-sm font-bold text-yellow-900">{selectedTransaction.pointsUsed.toLocaleString()} Points Used</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-lg font-black text-yellow-700">-${(selectedTransaction.pointsUsed / 100).toFixed(2)}</span>
                                                <span className="text-[10px] font-bold text-yellow-600 uppercase">Cash Value</span>
                                            </div>
                                        </div>

                                        {selectedTransaction.vouchers.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedTransaction.vouchers.map((v: any, i: number) => (
                                                    <div key={i} className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                                                                <Ticket size={20} />
                                                            </div>
                                                            <div>
                                                                <span className="block text-[10px] font-black text-purple-700 uppercase tracking-widest">{v.code}</span>
                                                                <span className="text-sm font-bold text-purple-900">{v.name}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-sm font-black text-purple-700">Value: {v.value}</span>
                                                            <span className="text-[10px] font-bold text-purple-500 uppercase">Qty: {v.qty}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                                                No Vouchers Applied
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Right: Financial Settlement */}
                            <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 shadow-inner">
                                <div className="flex items-center gap-3 mb-8">
                                    <Calculator size={18} className="text-slate-400" />
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Financial Settlement</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                                        <span>Order Subtotal</span>
                                        <span className="font-bold text-slate-700">${Math.abs(selectedTransaction.total).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-red-500">
                                        <span>Total Campaign Discounts</span>
                                        <span className="font-bold">-$0.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-red-500">
                                        <span>Voucher / Point Credit</span>
                                        <span className="font-bold">-${(selectedTransaction.pointsUsed / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-slate-200 my-2"></div>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                                        <span>Actual Transaction Amount</span>
                                        <span className="text-lg font-black">${Math.abs(selectedTransaction.paid).toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <span>Tax Breakdown (0%)</span>
                                            <span>${selectedTransaction.fees.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <span>Surcharges / Ancillary</span>
                                            <span>${(selectedTransaction.fees.shipping + selectedTransaction.fees.other).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="pt-8">
                                        <div className="bg-slate-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-xl shadow-slate-200">
                                            <div>
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Real Paid Amount</span>
                                                <span className="text-xs text-white/60 font-medium">Source of Truth Ledger</span>
                                            </div>
                                            <div className="text-3xl font-black tracking-tight">${Math.abs(selectedTransaction.paid).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Internal Narrative Footer */}
                  <div className="px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
                    <div className="flex-1 max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={14} className="text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Order Remarks</span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl border border-slate-100 italic">
                            "{selectedTransaction.remarks || 'No internal remarks recorded for this transaction.'}"
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                            <Printer size={14} /> Print Audit
                        </button>
                        <button className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
                            <Download size={14} className="text-primary-400" /> Export PDF
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ### Tab 3: Tier (Journey) ### */}
        {activeTab === 'tier' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
            {/* Tier Ladder Overview */}
            <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
                <Crown size={320} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black text-slate-900 mb-2">Membership Status Architecture</h3>
                <p className="text-sm text-slate-500 mb-12 max-w-lg">Tracking your progression through our elite loyalty levels. Status is calculated based on rolling 12-month spend.</p>

                {/* The Ladder Visualization */}
                <div className="grid grid-cols-4 gap-4 relative max-w-4xl mx-auto">
                  {/* Background Progress Line (Gray) - Centered vertically at top-8 (center of h-16 icons) */}
                  <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-10 rounded-full"></div>
                  
                  {/* Active Progress Line (Green) - Centered vertically at top-8 */}
                  {(() => {
                    const tiersList = ['Bronze', 'Silver', 'Gold', 'Platinum'];
                    const currentIdx = tiersList.indexOf(member.tier);
                    const width = (currentIdx / (tiersList.length - 1)) * 100;
                    return (
                        <div 
                            className="absolute top-8 left-0 h-1 bg-green-500 -translate-y-1/2 -z-10 rounded-full transition-all duration-1000"
                            style={{ width: `${width}%` }}
                        ></div>
                    );
                  })()}
                  
                  {['Bronze', 'Silver', 'Gold', 'Platinum'].map((t, i) => {
                    const isCurrent = member.tier === t;
                    const isPast = ['Bronze', 'Silver', 'Gold', 'Platinum'].indexOf(member.tier) > i;
                    
                    return (
                      <div key={t} className="flex flex-col items-center text-center group">
                        <div className={`
                          w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 border-4 z-10
                          ${isCurrent ? `bg-white shadow-2xl scale-110 -translate-y-2 ${tierCfg.badge.split(' ')[2]}` : 
                            isPast ? 'bg-green-500 border-green-500 text-white' : 
                            'bg-white border-slate-200 text-slate-300'}
                        `}>
                          {isPast ? <CheckCircle2 size={24} /> : 
                           isCurrent ? <div className={tierCfg.badge.split(' ')[1]}>{tierCfg.icon}</div> : 
                           <Lock size={20} />}
                        </div>
                        <div className="mt-4">
                          <div className={`text-sm font-black uppercase tracking-widest ${isCurrent ? 'text-primary-600' : isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                            {t}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 mt-1">
                            {t === 'Bronze' ? 'Auto' : t === 'Silver' ? '$500' : t === 'Gold' ? '$2,000' : '$5,000'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progression Card */}
              <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={18} className="text-primary-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary-400">Next Milestone</span>
                      </div>
                      <h4 className="text-3xl font-black mb-1">Road to Platinum</h4>
                      <p className="text-white/60 text-sm mb-8">Maintain current momentum to upgrade by next month.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold">
                         <span className="text-white/40">Spend Progress</span>
                         <span>$4,250 / $5,000</span>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="h-full bg-gradient-to-r from-primary-400 to-cyan-400 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold bg-white/5 border border-white/10 p-3 rounded-2xl text-white/80">
                         <Sparkles size={14} className="text-yellow-400" />
                         Only <span className="text-white">$750.00</span> more to unlock Platinum status!
                      </div>
                    </div>
                 </div>
              </div>

              {/* History / Event Log */}
              <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <History size={18} className="text-slate-400" />
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">Status Timeline</h3>
                    </div>
                    <button className="text-xs font-bold text-primary-500 hover:underline">Download PDF Report</button>
                </div>

                <div className="flex-1 space-y-8 relative">
                   <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                   
                   {[
                     { date: 'Dec 12, 2024', event: 'Upgrade to Gold', desc: 'Membership spend exceeded $2,000 threshold.', icon: <Award size={14}/>, color: 'bg-yellow-100 text-yellow-600' },
                     { date: 'Jun 15, 2024', event: 'Upgrade to Silver', desc: 'Membership spend exceeded $500 threshold.', icon: <TrendingUp size={14}/>, color: 'bg-slate-100 text-slate-600' },
                     { date: 'Jan 12, 2024', event: 'Membership Joined', desc: 'Successfully enrolled as Bronze member.', icon: <User size={14}/>, color: 'bg-blue-100 text-blue-600' },
                   ].map((log, i) => (
                     <div key={i} className="flex gap-6 relative animate-in slide-in-from-left-4 duration-500">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm relative z-10 ${log.color}`}>
                           {log.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h5 className="text-sm font-black text-slate-900">{log.event}</h5>
                                <span className="text-[10px] font-bold text-slate-400">{log.date}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{log.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Benefits Unlocked Comparison */}
            <div className="bg-white border border-slate-200 rounded-4xl p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-green-50 rounded-xl text-green-600"><Star size={20} /></div>
                    <h3 className="text-xl font-black text-slate-900">Current Privileges vs Next Level</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-4">Unlocked in Gold</div>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 size={18} className="text-green-500" /> 1.5x Point Multiplier
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 size={18} className="text-green-500" /> Birthday Cash Voucher ($100)
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 size={18} className="text-green-500" /> Exclusive Gold Sale Events
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                <CheckCircle2 size={18} className="text-green-500" /> Priority Support Line
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-6 opacity-60">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-4">Waiting in Platinum</div>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                <Lock size={18} /> 2.0x Point Multiplier
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                <Lock size={18} /> Free Express Shipping (Unlimited)
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                <Lock size={18} /> Concierge Shopping Service
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                <Lock size={18} /> VIP Anniversary Dinner Invite
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* ### Tab 4: Points (Assets) ### */}
        {activeTab === 'points' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
            
            {/* Top Row: Points Economics Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                  <Coins size={120} />
                </div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Available Balance</div>
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">{member.points.toLocaleString()}</div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                      <TrendingUp size={12} /> +2,450 this month
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Valued at ~$HK 125.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lifetime Earned</div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter">84,200</div>
                <div className="mt-4 text-[11px] font-bold text-slate-500 flex items-center gap-2">
                  <History size={14} className="text-slate-300" /> Member since {member.joinDate}
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden group">
                <div className="absolute right-[-10px] top-[-10px] opacity-10">
                  <Clock size={120} className="text-white" />
                </div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Expiring Soon</div>
                  <div className="text-4xl font-black text-orange-400 tracking-tighter">1,250</div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-white/60">
                    <AlertTriangle size={14} className="text-orange-500" /> Next expiry: Dec 31, 2024
                  </div>
                </div>
              </div>
            </div>

            {/* Expiration Roadmap / Urgency Bar */}
            <div className="bg-orange-50 border border-orange-100 rounded-4xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase">Points Expiration Alert</h4>
                        <p className="text-xs text-slate-600 font-medium">1,250 points will expire in <strong className="text-orange-600">27 days</strong>. Suggest a redemption campaign.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <button className="px-6 py-2.5 bg-white border border-orange-200 text-orange-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-orange-100 transition-all shadow-sm">
                        Send Reminder SMS
                    </button>
                    <button className="px-6 py-2.5 bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
                        Suggest Offer
                    </button>
                </div>
            </div>

            {/* Ledger Section */}
            <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                            <History size={18} />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">Points Ledger</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Filter ledger..." 
                                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-50"
                            />
                        </div>
                        <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Date & Time</th>
                                <th className="px-8 py-5">Activity / Reference</th>
                                <th className="px-8 py-5">Source</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Delta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { date: 'Dec 02, 2024', time: '14:23', event: 'POS Purchase', ref: 'ORD-99281', source: 'Store - K11', status: 'Settled', delta: 342, type: 'earn' },
                                { date: 'Nov 28, 2024', time: '10:00', event: 'Birthday Bonus', ref: 'SYS-BDAY-24', source: 'Automation', status: 'Settled', delta: 1000, type: 'earn' },
                                { date: 'Nov 15, 2024', time: '18:45', event: 'Coupon Redemption', ref: 'CPN-SALE-20', source: 'Checkout', status: 'Settled', delta: -2500, type: 'burn' },
                                { date: 'Nov 02, 2024', time: '09:12', event: 'Admin Adjustment', ref: 'ADJ-10292', source: 'Internal Console', status: 'In Review', delta: 500, type: 'earn' },
                                { date: 'Oct 31, 2024', time: '23:59', event: 'Points Expired', ref: 'EXP-MONTHLY', source: 'System', status: 'Settled', delta: -120, type: 'expire' },
                                { date: 'Oct 22, 2024', time: '11:15', event: 'Return Reversal', ref: 'ORD-98542', source: 'POS - IFC', status: 'Settled', delta: -45, type: 'burn' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-slate-800">{row.date}</div>
                                        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{row.time}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                                            {row.event}
                                            {row.type === 'earn' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                            {row.type === 'burn' && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                        </div>
                                        <div className="text-[10px] font-mono font-bold text-slate-400">{row.ref}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                                                {row.source.includes('Store') ? <MapPin size={10} /> : <History size={10} />}
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{row.source}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                            row.status === 'Settled' ? 'bg-green-50 text-green-700 border-green-100' : 
                                            row.status === 'In Review' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            'bg-slate-50 text-slate-500 border-slate-200'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className={`px-8 py-5 text-right text-sm font-black font-mono ${
                                        row.type === 'earn' ? 'text-green-600' : 
                                        row.type === 'burn' || row.type === 'expire' ? 'text-red-600' : 'text-slate-400'
                                    }`}>
                                        {row.delta > 0 ? '+' : ''}{row.delta.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                    <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 transition-colors py-2 px-4 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100">
                        View Complete Audit Log
                    </button>
                </div>
            </div>

            {/* Quick Action Footer for Points */}
            <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-4xl shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <Info size={20} />
                    </div>
                    <div className="text-xs font-medium text-slate-500 max-w-sm">
                        Manual point adjustments are audited and logged with the current admin's identity. 
                        Adjustments over 5,000 pts require supervisor approval.
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button 
                        onClick={() => setActionModal({ isOpen: true, type: 'issue_coupon' })}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
                    >
                        Redeem for Member
                    </button>
                    <button 
                        onClick={() => setActionModal({ isOpen: true, type: 'adjust_points' })}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                        <Plus size={16} /> Manual Adjustment
                    </button>
                 </div>
            </div>
          </div>
        )}

        {/* ### Tab 5: My Wallet (Coupons) ### */}
        {activeTab === 'coupons' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
            
            {/* Top Row: Coupon Inventory Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Ticket size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Issued</div>
                  <div className="text-2xl font-black text-slate-900">14</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</div>
                  <div className="text-2xl font-black text-slate-900">4</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiring Soon</div>
                  <div className="text-2xl font-black text-slate-900">2</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
                  <X size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Used/Expired</div>
                  <div className="text-2xl font-black text-slate-900">8</div>
                </div>
              </div>
            </div>

            {/* Filter & Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex gap-2">
                    {['All Coupons', 'Available', 'Used', 'Expired'].map((filter, i) => (
                        <button 
                            key={filter}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search coupon code..." 
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                </div>
            </div>

            {/* Coupons Grid (Skeuomorphic Ticket Design) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[
                    { id: 'C-9281-X', name: '$10 Cash Voucher', status: 'Available', expiry: 'Dec 31, 2024', type: 'cash', value: '$10', color: 'primary' },
                    { id: 'C-5521-A', name: 'Free Shipping Token', status: 'Available', expiry: 'Jan 15, 2025', type: 'ship', value: 'FREE', color: 'blue' },
                    { id: 'C-1120-B', name: 'Birthday 20% Off', status: 'Expiring', expiry: 'Dec 20, 2024', type: 'percent', value: '20%', color: 'orange' },
                    { id: 'C-0092-Z', name: 'Platinum Renewal Gift', status: 'Used', expiry: 'Nov 02, 2024', type: 'gift', value: 'GIFT', color: 'slate' },
                ].map((cpn, i) => {
                    const isAvailable = cpn.status === 'Available' || cpn.status === 'Expiring';
                    const isOrange = cpn.status === 'Expiring';
                    
                    return (
                        <div 
                            key={cpn.id} 
                            className={`group relative flex h-36 rounded-3xl overflow-hidden border transition-all ${
                                !isAvailable ? 'bg-slate-50 border-slate-200 opacity-60 grayscale' : 
                                isOrange ? 'bg-white border-orange-200 shadow-xl shadow-orange-100/50 hover:-translate-y-1' :
                                'bg-white border-slate-200 shadow-lg shadow-slate-100 hover:shadow-xl hover:-translate-y-1'
                            }`}
                        >
                            {/* Left Ticket Part: The Value Box */}
                            <div className={`w-32 flex flex-col items-center justify-center border-r border-dashed shrink-0 relative transition-colors ${
                                !isAvailable ? 'bg-slate-200 border-slate-300' : 
                                isOrange ? 'bg-orange-500 border-orange-400' : 'bg-slate-900 border-slate-700'
                            }`}>
                                {/* Punch Holes (Skeuomorphic cutout) */}
                                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#FDFDFD] border border-slate-100 shadow-inner z-10"></div>
                                <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#FDFDFD] border border-slate-100 shadow-inner z-10"></div>
                                
                                <div className={`text-3xl font-black tracking-tighter ${!isAvailable ? 'text-slate-400' : 'text-white'}`}>{cpn.value}</div>
                                <div className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${!isAvailable ? 'text-slate-400' : 'text-white/60'}`}>{cpn.type}</div>
                            </div>

                            {/* Right Ticket Part: The Content */}
                            <div className="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-base font-black text-slate-900 truncate">{cpn.name}</h4>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                            cpn.status === 'Available' ? 'bg-green-100 text-green-700' :
                                            cpn.status === 'Expiring' ? 'bg-orange-100 text-orange-700' :
                                            'bg-slate-200 text-slate-500'
                                        }`}>
                                            {cpn.status}
                                        </span>
                                    </div>
                                    <div className="font-mono text-xs font-bold text-slate-400">CODE: <span className="text-slate-900">{cpn.id}</span></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                        <Calendar size={12} className="text-slate-300" />
                                        Exp: {cpn.expiry}
                                    </div>
                                    
                                    {isAvailable && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setActionModal({ isOpen: true, type: 'resend_coupon' })}
                                                className="p-2 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-lg transition-colors"
                                                title="Resend to Customer"
                                            >
                                                <Mail size={14} />
                                            </button>
                                            <button 
                                                onClick={() => setActionModal({ isOpen: true, type: 'adjust_points' })}
                                                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                                                title="Manual Redemption"
                                            >
                                                <CheckCircle2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State / Footer */}
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-slate-200 rounded-4xl text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <Plus size={32} />
                 </div>
                 <h4 className="text-lg font-bold text-slate-900 mb-1">Issue a unique reward?</h4>
                 <p className="text-sm text-slate-500 mb-8 max-w-sm">Manually issuing a coupon will notify the customer via their preferred channel and add it to their wallet immediately.</p>
                 <button 
                    onClick={() => setActionModal({ isOpen: true, type: 'issue_coupon' })}
                    className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
                 >
                    <Ticket size={18} className="text-purple-400" /> Issue Custom Coupon
                 </button>
            </div>
          </div>
        )}

        {/* ### Tab 6: Info Change Log (Audit) ### */}
        {activeTab === 'log' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
            {/* Audit Dashboard Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                  <History size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Events</div>
                  <div className="text-2xl font-black text-slate-900">124</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Modified</div>
                  <div className="text-sm font-bold text-slate-900">2 hours ago</div>
                  <div className="text-[10px] text-slate-400 font-medium">by Admin #042</div>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <ShieldCheck size={80} className="text-white" />
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Data Integrity</div>
                  <div className="text-lg font-black text-white uppercase tracking-tight">Verified Chain</div>
                </div>
              </div>
            </div>

            {/* Change Log Table */}
            <div className="bg-white border border-slate-200 rounded-4xl shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <History size={18} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">System Audit Trail</h3>
                </div>
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search by admin or field..." 
                        className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-50"
                      />
                   </div>
                   <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm">
                      <Download size={18} />
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-8 py-5">Timestamp</th>
                      <th className="px-8 py-5">Operator</th>
                      <th className="px-8 py-5">Action Type</th>
                      <th className="px-8 py-5">Modification Detail</th>
                      <th className="px-8 py-5 text-right">IP / Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { date: 'Dec 02, 2024', time: '14:23', admin: 'Admin #042 (Sarah L.)', type: 'Profile Update', detail: 'Email', old: 'alina@oldmail.com', new: 'alina@example.com', ip: '202.64.11.90' },
                      { date: 'Nov 28, 2024', time: '10:00', admin: 'System (Automation)', type: 'Point Adjustment', detail: 'Loyalty Run', old: '11,500', new: '12,500', ip: 'internal-v1' },
                      { date: 'Nov 25, 2024', time: '16:12', admin: 'Admin #001 (Root)', type: 'Tier Override', detail: 'Tier Status', old: 'Silver', new: 'Gold', ip: '192.168.1.1' },
                      { date: 'Nov 12, 2024', time: '09:45', admin: 'Admin #042 (Sarah L.)', type: 'Consent Change', detail: 'SMS Marketing', old: 'Opt-out', new: 'Opt-in', ip: '202.64.11.90' },
                      { date: 'Oct 30, 2024', time: '23:59', admin: 'System (Cleanup)', type: 'Data Purge', detail: 'Expired Points', old: '11,620', new: '11,500', ip: 'internal-cron' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="text-sm font-bold text-slate-800">{log.date}</div>
                          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{log.time}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                              <User size={14} />
                            </div>
                            <span className="text-sm font-black text-slate-900">{log.admin}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            log.type.includes('Tier') ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                            log.type.includes('Point') ? 'bg-green-50 text-green-700 border-green-100' :
                            log.type.includes('Consent') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.detail}</div>
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="text-slate-400 line-through decoration-slate-300">{log.old}</span>
                            <ArrowRight size={12} className="text-slate-300" />
                            <span className="text-primary-600 px-1.5 py-0.5 bg-primary-50 rounded">{log.new}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right font-mono text-[10px] font-bold text-slate-400">
                          {log.ip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 transition-colors py-2 px-4 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100">
                  View Detailed JSON Payload
                </button>
              </div>
            </div>

            {/* Audit Policy Footer */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <Info size={18} />
                  </div>
                  <p className="text-xs font-medium text-slate-500 max-w-lg leading-relaxed">
                    Auditing is enabled for all PII and financial fields. Records are stored in a read-only immutable log for 7 years to comply with regional data governance and GDPR requirements.
                  </p>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-200">
                  Export Audit PDF
               </button>
            </div>
          </div>
        )}

        {/* Tab Placeholders for logic clarity */}
        {(activeTab !== 'profile' && activeTab !== 'transactions' && activeTab !== 'tier' && activeTab !== 'points' && activeTab !== 'coupons' && activeTab !== 'log') && (
           <div className="bg-white border border-slate-200 border-dashed rounded-4xl p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                 <Info size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Module Under Update</h3>
              <p className="text-sm text-slate-500 max-w-sm">The <strong>{activeTab}</strong> tab logic and UI is currently being refined to match the new architecture.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetail;
