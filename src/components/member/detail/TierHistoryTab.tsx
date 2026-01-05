import React from 'react';
import { TrendingUp, TrendingDown, Crown, RefreshCw } from 'lucide-react';
import { AssetLog } from '../../../types';

interface TierHistoryTabProps {
    logs: AssetLog[];
}

/**
 * TierHistoryTab displays the growth value (tier) change history.
 * Shows change type, value, balance before/after, and remarks.
 */
const TierHistoryTab: React.FC<TierHistoryTabProps> = ({ logs }) => {
    const tierLogs = logs.filter((log) => log.type === 'tier');

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
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Change Type</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Change Value</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Before</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase">After</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Time</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Source</th>
                            <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tierLogs.map((log) => (
                            <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {log.changeType.includes('Upgrade') ? (
                                            <TrendingUp size={16} className="text-green-500" />
                                        ) : log.changeType.includes('Downgrade') ? (
                                            <TrendingDown size={16} className="text-red-500" />
                                        ) : (
                                            <RefreshCw size={16} className="text-blue-500" />
                                        )}
                                        <span className="font-bold text-slate-900">{log.changeType}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-slate-700">{log.changeValue}</td>
                                <td className="px-4 py-3">
                                    <TierBadge tier={String(log.balanceBefore)} />
                                </td>
                                <td className="px-4 py-3">
                                    <TierBadge tier={String(log.balanceAfter)} />
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-slate-500">{log.source}</td>
                                <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">
                                    {log.remark || '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
