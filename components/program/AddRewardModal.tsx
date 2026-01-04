import React, { useState } from 'react';
import { X, Gift, Coins, Ticket, CheckCircle2, Clock, DollarSign, Truck, AlertCircle } from 'lucide-react';
import { TierBenefit } from '../../types';
import SentenceInput from './SentenceInput';

interface AddRewardModalProps {
  category: TierBenefit['category'];
  onClose: () => void;
  onSave: (benefit: TierBenefit) => void;
}

// Mock Data for "Rich Tickets"
const MOCK_COUPONS = [
  { id: 'c1', name: '$10 Cash Voucher', type: 'discount', value: '$10', validity: '3 Months', minSpend: '$50', icon: DollarSign, color: 'text-green-600 bg-green-50 border-green-200' },
  { id: 'c2', name: '15% Off Order', type: 'discount', value: '15%', validity: '30 Days', minSpend: 'None', icon: Ticket, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'c3', name: 'Free Shipping', type: 'free_shipping', value: 'Standard', validity: '6 Months', minSpend: '$20', icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'c4', name: 'Mystery Gift', type: 'custom', value: 'Item', validity: '1 Year', minSpend: 'None', icon: Gift, color: 'text-orange-600 bg-orange-50 border-orange-200' },
];

const AddRewardModal: React.FC<AddRewardModalProps> = ({ category, onClose, onSave }) => {
  const [type, setType] = useState<'fixed_points' | 'coupon'>('fixed_points');
  const [pointsValue, setPointsValue] = useState(100);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  const handleSave = () => {
    let newBenefit: TierBenefit;

    if (type === 'fixed_points') {
      newBenefit = {
        id: Math.random().toString(36).substr(2, 9),
        category,
        type: 'fixed_points',
        label: `${pointsValue} Bonus Points`,
        value: String(pointsValue),
      };
    } else {
      const coupon = MOCK_COUPONS.find(c => c.id === selectedCouponId);
      if (!coupon) return;
      newBenefit = {
        id: Math.random().toString(36).substr(2, 9),
        category,
        type: 'coupon', // Generalizing as coupon wrapper
        label: coupon.name,
        value: coupon.value,
      };
    }

    onSave(newBenefit);
  };

  const getTitle = () => {
    switch(category) {
      case 'upgrade': return 'Add Upgrade Bonus';
      case 'renewal': return 'Add Renewal Bonus';
      case 'birthday': return 'Add Birthday Treat';
      case 'anniversary': return 'Add Anniversary Gift';
      case 'welcome': return 'Add Welcome Gift';
      case 'profile': return 'Add Profile Mission Reward';
      default: return 'Add Reward';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Gift size={18} className="text-primary-500" />
            {getTitle()}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
            
            {/* Left Sidebar: Type Selector */}
            <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-4 space-y-2">
                <button 
                  onClick={() => setType('fixed_points')}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${type === 'fixed_points' ? 'bg-white shadow-sm border border-slate-200 text-primary-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Coins size={18} className={type === 'fixed_points' ? 'text-primary-500' : 'text-slate-400'} />
                    <span className="font-bold text-sm">Fixed Points</span>
                </button>
                <button 
                  onClick={() => setType('coupon')}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${type === 'coupon' ? 'bg-white shadow-sm border border-slate-200 text-primary-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Ticket size={18} className={type === 'coupon' ? 'text-primary-500' : 'text-slate-400'} />
                    <span className="font-bold text-sm">Coupon / Voucher</span>
                </button>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {type === 'fixed_points' ? (
                   <div className="flex flex-col items-center justify-center h-full">
                     <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6">
                        <Coins size={32} />
                     </div>
                     <div className="text-lg font-medium text-slate-600 mb-2">
                       Grant member
                     </div>
                     <SentenceInput 
                        type="number"
                        value={pointsValue}
                        onChange={(v) => setPointsValue(Number(v))}
                        width="w-32"
                        className="text-4xl"
                     />
                     <div className="text-lg font-medium text-slate-600 mt-2">
                       Points automatically.
                     </div>
                   </div>
                ) : (
                   <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Select a Coupon from Library</h4>
                      <div className="grid grid-cols-1 gap-4">
                          {MOCK_COUPONS.map(coupon => {
                              const isSelected = selectedCouponId === coupon.id;
                              const Icon = coupon.icon;
                              return (
                                  <div 
                                    key={coupon.id}
                                    onClick={() => setSelectedCouponId(coupon.id)}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all group ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                  >
                                      <div className="flex items-start justify-between">
                                          <div className="flex items-start gap-4">
                                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${coupon.color}`}>
                                                  <Icon size={20} />
                                              </div>
                                              <div>
                                                  <div className="font-bold text-slate-900">{coupon.name}</div>
                                                  <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                                                      <span className="flex items-center gap-1"><Clock size={12} /> {coupon.validity}</span>
                                                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                      <span>Min Spend: {coupon.minSpend}</span>
                                                  </div>
                                              </div>
                                          </div>
                                          {isSelected && (
                                              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-sm animate-in zoom-in duration-200">
                                                  <CheckCircle2 size={14} />
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                      <div className="mt-6 text-center">
                        <button className="text-xs font-bold text-primary-600 hover:underline flex items-center justify-center gap-1">
                            <Ticket size={12} /> Create New Coupon in Assets
                        </button>
                      </div>
                   </div>
                )}
            </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={type === 'coupon' && !selectedCouponId}
            className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
          >
            Add Reward
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddRewardModal;