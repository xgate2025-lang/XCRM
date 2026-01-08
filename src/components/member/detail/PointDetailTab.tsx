import React, { useState } from 'react';
import { Coins, Clock, TrendingUp, Gift, History, Package, AlertTriangle } from 'lucide-react';
import { AssetLog, PointPacket, PointsSummary } from '../../../types';
import PointPacketTable from './PointPacketTable';
import PointLedgerTable from './PointLedgerTable';

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
        <div className="space-y-8 animate-in fade-in duration-300 pb-10">
            {/* FR-000: Points Expiration Alert */}
            <ExpirationAlert packets={packets} />

            {/* FR-MEM-03: Summary Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                    label="Total Used"
                    value={usedPoints.toLocaleString()}
                    icon={<Gift size={18} />}
                    color="blue"
                />
                <SummaryCard
                    label="Total Expired"
                    value={expiredPoints.toLocaleString()}
                    icon={<Clock size={18} />}
                    color="slate"
                />
            </div>

            {/* FR-002: Segmented Control - Points Detail / Points Ledger */}
            <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
                <button
                    onClick={() => setViewMode('packets')}
                    className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === 'packets'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Package size={16} />
                    Points Detail
                </button>
                <button
                    onClick={() => setViewMode('ledger')}
                    className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === 'ledger'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <History size={16} />
                    Points Ledger
                </button>
            </div>

            {/* Content */}
            {viewMode === 'packets' ? (
                <PointPacketTable packets={packets} />
            ) : (
                <PointLedgerTable logs={pointLogs} />
            )}
        </div>
    );
};

/**
 * FR-000: Expiration Alert Component
 * Displays warning banner if points are expiring within 30 days
 */
const ExpirationAlert: React.FC<{ packets: PointPacket[] }> = ({ packets }) => {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();

    // Calculate total points expiring within 30 days
    const expiringPoints = packets
        .filter((p) => {
            const expiryDate = new Date(p.expiryDate);
            return p.remainingPoints > 0 && expiryDate <= thirtyDaysFromNow && expiryDate > now;
        })
        .reduce((sum, p) => sum + p.remainingPoints, 0);

    // Find the earliest expiring packet
    const earliestExpiringPacket = packets
        .filter((p) => {
            const expiryDate = new Date(p.expiryDate);
            return p.remainingPoints > 0 && expiryDate <= thirtyDaysFromNow && expiryDate > now;
        })
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];

    if (!earliestExpiringPacket || expiringPoints === 0) {
        return null;
    }

    const daysUntilExpiry = Math.ceil(
        (new Date(earliestExpiringPacket.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-bold text-amber-900">
                    {expiringPoints.toLocaleString()} points will expire in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}.
                </p>
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{
    label: string;
    value: string;
    icon: React.ReactNode;
    color: 'primary' | 'green' | 'blue' | 'slate';
}> = ({ label, value, icon, color }) => {
    const iconColorMap = {
        primary: 'bg-primary-50 text-primary-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        slate: 'bg-slate-50 text-slate-500',
    };

    return (
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-200 hover:border-primary-300 transition-colors group">
            <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-xl transition-colors ${iconColorMap[color]}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 leading-tight">{value}</p>
        </div>
    );
};

export default PointDetailTab;
