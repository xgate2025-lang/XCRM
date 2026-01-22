import React, { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { BrandConfig } from '../../../types';

interface BrandFormProps {
    brand?: BrandConfig | null;
    onSave: (brand: Omit<BrandConfig, 'id' | 'createdAt'>) => Promise<void>;
    onCancel: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ brand, onSave, onCancel }) => {
    const isEditMode = !!brand;

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        logo: '',
        sortOrder: 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (brand) {
            setFormData({
                code: brand.code,
                name: brand.name,
                logo: brand.logo || '',
                sortOrder: brand.sortOrder,
            });
        }
    }, [brand]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.code.trim()) newErrors.code = 'Brand Code is required';
        if (!formData.name.trim()) newErrors.name = 'Brand Name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to Base64 for mock storage
        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({ ...prev, logo: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSave({
                code: formData.code.trim(),
                name: formData.name.trim(),
                logo: formData.logo || undefined,
                sortOrder: formData.sortOrder,
            });
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save brand' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {isEditMode ? 'Edit Brand' : 'Add Brand'}
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

                    {/* Logo Preview & Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                                {formData.logo ? (
                                    <img src={formData.logo} alt="Logo preview" className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-slate-400 text-xs">No logo</span>
                                )}
                            </div>
                            <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg cursor-pointer hover:bg-primary-100">
                                <Upload size={16} />
                                Upload
                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Brand Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Brand Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            disabled={isEditMode}
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.code ? 'border-red-300' : 'border-slate-300'
                                } ${isEditMode ? 'bg-slate-100 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-primary-100`}
                            placeholder="e.g., NIKE"
                        />
                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                    </div>

                    {/* Brand Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Brand Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-300' : 'border-slate-300'
                                } focus:outline-none focus:ring-2 focus:ring-primary-100`}
                            placeholder="e.g., Nike"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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

export default BrandForm;
