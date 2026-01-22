import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe, Plus, Search, Edit3, Trash2, X, Check, AlertCircle,
  DollarSign, ChevronDown, Users, ArrowLeft, Info, Clock
} from 'lucide-react';
import { useGlobalSettings } from '../../context/GlobalSettingsContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { CurrencyConfig, NavItemId } from '../../types';
import { NavigationPayload } from '../../App';
import CustomerAttributes from '../../components/settings/CustomerAttributes';
import { TIMEZONES } from '../../lib/services/mock/MockGlobalSettingsService';

// ISO 4217 Currency list for the dropdown
const ISO_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'NZD', name: 'New Zealand Dollar' },
];

type TabId = 'currency' | 'attributes';

interface GlobalSettingsProps {
  navigationPayload?: NavigationPayload;
  onNavigate?: (id: NavItemId, payload?: NavigationPayload) => void;
}

const GlobalSettings: React.FC<GlobalSettingsProps> = ({ navigationPayload, onNavigate }) => {
  const {
    currencies,
    timezone,
    isLoading,
    error,
    setTimezone,
    addCurrency,
    updateCurrency,
    deleteCurrency,
    getDefaultCurrency,
  } = useGlobalSettings();

  const { toggleSubtask, state: onboardingState } = useOnboarding();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>('currency');

  // T008: Set active tab from navigation payload (onboarding flow)
  useEffect(() => {
    if (navigationPayload?.tab === 'currency') {
      setActiveTab('currency');
    }
  }, [navigationPayload?.tab]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CurrencyConfig | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<CurrencyConfig | null>(null);

  // Form state
  const [selectedCode, setSelectedCode] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Timezone state
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);
  const [isTimezoneChanged, setIsTimezoneChanged] = useState(false);

  // Sync timezone from context
  useEffect(() => {
    setSelectedTimezone(timezone);
  }, [timezone]);

  // Handle timezone change
  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    setIsTimezoneChanged(newTimezone !== timezone);
  };

  // Save timezone
  const handleSaveTimezone = async () => {
    try {
      await setTimezone(selectedTimezone);
      setIsTimezoneChanged(false);
      // Mark onboarding Step 1 subtask as complete
      if (onboardingState && !onboardingState.missions.identity.subtasks[0].isDone) {
        await toggleSubtask('identity', 'set_timezone', true);
      }
    } catch (err) {
      // Error handled by context
    }
  };

  // Get default currency
  const defaultCurrency = getDefaultCurrency();

  // Filter currencies based on search
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return currencies;
    const q = searchQuery.toLowerCase();
    return currencies.filter(c =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    );
  }, [currencies, searchQuery]);

  // Get available currencies for dropdown (exclude already added)
  const availableCurrencies = useMemo(() => {
    const existingCodes = new Set(currencies.map(c => c.code));
    return ISO_CURRENCIES.filter(c => !existingCodes.has(c.code));
  }, [currencies]);

  // Open modal for adding
  const handleAddClick = () => {
    setEditingCurrency(null);
    setSelectedCode('');
    setExchangeRate('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditClick = (currency: CurrencyConfig) => {
    if (currency.isDefault) return; // Cannot edit default
    setEditingCurrency(currency);
    setSelectedCode(currency.code);
    setExchangeRate(currency.rate.toString());
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (currency: CurrencyConfig) => {
    if (currency.isDefault) return; // Cannot delete default
    setCurrencyToDelete(currency);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!currencyToDelete) return;
    try {
      await deleteCurrency(currencyToDelete.code);
      setIsDeleteConfirmOpen(false);
      setCurrencyToDelete(null);
    } catch (err) {
      // Error handled by context
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) {
      setFormError('Exchange rate must be a positive number');
      return;
    }
    if (rate.toString().split('.')[1]?.length > 6) {
      setFormError('Exchange rate can have at most 6 decimal places');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCurrency) {
        // Update existing
        await updateCurrency(editingCurrency.code, rate);
      } else {
        // Add new
        if (!selectedCode) {
          setFormError('Please select a currency');
          setIsSubmitting(false);
          return;
        }
        const currencyInfo = ISO_CURRENCIES.find(c => c.code === selectedCode);
        await addCurrency({
          code: selectedCode,
          name: currencyInfo?.name || selectedCode,
          rate,
          isDefault: false,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary-50 p-3 rounded-xl">
            <Globe size={28} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Global Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Manage currencies and customer attributes</p>
          </div>
        </div>

        {/* T009: Return to Dashboard button (visible when navigating from onboarding) */}
        {navigationPayload?.source === 'onboarding' && onNavigate && (
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 font-bold rounded-xl hover:bg-primary-100 transition-all"
          >
            <ArrowLeft size={18} />
            Return to Dashboard
          </button>
        )}
      </div>

      {/* T016: Onboarding guidance banner */}
      {navigationPayload?.source === 'onboarding' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Info size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-blue-900">Step 1: Set Your Timezone & Currency</p>
            <p className="text-blue-700 text-sm mt-1">
              Configure your default currency and exchange rates below. This ensures all transactions
              and reports display values correctly for your business.
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-slate-200 px-2">
        <button
          onClick={() => setActiveTab('currency')}
          className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'currency'
              ? 'text-primary-600 border-primary-500'
              : 'text-slate-400 border-transparent hover:text-slate-600'
          }`}
        >
          <DollarSign size={16} />
          Currency
        </button>
        <button
          onClick={() => setActiveTab('attributes')}
          className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'attributes'
              ? 'text-primary-600 border-primary-500'
              : 'text-slate-400 border-transparent hover:text-slate-600'
          }`}
        >
          <Users size={16} />
          Customer Attributes
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Currency Tab Content */}
      {activeTab === 'currency' && (
        <div className="space-y-6">
          {/* Timezone Setting */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Timezone</h3>
                <p className="text-sm text-slate-500">Set your business timezone for reports and scheduling</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <select
                  value={selectedTimezone}
                  onChange={(e) => handleTimezoneChange(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {isTimezoneChanged && (
                <button
                  onClick={handleSaveTimezone}
                  className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                  <Check size={18} />
                  Save Timezone
                </button>
              )}
              {!isTimezoneChanged && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Check size={16} />
                  Saved
                </span>
              )}
            </div>
          </div>

          {/* Default Currency Info */}
          {defaultCurrency && (
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Default Currency (Base)</p>
                  <p className="text-2xl font-black text-slate-900">
                    {defaultCurrency.code} - {defaultCurrency.name}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">All exchange rates are relative to this currency</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-primary-100">
                  <p className="text-xs text-slate-400 font-bold">Rate</p>
                  <p className="text-xl font-black text-slate-900">1.000000</p>
                </div>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-slate-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddClick}
              disabled={availableCurrencies.length === 0}
              className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus size={18} />
              Add Currency
            </button>
          </div>

          {/* Currency Table */}
          <div className="bg-white rounded-4xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-slate-500 mt-4">Loading currencies...</p>
              </div>
            ) : filteredCurrencies.length === 0 ? (
              <div className="p-12 text-center">
                <DollarSign size={48} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No currencies found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary-500 font-bold text-sm mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Currency</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Exchange Rate</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Updated</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCurrencies.map((currency) => (
                    <tr
                      key={currency.code}
                      className={`hover:bg-slate-50 transition-colors ${currency.isDefault ? 'bg-primary-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            currency.isDefault
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {currency.code.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{currency.name}</p>
                            {currency.isDefault && (
                              <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-700">{currency.code}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-bold text-slate-900">{currency.rate.toFixed(6)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 text-sm">{formatDate(currency.updatedAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!currency.isDefault && (
                            <>
                              <button
                                onClick={() => handleEditClick(currency)}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                title="Edit"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(currency)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                          {currency.isDefault && (
                            <span className="text-xs text-slate-400 italic">Read-only</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Attributes Tab Content */}
      {activeTab === 'attributes' && <CustomerAttributes />}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCurrency ? 'Edit Currency' : 'Add Currency'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Currency Selection (only for add) */}
              {!editingCurrency && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Select Currency
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCode}
                      onChange={(e) => setSelectedCode(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 appearance-none cursor-pointer"
                    >
                      <option value="">Choose a currency...</option>
                      {availableCurrencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Display selected currency info (for edit) */}
              {editingCurrency && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Currency</p>
                  <p className="text-lg font-bold text-slate-900">
                    {editingCurrency.code} - {editingCurrency.name}
                  </p>
                </div>
              )}

              {/* Exchange Rate Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Exchange Rate
                  <span className="text-slate-400 font-normal ml-2">
                    (1 {selectedCode || editingCurrency?.code || '...'} = X {defaultCurrency?.code || 'THB'})
                  </span>
                </label>
                <input
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="e.g., 34.50"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Maximum 6 decimal places. Rate must be greater than 0.
                </p>
              </div>

              {/* Form Error */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={16} />
                  <p className="text-red-700 text-sm font-medium">{formError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {editingCurrency ? 'Update' : 'Add Currency'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && currencyToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Currency?</h2>
              <p className="text-slate-500 mb-2">
                Are you sure you want to delete <span className="font-bold">{currencyToDelete.code}</span>?
              </p>
              <p className="text-sm text-amber-600 bg-amber-50 rounded-xl p-3 mb-6">
                This action may affect historical data calculations.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setCurrencyToDelete(null);
                  }}
                  className="flex-1 px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSettings;
