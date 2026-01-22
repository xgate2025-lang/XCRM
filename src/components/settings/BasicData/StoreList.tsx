import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Filter, Store as StoreIcon, Loader2, Upload, ChevronDown } from 'lucide-react';
import { StoreConfig, StoreType, StoreStatus } from '../../../types';
import { basicDataService } from '../../../lib/services/mock/MockBasicDataService';
import { useOnboarding } from '../../../context/OnboardingContext';
import StoreForm from './StoreForm';
import ImportWizard from './ImportWizard';

const STORE_TYPE_LABELS: Record<StoreType, string> = {
    [StoreType.DIRECT]: 'Direct',
    [StoreType.FRANCHISE]: 'Franchise',
    [StoreType.PARTNER]: 'Partner',
};

const STATUS_STYLES: Record<StoreStatus, string> = {
    [StoreStatus.ACTIVE]: 'bg-green-100 text-green-700',
    [StoreStatus.DISABLED]: 'bg-slate-100 text-slate-500',
};

const StoreList: React.FC = () => {
    const [stores, setStores] = useState<StoreConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Onboarding context for marking Step 2 subtask complete
    const { toggleSubtask, state: onboardingState } = useOnboarding();

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<StoreType | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<StoreStatus | 'all'>('all');

    // Form Modal
    const [showForm, setShowForm] = useState(false);
    const [editingStore, setEditingStore] = useState<StoreConfig | null>(null);
    const [showImport, setShowImport] = useState(false);

    const loadStores = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await basicDataService.getStores();
            setStores(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load stores');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    const handleAdd = () => {
        setEditingStore(null);
        setShowForm(true);
    };

    const handleEdit = (store: StoreConfig) => {
        setEditingStore(store);
        setShowForm(true);
    };

    const handleDelete = async (code: string) => {
        if (!confirm('Are you sure you want to delete this store?')) return;
        try {
            await basicDataService.deleteStore(code);
            await loadStores();
        } catch (err: any) {
            alert(err.message || 'Failed to delete store');
        }
    };

    const handleSave = async (storeData: Omit<StoreConfig, 'createdAt' | 'updatedAt'>) => {
        const isAdding = !editingStore;
        if (editingStore) {
            await basicDataService.updateStore(editingStore.code, storeData);
        } else {
            await basicDataService.addStore(storeData);
        }
        setShowForm(false);
        setEditingStore(null);
        await loadStores();

        // Mark onboarding Step 2 "Import Store List" subtask as complete when adding a store
        if (isAdding && onboardingState && !onboardingState.missions.tier_method.subtasks[0].isDone) {
            await toggleSubtask('tier_method', 'import_stores', true);
        }
    };

    // Filtered data
    const filteredStores = stores.filter((store) => {
        const matchesSearch =
            store.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || store.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
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
                <button onClick={loadStores} className="text-primary-500 hover:underline">
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
                            placeholder="Search stores..."
                            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-100"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as StoreType | 'all')}
                            className="appearance-none pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            {Object.entries(STORE_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StoreStatus | 'all')}
                            className="appearance-none pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value={StoreStatus.ACTIVE}>Active</option>
                            <option value={StoreStatus.DISABLED}>Disabled</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                    </div>
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
                        Add Store
                    </button>
                </div>
            </div>

            {/* Table */}
            {filteredStores.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <StoreIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No stores found</p>
                    <p className="text-sm mt-1">Click "Add Store" to create your first store</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredStores.map((store) => (
                                <tr key={store.code} className={`hover:bg-slate-50 ${store.status === StoreStatus.DISABLED ? 'opacity-60' : ''}`}>
                                    <td className="px-4 py-3 font-mono text-xs">{store.code}</td>
                                    <td className="px-4 py-3 font-medium">{store.name}</td>
                                    <td className="px-4 py-3">{STORE_TYPE_LABELS[store.type]}</td>
                                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{store.address || '-'}</td>
                                    <td className="px-4 py-3 text-slate-500">{store.contact || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[store.status]}`}>
                                            {store.status === StoreStatus.ACTIVE ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(store)}
                                                className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(store.code)}
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
                <StoreForm
                    store={editingStore}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingStore(null);
                    }}
                />
            )}

            {/* Import Modal */}
            {showImport && (
                <ImportWizard
                    type="stores"
                    onClose={() => setShowImport(false)}
                    onComplete={async () => {
                        setShowImport(false);
                        await loadStores();
                        // Mark onboarding Step 2 "Import Store List" subtask as complete
                        if (onboardingState && !onboardingState.missions.tier_method.subtasks[0].isDone) {
                            await toggleSubtask('tier_method', 'import_stores', true);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default StoreList;
