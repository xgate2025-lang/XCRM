import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package, Loader2, Upload } from 'lucide-react';
import { ProductConfig, ProductStatus, CategoryConfig, BrandConfig } from '../../../types';
import { basicDataService } from '../../../lib/services/mock/MockBasicDataService';
import ProductForm from './ProductForm';
import ImportWizard from './ImportWizard';

const STATUS_STYLES: Record<ProductStatus, string> = {
    [ProductStatus.ON_SHELF]: 'bg-green-100 text-green-700',
    [ProductStatus.OFF_SHELF]: 'bg-slate-100 text-slate-500',
};

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<ProductConfig[]>([]);
    const [categories, setCategories] = useState<CategoryConfig[]>([]);
    const [brands, setBrands] = useState<BrandConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [brandFilter, setBrandFilter] = useState<string>('all');

    // Form Modal
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductConfig | null>(null);
    const [showImport, setShowImport] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [prods, cats, brs] = await Promise.all([
                basicDataService.getProducts(),
                basicDataService.getCategories(),
                basicDataService.getBrands(),
            ]);
            setProducts(prods);
            setCategories(cats);
            setBrands(brs);
        } catch (err: any) {
            setError(err.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '-';
    const getBrandName = (id: string) => brands.find((b) => b.id === id)?.name || '-';

    const handleAdd = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEdit = (product: ProductConfig) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (sku: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await basicDataService.deleteProduct(sku);
            await loadData();
        } catch (err: any) {
            alert(err.message || 'Failed to delete product');
        }
    };

    const handleSave = async (productData: Omit<ProductConfig, 'createdAt' | 'updatedAt'>) => {
        if (editingProduct) {
            await basicDataService.updateProduct(editingProduct.sku, productData);
        } else {
            await basicDataService.addProduct(productData);
        }
        setShowForm(false);
        setEditingProduct(null);
        await loadData();
    };

    // Filtered data
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
        const matchesBrand = brandFilter === 'all' || product.brandId === brandFilter;
        return matchesSearch && matchesCategory && matchesBrand;
    });

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
                <button onClick={loadData} className="text-primary-500 hover:underline">
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Brand Filter */}
                    <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Brands</option>
                        {brands.map((br) => (
                            <option key={br.id} value={br.id}>{br.name}</option>
                        ))}
                    </select>
                </div>

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
                        Add Product
                    </button>
                </div>
            </div>

            {/* Table */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No products found</p>
                    <p className="text-sm mt-1">Click "Add Product" to create your first product</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Image</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.sku} className={`hover:bg-slate-50 ${product.status === ProductStatus.OFF_SHELF ? 'opacity-60' : ''}`}>
                                    <td className="px-4 py-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={16} className="text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                                    <td className="px-4 py-3 font-medium">{product.name}</td>
                                    <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-slate-500">{getCategoryName(product.categoryId)}</td>
                                    <td className="px-4 py-3 text-slate-500">{getBrandName(product.brandId)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[product.status]}`}>
                                            {product.status === ProductStatus.ON_SHELF ? 'On Shelf' : 'Off Shelf'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.sku)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                    }}
                />
            )}

            {/* Import Modal */}
            {showImport && (
                <ImportWizard
                    type="products"
                    onClose={() => setShowImport(false)}
                    onComplete={() => {
                        setShowImport(false);
                        loadData();
                    }}
                />
            )}
        </div>
    );
};

export default ProductList;
