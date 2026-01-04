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
}

export function TrendMetric({ data, variant = 'default' }: TrendMetricProps) {
  const { value, trend, label, unit, history = [] } = data;

  // Format value with unit
  const formattedValue = formatValue(value, unit);

  // Determine trend direction
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  
  // Prepare chart data (history array to object array)
  const chartData = history.map((val, i) => ({ i, value: val }));
  const strokeColor = trend >= 0 ? '#10b981' : '#ef4444'; // green-500 : red-500

  return (
    <div className={`
      card-premium
      ${variant === 'compact' ? 'p-4' : 'p-6'} flex flex-col justify-between h-full group
    `}>
      {/* Top Row: Label + Badge */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em]">
          {label}
        </div>
        <TrendBadge direction={trendDirection} value={trend} />
      </div>

      {/* Middle: Sparkline (Only if history exists) */}
      {history.length > 0 && variant === 'default' && (
        <div className="h-12 w-full my-2 opacity-100 mix-blend-multiply filter contrast-125">
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

      {/* Bottom: Big Number */}
      <div className={`font-black tracking-tight text-slate-900 ${
        variant === 'compact' ? 'text-2xl' : 'text-4xl'
      }`}>
        {formattedValue}
      </div>
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
