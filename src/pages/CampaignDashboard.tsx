import React, { useState, useEffect } from 'react';
import {
  Plus, Search, TrendingUp, AlertTriangle, DollarSign,
  MoreHorizontal, Play, Pause, Edit3, ArrowUp, BarChart2,
  Calendar, Copy, Trash2, Users, Gift, Filter
} from 'lucide-react';
import { Campaign, CampaignStatus, NavItemId, CampaignType, CampaignKPI } from '../types';
import { SETTINGS_BUTTON_STYLES } from '../constants';
import TemplateDrawer from '../components/campaign/TemplateDrawer';
import QuickLookDrawer from '../components/campaign/QuickLookDrawer';
import StopConfirmationModal from '../components/shared/StopConfirmationModal';
import { useCampaign } from '../context/CampaignContext';

interface CampaignDashboardProps {
  onNavigate: (id: NavItemId, payload?: { id: string }) => void;
}

/**
 * T004: Polymorphic Metric Utility
 * Determines the primary KPI display based on campaign type.
 */
export const getCampaignKPI = (campaign: Campaign): CampaignKPI => {
  switch (campaign.type) {
    case 'boost_sales':
    case 'spending':
    case 'accumulated':
    case 'accumulation':
      return {
        label: 'ROI / Sales',
        value: campaign.attributionRevenueDisplay || `$${(campaign.attributionRevenue || 0).toLocaleString()} (0x)`
      };
    case 'referral':
      return {
        label: 'New Members',
        value: `+${campaign.totalParticipants || 0} Users`
      };
    case 'coupon':
      return {
        label: 'Redemption Rate',
        value: campaign.attributionRevenueDisplay || '0%'
      };
    case 'birthday':
    default:
      return {
        label: 'Participation',
        value: `${campaign.totalParticipants || 0} Reached`
      };
  }
};

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({ onNavigate }) => {
  // Consume Context Data
  const { campaigns, isLoading, saveCampaign, deleteCampaign, createDraftFromTemplate, loadCampaign, clearDraft } = useCampaign();

  // Local UI State
  const [activeFilter, setActiveFilter] = useState<CampaignStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [stoppingCampaign, setStoppingCampaign] = useState<Campaign | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || null;

  // Computed Data
  // T014: Search query affects filtering, which now correctly cascades to summary metrics.
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // T012: Derived from filtered list instead of global list
  const totalRunning = filteredCampaigns.filter(c => c.status === 'running' || c.status === 'active').length;
  const totalParticipants = filteredCampaigns.reduce((acc, curr) => acc + (curr.totalParticipants || 0), 0);
  const totalRevenue = filteredCampaigns.reduce((acc, curr) => acc + curr.attributionRevenue, 0);

  // Handlers
  // T013: Map card click to status filter
  const handleMetricClick = (status: CampaignStatus | 'all') => {
    setActiveFilter(status);
  };

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
    loadCampaign(campaign.id);
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
      totalParticipants: 0,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lastEdited: 'Just now'
    };
    saveCampaign(newCampaign);
    setActiveMenuId(null);
  };

  const handleUpdateStatus = (campaign: Campaign, newStatus: CampaignStatus) => {
    if (newStatus === 'stop') {
      setStoppingCampaign(campaign);
      setActiveMenuId(null);
      return;
    }
    saveCampaign({ ...campaign, status: newStatus });
    setActiveMenuId(null);
  };

  const confirmStop = () => {
    if (stoppingCampaign) {
      saveCampaign({ ...stoppingCampaign, status: 'stop' });
      setStoppingCampaign(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      deleteCampaign(id);
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

      <StopConfirmationModal
        isOpen={!!stoppingCampaign}
        onClose={() => setStoppingCampaign(null)}
        onConfirm={confirmStop}
        campaignName={stoppingCampaign?.name || ''}
      />

      <QuickLookDrawer
        campaign={selectedCampaign}
        isOpen={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
        onViewFull={(id) => onNavigate('campaign-analytics', { id })}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campaign Studio</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your offers, automated rules, and loyalty triggers.</p>
        </div>
        <button
          onClick={handleCreateClick}
          className={`${SETTINGS_BUTTON_STYLES.primary} group flex items-center gap-2 px-6 py-3 shadow-lg shadow-slate-200 hover:shadow-xl hover:scale-[1.02]`}
        >
          <Plus size={20} className="text-primary-300 group-hover:text-white transition-colors" />
          Create Campaign
        </button>
      </div>

      {/* Zone A: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => handleMetricClick('running')}
          className={`
            p-6 rounded-3xl border shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group transition-all cursor-pointer select-none
            ${activeFilter === 'running' ? 'bg-slate-900 border-slate-900 ring-4 ring-slate-100' : 'bg-white border-slate-200 hover:border-slate-300'}
          `}
        >
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className={activeFilter === 'running' ? 'text-white' : 'text-primary-500'} />
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${activeFilter === 'running' ? 'text-slate-400' : 'text-slate-400'}`}>Active Campaigns</span>
            <div className={`text-4xl font-extrabold mt-2 ${activeFilter === 'running' ? 'text-white' : 'text-slate-900'}`}>{totalRunning}</div>
          </div>
          <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg w-fit ${activeFilter === 'running' ? 'bg-white/10 text-white' : 'text-green-600 bg-green-50'}`}>
            <ArrowUp size={12} /> Live Now
          </div>
        </div>

        <div
          onClick={() => handleMetricClick('all')}
          className={`
            p-6 rounded-3xl border shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group transition-all cursor-pointer select-none
            ${activeFilter === 'all' ? 'bg-slate-900 border-slate-900 ring-4 ring-slate-100' : 'bg-white border-slate-200 hover:border-slate-300'}
          `}
        >
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} className={activeFilter === 'all' ? 'text-white' : 'text-blue-500'} />
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${activeFilter === 'all' ? 'text-slate-400' : 'text-slate-400'}`}>Summary Participants</span>
            <div className={`text-4xl font-extrabold mt-2 ${activeFilter === 'all' ? 'text-white' : 'text-slate-900'}`}>{totalParticipants.toLocaleString()}</div>
          </div>
          <div className={`text-xs font-medium ${activeFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
            Filtered unique members
          </div>
        </div>

        <div
          onClick={() => handleMetricClick('running')}
          className={`
            p-6 rounded-3xl border shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group transition-all cursor-pointer select-none
            ${activeFilter === 'running' ? 'bg-slate-900 border-slate-900 ring-4 ring-slate-100' : 'bg-white border-slate-200 hover:border-slate-300'}
          `}
        >
          <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} className={activeFilter === 'running' ? 'text-white' : 'text-green-500'} />
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${activeFilter === 'running' ? 'text-slate-400' : 'text-slate-400'}`}>Summary Sales</span>
            <div className={`text-4xl font-extrabold mt-2 ${activeFilter === 'running' ? 'text-white' : 'text-slate-900'}`}>${totalRevenue.toLocaleString()}</div>
          </div>
          <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg w-fit ${activeFilter === 'running' ? 'bg-white/10 text-white' : 'text-green-600 bg-green-50'}`}>
            <ArrowUp size={12} /> Revenue impact
          </div>
        </div>
      </div>

      {/* Zone B: Filters */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2 p-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Campaigns' },
            { id: 'draft', label: 'Draft' },
            { id: 'running', label: 'Running' },
            { id: 'paused', label: 'Pause' },
            { id: 'finish', label: 'Finish' },
            { id: 'stop', label: 'Stop' }
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
            placeholder="Search campaigns..."
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
                <th className="px-6 py-5 pl-8 w-1/3">Campaign Identity</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Timeline</th>
                <th className="px-6 py-5">Primary Metric</th>
                <th className="px-6 py-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Campaigns...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
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
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    onClick={() => setSelectedCampaignId(campaign.id)}
                    className={`
                      group hover:bg-slate-50/80 transition-colors cursor-pointer relative
                      ${selectedCampaignId === campaign.id ? 'bg-primary-50/50 hover:bg-primary-50/80' : ''}
                    `}
                  >
                    {/* Column 1: Identity */}
                    <td className="px-6 py-5 pl-8">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${campaign.type === 'boost_sales' || campaign.type === 'spending' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                          campaign.type === 'birthday' ? 'bg-pink-50 border-pink-100 text-pink-600' :
                            campaign.type === 'referral' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                              campaign.type === 'coupon' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                campaign.type === 'accumulation' || campaign.type === 'accumulated' ? 'bg-teal-50 border-teal-100 text-teal-600' :
                                  'bg-slate-100 border-slate-200 text-slate-600'
                          }`}>
                          {(campaign.type === 'boost_sales' || campaign.type === 'spending') && <TrendingUp size={24} />}
                          {campaign.type === 'birthday' && <Gift size={24} />}
                          {campaign.type === 'referral' && <Users size={24} />}
                          {campaign.type === 'coupon' && <Gift size={24} />}
                          {(campaign.type === 'accumulation' || campaign.type === 'accumulated') && <ArrowUp size={24} />}
                          {campaign.type === 'custom' && <Filter size={24} />}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-primary-600 transition-colors truncate">
                            {campaign.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tight bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded uppercase">
                              {campaign.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Status */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border-2 ${campaign.status === 'running' || campaign.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' :
                          campaign.status === 'paused' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            campaign.status === 'finish' || campaign.status === 'ended' ? 'bg-slate-100 text-slate-700 border-slate-200 shadow-sm' :
                              campaign.status === 'stop' ? 'bg-red-50 text-red-700 border-red-100' :
                                campaign.status === 'scheduled' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                  'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                          {campaign.status === 'running' ? 'Active' : campaign.status}
                        </span>
                        {campaign.status === 'running' && (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 3: Timeline */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          {campaign.status === 'running' || campaign.status === 'paused' || campaign.status === 'active'
                            ? `${campaign.startDate} → ${campaign.endDate || '∞'}`
                            : campaign.status === 'scheduled'
                              ? `Starts ${campaign.startDate}`
                              : `Ran for 30 Days`}
                        </div>
                        {campaign.status === 'running' && (
                          <div className="text-[10px] font-extrabold text-red-500 uppercase tracking-tight flex items-center gap-1">
                            <AlertTriangle size={10} /> Ends in 3 Days
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 4: Primary Metric */}
                    <td className="px-6 py-5">
                      {campaign.status !== 'draft' && campaign.status !== 'scheduled' ? (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            {getCampaignKPI(campaign).label}
                          </div>
                          <div className="text-lg font-black text-slate-900 tracking-tight">
                            {getCampaignKPI(campaign).value}
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-200 font-bold text-xs uppercase tracking-[0.2em] pl-4">
                          --
                        </div>
                      )}
                    </td>

                    {/* Column 5: Actions */}
                    <td className="px-6 py-5 text-right pr-8 relative">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(campaign.status === 'draft' || campaign.status === 'scheduled' || campaign.status === 'paused') ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(campaign); }}
                            className={`${SETTINGS_BUTTON_STYLES.primary} px-5 py-2.5 text-xs shadow-lg shadow-slate-200 active:scale-95`}
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); onNavigate('campaign-analytics', { id: campaign.id }); }}
                            className={`${SETTINGS_BUTTON_STYLES.secondary} px-5 py-2.5 text-xs text-slate-900 shadow-sm active:scale-95 flex items-center gap-2`}
                          >
                            <BarChart2 size={14} /> Analytics
                          </button>
                        )}

                        <button
                          onClick={(e) => handleMenuClick(e, campaign.id)}
                          className={`p-2.5 rounded-xl transition-colors ${activeMenuId === campaign.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      {activeMenuId === campaign.id && (
                        <div className="absolute right-8 top-12 w-52 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                          <div className="py-2.5 px-2">
                            {campaign.status === 'running' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(campaign, 'paused'); }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-3 transition-colors"
                              >
                                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                  <Pause size={16} />
                                </div>
                                Pause
                              </button>
                            )}
                            {(campaign.status === 'paused' || campaign.status === 'draft' || campaign.status === 'scheduled') && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(campaign, 'running'); }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-3 transition-colors"
                              >
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                  <Play size={16} />
                                </div>
                                {campaign.status === 'draft' ? 'Activate' : 'Resume'}
                              </button>
                            )}

                            <div className="h-px bg-slate-50 my-2 mx-2"></div>

                            <button
                              onClick={(e) => { e.stopPropagation(); handleDuplicate(campaign); }}
                              className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-3 transition-colors"
                            >
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Copy size={16} />
                              </div>
                              Duplicate
                            </button>

                            {(campaign.status === 'running' || campaign.status === 'paused') && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(campaign, 'stop'); }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                              >
                                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                  <AlertTriangle size={16} />
                                </div>
                                Stop
                              </button>
                            )}

                            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(campaign.id); }}
                                className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                              >
                                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                  <Trash2 size={16} />
                                </div>
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CampaignDashboard;