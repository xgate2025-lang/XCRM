/**
 * GlobalNavigator Component - Date Range Picker
 *
 * Per Spec FR-005: System MUST provide a Global Context Navigator
 * that controls all dashboard data.
 * Per FR-DASH-01: Dashboard TOP MUST NOT display "Store Filter".
 * Per Journal Visual Anchor: Uses standard card/button patterns.
 */

import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import type { DateRange } from '../../types';

const DATE_PRESETS: { label: string; getDates: () => { start: Date; end: Date } }[] = [
  {
    label: 'Last 7 Days',
    getDates: () => ({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(),
    }),
  },
  {
    label: 'Last 30 Days',
    getDates: () => ({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
    }),
  },
  {
    label: 'Last 90 Days',
    getDates: () => ({
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date(),
    }),
  },
  {
    label: 'This Year',
    getDates: () => ({
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date(),
    }),
  },
];

export function GlobalNavigator() {
  const { dateRange, setDateRange } = useDashboard();
  const [isDateOpen, setIsDateOpen] = useState(false);

  const handleDateSelect = (preset: typeof DATE_PRESETS[0]) => {
    const dates = preset.getDates();
    const newRange: DateRange = {
      start: dates.start,
      end: dates.end,
      label: preset.label,
    };
    setDateRange(newRange);
    setIsDateOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Picker */}
      <div className="relative">
        <button
          onClick={() => setIsDateOpen(!isDateOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Calendar size={16} className="text-primary-500" />
          <span>{dateRange.label}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDateOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleDateSelect(preset)}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  dateRange.label === preset.label ? 'text-primary-500 font-semibold' : 'text-slate-600'
                }`}
              >
                {preset.label}
                {dateRange.label === preset.label && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
