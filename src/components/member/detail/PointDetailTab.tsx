import React, { useState } from 'react';
import { Coins, Clock, Calendar, TrendingUp, TrendingDown, Gift, RefreshCw, History, Package, Search, Filter, ChevronDown } from 'lucide-react';
import { AssetLog, PointPacket, PointsSummary } from '../../../types';

interface PointDetailTabProps {
    packets: PointPacket[];
    logs: AssetLog[];
    summary?: PointsSummary;
}

type ViewMode = 'packets' | 'ledger';

/**
 * PointDetailTab displays:
 * FR-MEM-03: Summary stats (Available, Lifetime, Used, Expired)
 * FR-MEM-05: Point Packets table and Change Ledger table
 */
const PointDetailTab: React.FC<PointDetailTabProps> = ({ packets, logs, summary }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('packets');

    const pointLogs = logs.filter((log) => log.type === 'point');

    // Calculate summary from packets if not provided
    const totalPoints = summary?.availableBalance ?? packets.reduce((sum, p) => sum + p.remainingPoints, 0);
    const lifetimeEarned = summary?.lifetimeEarned ?? packets.reduce((sum, p) => sum + p.totalPoints, 0);
    const usedPoints = summary?.used ?? packets.reduce((sum, p) => sum + (p.totalPoints - p.remainingPoints), 0);
    const expiredPoints = summary?.expired ?? 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* FR-MEM-03: Summary Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    label="Available Balance"
                    value={totalPoints.toLocaleString()}
                    icon={<Coins size={18} />}
                    color="primary"
                />
                <SummaryCard
                    label="Lifetime Earned"
                    value={lifetimeEarned.toLocaleString()}
                    icon={<TrendingUp size={18} />}
                    color="green"
                />
                <SummaryCard
                    label="Used"
                    value={usedPoints.toLocaleString()}
                    icon={<Gift size={18} />}
                    color="blue"
                />
                <SummaryCard
                    label="Expired"
                    value={expiredPoints.toLocaleString()}
                    icon={<Clock size={18} />}
                    color="slate"
                />
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setViewMode('packets')}
                    className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'packets'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Package size={16} />
                    Point Packets
                </button>
                <button
                    onClick={() => setViewMode('ledger')}
                    className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${viewMode === 'ledger'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <History size={16} />
                    Change Ledger
                </button>
            </div>

            {/* Content */}
            {viewMode === 'packets' ? (
                <PacketTable packets={packets} />
            ) : (
                <LedgerTable logs={pointLogs} />
            )}
        </div>
    );
};

const SummaryCard: React.FC<{
    label: string;
    value: string;
    icon: React.ReactNode;
    color: 'primary' | 'green' | 'blue' | 'slate';
}> = ({ label, value, icon, color }) => {
    const colorMap = {
        primary: 'bg-primary-50 text-primary-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        slate: 'bg-slate-50 text-slate-500',
    };

    return (
        <div className={`p-5 rounded-2xl ${colorMap[color]}`}>
            <div className="flex items-center gap-2 mb-2 opacity-70">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-2xl font-black">{value}</p>
        </div>
    );
};

/**
 * FR-MEM-05: Packet List Table
 * Columns: ID, Total, Remaining, Earn Time, Expiry, Source, Notes
 */
const PacketTable: React.FC<{ packets: PointPacket[] }> = ({ packets }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPackets = packets.filter((p) =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.remark && p.remark.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (packets.length === 0) {
        return (
            <div className="text-center py-12">
                <Coins size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No point packets available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search packets..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">ID</th>
                            <th className="text-right px-4 py-3 font-black text-[10px] uppercase tracking-widest">Total</th>
                            <th className="text-right px-4 py-3 font-black text-[10px] uppercase tracking-widest">Remaining</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Earn Time</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Expiry</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Source</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPackets.map((packet) => {
                            const isExpiring = new Date(packet.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                            return (
                                <tr key={packet.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-600">{packet.id}</td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-900">{packet.totalPoints.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right">
                                        <span className={`font-black ${packet.remainingPoints === 0 ? 'text-slate-400' : 'text-primary-600'}`}>
                                            {packet.remainingPoints.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {packet.receivedDate}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className={`flex items-center gap-1 text-xs ${isExpiring ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                                            <Clock size={12} />
                                            {packet.expiryDate}
                                            {isExpiring && ' ⚠️'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                            {packet.source}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[150px] truncate">
                                        {packet.remark || '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredPackets.length === 0 && packets.length > 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    No packets match your search criteria.
                </div>
            )}
        </div>
    );
};

/**
 * FR-MEM-05: Ledger Table
 * Columns: Type, Value, Pre-balance, Post-balance, Time, Source, Notes
 */
const LedgerTable: React.FC<{ logs: AssetLog[] }> = ({ logs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'earn' | 'redeem' | 'expire' | 'adjust'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredLogs = logs.filter((log) => {
        // Search filter
        const matchesSearch = searchQuery === '' ||
            log.changeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.remark && log.remark.toLowerCase().includes(searchQuery.toLowerCase()));

        // Type filter
        if (typeFilter !== 'all') {
            const changeType = log.changeType.toLowerCase();
            if (typeFilter === 'earn' && !changeType.includes('earn') && !changeType.includes('bonus')) return false;
            if (typeFilter === 'redeem' && !changeType.includes('redeem') && !changeType.includes('use')) return false;
            if (typeFilter === 'expire' && !changeType.includes('expir')) return false;
            if (typeFilter === 'adjust' && !changeType.includes('adjust')) return false;
        }

        return matchesSearch;
    });

    if (logs.length === 0) {
        return (
            <div className="text-center py-12">
                <RefreshCw size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No point transactions recorded</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 md:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ledger..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>

                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        isFilterOpen ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Filter size={16} />
                    Type Filter
                    <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
                    {(['all', 'earn', 'redeem', 'expire', 'adjust'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                typeFilter === type
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            {type === 'all' ? 'All Types' : type}
                        </button>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Type</th>
                            <th className="text-right px-4 py-3 font-black text-[10px] uppercase tracking-widest">Value</th>
                            <th className="text-right px-4 py-3 font-black text-[10px] uppercase tracking-widest">Pre-balance</th>
                            <th className="text-right px-4 py-3 font-black text-[10px] uppercase tracking-widest">Post-balance</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Time</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Source</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase tracking-widest">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => {
                            const isPositive = Number(log.changeValue) >= 0;
                            return (
                                <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {isPositive ? (
                                                <TrendingUp size={16} className="text-green-500" />
                                            ) : (
                                                <TrendingDown size={16} className="text-red-500" />
                                            )}
                                            <span className="font-bold text-slate-900">{log.changeType}</span>
                                        </div>
                                    </td>
                                    <td className={`px-4 py-3 text-right font-black ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                        {isPositive ? '+' : ''}{Number(log.changeValue).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500">
                                        {Number(log.balanceBefore).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                                        {Number(log.balanceAfter).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                            {log.source}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[150px] truncate">
                                        {log.remark || '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredLogs.length === 0 && logs.length > 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    No transactions match your search criteria.
                </div>
            )}
        </div>
    );
};

export default PointDetailTab;
