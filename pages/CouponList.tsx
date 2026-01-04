
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, ChevronDown, MoreHorizontal, 
  Ticket, Percent, Package, Truck, Users, Calendar, 
  ArrowUpRight, AlertCircle, CheckCircle2, Clock, 
  Pause, Play, Copy, Trash2, Edit3, BarChart2, X, RotateCcw
} from 'lucide-react';
import { NavItemId, CouponType, CouponStatus } from '../types';
import { useCoupon } from '../context/CouponContext';

interface CouponListProps {
  onNavigate: (id: NavItemId) => void;
}

const CouponList: React.FC<CouponListProps> = ({ onNavigate }) => {
  const { coupons, deleteCoupon, duplicateCoupon, toggleCouponStatus } = useCoupon();
  
  // --- Smart Filter States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'All' | CouponStatus>('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'All' | CouponType>('All');
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // --- Logic Fix: Comprehensive Filtering Engine ---
  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
                          c.name.toLowerCase().includes(q) || 
                          c.code.toLowerCase().includes(q) ||
                          c.displayName.toLowerCase().includes(q);
      
      const matchesStatus = activeStatusFilter === 'All' || c.status === activeStatusFilter;
      const matchesType = activeTypeFilter === 'All' || c.type === activeTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [coupons, searchQuery, activeStatusFilter, activeTypeFilter]);

  // --- Helpers ---
  const getTypeIcon = (type: CouponType) => {
    switch (type) {
      case 'cash': return <Ticket className="text-green-600" size={18} />;
      case 'percentage': return <Percent className="text-blue-600" size={18} />;
      case 'sku': return <Package className="text-purple-600" size={18} />;
      case 'shipping': return <Truck className="text-orange-600" size={18} />;
    }
  };

  const getStatusStyles = (status: CouponStatus) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-700 border-green-200';
      case 'Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Paused': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ended': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Draft': return 'bg-slate-50 text-slate-400 border-slate-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setActiveStatusFilter('All');
    setActiveTypeFilter('All');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Zone A: Header & Global Metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Coupon Management</h1>
          <p className="text-slate-500 mt-2 text-lg">Create, monitor, and audit your digital value assets.</p>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-sm font-bold text-slate-700">{coupons.filter(c => c.status === 'Live').length} Live Assets</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                <Clock size={16} />
                <span className="text-sm font-medium">{coupons.filter(c => c.status === 'Scheduled').length} Scheduled Drops</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('coupon-create')} 
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} className="text-primary-300" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Zone A-2: Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Redemptions" value={coupons.reduce((acc, c) => acc + c.inventory.used, 0).toLocaleString()} trend="+12%" color="blue" />
          <StatCard label="Total Assets" value={coupons.length.toString()} trend="Active" color="green" />
          <StatCard label="Incremental Revenue" value={`$${(coupons.reduce((acc, c) => acc + c.revenue, 0) / 1000).toFixed(1)}k`} trend="+18%" color="indigo" />
          <StatCard label="Oversell Risk" value={coupons.filter(c => c.inventory.used / c.inventory.total > 0.9).length.toString()} trend="High" color="red" isWarning />
      </div>

      {/* Zone A-3: Fixed Smart Filters Toolbar */}
      <div className="space-y-4">
        <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Status Selection */}
            <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar w-full lg:w-auto">
                {['All', 'Live', 'Scheduled', 'Paused', 'Ended'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveStatusFilter(status as any)}
                        className={`
                            px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                            ${activeStatusFilter === status 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent'}
                        `}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="w-px h-8 bg-slate-100 hidden lg:block"></div>

            {/* Search Part */}
            <div className="flex-1 relative w-full">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by ID, code, or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-slate-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-50"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="w-px h-8 bg-slate-100 hidden lg:block"></div>

            {/* Filter Toggle Button */}
            <button 
                onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${isTypeFilterOpen ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                <Filter size={18} />
                Type
                <ChevronDown size={16} className={`transition-transform duration-300 ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>

        {/* Filter Panel Content (Conditional) */}
        {isTypeFilterOpen && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm animate-in slide-in-from-top-2 duration-300 flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Selection by Asset Type</span>
                <button
                    onClick={() => setActiveTypeFilter('All')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeTypeFilter === 'All' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                    All Types
                </button>
                {(['cash', 'percentage', 'sku', 'shipping'] as CouponType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveTypeFilter(type)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                            ${activeTypeFilter === type 
                                ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-200' 
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}
                        `}
                    >
                        {getTypeIcon(type)}
                        <span className="capitalize">{type}</span>
                    </button>
                ))}

                {(searchQuery || activeStatusFilter !== 'All' || activeTypeFilter !== 'All') && (
                    <button 
                        onClick={resetFilters}
                        className="ml-auto text-[10px] font-black uppercase text-red-500 hover:text-red-600 flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 transition-all hover:scale-105"
                    >
                        <RotateCcw size={12} /> Reset Filters
                    </button>
                )}
            </div>
        )}
      </div>

      {/* Zone B: The Data Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-visible shadow-sm shadow-slate-100/50 min-h-[400px]">
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Coupon Identity</th>
                <th className="px-8 py-5">Value / Type</th>
                <th className="px-8 py-5">Audience</th>
                <th className="px-8 py-5">Inventory Usage</th>
                <th className="px-8 py-5">Validity</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCoupons.map((coupon) => {
                const usagePercent = Math.round((coupon.inventory.used / coupon.inventory.total) * 100);
                const isCritical = usagePercent > 90 && coupon.status === 'Live';

                return (
                  <tr key={coupon.id} className="group hover:bg-slate-50/50 transition-colors cursor-default relative">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-tight">{coupon.name}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-wider">{coupon.code}</span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                          coupon.type === 'cash' ? 'bg-green-50 border-green-100' :
                          coupon.type === 'percentage' ? 'bg-blue-50 border-blue-100' :
                          coupon.type === 'sku' ? 'bg-purple-50 border-purple-100' :
                          'bg-orange-50 border-orange-100'
                        }`}>
                          {getTypeIcon(coupon.type)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 leading-none">{coupon.value}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase mt-1.5">{coupon.type}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                       <div className="flex flex-wrap gap-1 max-w-[150px]">
                         {coupon.audience.map(t => (
                           <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200 uppercase tracking-tighter whitespace-nowrap">{t}</span>
                         ))}
                       </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="w-32 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className={isCritical ? 'text-red-600' : 'text-slate-500'}>{usagePercent}% used</span>
                          <span className="text-slate-400 font-mono">{coupon.inventory.used}/{coupon.inventory.total}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div 
                            className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-primary-500 shadow-[0_0_8px_rgba(5,93,219,0.3)]'}`} 
                            style={{ width: `${usagePercent}%` }}
                           />
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <Calendar size={12} className="text-slate-300" />
                          {coupon.validity.start}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-5">
                          {coupon.validity.end ? `To ${coupon.validity.end}` : 'Rolling Validity'}
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(coupon.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          coupon.status === 'Live' ? 'bg-green-500 animate-pulse' : 
                          coupon.status === 'Scheduled' ? 'bg-blue-500' :
                          'bg-slate-400'
                        }`}></span>
                        {coupon.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 text-right pr-10 relative">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm" title="Edit Properties">
                            <Edit3 size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm" title="Performance Analytics">
                            <BarChart2 size={18} />
                         </button>
                         <div className="relative">
                            <button 
                                className={`p-2 rounded-xl transition-all ${activeMenuId === coupon.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === coupon.id ? null : coupon.id); }}
                            >
                                <MoreHorizontal size={18} />
                            </button>
                            {activeMenuId === coupon.id && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <div className="py-2">
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); duplicateCoupon(coupon.id); setActiveMenuId(null); }}
                                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                                        >
                                          <Copy size={16} /> Duplicate
                                        </button>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); toggleCouponStatus(coupon.id); setActiveMenuId(null); }}
                                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                                        >
                                          {coupon.status === 'Paused' ? <><Play size={16}/> Resume</> : <><Pause size={16}/> Pause</>}
                                        </button>
                                        <div className="h-px bg-slate-50 my-1"></div>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); deleteCoupon(coupon.id); setActiveMenuId(null); }}
                                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3"
                                        >
                                          <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                         </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State / No Results */}
        {filteredCoupons.length === 0 && (
          <div className="p-24 text-center flex flex-col items-center animate-in fade-in zoom-in-95">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border-2 border-dashed border-slate-200">
                <Ticket size={48} />
             </div>
             <h3 className="text-2xl font-extrabold text-slate-900">No assets matching filters</h3>
             <p className="text-slate-500 max-w-xs mt-2 font-medium">We couldn't find any coupons that match your current search and filter settings.</p>
             <button 
              onClick={resetFilters}
              className="mt-8 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
             >
               <RotateCcw size={18} /> Clear all filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-components ---

const StatCard = ({ label, value, trend, color, isWarning = false }: { label: string, value: string, trend: string, color: string, isWarning?: boolean }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`p-6 rounded-[2.5rem] border border-slate-200 bg-white shadow-sm flex flex-col justify-between h-36 relative overflow-hidden group hover:border-slate-300 transition-all cursor-default`}>
       <div className="flex justify-between items-start relative z-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</span>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${isWarning ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
            {trend}
          </div>
       </div>
       <div className="text-4xl font-black text-slate-900 relative z-10 tracking-tight">{value}</div>
       <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700 pointer-events-none ${colorMap[color]}`}>
          {isWarning ? <AlertCircle size={110} /> : <ArrowUpRight size={110} />}
       </div>
    </div>
  );
};

export default CouponList;
