import React from 'react';
import { Cake, Calendar, ArrowUp, Star, Shield, Gift } from 'lucide-react';

const GhostMatrix: React.FC = () => {
  return (
    <div className="w-full border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm select-none">
      {/* Table Header: The Hierarchy */}
      <div className="grid grid-cols-4 divide-x divide-slate-100 bg-slate-50/50">
        <div className="p-6 flex flex-col justify-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attributes</span>
        </div>
        
        {/* Column 1: Basic (The Floor) - Solid */}
        <div className="p-6 text-center bg-white border-b-4 border-slate-200">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide mb-2">
            Basic Tier
          </div>
          <div className="h-2 w-full bg-transparent"></div>
        </div>

        {/* Column 2: Gold (Ghost) - Faded */}
        <div className="p-6 text-center opacity-40 grayscale relative">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"></div>
          <div className="h-6 w-24 bg-slate-200 rounded-full mx-auto mb-2"></div>
        </div>

        {/* Column 3: Diamond (Ghost) - Faded */}
        <div className="p-6 text-center opacity-40 grayscale relative">
             <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"></div>
          <div className="h-6 w-24 bg-slate-200 rounded-full mx-auto mb-2"></div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-50">
        
        {/* Row 1: Entry Rules */}
        <div className="grid grid-cols-4 divide-x divide-slate-50">
          <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30">Entry Rules</div>
          <div className="p-6 flex justify-center items-center">
             <span className="text-sm font-bold text-slate-400">Auto-Enrolled</span>
          </div>
          <div className="p-6 flex justify-center items-center opacity-40">
             <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>
          <div className="p-6 flex justify-center items-center opacity-40">
             <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>

        {/* Row 2: Visual Identity */}
        <div className="grid grid-cols-4 divide-x divide-slate-50">
          <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30">Visual Identity</div>
          <div className="p-6 flex justify-center">
             {/* Solid Placeholder */}
             <div className="w-16 h-24 bg-slate-100 rounded-lg border-2 border-slate-200 border-dashed flex items-center justify-center">
                <Shield size={20} className="text-slate-300" />
             </div>
          </div>
          <div className="p-6 flex justify-center opacity-40">
             <div className="w-16 h-24 bg-slate-100 rounded-lg flex items-center justify-center">
             </div>
          </div>
          <div className="p-6 flex justify-center opacity-40">
             <div className="w-16 h-24 bg-slate-100 rounded-lg flex items-center justify-center">
             </div>
          </div>
        </div>

        {/* SECTION: Onboarding */}
        <div className="bg-slate-50/50 px-6 py-2 border-y border-slate-100">
           <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Onboarding Missions</span>
        </div>

        {/* Row 3: Welcome & Profile */}
        <div className="grid grid-cols-4 divide-x divide-slate-50">
          <div className="p-6 text-sm font-medium text-slate-500 bg-slate-50/30">Welcome & Profile</div>
          <div className="p-6 flex flex-col gap-2 items-center">
             {/* Active Pills */}
             <div className="h-6 w-full max-w-[120px] bg-green-50 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-green-100">
                <Gift size={12} className="mr-1" /> Welcome Gift
             </div>
             <div className="h-6 w-full max-w-[120px] bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-blue-100">
                <Star size={12} className="mr-1" /> Complete Profile
             </div>
          </div>
          <div className="p-6 opacity-20 bg-slate-50/50"></div>
          <div className="p-6 opacity-20 bg-slate-50/50"></div>
        </div>

        {/* SECTION: Ongoing Privileges */}
        <div className="bg-slate-50/50 px-6 py-2 border-y border-slate-100">
           <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Ongoing Privileges</span>
        </div>

        {/* Row 4: Multipliers */}
        <div className="grid grid-cols-4 divide-x divide-slate-50">
          <div className="p-6 text-sm font-medium text-slate-500 bg-slate-50/30">Point Multipliers</div>
          <div className="p-6 flex justify-center items-center">
             <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6 flex justify-center items-center opacity-50">
             <div className="h-4 w-20 bg-slate-200 rounded"></div>
          </div>
          <div className="p-6 flex justify-center items-center opacity-50">
             <div className="h-4 w-28 bg-slate-200 rounded"></div>
          </div>
        </div>

        {/* SECTION: Lifecycle Events */}
        <div className="bg-slate-50/50 px-6 py-2 border-y border-slate-100">
           <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Lifecycle Events</span>
        </div>

        {/* Row 5: Birthday & Anniversary */}
        <div className="grid grid-cols-4 divide-x divide-slate-50">
          <div className="p-6 text-sm font-medium text-slate-500 bg-slate-50/30">Birthday & Anniversary</div>
          {/* Basic */}
          <div className="p-6 flex flex-col gap-2 items-center opacity-60">
             <div className="h-6 w-full max-w-[100px] bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Cake size={12} />
             </div>
             <div className="h-6 w-full max-w-[100px] bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Calendar size={12} />
             </div>
          </div>
          {/* Gold */}
          <div className="p-6 flex flex-col gap-2 items-center opacity-40">
             <div className="h-6 w-full max-w-[100px] bg-slate-200 rounded-full flex items-center justify-center">
                 <Cake size={12} className="text-slate-400" />
             </div>
             <div className="h-6 w-full max-w-[100px] bg-slate-200 rounded-full flex items-center justify-center">
                 <Calendar size={12} className="text-slate-400" />
             </div>
          </div>
          {/* Diamond */}
          <div className="p-6 flex flex-col gap-2 items-center opacity-40">
             <div className="h-6 w-full max-w-[100px] bg-slate-200 rounded-full flex items-center justify-center">
                 <Cake size={12} className="text-slate-400" />
             </div>
             <div className="h-6 w-full max-w-[100px] bg-slate-200 rounded-full flex items-center justify-center">
                 <Calendar size={12} className="text-slate-400" />
             </div>
          </div>
        </div>

        {/* SECTION: Status Triggers */}
        <div className="bg-slate-50/50 px-6 py-2 border-y border-slate-100">
           <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Status Triggers</span>
        </div>

        {/* Row 6: Upgrade & Renewal */}
        <div className="grid grid-cols-4 divide-x divide-slate-50">
          <div className="p-6 text-sm font-medium text-slate-500 bg-slate-50/30">Upgrade & Renewal</div>
          <div className="p-6 bg-slate-50/50">
             {/* Basic has no upgrade trigger */}
          </div>
          <div className="p-6 flex justify-center items-center opacity-40">
             <div className="h-8 w-32 bg-slate-200 rounded-full flex items-center justify-center gap-2">
                 <ArrowUp size={14} className="text-slate-400" />
             </div>
          </div>
          <div className="p-6 flex justify-center items-center opacity-40">
             <div className="h-8 w-32 bg-slate-200 rounded-full flex items-center justify-center gap-2">
                 <ArrowUp size={14} className="text-slate-400" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GhostMatrix;