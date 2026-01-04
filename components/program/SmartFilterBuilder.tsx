import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Plus, Search, ArrowLeft, Check, Tag, Hash, Type, DollarSign, AlertCircle, ChevronDown
} from 'lucide-react';
import { AttributeCondition } from '../../types';

export interface AttributeDef {
  id: string;
  label: string;
  icon: React.ElementType;
  inputType: 'text' | 'range' | 'multi-select';
  operators: string[];
  options?: string[]; // For multi-select
  unitPrefix?: string; // e.g. "$"
}

interface SmartFilterBuilderProps {
  conditions: AttributeCondition[];
  onChange: (conditions: AttributeCondition[]) => void;
  logicMode?: 'AND' | 'OR';
  availableAttributes?: AttributeDef[];
}

// --- Configuration ---

export const DEFAULT_ATTRIBUTES: AttributeDef[] = [
  { 
    id: 'brand', 
    label: 'Brand', 
    icon: Tag, 
    inputType: 'multi-select', 
    operators: ['is_any_of'],
    options: ['Nike', 'Adidas', 'Puma', 'Sony', 'Apple', 'Samsung', 'Lululemon', 'Zara']
  },
  { 
    id: 'category', 
    label: 'Category', 
    icon: Hash, 
    inputType: 'multi-select', 
    operators: ['is_any_of'],
    options: ['Shoes', 'Electronics', 'Accessories', 'Home', 'Beauty', 'Sports']
  },
  { 
    id: 'product_name', 
    label: 'Product Name', 
    icon: Type, 
    inputType: 'text', 
    operators: ['contains'] 
  },
  { 
    id: 'cart_total', 
    label: 'Cart Total', 
    icon: DollarSign, 
    inputType: 'range', 
    operators: ['between', 'greater_than', 'less_than', 'equals'],
    unitPrefix: '$'
  },
];

const OPERATOR_LABELS: Record<string, string> = {
  'is_any_of': 'is any of',
  'contains': 'contains',
  'between': 'between',
  'greater_than': 'at least',
  'less_than': 'at most',
  'equals': 'exactly',
};

// --- Component ---

const SmartFilterBuilder: React.FC<SmartFilterBuilderProps> = ({ conditions, onChange, logicMode = 'AND', availableAttributes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'attribute' | 'value'>('attribute');
  
  // Attributes to use
  const attributes = availableAttributes || DEFAULT_ATTRIBUTES;
  
  // Selection State
  const [tempAttribute, setTempAttribute] = useState<AttributeDef | null>(null);
  
  // Value State
  const [tempValue, setTempValue] = useState<string | string[]>(''); // Text/Multi-select/Single Number
  const [minVal, setMinVal] = useState<string>(''); // Range Min
  const [maxVal, setMaxVal] = useState<string>(''); // Range Max
  const [rangeMode, setRangeMode] = useState<string>('between'); // For numeric logic
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        resetAndClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetAndClose = () => {
    setIsOpen(false);
    setStep('attribute');
    setTempAttribute(null);
    setTempValue('');
    setMinVal('');
    setMaxVal('');
    setRangeMode('between');
  };

  const handleAttributeSelect = (attr: AttributeDef) => {
    setTempAttribute(attr);
    setTempValue(attr.inputType === 'multi-select' ? [] : '');
    setMinVal('');
    setMaxVal('');
    setRangeMode('between');
    setStep('value');
  };

  const handleSave = () => {
    if (!tempAttribute) return;

    let finalValue = '';
    let finalOperator = tempAttribute.operators[0];

    // Process Range / Numeric
    if (tempAttribute.inputType === 'range') {
        finalOperator = rangeMode;
        if (rangeMode === 'between') {
             if (!minVal || !maxVal) return;
             finalValue = `${minVal}:${maxVal}`;
        } else {
             if (!tempValue) return;
             finalValue = String(tempValue);
        }
    } 
    // Process Multi-select
    else if (Array.isArray(tempValue)) {
      if (tempValue.length === 0) return;
      finalValue = tempValue.join(', ');
    } 
    // Process Text
    else {
      if (!tempValue) return;
      finalValue = String(tempValue);
    }

    const newCondition: AttributeCondition = {
      id: Math.random().toString(36).substr(2, 9),
      attribute: tempAttribute.id,
      operator: finalOperator,
      value: finalValue,
    };

    onChange([...conditions, newCondition]);
    resetAndClose();
  };

  const removeCondition = (id: string) => {
    onChange(conditions.filter(c => c.id !== id));
  };

  // --- Helpers ---

  const formatChipValue = (cond: AttributeCondition, attr: AttributeDef) => {
    if (attr.inputType === 'range') {
        const unit = attr.unitPrefix || '';
        
        if (cond.operator === 'between') {
             const [min, max] = cond.value.split(':');
             return `${unit}${min} - ${unit}${max}`;
        }
        if (cond.operator === 'greater_than') return `> ${unit}${cond.value}`;
        if (cond.operator === 'less_than') return `< ${unit}${cond.value}`;
        if (cond.operator === 'equals') return `= ${unit}${cond.value}`;
    }
    return cond.value;
  };

  const isFormValid = () => {
      if (!tempAttribute) return false;
      
      if (tempAttribute.inputType === 'range') {
          if (rangeMode === 'between') {
              if (!minVal || !maxVal) return false;
              return Number(minVal) < Number(maxVal);
          }
          return !!tempValue;
      }
      
      if (tempAttribute.inputType === 'text') return !!tempValue;
      
      if (tempAttribute.inputType === 'multi-select') {
          return Array.isArray(tempValue) && tempValue.length > 0;
      }
      
      return false;
  };

  // --- Renderers ---

  const renderChip = (cond: AttributeCondition) => {
    const attrDef = attributes.find(a => a.id === cond.attribute);
    if (!attrDef) return null;

    const Icon = attrDef.icon;
    const formattedValue = formatChipValue(cond, attrDef);
    
    // Determine label for operator badge
    let operatorBadge = '';
    if (attrDef.inputType === 'range') {
        operatorBadge = OPERATOR_LABELS[cond.operator] || cond.operator;
    } else if (attrDef.inputType === 'multi-select') {
        operatorBadge = 'In';
    } else {
        operatorBadge = 'Has';
    }

    return (
      <div key={cond.id} className="inline-flex items-center bg-white border border-slate-200 rounded-lg shadow-sm pl-2 pr-1 py-1 animate-in fade-in zoom-in-95 duration-200 group hover:border-slate-300">
        <Icon size={14} className="text-slate-400 mr-2" />
        <span className="text-sm text-slate-500 font-medium mr-1">{attrDef.label}</span>
        
        {/* Operator Badge */}
        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1 rounded mr-1">
            {operatorBadge}
        </span>

        <span className="text-sm text-slate-900 font-bold mr-2">
           {formattedValue}
        </span>
        <button 
          onClick={() => removeCondition(cond.id)}
          className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  };

  const renderAttributeStep = () => (
    <div className="p-2 w-64">
      <div className="px-2 py-2 mb-2 relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          autoFocus 
          placeholder="Select attribute..." 
          className="w-full bg-slate-50 border-none rounded-lg py-1.5 pl-8 text-sm focus:ring-0 placeholder:text-slate-400"
        />
      </div>
      <div className="space-y-0.5 max-h-48 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Attributes</div>
        {attributes.map(attr => {
          // Check if already used
          const isUsed = conditions.some(c => c.attribute === attr.id);
          
          return (
            <button
              key={attr.id}
              onClick={() => !isUsed && handleAttributeSelect(attr)}
              disabled={isUsed}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors group ${
                  isUsed ? 'opacity-40 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-100 cursor-pointer'
              }`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${isUsed ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'}`}>
                <attr.icon size={14} />
              </div>
              <div>
                  <span className={`text-sm font-medium ${isUsed ? 'text-slate-400' : 'text-slate-700'}`}>{attr.label}</span>
                  {isUsed && <div className="text-[10px] text-slate-400 font-medium">Already added</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderValueStep = () => {
    if (!tempAttribute) return null;
    const Icon = tempAttribute.icon;

    return (
      <div className="p-3 w-72">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
          <button onClick={() => setStep('attribute')} className="p-1 -ml-1 text-slate-400 hover:text-slate-600 rounded">
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
             <Icon size={14} className="text-slate-400" />
             {tempAttribute.label}
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-4">
           {tempAttribute.inputType === 'text' && (
             <input 
               autoFocus
               type="text"
               value={tempValue as string}
               onChange={(e) => setTempValue(e.target.value)}
               placeholder="Contains text..."
               className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:border-primary-500 focus:outline-none"
             />
           )}
           
           {/* NUMERIC / RANGE BUILDER */}
           {tempAttribute.inputType === 'range' && (
             <div className="space-y-3">
                 {/* Logic Selector */}
                 <div className="relative">
                    <select
                        value={rangeMode}
                        onChange={(e) => setRangeMode(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-primary-500 cursor-pointer"
                    >
                        {tempAttribute.operators.map(op => (
                            <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 </div>

                 {/* Inputs based on Mode */}
                 {rangeMode === 'between' && (
                     <div className="flex items-center gap-2 animate-in fade-in duration-200">
                        <div className="relative flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">{tempAttribute.unitPrefix}</span>
                                <input 
                                autoFocus
                                type="number"
                                value={minVal}
                                onChange={(e) => setMinVal(e.target.value)}
                                className="w-full border-2 border-slate-200 rounded-xl pl-6 pr-2 py-2 text-sm font-medium focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="pt-6 text-slate-300 font-bold">-</div>
                        <div className="relative flex-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">{tempAttribute.unitPrefix}</span>
                                <input 
                                type="number"
                                value={maxVal}
                                onChange={(e) => setMaxVal(e.target.value)}
                                className="w-full border-2 border-slate-200 rounded-xl pl-6 pr-2 py-2 text-sm font-medium focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>
                     </div>
                 )}

                 {rangeMode !== 'between' && (
                     <div className="animate-in fade-in duration-200">
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{tempAttribute.unitPrefix}</span>
                            <input 
                            autoFocus
                            type="number"
                            value={tempValue as string}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder="0.00"
                            className="w-full border-2 border-slate-200 rounded-xl pl-6 pr-3 py-2 text-sm font-medium focus:border-primary-500 focus:outline-none"
                            />
                        </div>
                     </div>
                 )}

                 {/* Validation Error */}
                 {rangeMode === 'between' && minVal && maxVal && Number(minVal) >= Number(maxVal) && (
                     <div className="flex items-center gap-2 text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg">
                         <AlertCircle size={14} />
                         Min must be less than Max
                     </div>
                 )}
             </div>
           )}

           {/* LIST BUILDER */}
           {tempAttribute.inputType === 'multi-select' && (
             <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                 <div className="text-xs text-slate-400 font-medium mb-2">Includes <span className="font-bold text-slate-700">ANY</span> of the following:</div>
                {tempAttribute.options?.map(opt => {
                   const isSelected = (tempValue as string[]).includes(opt);
                   return (
                     <label key={opt} className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-primary-50 border-primary-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-300 bg-white'}`}>
                             {isSelected && <Check size={10} className="text-white" />}
                          </div>
                          <span className={`text-sm ${isSelected ? 'font-bold text-primary-700' : 'font-medium text-slate-600'}`}>{opt}</span>
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={isSelected}
                          onChange={(e) => {
                             const current = tempValue as string[];
                             setTempValue(e.target.checked ? [...current, opt] : current.filter(x => x !== opt));
                          }}
                        />
                     </label>
                   )
                })}
             </div>
           )}
        </div>

        {/* Footer */}
        <button 
          onClick={handleSave}
          disabled={!isFormValid()}
          className="w-full py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Add Condition
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {conditions.map((cond, index) => (
        <React.Fragment key={cond.id}>
           {index > 0 && (
              <div className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                 logicMode === 'OR' 
                   ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                   : 'bg-slate-100 text-slate-500'
              }`}>
                 {logicMode}
              </div>
           )}
           {renderChip(cond)}
        </React.Fragment>
      ))}
      
      {/* Show Add Button only if there are attributes left to add */}
      {/* Use availableAttributes here */}
      {conditions.length < attributes.length && (
        <div className="relative" ref={dropdownRef}>
            <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-dashed transition-all ${isOpen ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-white text-slate-500 border-slate-300 hover:border-primary-400 hover:text-primary-600'}`}
            >
            <Plus size={14} />
            Add Condition
            </button>

            {isOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                {step === 'attribute' ? renderAttributeStep() : renderValueStep()}
            </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SmartFilterBuilder;