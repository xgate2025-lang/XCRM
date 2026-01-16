import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag, Loader2, Upload } from 'lucide-react';
import { BrandConfig } from '../../../types';
import { basicDataService } from '../../../lib/services/mock/MockBasicDataService';
import BrandForm from './BrandForm';
import ImportWizard from './ImportWizard';

const BrandList: React.FC = () => {
    const [brands, setBrands] = useState<BrandConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form Modal
    const [showForm, setShowForm] = useState(false);
    const [editingBrand, setEditingBrand] = useState<BrandConfig | null>(null);
    const [showImport, setShowImport] = useState(false);

    const loadBrands = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await basicDataService.getBrands();
            setBrands(data.sort((a, b) => a.sortOrder - b.sortOrder));
        } catch (err: any) {
            setError(err.message || 'Failed to load brands');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, []);

    const handleAdd = () => {
        setEditingBrand(null);
        setShowForm(true);
    };

    const handleEdit = (brand: BrandConfig) => {
        setEditingBrand(brand);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;
        try {
            await basicDataService.deleteBrand(id);
            await loadBrands();
        } catch (err: any) {
            alert(err.message || 'Failed to delete brand');
        }
    };

    const handleSave = async (brandData: Omit<BrandConfig, 'id' | 'createdAt'>) => {
        if (editingBrand) {
            await basicDataService.updateBrand(editingBrand.id, brandData);
        } else {
            await basicDataService.addBrand({
                ...brandData,
                sortOrder: brands.length + 1,
            });
        }
        setShowForm(false);
        setEditingBrand(null);
        await loadBrands();
    };

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
                <button onClick={loadBrands} className="text-primary-500 hover:underline">
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-500">{brands.length} brands</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowImport(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                        <Upload size={16} />
                        Import
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all"
                    >
                        <Plus size={16} />
                        Add Brand
                    </button>
                </div>
            </div>

            {/* Grid */}
            {brands.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Tag size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No brands yet</p>
                    <p className="text-sm mt-1">Click "Add Brand" to create your first brand</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-shadow group"
                        >
                            {/* Logo */}
                            <div className="w-full h-24 bg-slate-50 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                                {brand.logo ? (
                                    <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <Tag size={32} className="text-slate-300" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-slate-900 text-sm">{brand.name}</h3>
                                    <p className="text-xs text-slate-400 font-mono">{brand.code}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(brand)}
                                        className="p-1 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brand.id)}
                                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <BrandForm
                    brand={editingBrand}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingBrand(null);
                    }}
                />
            )}

            {/* Import Modal */}
            {showImport && (
                <ImportWizard
                    type="brands"
                    onClose={() => setShowImport(false)}
                    onComplete={() => {
                        setShowImport(false);
                        loadBrands();
                    }}
                />
            )}
        </div>
    );
};

export default BrandList;
