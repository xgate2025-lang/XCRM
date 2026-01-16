import React, { useState, useMemo } from 'react';
import {
  Plus, Search, Edit3, Trash2, X, Check, AlertCircle,
  ChevronDown, ChevronUp, GripVertical, Lock, Type, Calendar,
  Hash, ToggleLeft, List, ListChecks
} from 'lucide-react';
import { useGlobalSettings } from '../../context/GlobalSettingsContext';
import { CustomerAttribute, AttributeFormat, AttributeOption } from '../../types';

// Format options for dropdown
const FORMAT_OPTIONS: { value: AttributeFormat; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'TEXT', label: 'Text', icon: <Type size={16} />, description: 'Single line text input' },
  { value: 'NUMBER', label: 'Number', icon: <Hash size={16} />, description: 'Numeric values only' },
  { value: 'DATE', label: 'Date', icon: <Calendar size={16} />, description: 'Date picker (YYYY-MM-DD)' },
  { value: 'DATETIME', label: 'Date & Time', icon: <Calendar size={16} />, description: 'Date and time picker' },
  { value: 'BOOLEAN', label: 'Yes/No', icon: <ToggleLeft size={16} />, description: 'Toggle switch' },
  { value: 'SELECT', label: 'Single Select', icon: <List size={16} />, description: 'Dropdown with one choice' },
  { value: 'MULTISELECT', label: 'Multi Select', icon: <ListChecks size={16} />, description: 'Multiple choices allowed' },
];

const CustomerAttributes: React.FC = () => {
  const {
    attributes,
    isLoading,
    addAttribute,
    updateAttribute,
    deleteAttribute,
    getStandardAttributes,
    getCustomAttributes,
  } = useGlobalSettings();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<CustomerAttribute | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<CustomerAttribute | null>(null);

  // Form state
  const [formCode, setFormCode] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formFormat, setFormFormat] = useState<AttributeFormat>('TEXT');
  const [formIsRequired, setFormIsRequired] = useState(false);
  const [formIsUnique, setFormIsUnique] = useState(false);
  const [formOptions, setFormOptions] = useState<AttributeOption[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'STANDARD' | 'CUSTOM'>('all');

  // Get filtered attributes
  const filteredAttributes = useMemo(() => {
    let result = attributes;

    // Filter by type
    if (filterType === 'STANDARD') {
      result = getStandardAttributes();
    } else if (filterType === 'CUSTOM') {
      result = getCustomAttributes();
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.code.toLowerCase().includes(q) ||
        a.displayName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [attributes, filterType, searchQuery, getStandardAttributes, getCustomAttributes]);

  // Grouped attributes for display
  const standardAttributes = filteredAttributes.filter(a => a.type === 'STANDARD');
  const customAttributes = filteredAttributes.filter(a => a.type === 'CUSTOM');

  // Open modal for adding
  const handleAddClick = () => {
    setEditingAttribute(null);
    setFormCode('');
    setFormDisplayName('');
    setFormFormat('TEXT');
    setFormIsRequired(false);
    setFormIsUnique(false);
    setFormOptions([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditClick = (attr: CustomerAttribute) => {
    setEditingAttribute(attr);
    // Remove c_ prefix for display in edit mode
    setFormCode(attr.type === 'CUSTOM' ? attr.code.replace(/^c_/, '') : attr.code);
    setFormDisplayName(attr.displayName);
    setFormFormat(attr.format);
    setFormIsRequired(attr.isRequired);
    setFormIsUnique(attr.isUnique);
    setFormOptions(attr.options || []);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (attr: CustomerAttribute) => {
    if (attr.type === 'STANDARD') return;
    setAttributeToDelete(attr);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!attributeToDelete) return;
    try {
      await deleteAttribute(attributeToDelete.code);
      setIsDeleteConfirmOpen(false);
      setAttributeToDelete(null);
    } catch (err) {
      // Error handled by context
    }
  };

  // Add option
  const handleAddOption = () => {
    setFormOptions([...formOptions, { label: '', value: '' }]);
  };

  // Update option
  const handleUpdateOption = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...formOptions];
    updated[index] = { ...updated[index], [field]: val };
    // Auto-generate value from label if value is empty
    if (field === 'label' && !updated[index].value) {
      updated[index].value = val.toLowerCase().replace(/\s+/g, '_');
    }
    setFormOptions(updated);
  };

  // Remove option
  const handleRemoveOption = (index: number) => {
    setFormOptions(formOptions.filter((_, i) => i !== index));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formCode.trim()) {
      setFormError('Attribute code is required');
      return;
    }

    if (!formDisplayName.trim()) {
      setFormError('Display name is required');
      return;
    }

    // Validate code format (alphanumeric + underscore only)
    if (!/^[a-z][a-z0-9_]*$/i.test(formCode)) {
      setFormError('Code must start with a letter and contain only letters, numbers, and underscores');
      return;
    }

    // Validate options for SELECT/MULTISELECT
    if ((formFormat === 'SELECT' || formFormat === 'MULTISELECT')) {
      const validOptions = formOptions.filter(o => o.label.trim() && o.value.trim());
      if (validOptions.length === 0) {
        setFormError('At least one option is required for Select/Multi-select attributes');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const finalCode = editingAttribute
        ? editingAttribute.code // Keep original code when editing
        : `c_${formCode.toLowerCase()}`; // Add c_ prefix for new custom attributes

      // Check for duplicate code (only for new attributes)
      if (!editingAttribute && attributes.some(a => a.code === finalCode)) {
        setFormError(`Attribute code "${finalCode}" already exists`);
        setIsSubmitting(false);
        return;
      }

      const attributeData: CustomerAttribute = {
        code: finalCode,
        displayName: formDisplayName.trim(),
        type: editingAttribute?.type || 'CUSTOM',
        format: formFormat,
        isRequired: formIsRequired,
        isUnique: formIsUnique,
        status: 'ACTIVE',
        options: (formFormat === 'SELECT' || formFormat === 'MULTISELECT')
          ? formOptions.filter(o => o.label.trim() && o.value.trim())
          : undefined,
      };

      if (editingAttribute) {
        await updateAttribute(editingAttribute.code, attributeData);
      } else {
        await addAttribute(attributeData);
      }

      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get format icon
  const getFormatIcon = (format: AttributeFormat) => {
    const formatOption = FORMAT_OPTIONS.find(f => f.value === format);
    return formatOption?.icon || <Type size={16} />;
  };

  // Get format label
  const getFormatLabel = (format: AttributeFormat) => {
    const formatOption = FORMAT_OPTIONS.find(f => f.value === format);
    return formatOption?.label || format;
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        {/* Type Filter */}
        <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl">
          {(['all', 'STANDARD', 'CUSTOM'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type === 'all' ? 'All' : type === 'STANDARD' ? 'Standard' : 'Custom'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search attributes..."
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
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Plus size={20} className="text-primary-300" />
          New Attribute
        </button>
      </div>

      {/* Attributes List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-slate-500 mt-4">Loading attributes...</p>
          </div>
        ) : filteredAttributes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <List size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No attributes found</p>
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
          <>
            {/* Standard Attributes Section */}
            {(filterType === 'all' || filterType === 'STANDARD') && standardAttributes.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Lock size={16} className="text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Standard Attributes</h3>
                  <span className="text-xs text-slate-400 font-medium ml-2">({standardAttributes.length})</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {standardAttributes.map((attr) => (
                    <AttributeRow
                      key={attr.code}
                      attribute={attr}
                      onEdit={() => handleEditClick(attr)}
                      onDelete={() => handleDeleteClick(attr)}
                      getFormatIcon={getFormatIcon}
                      getFormatLabel={getFormatLabel}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Custom Attributes Section */}
            {(filterType === 'all' || filterType === 'CUSTOM') && customAttributes.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-primary-50 border-b border-primary-100 flex items-center gap-2">
                  <Edit3 size={16} className="text-primary-500" />
                  <h3 className="text-sm font-bold text-primary-700 uppercase tracking-wider">Custom Attributes</h3>
                  <span className="text-xs text-primary-400 font-medium ml-2">({customAttributes.length})</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {customAttributes.map((attr) => (
                    <AttributeRow
                      key={attr.code}
                      attribute={attr}
                      onEdit={() => handleEditClick(attr)}
                      onDelete={() => handleDeleteClick(attr)}
                      getFormatIcon={getFormatIcon}
                      getFormatLabel={getFormatLabel}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingAttribute ? 'Edit Attribute' : 'New Custom Attribute'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Code Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Attribute Code
                  {!editingAttribute && (
                    <span className="text-slate-400 font-normal ml-2">(will be prefixed with c_)</span>
                  )}
                </label>
                {editingAttribute ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-2xl">
                    <Lock size={16} className="text-slate-400" />
                    <span className="font-mono font-bold text-slate-600">{editingAttribute.code}</span>
                    <span className="text-xs text-slate-400 ml-auto">Code cannot be changed</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-200 rounded-l-2xl text-sm font-mono font-bold text-slate-500 border border-r-0 border-slate-200">
                      c_
                    </span>
                    <input
                      type="text"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="attribute_name"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-r-2xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                )}
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  placeholder="e.g., Loyalty Tier"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>

              {/* Data Format */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Data Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FORMAT_OPTIONS.map((format) => (
                    <button
                      key={format.value}
                      type="button"
                      onClick={() => {
                        setFormFormat(format.value);
                        // Clear options if switching away from SELECT/MULTISELECT
                        if (format.value !== 'SELECT' && format.value !== 'MULTISELECT') {
                          setFormOptions([]);
                        }
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                        formFormat === format.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`${formFormat === format.value ? 'text-primary-600' : 'text-slate-400'}`}>
                        {format.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${formFormat === format.value ? 'text-primary-700' : 'text-slate-700'}`}>
                          {format.label}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options for SELECT/MULTISELECT */}
              {(formFormat === 'SELECT' || formFormat === 'MULTISELECT') && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Options
                    <span className="text-slate-400 font-normal ml-2">(at least 1 required)</span>
                  </label>
                  <div className="space-y-2">
                    {formOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                            placeholder="Label"
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => handleUpdateOption(index, 'value', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="value"
                            className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-100"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="w-full px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:border-primary-300 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              {/* Validation Rules */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Validation Rules
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setFormIsRequired(!formIsRequired)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                      formIsRequired
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      formIsRequired ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                    }`}>
                      {formIsRequired && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm font-bold">Required</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormIsUnique(!formIsUnique)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                      formIsUnique
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      formIsUnique ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                    }`}>
                      {formIsUnique && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm font-bold">Unique</span>
                  </button>
                </div>
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
                      {editingAttribute ? 'Update' : 'Create Attribute'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && attributeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Attribute?</h2>
              <p className="text-slate-500 mb-2">
                Are you sure you want to delete <span className="font-mono font-bold">{attributeToDelete.code}</span>?
              </p>
              <p className="text-sm text-amber-600 bg-amber-50 rounded-xl p-3 mb-6">
                This may affect customer profiles using this attribute.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setAttributeToDelete(null);
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

// Attribute Row Component
interface AttributeRowProps {
  attribute: CustomerAttribute;
  onEdit: () => void;
  onDelete: () => void;
  getFormatIcon: (format: AttributeFormat) => React.ReactNode;
  getFormatLabel: (format: AttributeFormat) => string;
}

const AttributeRow: React.FC<AttributeRowProps> = ({
  attribute,
  onEdit,
  onDelete,
  getFormatIcon,
  getFormatLabel,
}) => {
  const isStandard = attribute.type === 'STANDARD';

  return (
    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isStandard ? 'bg-slate-100 text-slate-500' : 'bg-primary-100 text-primary-600'
      }`}>
        {getFormatIcon(attribute.format)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-slate-900 truncate">{attribute.displayName}</p>
          {attribute.isRequired && (
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Required</span>
          )}
          {attribute.isUnique && (
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Unique</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="font-mono text-xs text-slate-500">{attribute.code}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500">{getFormatLabel(attribute.format)}</span>
          {attribute.options && attribute.options.length > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400">{attribute.options.length} options</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
          title="Edit"
        >
          <Edit3 size={18} />
        </button>
        {!isStandard && (
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}
        {isStandard && (
          <div className="p-2 text-slate-300" title="Standard attributes cannot be deleted">
            <Lock size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAttributes;
