export enum StoreType {
    DIRECT = 'DIRECT',
    FRANCHISE = 'FRANCHISE',
    PARTNER = 'PARTNER',
}

export enum StoreStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface StoreConfig {
    code: string;
    name: string;
    type: StoreType;
    address?: string;
    contact?: string;
    businessHours?: string;
    coordinates?: Coordinates;
    status: StoreStatus;
    createdAt: string;
    updatedAt: string;
}

export enum ProductStatus {
    ON_SHELF = 'ON_SHELF',
    OFF_SHELF = 'OFF_SHELF',
}

export interface ProductConfig {
    sku: string;
    name: string;
    price: number;
    categoryId: string;
    brandId: string;
    images?: string[];
    description?: string;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryConfig {
    id: string;
    code: string;
    name: string;
    parentId?: string | null;
    icon?: string;
    sortOrder: number;
    createdAt: string;
}

export interface BrandConfig {
    id: string;
    code: string;
    name: string;
    logo?: string;
    sortOrder: number;
    createdAt: string;
}

export interface IBasicDataService {
    // Store
    getStores(): Promise<StoreConfig[]>;
    addStore(store: Omit<StoreConfig, 'createdAt' | 'updatedAt'>): Promise<StoreConfig>;
    updateStore(code: string, updates: Partial<StoreConfig>): Promise<StoreConfig>;
    deleteStore(code: string): Promise<void>;

    // Product
    getProducts(): Promise<ProductConfig[]>;
    addProduct(product: Omit<ProductConfig, 'createdAt' | 'updatedAt'>): Promise<ProductConfig>;
    updateProduct(sku: string, updates: Partial<ProductConfig>): Promise<ProductConfig>;
    deleteProduct(sku: string): Promise<void>; // Or disable

    // Category
    getCategories(): Promise<CategoryConfig[]>;
    addCategory(category: Omit<CategoryConfig, 'id' | 'createdAt'>): Promise<CategoryConfig>;
    updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<CategoryConfig>;
    deleteCategory(id: string): Promise<void>;

    // Brand
    getBrands(): Promise<BrandConfig[]>;
    addBrand(brand: Omit<BrandConfig, 'id' | 'createdAt'>): Promise<BrandConfig>;
    updateBrand(id: string, updates: Partial<BrandConfig>): Promise<BrandConfig>;
    deleteBrand(id: string): Promise<void>;

    // Import
    importData(data: {
        stores?: StoreConfig[];
        products?: ProductConfig[];
        categories?: CategoryConfig[];
        brands?: BrandConfig[];
    }): Promise<{ success: number; failed: number; errors: string[] }>;
}
