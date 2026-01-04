import React, { useState, useEffect } from 'react';
import { NavItem, NavItemId } from '../types';
import { ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface SidebarProps {
  navItemsOperational: NavItem[];
  navItemsConfig: NavItem[];
  currentPage: NavItemId;
  onNavigate: (id: NavItemId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  navItemsOperational,
  navItemsConfig,
  currentPage,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Auto-expand parent if a child is selected when not collapsed
  useEffect(() => {
    if (!isCollapsed) {
      const allItems = [...navItemsOperational, ...navItemsConfig];
      const parent = allItems.find((item) => item.children?.some((child) => child.id === currentPage));
      if (parent) {
        setExpandedParents((prev) => ({ ...prev, [parent.id]: true }));
      }
    }
  }, [currentPage, isCollapsed, navItemsOperational, navItemsConfig]);

  const handleParentClick = (item: NavItem) => {
    if (item.children) {
      if (isCollapsed) return; 
      setExpandedParents((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    } else {
      onNavigate(item.id);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.id === currentPage) return true;
    if (item.children?.some((child) => child.id === currentPage)) return true;
    return false;
  };

  return (
    <aside
      className={`
        flex flex-col h-screen bg-[#FDFDFD] transition-all duration-300 ease-in-out z-20 sticky top-0
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Zone A: Global Identity */}
      {/* 
          Use transition-all on padding to match sidebar width change.
          isCollapsed: px-0 to allow full centering control via flex/absolute centering.
      */}
      <div className={`pt-10 pb-6 flex items-center flex-shrink-0 min-h-[88px] transition-all duration-300 ${isCollapsed ? 'px-0 justify-center' : 'px-6'}`}>
        <div 
            className="relative h-10 w-full flex items-center justify-center cursor-pointer group"
            onClick={() => onNavigate('dashboard')}
        >
             {/* Collapsed Logo */}
             <img 
               src="https://drive.google.com/thumbnail?id=1tMylPpu3FUXbHMaoQOZ3F3CvuiXWF9tB&sz=w200" 
               alt="XGATE" 
               referrerPolicy="no-referrer"
               className={`
                 absolute h-10 w-10 object-contain transition-all duration-300 ease-out
                 ${isCollapsed 
                    ? 'opacity-100 scale-100 rotate-0 delay-75' 
                    : 'opacity-0 scale-75 -rotate-12 pointer-events-none'
                 }
               `}
             />

             {/* Expanded Logo */}
             <img 
               src="https://drive.google.com/thumbnail?id=1JFzbppsK5xnnuvBzoazi-dWMRI6fH0yw&sz=w1000" 
               alt="XGATE" 
               referrerPolicy="no-referrer"
               className={`
                 absolute left-0 h-10 w-auto object-contain transition-all duration-300 ease-out origin-left
                 ${!isCollapsed 
                    ? 'opacity-100 translate-x-0 scale-100 delay-75' 
                    : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'
                 }
               `}
             />
        </div>
      </div>

      {/* Navigation Scroll Area - Vertically Centered */}
      {/* Changed overflow-y-auto to overflow-visible to prevent tooltip clipping */}
      <div className="flex-1 flex flex-col justify-center overflow-visible py-2 space-y-2 px-4">
        
        {/* Navigation Wrapper to keep items together while centering */}
        <div className="w-full">
            {/* Zone B */}
            <div>
                {!isCollapsed && <div className="px-4 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider animate-in fade-in duration-300">Operations</div>}
                {navItemsOperational.map((item) => (
                    <NavItemComponent 
                        key={item.id}
                        item={item}
                        isCollapsed={isCollapsed}
                        isActive={isActive(item)}
                        isExpanded={!!expandedParents[item.id]}
                        onParentClick={() => handleParentClick(item)}
                        onNavigate={onNavigate}
                        currentPage={currentPage}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                    />
                ))}
            </div>

            {/* Zone C: Divider */}
            <div className="my-6 px-4">
                <div className="h-px bg-slate-100 w-full" />
            </div>

            {/* Zone D */}
            <div>
                 {!isCollapsed && <div className="px-4 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider animate-in fade-in duration-300">Configuration</div>}
                 {navItemsConfig.map((item) => (
                    <NavItemComponent 
                        key={item.id}
                        item={item}
                        isCollapsed={isCollapsed}
                        isActive={isActive(item)}
                        isExpanded={!!expandedParents[item.id]}
                        onParentClick={() => handleParentClick(item)}
                        onNavigate={onNavigate}
                        currentPage={currentPage}
                        hoveredItem={hoveredItem}
                        setHoveredItem={setHoveredItem}
                    />
                ))}
            </div>
        </div>

      </div>

      {/* Footer / Toggle */}
      <div className="p-4 flex-shrink-0 flex justify-center pb-8">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

// Sub-component for individual Nav Items
const NavItemComponent: React.FC<{
    item: NavItem;
    isCollapsed: boolean;
    isActive: boolean;
    isExpanded: boolean;
    onParentClick: () => void;
    onNavigate: (id: NavItemId) => void;
    currentPage: NavItemId;
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
}> = ({ item, isCollapsed, isActive, isExpanded, onParentClick, onNavigate, currentPage, hoveredItem, setHoveredItem }) => {
    
    const hasChildren = !!item.children;
    const isHovered = hoveredItem === item.id;

    return (
        <div 
            className="relative mb-2"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            {/* Main Item */}
            <div
                onClick={onParentClick}
                className={`
                    flex items-center px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 group
                    ${isActive ? 'bg-primary-500 text-white' : 'text-slate-500 hover:bg-primary-100 hover:text-primary-600'}
                    ${isCollapsed ? 'justify-center w-12 h-12 mx-auto px-0' : ''}
                `}
            >
                <item.icon
                    size={isCollapsed ? 22 : 20}
                    className={`
                        flex-shrink-0 transition-colors
                        ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-600'}
                    `}
                />
                
                {!isCollapsed && (
                    <>
                        <span className="ml-3 text-sm font-bold flex-1 truncate leading-none pt-0.5">{item.label}</span>
                        {hasChildren && (
                            <ChevronRight 
                                size={16} 
                                className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
                            />
                        )}
                    </>
                )}
            </div>

            {/* EXPANDED STATE (Accordion) */}
            {!isCollapsed && hasChildren && isExpanded && (
                <div className="mt-2 ml-4 pl-4 border-l-2 border-slate-100 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.children!.map((child) => (
                        <div
                            key={child.id}
                            onClick={(e) => { e.stopPropagation(); onNavigate(child.id); }}
                            className={`
                                px-4 py-2.5 text-sm rounded-xl cursor-pointer transition-all block truncate font-medium
                                ${currentPage === child.id ? 'text-primary-600 bg-primary-100' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}
                            `}
                        >
                            {child.label}
                        </div>
                    ))}
                </div>
            )}

            {/* COLLAPSED STATE HOVER EFFECTS */}
            {isCollapsed && isHovered && (
                /* Use pl-4 instead of ml-4 to create a safe hover bridge so mouse doesn't leave the area */
                <div className="absolute left-full top-0 pl-4 z-50">
                    {!hasChildren && (
                        <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
                            {item.label}
                        </div>
                    )}

                    {hasChildren && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-56 animate-in fade-in slide-in-from-left-2 duration-200">
                            <div className="px-3 py-2 border-b border-slate-50 mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                            </div>
                            {item.children!.map((child) => (
                                <div
                                    key={child.id}
                                    onClick={(e) => { e.stopPropagation(); onNavigate(child.id); }}
                                    className={`
                                        px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-colors font-medium
                                        ${currentPage === child.id ? 'bg-primary-100 text-primary-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                    `}
                                >
                                    {child.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Sidebar;