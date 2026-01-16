import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { StoreConfig, StoreType, StoreStatus } from '../../../types';

interface StoreFormProps {
    store?: StoreConfig | null;
    onSave: (store: Omit<StoreConfig, 'createdAt' | 'updatedAt'>) => Promise<void>;
    onCancel: () => void;
}

const STORE_TYPES: { value: StoreType; label: string }[] = [
    { value: StoreType.DIRECT, label: 'Direct' },
    { value: StoreType.FRANCHISE, label: 'Franchise' },
    { value: StoreType.PARTNER, label: 'Partner' },
];

const STORE_STATUSES: { value: StoreStatus; label: string }[] = [
    { value: StoreStatus.ACTIVE, label: 'Active' },
    { value: StoreStatus.DISABLED, label: 'Disabled' },
];

const StoreForm: React.FC<StoreFormProps> = ({ store, onSave, onCancel }) => {
    const isEditMode = !!store;

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        type: StoreType.DIRECT,
        address: '',
        contact: '',
        businessHours: '',
        status: StoreStatus.ACTIVE,
        coordinates: { lat: 0, lng: 0 },
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (store) {
            setFormData({
                code: store.code,
                name: store.name,
                type: store.type,
                address: store.address || '',
                contact: store.contact || '',
                businessHours: store.businessHours || '',
                status: store.status,
                coordinates: store.coordinates || { lat: 0, lng: 0 },
            });
        }
    }, [store]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Store Code is required';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Store Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSave({
                code: formData.code.trim(),
                name: formData.name.trim(),
                type: formData.type,
                address: formData.address.trim() || undefined,
                contact: formData.contact.trim() || undefined,
                businessHours: formData.businessHours.trim() || undefined,
                status: formData.status,
                coordinates: formData.coordinates.lat !== 0 || formData.coordinates.lng !== 0
                    ? formData.coordinates
                    : undefined,
            });
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save store' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {isEditMode ? 'Edit Store' : 'Add Store'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Store Code */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Store Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value)}
                                disabled={isEditMode}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.code ? 'border-red-300' : 'border-slate-300'
                                    } ${isEditMode ? 'bg-slate-100 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                                placeholder="e.g., STR-001"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>

                        {/* Store Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Store Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-300' : 'border-slate-300'
                                    } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                                placeholder="e.g., Central Mall"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {STORE_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {STORE_STATUSES.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., 123 Main St, Bangkok"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
                            <input
                                type="text"
                                value={formData.contact}
                                onChange={(e) => handleChange('contact', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., +66 2 123 4567"
                            />
                        </div>

                        {/* Business Hours */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Business Hours</label>
                            <input
                                type="text"
                                value={formData.businessHours}
                                onChange={(e) => handleChange('businessHours', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., Mon-Fri 09:00-22:00"
                            />
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.coordinates.lat || ''}
                                onChange={(e) => handleChange('coordinates', { ...formData.coordinates, lat: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., 13.7563"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.coordinates.lng || ''}
                                onChange={(e) => handleChange('coordinates', { ...formData.coordinates, lng: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., 100.5018"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreForm;
