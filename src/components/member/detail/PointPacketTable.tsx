import React, { useState } from 'react';
import { Coins, Clock, Calendar, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { PointPacket } from '../../../types';

interface PointPacketTableProps {
    packets: PointPacket[];
}

/**
 * FR-003: Points Detail Table
 * Columns: Detail ID, Total Value, Remaining, Earned Time, Expiry Time, Source, Remarks
 */
const PointPacketTable: React.FC<PointPacketTableProps> = ({ packets }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<{ key: keyof PointPacket; direction: 'asc' | 'desc' } | null>(null);

    // 1. Filter
    const filteredPackets = packets.filter((p) => {
        // Search filter
        const matchesSearch = searchQuery === '' ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.remark && p.remark.toLowerCase().includes(searchQuery.toLowerCase()));

        // Date filter (Earned Date)
        let matchesDate = true;
        if (dateFilter.start || dateFilter.end) {
            const earnedDate = new Date(p.receivedDate);
            if (dateFilter.start && earnedDate < new Date(dateFilter.start)) {
                matchesDate = false;
            }
            if (dateFilter.end && earnedDate > new Date(dateFilter.end + 'T23:59:59')) {
                matchesDate = false;
            }
        }

        return matchesSearch && matchesDate;
    });

    // 2. Sort
    const sortedPackets = React.useMemo(() => {
        if (!sortConfig) return filteredPackets;
        return [...filteredPackets].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredPackets, sortConfig]);

    // 3. Paginate
    const totalPages = Math.ceil(sortedPackets.length / itemsPerPage);
    const paginatedPackets = sortedPackets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: keyof PointPacket) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    if (packets.length === 0) {
        return (
            <div className="text-center py-12">
                <Coins size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No point packets available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 md:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Ref ID / Source..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors shadow-sm"
                    />
                </div>

                {/* FR-005: Earned Date Filter */}
                <div className="flex gap-2 items-center">
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

            {/* Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Detail ID</th>
                            <th
                                onClick={() => handleSort('totalPoints')}
                                className="text-right px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Total Value
                                    <ArrowUpDown size={12} className="text-slate-400" />
                                </div>
                            </th>
                            <th className="text-right px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Remaining</th>
                            <th
                                onClick={() => handleSort('receivedDate')}
                                className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Earned Time
                                    <ArrowUpDown size={12} className="text-slate-400" />
                                </div>
                            </th>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Expiry Time</th>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Source</th>
                            <th className="text-left px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPackets.map((packet) => {
                            const now = new Date();
                            const expiryDate = new Date(packet.expiryDate);
                            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                            // FR-003: Expiry Time visual states
                            // Amber if expiring within 30 days, Red if expired
                            const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
                            const isExpired = daysUntilExpiry < 0;

                            return (
                                <tr key={packet.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{packet.id}</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-900">{packet.totalPoints.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`font-black ${packet.remainingPoints === 0 ? 'text-slate-400' : 'text-primary-600'}`}>
                                            {packet.remainingPoints.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs text-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-slate-400" />
                                            {packet.receivedDate ? new Date(packet.receivedDate).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-1.5 text-xs text-nowrap ${isExpired ? 'text-red-500 font-bold' :
                                            isExpiringSoon ? 'text-amber-500 font-bold' :
                                                'text-slate-500'
                                            }`}>
                                            <Clock size={14} className={isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-slate-400'} />
                                            {packet.expiryDate ? new Date(packet.expiryDate).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">
                                            {packet.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs max-w-[150px] truncate font-medium">
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

export default PointPacketTable;
