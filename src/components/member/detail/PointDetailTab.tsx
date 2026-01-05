import React, { useState } from 'react';
import { Coins, Clock, Calendar, TrendingUp, TrendingDown, Gift, RefreshCw } from 'lucide-react';
import { AssetLog, PointPacket } from '../../../types';

interface PointDetailTabProps {
    packets: PointPacket[];
    logs: AssetLog[];
}

type ViewMode = 'packets' | 'ledger';

/**
 * PointDetailTab displays:
 * 1. Point Packets (asset details with expiry)
 * 2. Point Change Ledger (transaction history)
 */
const PointDetailTab: React.FC<PointDetailTabProps> = ({ packets, logs }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('packets');

    const pointLogs = logs.filter((log) => log.type === 'point');
    const totalPoints = packets.reduce((sum, p) => sum + p.remainingPoints, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-6 text-white">
                <p className="text-sm font-bold opacity-80">Total Available Points</p>
                <p className="text-4xl font-black mt-1">{totalPoints.toLocaleString()}</p>
                <p className="text-sm opacity-70 mt-2">
                    Across {packets.length} active {packets.length === 1 ? 'packet' : 'packets'}
                </p>
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setViewMode('packets')}
                    className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'packets'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Point Packets
                </button>
                <button
                    onClick={() => setViewMode('ledger')}
                    className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'ledger'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Change Ledger
                </button>
            </div>

            {/* Content */}
            {viewMode === 'packets' ? (
                <PacketList packets={packets} />
            ) : (
                <LedgerTable logs={pointLogs} />
            )}
        </div>
    );
};

const PacketList: React.FC<{ packets: PointPacket[] }> = ({ packets }) => {
    if (packets.length === 0) {
        return (
            <div className="text-center py-12">
                <Coins size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No point packets available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {packets.map((packet) => {
                const isExpiring = new Date(packet.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const usagePercent = ((packet.totalPoints - packet.remainingPoints) / packet.totalPoints) * 100;

                return (
                    <div
                        key={packet.id}
                        className={`p-5 bg-white rounded-2xl border transition-all ${isExpiring ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                                    <Gift size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{packet.source}</p>
                                    <p className="text-xs text-slate-500">{packet.remark}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-slate-900">
                                    {packet.remainingPoints.toLocaleString()}
                                    <span className="text-slate-400 text-sm font-normal">
                                        /{packet.totalPoints.toLocaleString()}
                                    </span>
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Remaining</p>
                            </div>
                        </div>

                        {/* Usage Bar */}
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-primary-500 rounded-full transition-all"
                                style={{ width: `${100 - usagePercent}%` }}
                            />
                        </div>

                        {/* Dates */}
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-slate-500">
                                <Calendar size={12} />
                                Received: {packet.receivedDate}
                            </span>
                            <span
                                className={`flex items-center gap-1 ${isExpiring ? 'text-amber-600 font-bold' : 'text-slate-500'
                                    }`}
                            >
                                <Clock size={12} />
                                Expires: {packet.expiryDate}
                                {isExpiring && ' ⚠️'}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const LedgerTable: React.FC<{ logs: AssetLog[] }> = ({ logs }) => {
    if (logs.length === 0) {
        return (
            <div className="text-center py-12">
                <RefreshCw size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 font-bold">No point transactions recorded</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Type</th>
                        <th className="text-right px-4 py-3 font-black text-[10px] uppercase">Change</th>
                        <th className="text-right px-4 py-3 font-black text-[10px] uppercase">Before</th>
                        <th className="text-right px-4 py-3 font-black text-[10px] uppercase">After</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Time</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Source</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => {
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
                                <td className={`px-4 py-3 text-right font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
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
                                <td className="px-4 py-3 text-slate-500">{log.source}</td>
                                <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">
                                    {log.remark || '—'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PointDetailTab;
