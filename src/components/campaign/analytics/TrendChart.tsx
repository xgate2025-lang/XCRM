import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts';

interface TrendChartProps {
    data: any[];
    title: string;
    type: 'purchase' | 'referral';
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, title, type }) => {
    const isReferral = type === 'referral';

    return (
        <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isReferral ? 'bg-indigo-500' : 'bg-primary-500'}`} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {isReferral ? 'Signups' : 'Revenue'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cost</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isReferral ? '#6366f1' : '#055DDB'} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={isReferral ? '#6366f1' : '#055DDB'} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                            tickFormatter={(value) => isReferral && !data[0]?.revenue ? value : `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            labelStyle={{ fontWeight: 800, marginBottom: '4px', color: '#0f172a' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={isReferral ? "signups" : "revenue"}
                            stroke={isReferral ? "#6366f1" : "#055DDB"}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorMain)"
                        />
                        <Area
                            type="monotone"
                            dataKey="cost"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#colorCost)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
