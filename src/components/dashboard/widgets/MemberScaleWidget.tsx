/**
 * MemberScaleWidget - Zone 2A: Scale & Activity
 * 
 * Displays Total Scale and Active Member Count.
 * Visual Logic: Pulse Dot is Green if active % is healthy.
 */

import React from 'react';
import { Users, Activity, ChevronRight } from 'lucide-react';

interface MemberScaleWidgetProps {
  totalMembers: number;
  activeMembers: number;
}

export function MemberScaleWidget({ totalMembers, activeMembers }: MemberScaleWidgetProps) {
  // Calculate active percentage
  const activePercent = Math.round((activeMembers / totalMembers) * 100);
  
  // Visual logic: active > 50% is "healthy" (Green Pulse)
  const isHealthy = activePercent > 50;

  return (
    <div className="card-premium p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
            <Users size={22} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em]">Total Scale</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {totalMembers.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="my-6 border-t border-slate-50"></div>

      {/* Active Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={16} className="text-slate-400" />
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em]">Active Members</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {activeMembers.toLocaleString()}
          </div>
          
          {/* Pulse Dot */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isHealthy ? 'bg-green-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                isHealthy ? 'bg-green-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <span className="text-xs font-bold text-slate-600">{activePercent}% Active</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
        <button className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wide flex items-center gap-1 transition-colors">
          View Member Report <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
