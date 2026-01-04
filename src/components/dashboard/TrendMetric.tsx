/**
 * TrendMetric Component - Metric Card with Trend Indicator
 * 
 * Per Spec FR-006: Metrics MUST show Trend Indicators (percentage change vs previous period).
 * Per Journal Visual Anchor: Uses standard card pattern and typography.
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MetricData } from '../../types';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TrendMetricProps {
  data: MetricData;
  variant?: 'default' | 'compact';
  icon?: React.ElementType;
  iconColor?: string; // e.g., 'blue', 'emerald'
}

export function TrendMetric({ data, variant = 'default', icon: Icon, iconColor = 'slate' }: TrendMetricProps) {
  const { value, trend, label, unit, history = [] } = data;

  // Format value with unit
  const formattedValue = formatValue(value, unit);

  // Determine trend direction
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  
  // Prepare chart data (history array to object array)
  const chartData = history.map((val, i) => ({ i, value: val }));
  const strokeColor = trend >= 0 ? '#10b981' : '#ef4444'; 

  // Dynamic color classes for Icon Box
  const bgClass = `bg-${iconColor}-50`;
  const textClass = `text-${iconColor}-600`;

  return (
    <div className={`
      card-premium
      ${variant === 'compact' ? 'p-4' : 'p-6'} flex flex-col justify-between h-full group
    `}>
      {/* Header: Icon Box (Left) + Trend Badge (Right) - "CensusCard Style" */}
      <div className="flex justify-between items-start mb-4">
        {Icon ? (
           <div className={`p-3 rounded-2xl ${bgClass} ${textClass} transition-colors`}>
             <Icon size={22} />
           </div>
        ) : (
           /* Fallback if no icon provided */
           <div className="h-11 w-11" />
        )}
        <TrendBadge direction={trendDirection} value={trend} />
      </div>

      {/* Main Content: Label + Value */}
      <div className="mb-4">
         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
           {label}
         </div>
         <div className={`font-black tracking-tight text-slate-900 ${
           variant === 'compact' ? 'text-2xl' : 'text-3xl'
         }`}>
           {formattedValue}
         </div>
      </div>

      {/* Footer / Middle: Sparkline */}
      {history.length > 0 && variant === 'default' && (
        <div className="h-10 w-full opacity-80 mix-blend-multiply filter contrast-125 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                 <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2}/>
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={1}/>
                </linearGradient>
              </defs>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={strokeColor} 
                strokeWidth={3} 
                dot={false} 
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}


// --- Trend Badge Sub-component ---

interface TrendBadgeProps {
  direction: 'up' | 'down' | 'neutral';
  value: number;
}

function TrendBadge({ direction, value }: TrendBadgeProps) {
  const absValue = Math.abs(value).toFixed(1);

  if (direction === 'neutral') {
    return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
        <Minus size={12} />
        <span>0%</span>
      </div>
    );
  }

  const isUp = direction === 'up';
  const bgColor = isUp ? 'bg-green-100' : 'bg-red-100';
  const textColor = isUp ? 'text-green-600' : 'text-red-600';
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor} text-xs font-semibold`}>
      <Icon size={12} />
      <span>{isUp ? '+' : '-'}{absValue}%</span>
    </div>
  );
}


// --- Utility Functions ---

function formatValue(value: number, unit?: string): string {
  if (unit === '$') {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  }

  if (unit === '%') {
    return `${value.toFixed(1)}%`;
  }

  // Default: just format the number
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}
