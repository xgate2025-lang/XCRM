import React, { useState } from 'react';
import { 
  Cake, Calendar, ArrowUp, Shield, Gift, Plus, Lock, 
  MoreVertical, Edit2, Trash2, Crown, Zap, CheckCircle2, Ticket
} from 'lucide-react';
import { TierDefinition, ProgramLogic, TierBenefit } from '../../types';

interface ActiveTierMatrixProps {
  tiers: TierDefinition[];
  programLogic: ProgramLogic | null;
  onAddTier: () => void;
  onEditTier: (tier: TierDefinition) => void;
  onUpdateTier: (id: string, updates: Partial<TierDefinition>) => void;
  onDeleteTier: (id: string) => void;
}

// Deep colors for the Card Visuals (matching TierWizard)
const CARD_THEMES = [
  { id: 'bronze', color: 'bg-orange-600' },
  { id: 'silver', color: 'bg-slate-400' },
  { id: 'gold', color: 'bg-yellow-500' },
  { id: 'platinum', color: 'bg-cyan-500' },
  { id: 'diamond', color: 'bg-blue-600' },
  { id: 'black', color: 'bg-slate-900' },
];

const ActiveTierMatrix: React.FC<ActiveTierMatrixProps> = ({ 
  tiers, 
  programLogic, 
  onAddTier,
  onEditTier,
  onUpdateTier,
  onDeleteTier
}) => {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Helper to map theme to colors for the Header Pills (Light variants)
  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'silver': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'bronze': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'platinum': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'diamond': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'black': return 'bg-slate-800 text-white border-slate-900';
      // Custom theme will be handled via inline styles usually, but here we return a safe default
      case 'custom': return 'text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const renderBenefitList = (benefits: TierBenefit[], emptyLabel: string = "-") => {
    if (benefits.length === 0) return <span className="text-xs text-slate-300 font-medium">{emptyLabel}</span>;
    return (
        <div className="flex flex-col gap-1.5 items-center w-full">
            {benefits.map(b => (
                <div key={b.id} className="w-full text-center px-2 py-1 bg-white border border-slate-100 rounded-md shadow-sm text-xs font-bold text-slate-700 truncate">
                    {b.label}
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="w-full border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm select-none animate-in fade-in duration-500">
      
      {/* 
         GRID LAYOUT: 
         First column (Labels): 220px
         Tier columns: Flexible (min 200px)
         Add Button column: 150px
      */}
      <div 
        className="grid divide-x divide-slate-100"
        style={{ gridTemplateColumns: `220px repeat(${tiers.length}, minmax(200px, 1fr)) 150px` }}
      >
        
        {/* === HEADER ROW === */}
        
        {/* Cell 0,0: Corner */}
        <div className="p-6 flex flex-col justify-end bg-slate-50/50 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attributes</span>
        </div>

        {/* Dynamic Tier Headers */}
        {tiers.map((tier, idx) => (
          <div 
            key={tier.id}
            onClick={() => onEditTier(tier)}
            className={`p-6 text-center border-b-4 relative group transition-colors cursor-pointer ${hoveredCol === idx ? 'bg-slate-50' : 'bg-white'} ${tier.type === 'base' ? 'border-slate-800' : 'border-primary-500'}`}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
          >
            <div className="flex justify-between items-start">
               <div className="w-6"></div> {/* Spacer */}
               <div 
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3 ${getThemeStyles(tier.design.colorTheme)}`}
                  style={tier.design.colorTheme === 'custom' ? { backgroundColor: tier.design.customColor, color: '#fff' } : {}}
               >
                  {tier.type === 'base' && <Lock size={10} />}
                  {tier.name} Tier
               </div>
               {/* Actions Menu (Hover Only) */}
               <div className="w-6 flex justify-end">
                 {tier.type !== 'base' && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); onDeleteTier(tier.id); }}
                     className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-opacity"
                   >
                     <Trash2 size={14} />
                   </button>
                 )}
               </div>
            </div>
            
            <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2 group-hover:text-primary-600 transition-colors">
               {tier.name} <Edit2 size={12} className="opacity-0 group-hover:opacity-50" />
            </div>
            
            {/* Active Indicator */}
            {idx > 0 && (
                <div className="absolute top-0 right-0 p-1">
                   <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-200"></div>
                </div>
            )}
          </div>
        ))}

        {/* Add Tier Header */}
        <div 
          onClick={onAddTier}
          className="p-6 border-b border-slate-200 bg-slate-50/30 hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer group flex flex-col items-center justify-center gap-2 border-r-0"
        >
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 group-hover:border-primary-400 group-hover:bg-white flex items-center justify-center transition-all">
             <Plus size={20} className="text-slate-400 group-hover:text-primary-500" />
          </div>
          <span className="text-xs font-bold text-slate-400 group-hover:text-primary-600">Add Tier</span>
        </div>


        {/* === ROW 1: ENTRY RULES === */}
        
        {/* Label */}
        <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30 border-b border-slate-50">Entry Rules</div>
        
        {/* Cells */}
        {tiers.map((tier, idx) => {
           // Qualification Window Label Logic
           const qual = tier.qualificationWindow || { type: 'rolling_period', months: 12 };
           const windowLabel = qual.type === 'membership_year' 
             ? 'Mbr Year' 
             : `${qual.months} Mo`;

           return (
             <div 
               key={`entry-${tier.id}`} 
               onClick={() => onEditTier(tier)}
               className={`p-6 flex flex-col items-center justify-center border-b border-slate-50 cursor-pointer ${hoveredCol === idx ? 'bg-slate-50/50' : ''}`}
               onMouseEnter={() => setHoveredCol(idx)}
               onMouseLeave={() => setHoveredCol(null)}
             >
                {tier.type === 'base' ? (
                   <span className="text-sm font-bold text-slate-400">Auto-Enrolled</span>
                ) : (
                   <div className="text-center group">
                      <div className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
                          {programLogic?.upgradeMethod === 'points_accumulated' ? '' : '$'}
                          {tier.entryThreshold.toLocaleString()}
                          {programLogic?.upgradeMethod === 'points_accumulated' && <span className="text-xs font-medium text-slate-500 uppercase">{programLogic.engagementConfig?.currencyName || 'Pts'}</span>}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                          {programLogic?.upgradeMethod === 'points_accumulated' ? 'Earned' : 'Spent'} / {windowLabel}
                      </div>
                   </div>
                )}
             </div>
           );
        })}
        {/* Empty Slot for Add Col */}
        <div className="bg-slate-50/30 border-b border-slate-50"></div>


        {/* === ROW 2: VISUAL IDENTITY (UPDATED) === */}

        {/* Label */}
        <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30 border-b border-slate-50">Visual Identity</div>

        {/* Cells */}
        {tiers.map((tier, idx) => {
           // Calculate Mini-Card Styles
           const isImage = tier.design.mode === 'image' && tier.design.imageUrl;
           const theme = CARD_THEMES.find(t => t.id === tier.design.colorTheme);
           
           // Background Logic
           const bgClass = !isImage && tier.design.colorTheme !== 'custom' ? theme?.color || 'bg-slate-900' : '';
           const customStyle = tier.design.colorTheme === 'custom' ? { backgroundColor: tier.design.customColor } : {};
           const imageStyle = isImage ? { backgroundImage: `url(${tier.design.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

           return (
             <div 
               key={`visual-${tier.id}`} 
               onClick={() => onEditTier(tier)}
               className={`p-6 flex justify-center border-b border-slate-50 cursor-pointer ${hoveredCol === idx ? 'bg-slate-50/50' : ''}`}
               onMouseEnter={() => setHoveredCol(idx)}
               onMouseLeave={() => setHoveredCol(null)}
             >
                {/* The Mini Card */}
                <div 
                   className={`w-16 h-24 rounded-lg shadow-md transition-transform hover:scale-110 relative overflow-hidden flex flex-col justify-between p-2 select-none group ${bgClass}`}
                   style={{ ...customStyle, ...imageStyle }}
                >
                   {/* Overlay for legibility if image */}
                   {isImage && <div className="absolute inset-0 bg-black/20"></div>}

                   {/* Card Content - Simulated */}
                   <div className="relative z-10 flex justify-between items-start">
                      <span className="text-[8px] font-extrabold text-white tracking-widest uppercase opacity-90 drop-shadow-sm">{tier.code}</span>
                   </div>

                   <div className="relative z-10 self-end">
                      <Shield size={10} className="text-white opacity-80 drop-shadow-sm" />
                   </div>
                </div>
             </div>
           );
        })}
        <div className="bg-slate-50/30 border-b border-slate-50"></div>


        {/* === SECTION HEADER === */}
        <div className="col-span-full bg-slate-50/80 px-6 py-2 border-y border-slate-100 backdrop-blur-sm sticky top-0 z-10">
           <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Ongoing Privileges</span>
        </div>


        {/* === ROW 3: MULTIPLIERS === */}
        
        {/* Label */}
        <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30 border-b border-slate-50">Point Multipliers</div>

        {/* Cells */}
        {tiers.map((tier, idx) => (
           <div 
             key={`mult-${tier.id}`} 
             onClick={() => onEditTier(tier)}
             className={`p-6 flex justify-center items-center border-b border-slate-50 cursor-pointer ${hoveredCol === idx ? 'bg-slate-50/50' : ''}`}
             onMouseEnter={() => setHoveredCol(idx)}
             onMouseLeave={() => setHoveredCol(null)}
           >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                 <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                 <span className="font-bold text-slate-900">{tier.multiplier}x</span>
              </div>
           </div>
        ))}
        <div className="bg-slate-50/30 border-b border-slate-50"></div>

        {/* === ROW 3b: ADDITIONAL PERKS (ONGOING) === */}
        
        {/* Label */}
        <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30 border-b border-slate-50">Additional Perks</div>

        {/* Cells */}
        {tiers.map((tier, idx) => (
           <div 
             key={`perks-${tier.id}`} 
             onClick={() => onEditTier(tier)}
             className={`p-6 flex justify-center items-center border-b border-slate-50 cursor-pointer ${hoveredCol === idx ? 'bg-slate-50/50' : ''}`}
             onMouseEnter={() => setHoveredCol(idx)}
             onMouseLeave={() => setHoveredCol(null)}
           >
              {renderBenefitList(tier.benefits.filter(b => b.category === 'ongoing'))}
           </div>
        ))}
        <div className="bg-slate-50/30 border-b border-slate-50"></div>


        {/* === SECTION HEADER === */}
        <div className="col-span-full bg-slate-50/80 px-6 py-2 border-y border-slate-100 backdrop-blur-sm sticky top-0 z-10">
           <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Lifecycle Events</span>
        </div>

        {/* === ROW 4: UPGRADE === */}
        <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30 border-b border-slate-50">Welcome / Upgrade</div>
        {tiers.map((tier, idx) => (
           <div 
             key={`upg-${tier.id}`} 
             onClick={() => onEditTier(tier)}
             className={`p-6 flex justify-center items-center border-b border-slate-50 cursor-pointer ${hoveredCol === idx ? 'bg-slate-50/50' : ''}`}
             onMouseEnter={() => setHoveredCol(idx)}
             onMouseLeave={() => setHoveredCol(null)}
           >
              {renderBenefitList(tier.benefits.filter(b => b.category === 'upgrade' || b.category === 'welcome'))}
           </div>
        ))}
        <div className="bg-slate-50/30 border-b border-slate-50"></div>

        {/* === ROW 5: BIRTHDAY === */}
        <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30 border-b border-slate-50">Birthday Gift</div>
        {tiers.map((tier, idx) => (
           <div 
             key={`bday-${tier.id}`} 
             onClick={() => onEditTier(tier)}
             className={`p-6 flex justify-center items-center border-b border-slate-50 cursor-pointer ${hoveredCol === idx ? 'bg-slate-50/50' : ''}`}
             onMouseEnter={() => setHoveredCol(idx)}
             onMouseLeave={() => setHoveredCol(null)}
           >
              {renderBenefitList(tier.benefits.filter(b => b.category === 'birthday'))}
           </div>
        ))}
        <div className="bg-slate-50/30 border-b border-slate-50"></div>

        {/* === ROW 6: RENEWAL === */}
        <div className="p-6 text-sm font-bold text-slate-500 bg-slate-50/30">Renewal Bonus</div>
        {tiers.map((tier, idx) => (
           <div 
             key={`renew-${tier.id}`} 
             onClick={() => onEditTier(tier)}
             className={`p-6 flex justify-center items-center cursor-pointer ${hoveredCol === idx ? 'bg-slate-50/50' : ''}`}
             onMouseEnter={() => setHoveredCol(idx)}
             onMouseLeave={() => setHoveredCol(null)}
           >
              {renderBenefitList(tier.benefits.filter(b => b.category === 'renewal'))}
           </div>
        ))}
        <div className="bg-slate-50/30"></div>

      </div>
    </div>
  );
};

export default ActiveTierMatrix;