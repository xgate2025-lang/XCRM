import {
    StoreConfig,
    StoreStatus,
    StoreType,
    ProductConfig,
    ProductStatus,
    CategoryConfig,
    BrandConfig,
    IBasicDataService,
} from '../../../types';

// LocalStorage keys
const STORES_KEY = 'xcrm_stores';
const PRODUCTS_KEY = 'xcrm_products';
const CATEGORIES_KEY = 'xcrm_categories';
const BRANDS_KEY = 'xcrm_brands';

// --- Helper Functions ---

const loadFromStorage = <T>(key: string, initialData: T[]): T[] => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
    }
    // Initialize with default data
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
};

const saveToStorage = <T>(key: string, data: T[]): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

// --- Initial Seed Data ---

const INITIAL_STORES: StoreConfig[] = [
    {
        code: 'STR-001',
        name: 'Central Mall',
        type: StoreType.DIRECT,
        address: '123 Main St, Bangkok',
        contact: '+66 2 123 4567',
        businessHours: 'Mon-Fri 09:00-22:00',
        status: StoreStatus.ACTIVE,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

const INITIAL_CATEGORIES: CategoryConfig[] = [
    {
        id: 'cat-001',
        code: 'APPAREL',
        name: 'Apparel',
        parentId: null,
        sortOrder: 1,
        createdAt: '2024-01-01T00:00:00Z',
    },
];

const INITIAL_BRANDS: BrandConfig[] = [
    {
        id: 'brand-001',
        code: 'NIKE',
        name: 'Nike',
        sortOrder: 1,
        createdAt: '2024-01-01T00:00:00Z',
    },
];

const INITIAL_PRODUCTS: ProductConfig[] = [];

// --- Service Implementation ---

class MockBasicDataService implements IBasicDataService {
    // Store Methods
    async getStores(): Promise<StoreConfig[]> {
        return loadFromStorage<StoreConfig>(STORES_KEY, INITIAL_STORES);
    }

    async addStore(store: Omit<StoreConfig, 'createdAt' | 'updatedAt'>): Promise<StoreConfig> {
        const stores = await this.getStores();
        if (stores.some(s => s.code === store.code)) {
            throw new Error(`Store ${store.code} already exists`);
        }
        const now = new Date().toISOString();
        const newStore: StoreConfig = { ...store, createdAt: now, updatedAt: now };
        stores.push(newStore);
        saveToStorage(STORES_KEY, stores);
        return newStore;
    }

    async updateStore(code: string, updates: Partial<StoreConfig>): Promise<StoreConfig> {
        const stores = await this.getStores();
        const index = stores.findIndex(s => s.code === code);
        if (index === -1) throw new Error(`Store ${code} not found`);
        stores[index] = { ...stores[index], ...updates, updatedAt: new Date().toISOString() };
        saveToStorage(STORES_KEY, stores);
        return stores[index];
    }

    async deleteStore(code: string): Promise<void> {
        const stores = await this.getStores();
        const filtered = stores.filter(s => s.code !== code);
        saveToStorage(STORES_KEY, filtered);
    }

    // Product Methods (Shell - to be implemented in Phase 4)
    async getProducts(): Promise<ProductConfig[]> {
        return loadFromStorage<ProductConfig>(PRODUCTS_KEY, INITIAL_PRODUCTS);
    }

    async addProduct(product: Omit<ProductConfig, 'createdAt' | 'updatedAt'>): Promise<ProductConfig> {
        const products = await this.getProducts();
        if (products.some(p => p.sku === product.sku)) {
            throw new Error(`Product ${product.sku} already exists`);
        }
        const now = new Date().toISOString();
        const newProduct: ProductConfig = { ...product, createdAt: now, updatedAt: now };
        products.push(newProduct);
        saveToStorage(PRODUCTS_KEY, products);
        return newProduct;
    }

    async updateProduct(sku: string, updates: Partial<ProductConfig>): Promise<ProductConfig> {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.sku === sku);
        if (index === -1) throw new Error(`Product ${sku} not found`);
        products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
        saveToStorage(PRODUCTS_KEY, products);
        return products[index];
    }

    async deleteProduct(sku: string): Promise<void> {
        const products = await this.getProducts();
        const filtered = products.filter(p => p.sku !== sku);
        saveToStorage(PRODUCTS_KEY, filtered);
    }

    // Category Methods (Shell - to be implemented in Phase 3)
    async getCategories(): Promise<CategoryConfig[]> {
        return loadFromStorage<CategoryConfig>(CATEGORIES_KEY, INITIAL_CATEGORIES);
    }

    async addCategory(category: Omit<CategoryConfig, 'id' | 'createdAt'>): Promise<CategoryConfig> {
        const categories = await this.getCategories();
        if (categories.some(c => c.code === category.code)) {
            throw new Error(`Category ${category.code} already exists`);
        }
        const newCategory: CategoryConfig = {
            ...category,
            id: `cat-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        categories.push(newCategory);
        saveToStorage(CATEGORIES_KEY, categories);
        return newCategory;
    }

    async updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<CategoryConfig> {
        const categories = await this.getCategories();
        const index = categories.findIndex(c => c.id === id);
        if (index === -1) throw new Error(`Category ${id} not found`);
        categories[index] = { ...categories[index], ...updates };
        saveToStorage(CATEGORIES_KEY, categories);
        return categories[index];
    }

    async deleteCategory(id: string): Promise<void> {
        const categories = await this.getCategories();
        const products = await this.getProducts();
        // Block if has children or linked products
        if (categories.some(c => c.parentId === id)) {
            throw new Error('Cannot delete category with child categories');
        }
        if (products.some(p => p.categoryId === id)) {
            throw new Error('Cannot delete category with linked products');
        }
        const filtered = categories.filter(c => c.id !== id);
        saveToStorage(CATEGORIES_KEY, filtered);
    }

    // Brand Methods (Shell - to be implemented in Phase 3)
    async getBrands(): Promise<BrandConfig[]> {
        return loadFromStorage<BrandConfig>(BRANDS_KEY, INITIAL_BRANDS);
    }

    async addBrand(brand: Omit<BrandConfig, 'id' | 'createdAt'>): Promise<BrandConfig> {
        const brands = await this.getBrands();
        if (brands.some(b => b.code === brand.code)) {
            throw new Error(`Brand ${brand.code} already exists`);
        }
        const newBrand: BrandConfig = {
            ...brand,
            id: `brand-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        brands.push(newBrand);
        saveToStorage(BRANDS_KEY, brands);
        return newBrand;
    }

    async updateBrand(id: string, updates: Partial<BrandConfig>): Promise<BrandConfig> {
        const brands = await this.getBrands();
        const index = brands.findIndex(b => b.id === id);
        if (index === -1) throw new Error(`Brand ${id} not found`);
        brands[index] = { ...brands[index], ...updates };
        saveToStorage(BRANDS_KEY, brands);
        return brands[index];
    }

    async deleteBrand(id: string): Promise<void> {
        const brands = await this.getBrands();
        const products = await this.getProducts();
        if (products.some(p => p.brandId === id)) {
            throw new Error('Cannot delete brand with linked products');
        }
        const filtered = brands.filter(b => b.id !== id);
        saveToStorage(BRANDS_KEY, filtered);
    }

    // Import (Phase 5)
    async importData(data: {
        stores?: StoreConfig[];
        products?: ProductConfig[];
        categories?: CategoryConfig[];
        brands?: BrandConfig[];
    }): Promise<{ success: number; failed: number; errors: string[] }> {
        const errors: string[] = [];
        let success = 0;
        let failed = 0;

        // Import Stores
        if (data.stores && data.stores.length > 0) {
            const existingStores = await this.getStores();
            const existingCodes = new Set(existingStores.map((s) => s.code));
            const now = new Date().toISOString();

            for (const store of data.stores) {
                if (!store.code || !store.name) {
                    errors.push(`Store missing required fields (code/name)`);
                    failed++;
                    continue;
                }
                if (existingCodes.has(store.code)) {
                    errors.push(`Store ${store.code} already exists`);
                    failed++;
                    continue;
                }
                existingStores.push({
                    ...store,
                    createdAt: store.createdAt || now,
                    updatedAt: store.updatedAt || now,
                });
                existingCodes.add(store.code);
                success++;
            }
            saveToStorage(STORES_KEY, existingStores);
        }

        // Import Brands (before Categories/Products since they depend on brands)
        if (data.brands && data.brands.length > 0) {
            const existingBrands = await this.getBrands();
            const existingCodes = new Set(existingBrands.map((b) => b.code));
            const now = new Date().toISOString();

            for (const brand of data.brands) {
                if (!brand.code || !brand.name) {
                    errors.push(`Brand missing required fields (code/name)`);
                    failed++;
                    continue;
                }
                if (existingCodes.has(brand.code)) {
                    errors.push(`Brand ${brand.code} already exists`);
                    failed++;
                    continue;
                }
                existingBrands.push({
                    ...brand,
                    id: brand.id || `brand-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    createdAt: brand.createdAt || now,
                    sortOrder: brand.sortOrder || existingBrands.length + 1,
                });
                existingCodes.add(brand.code);
                success++;
            }
            saveToStorage(BRANDS_KEY, existingBrands);
        }

        // Import Categories
        if (data.categories && data.categories.length > 0) {
            const existingCategories = await this.getCategories();
            const existingCodes = new Set(existingCategories.map((c) => c.code));
            const now = new Date().toISOString();

            for (const category of data.categories) {
                if (!category.code || !category.name) {
                    errors.push(`Category missing required fields (code/name)`);
                    failed++;
                    continue;
                }
                if (existingCodes.has(category.code)) {
                    errors.push(`Category ${category.code} already exists`);
                    failed++;
                    continue;
                }
                existingCategories.push({
                    ...category,
                    id: category.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    createdAt: category.createdAt || now,
                    sortOrder: category.sortOrder || existingCategories.length + 1,
                });
                existingCodes.add(category.code);
                success++;
            }
            saveToStorage(CATEGORIES_KEY, existingCategories);
        }

        // Import Products
        if (data.products && data.products.length > 0) {
            const existingProducts = await this.getProducts();
            const existingSkus = new Set(existingProducts.map((p) => p.sku));
            const now = new Date().toISOString();

            for (const product of data.products) {
                if (!product.sku || !product.name) {
                    errors.push(`Product missing required fields (sku/name)`);
                    failed++;
                    continue;
                }
                if (existingSkus.has(product.sku)) {
                    errors.push(`Product ${product.sku} already exists`);
                    failed++;
                    continue;
                }
                existingProducts.push({
                    ...product,
                    createdAt: product.createdAt || now,
                    updatedAt: product.updatedAt || now,
                });
                existingSkus.add(product.sku);
                success++;
            }
            saveToStorage(PRODUCTS_KEY, existingProducts);
        }

        return { success, failed, errors };
    }
}

// Export singleton instance
export const basicDataService = new MockBasicDataService();
export default basicDataService;
