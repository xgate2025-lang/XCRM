import React, { useCallback, useMemo, useState } from 'react';
import { Store, Globe, ChevronDown, ChevronRight, Search, Check, Info } from 'lucide-react';
import { useCouponWizard } from '../../../context/CouponWizardContext';

/**
 * Section D: Redemption Limits
 *
 * Fields per Coupon_Wireframe_v3.md:
 * 12. Store Scope:
 *     - All Stores (default)
 *     - Specific Stores (shows store selection tree)
 *       - Group-level selection expands to individual store IDs
 *       - Search functionality for filtering stores
 */

// Store group structure
interface StoreItem {
  id: string;
  name: string;
  code?: string;
}

interface StoreGroup {
  id: string;
  name: string;
  stores: StoreItem[];
}

// Mock store data organized by groups
const MOCK_STORE_GROUPS: StoreGroup[] = [
  {
    id: 'group-city-center',
    name: 'City Center',
    stores: [
      { id: 'store-001', name: 'Downtown Flagship', code: 'DTF-001' },
      { id: 'store-002', name: 'Central Mall', code: 'CM-002' },
      { id: 'store-003', name: 'Business District', code: 'BD-003' },
    ],
  },
  {
    id: 'group-transit',
    name: 'Transit Hubs',
    stores: [
      { id: 'store-004', name: 'Airport Terminal 1', code: 'APT-001' },
      { id: 'store-005', name: 'Airport Terminal 2', code: 'APT-002' },
      { id: 'store-006', name: 'Central Station', code: 'CS-001' },
      { id: 'store-007', name: 'Bus Terminal', code: 'BT-001' },
    ],
  },
  {
    id: 'group-suburbs',
    name: 'Suburban Areas',
    stores: [
      { id: 'store-008', name: 'Westside Plaza', code: 'WSP-001' },
      { id: 'store-009', name: 'Eastgate Shopping', code: 'EGS-001' },
      { id: 'store-010', name: 'Northpoint Mall', code: 'NPM-001' },
    ],
  },
  {
    id: 'group-outlets',
    name: 'Outlet Stores',
    stores: [
      { id: 'store-011', name: 'Factory Outlet North', code: 'FON-001' },
      { id: 'store-012', name: 'Factory Outlet South', code: 'FOS-001' },
    ],
  },
];

const RedemptionLimitsSection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  // Local state for UI
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['group-city-center']));
  const [searchQuery, setSearchQuery] = useState('');

  // Get all store IDs from all groups
  const allStoreIds = useMemo(
    () => MOCK_STORE_GROUPS.flatMap((group) => group.stores.map((store) => store.id)),
    []
  );

  // Filter stores based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_STORE_GROUPS;
    }
    const query = searchQuery.toLowerCase();
    return MOCK_STORE_GROUPS.map((group) => ({
      ...group,
      stores: group.stores.filter(
        (store) =>
          store.name.toLowerCase().includes(query) ||
          store.code?.toLowerCase().includes(query) ||
          group.name.toLowerCase().includes(query)
      ),
    })).filter((group) => group.stores.length > 0);
  }, [searchQuery]);

  // Toggle group expansion
  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  // Toggle individual store selection
  const toggleStore = useCallback(
    (storeId: string) => {
      const currentIds = coupon.storeIds || [];
      const newIds = currentIds.includes(storeId)
        ? currentIds.filter((id) => id !== storeId)
        : [...currentIds, storeId];
      updateCoupon({ storeIds: newIds });
    },
    [coupon.storeIds, updateCoupon]
  );

  // Toggle all stores in a group
  const toggleGroup2 = useCallback(
    (group: StoreGroup) => {
      const currentIds = new Set(coupon.storeIds || []);
      const groupStoreIds = group.stores.map((store) => store.id);
      const allSelected = groupStoreIds.every((id) => currentIds.has(id));

      let newIds: string[];
      if (allSelected) {
        // Deselect all stores in this group
        newIds = (coupon.storeIds || []).filter((id) => !groupStoreIds.includes(id));
      } else {
        // Select all stores in this group
        newIds = [...new Set([...(coupon.storeIds || []), ...groupStoreIds])];
      }
      updateCoupon({ storeIds: newIds });
    },
    [coupon.storeIds, updateCoupon]
  );

  // Check if all stores in a group are selected
  const isGroupFullySelected = useCallback(
    (group: StoreGroup): boolean => {
      const currentIds = new Set(coupon.storeIds || []);
      return group.stores.every((store) => currentIds.has(store.id));
    },
    [coupon.storeIds]
  );

  // Check if some (but not all) stores in a group are selected
  const isGroupPartiallySelected = useCallback(
    (group: StoreGroup): boolean => {
      const currentIds = new Set(coupon.storeIds || []);
      const selected = group.stores.filter((store) => currentIds.has(store.id)).length;
      return selected > 0 && selected < group.stores.length;
    },
    [coupon.storeIds]
  );

  // Select/Deselect all stores
  const toggleSelectAll = useCallback(() => {
    const currentIds = coupon.storeIds || [];
    if (currentIds.length === allStoreIds.length) {
      updateCoupon({ storeIds: [] });
    } else {
      updateCoupon({ storeIds: [...allStoreIds] });
    }
  }, [coupon.storeIds, allStoreIds, updateCoupon]);

  // Handle store scope change
  const handleScopeChange = useCallback(
    (scope: 'all' | 'specific') => {
      const updates: Record<string, any> = { storeScope: scope };
      if (scope === 'all') {
        updates.storeIds = [];
      }
      updateCoupon(updates);
    },
    [updateCoupon]
  );

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">What are Redemption Limits?</p>
          <p className="text-blue-600 mt-1">
            Control where this coupon can be used. You can allow redemption at all stores or limit it
            to specific locations.
          </p>
        </div>
      </div>

      {/* Store Scope Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          12. Store Scope <span className="text-red-400">*</span>
        </label>

        <div className="space-y-3">
          {/* All Stores Option */}
          <div
            onClick={() => handleScopeChange('all')}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.storeScope === 'all'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.storeScope === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Globe size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="storeScope"
                    checked={coupon.storeScope === 'all'}
                    onChange={() => handleScopeChange('all')}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.storeScope === 'all' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    All Stores
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.storeScope === 'all' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Coupon can be redeemed at any store location
                </p>
              </div>
            </div>
          </div>

          {/* Specific Stores Option */}
          <div
            onClick={() => handleScopeChange('specific')}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.storeScope === 'specific'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.storeScope === 'specific'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Store size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="storeScope"
                    checked={coupon.storeScope === 'specific'}
                    onChange={() => handleScopeChange('specific')}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.storeScope === 'specific' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    Specific Stores
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.storeScope === 'specific' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Limit redemption to selected store locations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Selection Tree (shown when Specific Stores selected) */}
      {coupon.storeScope === 'specific' && (
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
          {/* Header with count and select all */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Stores{' '}
              <span className="text-primary-500">
                ({coupon.storeIds?.length || 0} of {allStoreIds.length} selected)
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {coupon.storeIds?.length === allStoreIds.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores or groups..."
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-primary-500 focus:ring-0 outline-none transition-colors bg-white"
            />
          </div>

          {/* Store Tree */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.id) || searchQuery.trim() !== '';
              const isFullySelected = isGroupFullySelected(group);
              const isPartially = isGroupPartiallySelected(group);

              return (
                <div
                  key={group.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                >
                  {/* Group Header */}
                  <div
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                      isFullySelected
                        ? 'bg-primary-50'
                        : isPartially
                          ? 'bg-amber-50'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-400" />
                      )}
                    </button>

                    {/* Group Checkbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroup2(group);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        isFullySelected
                          ? 'bg-primary-500 border-primary-500'
                          : isPartially
                            ? 'bg-amber-400 border-amber-400'
                            : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {(isFullySelected || isPartially) && <Check size={14} className="text-white" />}
                    </div>

                    <div className="flex-1" onClick={() => toggleGroup(group.id)}>
                      <span className="text-sm font-bold text-slate-700">{group.name}</span>
                      <span className="text-xs text-slate-400 ml-2">
                        ({group.stores.filter((s) => coupon.storeIds?.includes(s.id)).length}/
                        {group.stores.length})
                      </span>
                    </div>
                  </div>

                  {/* Store List */}
                  {isExpanded && (
                    <div className="border-t border-slate-100">
                      {group.stores.map((store) => {
                        const isSelected = coupon.storeIds?.includes(store.id);
                        return (
                          <div
                            key={store.id}
                            onClick={() => toggleStore(store.id)}
                            className={`flex items-center gap-3 pl-12 pr-4 py-2.5 cursor-pointer transition-colors ${
                              isSelected ? 'bg-primary-50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-primary-500 border-primary-500'
                                  : 'border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div className="flex-1">
                              <span
                                className={`text-sm ${isSelected ? 'font-medium text-primary-700' : 'text-slate-600'}`}
                              >
                                {store.name}
                              </span>
                              {store.code && (
                                <span className="text-xs text-slate-400 ml-2">({store.code})</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredGroups.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Store size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No stores match your search</p>
              </div>
            )}
          </div>

          {/* Validation Warning */}
          {coupon.storeIds?.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
              <Info size={14} className="text-amber-500" />
              <span className="text-xs font-medium text-amber-700">
                Please select at least one store to continue
              </span>
            </div>
          )}

          {/* Selection Summary */}
          {(coupon.storeIds?.length || 0) > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-100 rounded-lg">
              <Check size={14} className="text-primary-600" />
              <span className="text-sm font-bold text-primary-700">
                {coupon.storeIds?.length} store{(coupon.storeIds?.length || 0) !== 1 ? 's' : ''}{' '}
                selected across{' '}
                {
                  MOCK_STORE_GROUPS.filter((g) =>
                    g.stores.some((s) => coupon.storeIds?.includes(s.id))
                  ).length
                }{' '}
                group
                {MOCK_STORE_GROUPS.filter((g) =>
                  g.stores.some((s) => coupon.storeIds?.includes(s.id))
                ).length !== 1
                  ? 's'
                  : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RedemptionLimitsSection;
