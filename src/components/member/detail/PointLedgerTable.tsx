import React, { useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Filter, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { AssetLog } from '../../../types';

interface PointLedgerTableProps {
    logs: AssetLog[];
}

/**
 * FR-004: Points Ledger Table
 * Columns: Type (Badge), Value (Colored +/-), Pre-balance, Post-balance, Time, Source, Remarks
 */
const PointLedgerTable: React.FC<PointLedgerTableProps> = ({ logs }) => {
    const [typeFilter, setTypeFilter] = useState<'all' | 'earn' | 'redeem' | 'expire' | 'adjust'>('all');
    const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<{ key: keyof AssetLog; direction: 'asc' | 'desc' } | null>(null);

    // 1. Filter
    const filteredLogs = logs.filter((log) => {
        // Type filter
        let matchesType = true;
        if (typeFilter !== 'all') {
            const changeType = log.changeType.toLowerCase();
            if (typeFilter === 'earn' && !changeType.includes('earn') && !changeType.includes('bonus')) matchesType = false;
            if (typeFilter === 'redeem' && !changeType.includes('redeem') && !changeType.includes('use')) matchesType = false;
            if (typeFilter === 'expire' && !changeType.includes('expir')) matchesType = false;
            if (typeFilter === 'adjust' && !changeType.includes('adjust')) matchesType = false;
        }

        // FR-006: Date Range filter
        let matchesDate = true;
        if (dateFilter.start || dateFilter.end) {
            const logDate = new Date(log.timestamp);
            if (dateFilter.start && logDate < new Date(dateFilter.start)) {
                matchesDate = false;
            }
            if (dateFilter.end && logDate > new Date(dateFilter.end + 'T23:59:59')) {
                matchesDate = false;
            }
        }

        return matchesType && matchesDate;
    });

    // 2. Sort
    const sortedLogs = React.useMemo(() => {
        if (!sortConfig) return filteredLogs;
        return [...filteredLogs].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredLogs, sortConfig]);

    // 3. Paginate
    const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
    const paginatedLogs = sortedLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: keyof AssetLog) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (logs.length === 0) {
        return (
            <div className="text-center py-12">
                <RefreshCw size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No point transactions recorded</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all w-fit shadow-sm ${isFilterOpen ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Filter size={16} />
                        Type Filter
                        <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* FR-006: Date Range Filter */}
                    <div className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:inline ml-2">Range:</span>
                        <input
                            type="date"
                            value={dateFilter.start}
                            onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors shadow-sm"
                            placeholder="Start date"
                        />
                        <span className="text-slate-400 text-sm font-bold">to</span>
                        <input
                            type="date"
                            value={dateFilter.end}
                            onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors shadow-sm"
                            placeholder="End date"
                        />
                        {(dateFilter.start || dateFilter.end) && (
                            <button
                                onClick={() => setDateFilter({ start: '', end: '' })}
                                className="px-3 py-2 text-xs font-bold text-primary-500 hover:text-primary-700 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
                    {(['all', 'earn', 'redeem', 'expire', 'adjust'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${typeFilter === type
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
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Type</th>
                            <th
                                onClick={() => handleSort('changeValue')}
                                className="text-right px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Value
                                    <ArrowUpDown size={12} className="text-slate-400" />
                                </div>
                            </th>
                            <th className="text-right px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Pre-bal</th>
                            <th className="text-right px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Post-bal</th>
                            <th
                                onClick={() => handleSort('timestamp')}
                                className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Time
                                    <ArrowUpDown size={12} className="text-slate-400" />
                                </div>
                            </th>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Source</th>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.map((log) => {
                            // FR-004: Value Logic - Green/+ for positive (Earn), Red/- for negative (Burn)
                            const isPositive = Number(log.changeValue) >= 0;

                            return (
                                <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        {/* FR-004: Change Type Badge with icon */}
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${isPositive ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                                {isPositive ? (
                                                    <TrendingUp size={14} />
                                                ) : (
                                                    <TrendingDown size={14} />
                                                )}
                                            </div>
                                            <span className="font-bold text-slate-900">{log.changeType}</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-black ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                        {isPositive ? '+' : ''}{Number(log.changeValue).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500 font-medium">
                                        {Number(log.balanceBefore).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                                        {Number(log.balanceAfter).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                                        {new Date(log.timestamp).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">
                                            {log.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs max-w-[150px] truncate font-medium">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-400">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PointLedgerTable;
