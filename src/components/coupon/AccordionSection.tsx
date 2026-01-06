import React, { ReactNode, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Edit3 } from 'lucide-react';
import { CouponWizardSection } from '../../types';

interface AccordionSectionProps {
  /** Unique section identifier */
  section: CouponWizardSection;
  /** Step number displayed in the header (1-5) */
  stepNumber: number;
  /** Section title */
  title: string;
  /** Summary text shown when collapsed */
  summary?: string;
  /** Whether this section is currently expanded */
  isActive: boolean;
  /** Whether this section has been completed successfully */
  isComplete?: boolean;
  /** Whether this section has validation errors */
  hasError?: boolean;
  /** Whether user is editing this section after previously moving past it */
  isEditing?: boolean;
  /** Callback when section header is clicked */
  onHeaderClick: (section: CouponWizardSection) => void;
  /** Content to render when expanded */
  children: ReactNode;
  /** Optional footer content (e.g., Continue button) */
  footer?: ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  section,
  stepNumber,
  title,
  summary,
  isActive,
  isComplete = false,
  hasError = false,
  isEditing = false,
  onHeaderClick,
  children,
  footer,
}) => {
  const isFirstRender = useRef(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll into view when section becomes active, but not on initial mount
  useEffect(() => {
    if (isActive && contentRef.current) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      // Small delay to allow animation to start
      const timer = setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleClick = () => {
    onHeaderClick(section);
  };

  // Determine step indicator styling
  const getStepIndicator = () => {
    if (isActive) {
      return 'bg-primary-500 text-white shadow-lg shadow-primary-500/30';
    }
    if (hasError) {
      return 'bg-red-100 text-red-600';
    }
    if (isComplete) {
      return 'bg-green-100 text-green-600';
    }
    return 'bg-slate-100 text-slate-500';
  };

  // Determine container styling
  const getContainerStyles = () => {
    const base = 'bg-white rounded-2xl border transition-all duration-300 overflow-hidden';

    if (isActive) {
      return `${base} border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500`;
    }
    if (hasError) {
      return `${base} border-red-200 hover:border-red-300 shadow-sm`;
    }
    if (isComplete) {
      return `${base} border-green-200 hover:border-green-300 shadow-sm`;
    }
    return `${base} border-slate-200 hover:border-slate-300 shadow-sm`;
  };

  // Get the icon for the step indicator
  const getStepIcon = () => {
    if (isActive) {
      return stepNumber;
    }
    if (hasError) {
      return <AlertCircle size={16} />;
    }
    if (isComplete) {
      return <CheckCircle2 size={16} />;
    }
    return stepNumber;
  };

  return (
    <div ref={contentRef} className={getContainerStyles()}>
      {/* Header - Always visible, clickable */}
      <div
        className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${isActive ? 'bg-white' : 'hover:bg-slate-50/50'
          }`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        aria-controls={`section-content-${section}`}
        aria-label={`${title}${isComplete ? ', completed' : ''}${hasError ? ', has errors' : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="flex items-center gap-4">
          {/* Step Number Indicator */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${getStepIndicator()}`}
          >
            {getStepIcon()}
          </div>

          {/* Title and Edit Badge */}
          <div className="flex items-center gap-2">
            <h3
              className={`text-lg font-bold transition-colors duration-200 ${isActive ? 'text-slate-900' : 'text-slate-600'
                }`}
            >
              {title}
            </h3>
            {isEditing && isActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Edit3 size={10} /> Editing
              </span>
            )}
          </div>
        </div>

        {/* Summary & Chevron - Shown when collapsed */}
        {!isActive && (
          <div className="flex items-center gap-3">
            {summary && (
              <div className="flex items-center gap-2">
                {hasError && <AlertCircle size={14} className="text-red-500" />}
                {isComplete && !hasError && <CheckCircle2 size={14} className="text-green-500" />}
                <span
                  className={`text-xs font-medium truncate max-w-[250px] ${hasError ? 'text-red-600' : isComplete ? 'text-slate-600' : 'text-slate-400'
                    }`}
                >
                  {summary}
                </span>
              </div>
            )}
            <ChevronDown
              size={20}
              className="text-slate-400 transition-transform duration-300"
            />
          </div>
        )}

        {/* Collapse indicator when active */}
        {isActive && (
          <ChevronUp size={20} className="text-primary-400" />
        )}
      </div>

      {/* Content - Animated expand/collapse */}
      <div
        id={`section-content-${section}`}
        className={`transition-all duration-300 ease-out ${isActive
          ? 'max-h-[2000px] opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
          }`}
      >
        {isActive && (
          <div className="px-6 pb-8 pl-[4.5rem] space-y-8 animate-in slide-in-from-top-2 duration-300">
            {/* Section Content */}
            <div className="space-y-6">{children}</div>

            {/* Optional Footer (Continue button, etc.) */}
            {footer && <div className="pt-4 flex justify-end">{footer}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionSection;
