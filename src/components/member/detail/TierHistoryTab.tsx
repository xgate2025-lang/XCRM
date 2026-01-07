import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Crown, RefreshCw, Calendar, Filter, ChevronDown } from 'lucide-react';
import { AssetLog } from '../../../types';

interface TierHistoryTabProps {
    logs: AssetLog[];
}

type ChangeTypeFilter = 'all' | 'upgrade' | 'downgrade' | 'adjustment';
type TimeFilter = 'all' | '7d' | '30d' | '90d' | '1y';

/**
 * TierHistoryTab displays the growth value (tier) change history.
 * FR-MEM-02: Uses a list structure with filtering by Change Type and Time.
 */
const TierHistoryTab: React.FC<TierHistoryTabProps> = ({ logs }) => {
    const [changeTypeFilter, setChangeTypeFilter] = useState<ChangeTypeFilter>('all');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const tierLogs = logs.filter((log) => log.type === 'tier');

    // Apply filters
    const filteredLogs = tierLogs.filter((log) => {
        // Change type filter
        if (changeTypeFilter !== 'all') {
            const changeType = log.changeType.toLowerCase();
            if (changeTypeFilter === 'upgrade' && !changeType.includes('upgrade')) return false;
            if (changeTypeFilter === 'downgrade' && !changeType.includes('downgrade')) return false;
            if (changeTypeFilter === 'adjustment' && (changeType.includes('upgrade') || changeType.includes('downgrade'))) return false;
        }

        // Time filter
        if (timeFilter !== 'all') {
            const logDate = new Date(log.timestamp);
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

            if (timeFilter === '7d' && daysDiff > 7) return false;
            if (timeFilter === '30d' && daysDiff > 30) return false;
            if (timeFilter === '90d' && daysDiff > 90) return false;
            if (timeFilter === '1y' && daysDiff > 365) return false;
        }

        return true;
    });

    if (tierLogs.length === 0) {
        return (
            <div className="text-center py-16 animate-in fade-in">
                <Crown size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No tier changes recorded</p>
                <p className="text-sm text-slate-400 mt-1">
                    Tier adjustments will appear here when they occur.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            isFilterOpen ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {(changeTypeFilter !== 'all' || timeFilter !== 'all') && (
                        <button
                            onClick={() => { setChangeTypeFilter('all'); setTimeFilter('all'); }}
                            className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="text-xs font-bold text-slate-400">
                    {filteredLogs.length} of {tierLogs.length} changes
                </div>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Change Type Filter */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                Change Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'upgrade', 'downgrade', 'adjustment'] as ChangeTypeFilter[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setChangeTypeFilter(type)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                            changeTypeFilter === type
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                        }`}
                                    >
                                        {type === 'all' ? 'All Types' : type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Filter */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                Time Period
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    { value: 'all', label: 'All Time' },
                                    { value: '7d', label: 'Last 7 Days' },
                                    { value: '30d', label: 'Last 30 Days' },
                                    { value: '90d', label: 'Last 90 Days' },
                                    { value: '1y', label: 'Last Year' },
                                ] as { value: TimeFilter; label: string }[]).map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => setTimeFilter(value)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            timeFilter === value
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Timeline List (FR-MEM-02: List Structure) */}
            <div className="space-y-4">
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl">
                        <RefreshCw size={32} className="mx-auto mb-3 text-slate-300" />
                        <p className="text-slate-500 font-bold">No changes match your filters</p>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your filter criteria.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-slate-100"></div>

                        {filteredLogs.map((log, index) => {
                            const isUpgrade = log.changeType.toLowerCase().includes('upgrade');
                            const isDowngrade = log.changeType.toLowerCase().includes('downgrade');

                            return (
                                <div
                                    key={log.id}
                                    className="relative flex gap-6 pl-2 animate-in slide-in-from-left-4 duration-300"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Timeline Dot */}
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm
                                        ${isUpgrade ? 'bg-green-100 text-green-600' :
                                          isDowngrade ? 'bg-red-100 text-red-600' :
                                          'bg-blue-100 text-blue-600'}
                                    `}>
                                        {isUpgrade ? <TrendingUp size={14} /> :
                                         isDowngrade ? <TrendingDown size={14} /> :
                                         <RefreshCw size={14} />}
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 pb-6">
                                        <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-sm transition-all">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-slate-900">{log.changeType}</span>
                                                    <span className="font-mono text-xs font-bold text-slate-400">{log.changeValue}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Calendar size={12} />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">From</span>
                                                    <TierBadge tier={String(log.balanceBefore)} />
                                                </div>
                                                <div className="text-slate-300">→</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">To</span>
                                                    <TierBadge tier={String(log.balanceAfter)} />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-xs">
                                                <div>
                                                    <span className="text-slate-400">Source: </span>
                                                    <span className="font-bold text-slate-600">{log.source}</span>
                                                </div>
                                                {log.remark && (
                                                    <div>
                                                        <span className="text-slate-400">Notes: </span>
                                                        <span className="font-medium text-slate-600">{log.remark}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const TierBadge: React.FC<{ tier: string }> = ({ tier }) => {
    const colorMap: Record<string, string> = {
        platinum: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        gold: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        silver: 'bg-slate-100 text-slate-700 border-slate-200',
        bronze: 'bg-orange-100 text-orange-700 border-orange-200',
    };

    const colors = colorMap[tier.toLowerCase()] || 'bg-slate-100 text-slate-600 border-slate-200';

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${colors}`}>
            <Crown size={10} />
            {tier}
        </span>
    );
};

export default TierHistoryTab;
