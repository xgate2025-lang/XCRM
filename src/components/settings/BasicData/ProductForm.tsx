import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ProductConfig, ProductStatus, CategoryConfig, BrandConfig } from '../../../types';
import { basicDataService } from '../../../lib/services/mock/MockBasicDataService';

interface ProductFormProps {
    product?: ProductConfig | null;
    onSave: (product: Omit<ProductConfig, 'createdAt' | 'updatedAt'>) => Promise<void>;
    onCancel: () => void;
}

const PRODUCT_STATUSES: { value: ProductStatus; label: string }[] = [
    { value: ProductStatus.ON_SHELF, label: 'On Shelf' },
    { value: ProductStatus.OFF_SHELF, label: 'Off Shelf' },
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
    const isEditMode = !!product;

    const [categories, setCategories] = useState<CategoryConfig[]>([]);
    const [brands, setBrands] = useState<BrandConfig[]>([]);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        price: 0,
        categoryId: '',
        brandId: '',
        images: [] as string[],
        description: '',
        status: ProductStatus.ON_SHELF,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const [cats, brs] = await Promise.all([
                basicDataService.getCategories(),
                basicDataService.getBrands(),
            ]);
            setCategories(cats);
            setBrands(brs);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                sku: product.sku,
                name: product.name,
                price: product.price,
                categoryId: product.categoryId,
                brandId: product.brandId,
                images: product.images || [],
                description: product.description || '',
                status: product.status,
            });
        }
    }, [product]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.name.trim()) newErrors.name = 'Product Name is required';
        if (formData.price < 0) newErrors.price = 'Price must be >= 0';
        if (!formData.categoryId) newErrors.categoryId = 'Category is required';
        if (!formData.brandId) newErrors.brandId = 'Brand is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, reader.result as string],
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSave({
                sku: formData.sku.trim(),
                name: formData.name.trim(),
                price: formData.price,
                categoryId: formData.categoryId,
                brandId: formData.brandId,
                images: formData.images.length > 0 ? formData.images : undefined,
                description: formData.description.trim() || undefined,
                status: formData.status,
            });
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to save product' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {isEditMode ? 'Edit Product' : 'Add Product'}
                    </h2>
                    <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                SKU <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                disabled={isEditMode}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.sku ? 'border-red-300' : 'border-slate-300'} ${isEditMode ? 'bg-slate-100' : ''} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                                placeholder="e.g., P-001"
                            />
                            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-300' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                                placeholder="e.g., Running Shoes"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.price ? 'border-red-300' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => handleChange('categoryId', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.categoryId ? 'border-red-300' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Brand <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.brandId}
                                onChange={(e) => handleChange('brandId', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.brandId ? 'border-red-300' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                            >
                                <option value="">Select Brand</option>
                                {brands.map((br) => (
                                    <option key={br.id} value={br.id}>{br.name}</option>
                                ))}
                            </select>
                            {errors.brandId && <p className="text-red-500 text-xs mt-1">{errors.brandId}</p>}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {PRODUCT_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Images</label>
                        <div className="flex flex-wrap gap-3">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50">
                                <Plus size={20} className="text-slate-400" />
                                <span className="text-xs text-slate-400">Add</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Description (Rich Text) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <div className="border border-slate-300 rounded-lg overflow-hidden">
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => handleChange('description', value)}
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline'],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        ['clean'],
                                    ],
                                }}
                                className="bg-white"
                                style={{ minHeight: '150px' }}
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

export default ProductForm;
