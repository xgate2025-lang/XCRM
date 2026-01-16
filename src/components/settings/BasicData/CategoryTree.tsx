import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown, Folder, FolderOpen, Loader2, Upload } from 'lucide-react';
import { CategoryConfig } from '../../../types';
import { basicDataService } from '../../../lib/services/mock/MockBasicDataService';
import ImportWizard from './ImportWizard';

interface CategoryFormData {
    code: string;
    name: string;
    parentId: string | null;
    icon?: string;
    sortOrder: number;
}

interface CategoryNodeProps {
    category: CategoryConfig;
    categories: CategoryConfig[];
    level: number;
    onEdit: (category: CategoryConfig) => void;
    onDelete: (id: string) => void;
    onAddChild: (parentId: string) => void;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
    category,
    categories,
    level,
    onEdit,
    onDelete,
    onAddChild,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const children = categories.filter((c) => c.parentId === category.id);
    const hasChildren = children.length > 0;

    return (
        <div>
            <div
                className={`flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg group`}
                style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
                {/* Expand/Collapse */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-0.5 rounded ${hasChildren ? 'text-slate-400 hover:text-slate-600' : 'invisible'}`}
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Icon */}
                {isExpanded && hasChildren ? (
                    <FolderOpen size={18} className="text-amber-500" />
                ) : (
                    <Folder size={18} className="text-slate-400" />
                )}

                {/* Name */}
                <span className="flex-1 text-sm font-medium text-slate-700">{category.name}</span>
                <span className="text-xs text-slate-400 font-mono">{category.code}</span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onAddChild(category.id)}
                        title="Add sub-category"
                        className="p-1 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded"
                    >
                        <Plus size={14} />
                    </button>
                    <button
                        onClick={() => onEdit(category)}
                        className="p-1 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div>
                    {children
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((child) => (
                            <CategoryNode
                                key={child.id}
                                category={child}
                                categories={categories}
                                level={level + 1}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAddChild={onAddChild}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

const CategoryTree: React.FC = () => {
    const [categories, setCategories] = useState<CategoryConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryConfig | null>(null);
    const [parentIdForNew, setParentIdForNew] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>({
        code: '',
        name: '',
        parentId: null,
        sortOrder: 0,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showImport, setShowImport] = useState(false);

    const loadCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await basicDataService.getCategories();
            setCategories(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleAdd = (parentId: string | null = null) => {
        setEditingCategory(null);
        setParentIdForNew(parentId);
        setFormData({
            code: '',
            name: '',
            parentId,
            sortOrder: categories.filter((c) => c.parentId === parentId).length + 1,
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleEdit = (category: CategoryConfig) => {
        setEditingCategory(category);
        setParentIdForNew(null);
        setFormData({
            code: category.code,
            name: category.name,
            parentId: category.parentId || null,
            icon: category.icon,
            sortOrder: category.sortOrder,
        });
        setFormErrors({});
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await basicDataService.deleteCategory(id);
            await loadCategories();
        } catch (err: any) {
            alert(err.message || 'Failed to delete category');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!formData.code.trim()) errors.code = 'Code is required';
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editingCategory) {
                await basicDataService.updateCategory(editingCategory.id, {
                    code: formData.code.trim(),
                    name: formData.name.trim(),
                    parentId: formData.parentId,
                    icon: formData.icon,
                    sortOrder: formData.sortOrder,
                });
            } else {
                await basicDataService.addCategory({
                    code: formData.code.trim(),
                    name: formData.name.trim(),
                    parentId: formData.parentId,
                    icon: formData.icon,
                    sortOrder: formData.sortOrder,
                });
            }
            setShowForm(false);
            await loadCategories();
        } catch (err: any) {
            setFormErrors({ submit: err.message || 'Failed to save category' });
        }
    };

    const rootCategories = categories.filter((c) => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">{error}</div>
                <button onClick={loadCategories} className="text-primary-500 hover:underline">
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-500">{categories.length} categories</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowImport(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        <Upload size={16} />
                        Import
                    </button>
                    <button
                        onClick={() => handleAdd(null)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all"
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Tree */}
            {rootCategories.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Folder size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No categories yet</p>
                    <p className="text-sm mt-1">Click "Add Category" to create your first category</p>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl p-3">
                    {rootCategories.map((cat) => (
                        <CategoryNode
                            key={cat.id}
                            category={cat}
                            categories={categories}
                            level={0}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAddChild={(parentId) => handleAdd(parentId)}
                        />
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {editingCategory ? 'Edit Category' : 'Add Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {formErrors.submit && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {formErrors.submit}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-bold ${formErrors.code ? 'border-red-300' : 'border-slate-100'
                                        } focus:outline-none focus:ring-2 focus:ring-primary-100`}
                                    placeholder="e.g., APPAREL"
                                />
                                {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-bold ${formErrors.name ? 'border-red-300' : 'border-slate-100'
                                        } focus:outline-none focus:ring-2 focus:ring-primary-100`}
                                    placeholder="e.g., Apparel"
                                />
                                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parent Category</label>
                                <select
                                    value={formData.parentId || ''}
                                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100"
                                >
                                    <option value="">No Parent (Root)</option>
                                    {categories
                                        .filter((c) => c.id !== editingCategory?.id)
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {showImport && (
                <ImportWizard
                    type="categories"
                    onClose={() => setShowImport(false)}
                    onComplete={() => {
                        setShowImport(false);
                        loadCategories();
                    }}
                />
            )}
        </div>
    );
};

export default CategoryTree;
