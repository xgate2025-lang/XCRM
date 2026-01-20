import React, { useCallback, useMemo } from 'react';
import { DollarSign, Percent, Package, Image as ImageIcon, X, Calendar, Infinity } from 'lucide-react';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import { CouponType } from '../../../types';

/**
 * Section A: Basic Information
 *
 * Fields per Coupon_Wireframe_v3.md:
 * 1. Name *
 * 2. Identifier * (Auto-generate / Custom)
 * 3. Type * (Fixed Deduction / Discount Percentage / Product or service)
 * 4. Value * (Dynamic based on Type)
 * 5. Image (optional)
 * 6. Description (optional)
 * 7. Terms & Conditions (optional)
 * 8. Template Validity * (Date Range / All Time toggle)
 */

// Type configuration with icons and labels
const TYPE_OPTIONS: {
  type: CouponType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    type: 'cash',
    label: 'Fixed Deduction',
    description: 'A fixed dollar amount off',
    icon: <DollarSign size={20} />,
  },
  {
    type: 'percentage',
    label: 'Discount Percentage',
    description: 'A percentage discount',
    icon: <Percent size={20} />,
  },
  {
    type: 'sku',
    label: 'Product or Service',
    description: 'A free item or service',
    icon: <Package size={20} />,
  },
];

// Helper to generate identifier from name
const generateIdentifier = (name: string): string => {
  if (!name) return '';
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20);
};

const BasicInfoSection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  // Auto-generate identifier when name changes and mode is 'auto'
  const handleNameChange = useCallback(
    (name: string) => {
      const updates: Record<string, any> = { name };
      if (coupon.identifierMode === 'auto') {
        updates.identifier = generateIdentifier(name);
      }
      updateCoupon(updates);
    },
    [coupon.identifierMode, updateCoupon]
  );

  // Handle identifier mode change
  const handleIdentifierModeChange = useCallback(
    (mode: 'auto' | 'manual') => {
      const updates: Record<string, any> = { identifierMode: mode };
      if (mode === 'auto') {
        updates.identifier = generateIdentifier(coupon.name || '');
      }
      updateCoupon(updates);
    },
    [coupon.name, updateCoupon]
  );

  // Handle type change - reset value when type changes
  const handleTypeChange = useCallback(
    (type: CouponType) => {
      const updates: Record<string, any> = { type };
      // Reset value-related fields when type changes
      if (type === 'sku') {
        updates.value = 0;
      } else {
        updates.productText = '';
      }
      updateCoupon(updates);
    },
    [updateCoupon]
  );

  // Handle All Time toggle
  const handleAllTimeToggle = useCallback(
    (isAllTime: boolean) => {
      updateCoupon({
        validityType: isAllTime ? 'dynamic' : 'fixed',
        startDate: isAllTime ? '' : coupon.startDate,
        endDate: isAllTime ? '' : coupon.endDate,
      });
    },
    [coupon.startDate, coupon.endDate, updateCoupon]
  );

  // Get today's date for min date validation
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  return (
    <div className="space-y-8">
      {/* 1. Name Field */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          1. Coupon Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={coupon.name || ''}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full text-lg font-bold border-b-2 border-slate-200 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors placeholder:text-slate-300"
          placeholder="e.g. Summer Sale $10 Off"
          autoFocus
          maxLength={100}
        />
        <p className="text-xs text-slate-400 mt-1">
          This name will be displayed to members in the app.
        </p>
      </div>

      {/* 2. Identifier Field */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          2. Identifier <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-6 mb-3">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="identifierMode"
              checked={coupon.identifierMode === 'auto'}
              onChange={() => handleIdentifierModeChange('auto')}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span
              className={`text-sm font-medium transition-colors ${
                coupon.identifierMode === 'auto' ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              Auto-generate
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="identifierMode"
              checked={coupon.identifierMode === 'manual'}
              onChange={() => handleIdentifierModeChange('manual')}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span
              className={`text-sm font-medium transition-colors ${
                coupon.identifierMode === 'manual' ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              Custom
            </span>
          </label>
        </div>

        {coupon.identifierMode === 'manual' ? (
          <input
            type="text"
            value={coupon.identifier || ''}
            onChange={(e) =>
              updateCoupon({ identifier: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') })
            }
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-mono font-bold uppercase tracking-wider focus:border-primary-500 focus:ring-0 outline-none transition-colors"
            placeholder="CUSTOM-CODE-123"
            maxLength={30}
          />
        ) : (
          <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-sm font-mono font-bold text-slate-600 uppercase tracking-wider">
              {coupon.identifier || 'Will be generated from name'}
            </span>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-1">
          Used for internal tracking and API references. Must be unique.
        </p>
      </div>

      {/* 3. Type Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          3. Coupon Type <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TYPE_OPTIONS.map(({ type, label, description, icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                coupon.type === type
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  coupon.type === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {icon}
              </div>
              <div
                className={`text-sm font-bold ${
                  coupon.type === type ? 'text-primary-700' : 'text-slate-700'
                }`}
              >
                {label}
              </div>
              <div className="text-xs text-slate-400 mt-1">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Value Field (Dynamic based on Type) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          4. Value <span className="text-red-400">*</span>
        </label>

        {coupon.type === 'cash' && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-slate-400">$</span>
            <input
              type="number"
              value={coupon.value || ''}
              onChange={(e) => updateCoupon({ value: Math.max(0, Number(e.target.value)) })}
              className="w-40 text-2xl font-bold border-b-2 border-slate-200 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors"
              placeholder="0.00"
              min={0}
              step={0.01}
            />
            <span className="text-sm text-slate-400 ml-2">off</span>
          </div>
        )}

        {coupon.type === 'percentage' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={coupon.value || ''}
              onChange={(e) =>
                updateCoupon({ value: Math.min(100, Math.max(0, Number(e.target.value))) })
              }
              className="w-32 text-2xl font-bold border-b-2 border-slate-200 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors"
              placeholder="0"
              min={0}
              max={100}
            />
            <span className="text-2xl font-bold text-slate-400">%</span>
            <span className="text-sm text-slate-400 ml-2">off</span>
          </div>
        )}

        {coupon.type === 'sku' && (
          <div>
            <input
              type="text"
              value={coupon.productText || ''}
              onChange={(e) => updateCoupon({ productText: e.target.value })}
              className="w-full text-lg font-bold border-b-2 border-slate-200 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors placeholder:text-slate-300"
              placeholder="e.g. Free Medium Coffee, Complimentary Dessert"
              maxLength={100}
            />
            <p className="text-xs text-slate-400 mt-1">
              Describe what the member receives with this coupon.
            </p>
          </div>
        )}
      </div>

      {/* 5. Image Upload (Optional) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          5. Image <span className="text-slate-300">(Optional)</span>
        </label>
        {coupon.imageUrl ? (
          <div className="relative inline-block">
            <img
              src={coupon.imageUrl}
              alt="Coupon preview"
              className="w-40 h-24 object-cover rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={() => updateCoupon({ imageUrl: '' })}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <div className="w-40 h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                <ImageIcon size={24} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-400">Upload Image</span>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Create a data URL for preview (in real app, would upload to server)
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      updateCoupon({ imageUrl: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
            <div className="text-xs text-slate-400">
              <p>Max 2MB</p>
              <p>JPG or PNG</p>
            </div>
          </div>
        )}
      </div>

      {/* 6. Description (Optional) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          6. Description <span className="text-slate-300">(Optional)</span>
        </label>
        <textarea
          value={coupon.description || ''}
          onChange={(e) => updateCoupon({ description: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:border-primary-500 focus:ring-0 outline-none transition-colors"
          placeholder="Enter a marketing description for this coupon..."
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-slate-400 mt-1 text-right">
          {(coupon.description || '').length}/500
        </p>
      </div>

      {/* 7. Terms & Conditions (Optional) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          7. Terms & Conditions <span className="text-slate-300">(Optional)</span>
        </label>
        <textarea
          value={coupon.termsConditions || ''}
          onChange={(e) => updateCoupon({ termsConditions: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:border-primary-500 focus:ring-0 outline-none transition-colors font-mono"
          placeholder="• Valid on orders over $50&#10;• Cannot be combined with other offers&#10;• One per customer"
          rows={4}
          maxLength={2000}
        />
        <p className="text-xs text-slate-400 mt-1">
          Enter the fine print. Use bullet points or line breaks for readability.
        </p>
      </div>

      {/* 8. Template Validity */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          8. Template Validity <span className="text-red-400">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-4">
          Define when this coupon template is active. Individual codes may have different validity
          (configured in Section B).
        </p>

        {/* All Time Toggle */}
        <div className="mb-4">
          <label
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              coupon.validityType === 'dynamic'
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <input
              type="checkbox"
              checked={coupon.validityType === 'dynamic'}
              onChange={(e) => handleAllTimeToggle(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <Infinity
              size={20}
              className={coupon.validityType === 'dynamic' ? 'text-primary-500' : 'text-slate-400'}
            />
            <div>
              <span
                className={`font-bold ${
                  coupon.validityType === 'dynamic' ? 'text-primary-700' : 'text-slate-600'
                }`}
              >
                All Time
              </span>
              <p className="text-xs text-slate-400">Template never expires</p>
            </div>
          </label>
        </div>

        {/* Date Range (shown when All Time is not checked) */}
        {coupon.validityType === 'fixed' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Date Range</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={coupon.startDate || ''}
                  onChange={(e) => updateCoupon({ startDate: e.target.value })}
                  min={today}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                />
              </div>
              <span className="text-slate-400 font-bold mt-5">to</span>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={coupon.endDate || ''}
                  onChange={(e) => updateCoupon({ endDate: e.target.value })}
                  min={coupon.startDate || today}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
