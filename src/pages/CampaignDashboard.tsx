import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, TrendingUp, AlertTriangle, DollarSign, 
  MoreHorizontal, Play, Pause, Edit3, ArrowUp, BarChart2,
  Calendar, Copy, Trash2, Users, Gift, Filter
} from 'lucide-react';
import { Campaign, CampaignStatus, NavItemId, CampaignType } from '../types';
import TemplateDrawer from '../components/campaign/TemplateDrawer';
import { useCampaign } from '../context/CampaignContext';

interface CampaignDashboardProps {
  onNavigate: (id: NavItemId) => void;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({ onNavigate }) => {
  // Consume Context Data
  const { campaigns, saveCampaign, deleteCampaign, createDraftFromTemplate, loadCampaign, clearDraft } = useCampaign();
  
  // Local UI State
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'drafts' | 'high_priority'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Computed Data
  const filteredCampaigns = campaigns.filter(c => {
    // 1. Text Search
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Pill Filter
    let matchesFilter = true;
    if (activeFilter === 'active') matchesFilter = c.status === 'active';
    if (activeFilter === 'drafts') matchesFilter = c.status === 'draft';
    if (activeFilter === 'high_priority') matchesFilter = c.priority === 'high' || c.priority === 'critical';

    return matchesSearch && matchesFilter;
  });

  const totalActive = campaigns.filter(c => c.status === 'active').length;
  const totalRevenue = campaigns.reduce((acc, curr) => acc + curr.attributionRevenue, 0);

  // Handlers
  const handleCreateClick = () => {
    clearDraft();
    setIsTemplateDrawerOpen(true);
  };

  const handleTemplateSelect = (type: CampaignType) => {
    createDraftFromTemplate(type);
    setIsTemplateDrawerOpen(false);
    onNavigate('campaign-editor');
  };

  const handleEdit = (campaign: Campaign) => {
    loadCampaign(campaign);
    onNavigate('campaign-editor');
  };

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDuplicate = (campaign: Campaign) => {
      const newCampaign: Campaign = {
          ...campaign,
          id: `cmp_${Math.random().toString(36).substr(2, 9)}`,
          name: `${campaign.name} (Copy)`,
          status: 'draft',
          attributionRevenue: 0,
          attributionRevenueDisplay: '$0',
          reachCount: 0,
          startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          lastEdited: 'Just now'
      };
      saveCampaign(newCampaign); // Save to context
      setActiveMenuId(null);
  };

  const handleToggleStatus = (campaign: Campaign) => {
      let newStatus: CampaignStatus = campaign.status;
      
      if (campaign.status === 'active') newStatus = 'paused';
      else if (campaign.status === 'paused') newStatus = 'active';
      else if (campaign.status === 'draft') newStatus = 'active';
      
      saveCampaign({ ...campaign, status: newStatus }); // Save to context
      setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
          deleteCampaign(id); // Delete from context
      }
      setActiveMenuId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      <TemplateDrawer 
        isOpen={isTemplateDrawerOpen}
        onClose={() => setIsTemplateDrawerOpen(false)}
        onSelect={handleTemplateSelect}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaign Studio</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your offers, automated rules, and loyalty triggers.</p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:scale-[1.02]"
        >
          <Plus size={20} className="text-primary-300 group-hover:text-white transition-colors" />
          Create Campaign
        </button>
      </div>

      {/* Zone A: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-primary-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Campaigns</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-2">{totalActive}</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
            <ArrowUp size={12} /> 2 launched this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle size={80} className="text-orange-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Liability</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-2">2.4M <span className="text-lg text-slate-400 font-bold">Pts</span></div>
          </div>
          <div className="text-xs font-medium text-slate-500">
            Pending redemption value: ~$24,000
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} className="text-green-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attribution Revenue (30d)</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-2">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
            <ArrowUp size={12} /> 12% vs last month
          </div>
        </div>
      </div>

      {/* Zone B: Filters */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Campaigns' },
            { id: 'active', label: 'Live / Active' },
            { id: 'drafts', label: 'Drafts' },
            { id: 'high_priority', label: 'High Priority' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                ${activeFilter === filter.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="w-px bg-slate-200 hidden lg:block my-2"></div>

        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, tag or trigger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Zone C: Campaign List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-visible shadow-sm min-h-[400px]">
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-5 pl-8 w-1/3">Campaign Name</th>
                <th className="px-6 py-5">Priority</th>
                <th className="px-6 py-5">Attribution (7d)</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCampaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  onClick={() => handleEdit(campaign)}
                  className="group hover:bg-slate-50/80 transition-colors cursor-pointer relative"
                >
                  <td className="px-6 py-5 pl-8">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        campaign.type === 'boost_sales' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        campaign.type === 'birthday' ? 'bg-pink-50 border-pink-100 text-pink-600' :
                        campaign.type === 'referral' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                        'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        {campaign.type === 'boost_sales' && <TrendingUp size={20} />}
                        {campaign.type === 'birthday' && <Gift size={20} />}
                        {campaign.type === 'referral' && <Users size={20} />}
                        {campaign.type === 'custom' && <Filter size={20} />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base mb-1 group-hover:text-primary-600 transition-colors">
                          {campaign.name}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> 
                            {campaign.status === 'active' || campaign.status === 'paused'
                              ? `Ends ${campaign.endDate || 'Never'}` 
                              : campaign.status === 'scheduled' 
                                ? `Starts ${campaign.startDate}`
                                : `Edited ${campaign.lastEdited}`}
                          </span>
                          {campaign.type === 'custom' && (
                            <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">Custom Logic</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {campaign.priority === 'critical' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200">
                        <ArrowUp size={12} strokeWidth={3} /> Critical
                      </div>
                    )}
                    {campaign.priority === 'high' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold border border-orange-200">
                        <ArrowUp size={12} /> High
                      </div>
                    )}
                    {campaign.priority === 'standard' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold border border-slate-200">
                        <div className="w-2 h-0.5 bg-slate-400 rounded-full"></div> Standard
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    {campaign.status === 'active' || campaign.status === 'paused' ? (
                      <div>
                        <div className="text-sm font-bold text-slate-900">{campaign.attributionRevenueDisplay}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{campaign.reachCount.toLocaleString()} users reached</div>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                        No Data
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {campaign.status === 'active' && (
                        <div className="w-8 h-5 bg-green-500 rounded-full p-0.5 flex justify-end transition-all">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      )}
                      {campaign.status === 'paused' && (
                        <div className="w-8 h-5 bg-slate-200 rounded-full p-0.5 flex justify-start transition-all">
                          <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
                        </div>
                      )}
                      {campaign.status !== 'active' && campaign.status !== 'paused' && (
                        <div className="w-8 h-5 bg-slate-200 rounded-full p-0.5 flex justify-start transition-all">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      )}
                      
                      <span className={`text-xs font-bold uppercase ml-1 ${
                        campaign.status === 'active' ? 'text-green-600' : 
                        campaign.status === 'paused' ? 'text-amber-600' :
                        campaign.status === 'scheduled' ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right pr-8 relative">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEdit(campaign); }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Campaign"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('performance-analytics'); }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Analytics"
                      >
                        <BarChart2 size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleMenuClick(e, campaign.id)}
                        className={`p-2 rounded-lg transition-colors ${activeMenuId === campaign.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {activeMenuId === campaign.id && (
                        <div className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="py-1">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDuplicate(campaign); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                                >
                                    <Copy size={16} /> Duplicate
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(campaign); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                                >
                                    {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                    {campaign.status === 'active' ? 'Pause Campaign' : campaign.status === 'draft' ? 'Activate' : 'Resume'}
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(campaign.id); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Search size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No campaigns found</h3>
                      <p className="text-slate-500 text-sm mt-1 max-w-xs">
                        Try adjusting your filters or create a new campaign to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CampaignDashboard;