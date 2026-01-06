import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface ScorecardProps {
    label: string;
    value: string | number;
    trend?: number; // percentage
    trendLabel?: string;
    unit?: string;
    tooltip?: string;
    type?: 'positive' | 'negative' | 'neutral';
}

export const ScoreCard: React.FC<ScorecardProps> = ({
    label,
    value,
    trend,
    trendLabel,
    unit,
    tooltip,
    type = 'neutral'
}) => {
    const isPositive = trend && trend > 0;

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                {tooltip && (
                    <div className="group relative">
                        <Info className="w-4 h-4 text-slate-300 cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {tooltip}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {unit === '$' && <span className="text-xl mr-0.5">$</span>}
                    {value}
                    {unit && unit !== '$' && <span className="text-lg ml-0.5 tracking-normal font-semibold text-slate-400">{unit}</span>}
                </span>
            </div>

            {trend !== undefined && (
                <div className="flex items-center gap-1.5">
                    <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{trendLabel || 'vs prev period'}</span>
                </div>
            )}
        </div>
    );
};

export const ScorecardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {children}
        </div>
    );
};
