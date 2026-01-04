
import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Phone, Upload, Plus, Users, TrendingUp, 
  AlertTriangle, ArrowRight, Search, Filter, ChevronDown, Crown, RotateCcw
} from 'lucide-react';
import { NavItemId } from '../types';
import { useMember } from '../context/MemberContext';
import ImportWizard from '../components/ImportWizard';
import EditProfileModal from '../components/member/EditProfileModal';

/* Define the props interface for MemberList */
interface MemberListProps {
  onNavigate: (id: NavItemId) => void;
}

/* Component definition with proper type annotation */
const MemberList: React.FC<MemberListProps> = ({ onNavigate }) => {
  const { members, setSelectedMemberId, filterOverride, setFilterOverride } = useMember();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // --- FILTER STATES ---
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'churn'>('all');
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [dateFilter, setDateFilter] = useState('Any Time');
  const [pointsFilter, setPointsFilter] = useState(0); // For the Point Bar
  const [searchQuery, setSearchQuery] = useState('');

  // Handle filter override on mount (e.g., coming from Performance)
  useEffect(() => {
    if (filterOverride === 'churn') {
        setDashboardFilter('churn');
        setFilterOverride(null); // Clear after use
    }
  }, [filterOverride, setFilterOverride]);

  // Health Check Dashboard Calculations
  const totalMembers = members.length;
  const newThisWeek = 12; // Mocked growth trend
  const churnRiskCount = members.filter(m => m.status === 'Inactive').length;

  // --- CUMULATIVE FILTERING ENGINE ---
  const displayMembers = members.filter(m => {
    // 1. Dashboard Filter (All vs Churn Risk)
    const matchesDashboard = dashboardFilter === 'churn' ? m.status === 'Inactive' : true;
    
    // 2. Tier Filter
    const matchesTier = tierFilter === 'All Tiers' ? true : m.tier === tierFilter;
    
    // 3. Points Filter (Point Bar logic)
    const matchesPoints = m.points >= pointsFilter;
    
    // 4. Date Filter
    let matchesDate = true;
    if (dateFilter !== 'Any Time') {
        const joinDate = new Date(m.joinDate);
        const now = new Date();
        if (dateFilter === 'Last 30 Days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            matchesDate = joinDate >= thirtyDaysAgo;
        } else if (dateFilter === 'This Year') {
            matchesDate = joinDate.getFullYear() === now.getFullYear();
        }
    }

    // 5. Search Query (Email, Phone, Card No, Name)
    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
        m.firstName.toLowerCase().includes(q) || 
        m.lastName.toLowerCase().includes(q) || 
        m.email.toLowerCase().includes(q) || 
        m.phone.includes(q) || 
        m.cardNo.includes(q);

    return matchesDashboard && matchesTier && matchesPoints && matchesDate && matchesSearch;
  });

  const resetFilters = () => {
    setTierFilter('All Tiers');
    setDateFilter('Any Time');
    setPointsFilter(0);
    setSearchQuery('');
    setDashboardFilter('all');
  };

  const handleRowClick = (id: string) => {
    setSelectedMemberId(id);
    onNavigate('member-detail');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Import Wizard */}
      <ImportWizard isOpen={showImport} onClose={() => setShowImport(false)} />

      {/* Unified Create/Edit Member Modal */}
      <EditProfileModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        initialData={undefined} 
      />

      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Member Management</h1>
          <p className="text-slate-500 mt-2 text-lg">View and manage your loyalty program members</p>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowImport(true)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
             >
                <Upload size={18} />
                Import
             </button>
             <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 hover:scale-[1.02]"
             >
                <Plus size={18} />
                Add Member
             </button>
        </div>
      </div>

      {/* The "Health Check" Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Members */}
        <div 
          onClick={() => setDashboardFilter('all')}
          className={`p-6 rounded-3xl border flex items-center gap-5 group transition-all cursor-pointer ${dashboardFilter === 'all' ? 'bg-primary-50 border-primary-500' : 'bg-white border-slate-200 hover:border-primary-400'}`}
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${dashboardFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-primary-50 text-primary-500'}`}>
                <Users size={28} />
            </div>
            <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Members</span>
                <div className="text-3xl font-black text-slate-900 leading-tight">{totalMembers.toLocaleString()}</div>
            </div>
        </div>

        {/* Card 2: New This Week */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-5 group hover:border-green-500 transition-all cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
            </div>
            <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">New This Week</span>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-slate-900 leading-tight">+{newThisWeek}</div>
                  <span className="text-xs font-bold text-green-600">+12% trend</span>
                </div>
            </div>
        </div>

        {/* Card 3: Churn Risk */}
        <div 
          onClick={() => setDashboardFilter('churn')}
          className={`p-6 rounded-3xl border flex items-center justify-between group transition-all cursor-pointer ${dashboardFilter === 'churn' ? 'bg-red-50 border-red-500' : 'bg-white border-slate-200 hover:red-400'}`}
        >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform relative group-hover:scale-110 ${dashboardFilter === 'churn' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
                  <AlertTriangle size={28} />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                  </span>
              </div>
              <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Churn Risk</span>
                  <div className="text-3xl font-black text-slate-900 leading-tight">{churnRiskCount}</div>
              </div>
            </div>
            <ArrowRight className={`transition-all ${dashboardFilter === 'churn' ? 'text-red-500 translate-x-1' : 'text-slate-200 group-hover:text-red-500 group-hover:translate-x-1'}`} size={24} />
        </div>
      </div>

      {/* 2. Advanced Toolbar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-2">
          {/* Search */}
          <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Card No, Phone or Email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
              />
          </div>
          
          {/* Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isFilterOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
      </div>

      {/* 3. Filter Panel (Conditional) */}
      {isFilterOpen && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-in slide-in-from-top-2 z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tier Level</label>
                    <select 
                      value={tierFilter}
                      onChange={(e) => setTierFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-400"
                    >
                        <option>All Tiers</option>
                        <option>Platinum</option>
                        <option>Gold</option>
                        <option>Silver</option>
                        <option>Bronze</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Join Date</label>
                    <select 
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-400"
                    >
                        <option>Any Time</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Min Point Balance</label>
                      <span className="text-xs font-black text-primary-600">{pointsFilter.toLocaleString()} Pts</span>
                    </div>
                    <div className="pt-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="50000" 
                        step="500" 
                        value={pointsFilter}
                        onChange={(e) => setPointsFilter(Number(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                      />
                      <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-300 uppercase">
                        <span>0</span>
                        <span>50,000</span>
                      </div>
                    </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <RotateCcw size={14} />
                  Reset All Filters
                </button>
              </div>
          </div>
      )}

      {/* 4. Data Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-5">Member</th>
                          <th className="px-6 py-5">Mobile</th>
                          <th className="px-6 py-5">Card Number</th>
                          <th className="px-6 py-5">Tier</th>
                          <th className="px-6 py-5">Point Balance</th>
                          <th className="px-6 py-5">Join Date</th>
                          <th className="px-6 py-5">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {displayMembers.map((member) => (
                          <tr 
                            key={member.id} 
                            onClick={() => handleRowClick(member.id)}
                            className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                          >
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                      <img src={member.avatar} alt={member.firstName} className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
                                      <div>
                                          <div className="font-bold text-slate-900 text-sm group-hover:text-primary-600 transition-colors">{member.firstName} {member.lastName}</div>
                                          <div className="text-xs text-slate-400">{member.email}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-slate-700">{member.phone}</div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-slate-700 font-mono tracking-tight">{member.cardNo}</div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                      member.tier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                      member.tier === 'Platinum' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                      member.tier === 'Silver' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                      'bg-orange-50 text-orange-700 border-orange-200'
                                  }`}>
                                      {member.tier === 'Gold' && <Crown size={12} />}
                                      {member.tier}
                                  </span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="font-bold text-slate-900">{member.points.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="text-sm text-slate-500 font-medium">{member.joinDate}</div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                      member.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                      {member.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          
          {/* Footer / Pagination */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">
                {displayMembers.length < totalMembers ? `Showing ${displayMembers.length} Filtered Results` : `Showing 1-${displayMembers.length} of ${totalMembers} Members`}
              </span>
              <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">Previous</button>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">Next</button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MemberList;
