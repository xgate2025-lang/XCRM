import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { basicDataService } from '../../../lib/services/mock/MockBasicDataService';
import { StoreConfig, ProductConfig, CategoryConfig, BrandConfig, StoreType, StoreStatus, ProductStatus } from '../../../types';

type ImportType = 'stores' | 'products' | 'categories' | 'brands';

interface ImportWizardProps {
    type: ImportType;
    onClose: () => void;
    onComplete: () => void;
}

const TYPE_LABELS: Record<ImportType, string> = {
    stores: 'Stores',
    products: 'Products',
    categories: 'Categories',
    brands: 'Brands',
};

const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        rows.push(row);
    }
    return rows;
};

const mapToStore = (row: Record<string, string>): StoreConfig | null => {
    if (!row.code || !row.name) return null;
    return {
        code: row.code,
        name: row.name,
        type: (row.type?.toUpperCase() as StoreType) || StoreType.DIRECT,
        address: row.address,
        contact: row.contact,
        businessHours: row.business_hours,
        status: row.status?.toUpperCase() === 'DISABLED' ? StoreStatus.DISABLED : StoreStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

const mapToProduct = (row: Record<string, string>): ProductConfig | null => {
    if (!row.sku || !row.name) return null;
    return {
        sku: row.sku,
        name: row.name,
        price: parseFloat(row.price) || 0,
        categoryId: row.category_id || '',
        brandId: row.brand_id || '',
        description: row.description,
        status: row.status?.toUpperCase() === 'OFF_SHELF' ? ProductStatus.OFF_SHELF : ProductStatus.ON_SHELF,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

const mapToCategory = (row: Record<string, string>): CategoryConfig | null => {
    if (!row.code || !row.name) return null;
    return {
        id: row.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        code: row.code,
        name: row.name,
        parentId: row.parent_id || null,
        sortOrder: parseInt(row.sort_order) || 1,
        createdAt: new Date().toISOString(),
    };
};

const mapToBrand = (row: Record<string, string>): BrandConfig | null => {
    if (!row.code || !row.name) return null;
    return {
        id: row.id || `brand-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        code: row.code,
        name: row.name,
        logo: row.logo,
        sortOrder: parseInt(row.sort_order) || 1,
        createdAt: new Date().toISOString(),
    };
};

const ImportWizard: React.FC<ImportWizardProps> = ({ type, onClose, onComplete }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setIsImporting(true);
        try {
            const text = await file.text();
            const rows = parseCSV(text);

            let importData: {
                stores?: StoreConfig[];
                products?: ProductConfig[];
                categories?: CategoryConfig[];
                brands?: BrandConfig[];
            } = {};

            switch (type) {
                case 'stores':
                    importData.stores = rows.map(mapToStore).filter((s): s is StoreConfig => s !== null);
                    break;
                case 'products':
                    importData.products = rows.map(mapToProduct).filter((p): p is ProductConfig => p !== null);
                    break;
                case 'categories':
                    importData.categories = rows.map(mapToCategory).filter((c): c is CategoryConfig => c !== null);
                    break;
                case 'brands':
                    importData.brands = rows.map(mapToBrand).filter((b): b is BrandConfig => b !== null);
                    break;
            }

            const importResult = await basicDataService.importData(importData);
            setResult(importResult);

            if (importResult.success > 0) {
                setTimeout(() => {
                    onComplete();
                }, 2000);
            }
        } catch (error: any) {
            setResult({ success: 0, failed: 1, errors: [error.message || 'Import failed'] });
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Import {TYPE_LABELS[type]}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Instructions */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                        <p className="font-medium mb-1">CSV Format Required</p>
                        <p className="text-xs">
                            {type === 'stores' && 'Columns: code, name, type, address, contact, business_hours, status'}
                            {type === 'products' && 'Columns: sku, name, price, category_id, brand_id, description, status'}
                            {type === 'categories' && 'Columns: code, name, parent_id, sort_order'}
                            {type === 'brands' && 'Columns: code, name, logo, sort_order'}
                        </p>
                    </div>

                    {/* File Upload */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        {file ? (
                            <div className="flex items-center justify-center gap-2 text-primary-600">
                                <FileSpreadsheet size={24} />
                                <span className="font-medium">{file.name}</span>
                            </div>
                        ) : (
                            <>
                                <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                                <p className="text-slate-500">Click to select a CSV file</p>
                            </>
                        )}
                    </div>

                    {/* Result */}
                    {result && (
                        <div className={`mt-4 p-3 rounded-lg ${result.success > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {result.success > 0 ? (
                                    <CheckCircle2 size={18} className="text-green-600" />
                                ) : (
                                    <AlertCircle size={18} className="text-red-600" />
                                )}
                                <span className={`font-medium ${result.success > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {result.success} imported, {result.failed} failed
                                </span>
                            </div>
                            {result.errors.length > 0 && (
                                <ul className="text-xs text-red-600 space-y-1 max-h-24 overflow-auto">
                                    {result.errors.slice(0, 5).map((err, i) => (
                                        <li key={i}>• {err}</li>
                                    ))}
                                    {result.errors.length > 5 && <li>... and {result.errors.length - 5} more errors</li>}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!file || isImporting}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50"
                    >
                        {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {isImporting ? 'Importing...' : 'Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportWizard;
