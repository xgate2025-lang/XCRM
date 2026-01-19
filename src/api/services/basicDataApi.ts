/**
 * 基础数据 API 服务
 * 处理门店、商品、分类、品牌等基础数据的 API 请求
 */

import { apiClient } from '../client';
import { ApiResponse, PaginatedData, QueryParams } from '../types';
import type { StoreConfig, ProductConfig, CategoryConfig, BrandConfig } from '../../types';

// API 路径前缀
const BASE_PATH = '/basic-data';

export const basicDataApi = {
  // ========== 门店管理 ==========

  /**
   * 获取门店列表
   * @param params 查询参数
   */
  async getStores(params?: QueryParams): Promise<StoreConfig[]> {
    const response = await apiClient.get<ApiResponse<StoreConfig[]>>(`${BASE_PATH}/stores`, {
      params,
    });
    return response.data.data;
  },

  /**
   * 获取单个门店
   * @param code 门店代码
   */
  async getStoreByCode(code: string): Promise<StoreConfig> {
    const response = await apiClient.get<ApiResponse<StoreConfig>>(`${BASE_PATH}/stores/${code}`);
    return response.data.data;
  },

  /**
   * 添加门店
   * @param store 门店信息
   */
  async addStore(store: Omit<StoreConfig, 'createdAt' | 'updatedAt'>): Promise<StoreConfig> {
    const response = await apiClient.post<ApiResponse<StoreConfig>>(`${BASE_PATH}/stores`, store);
    return response.data.data;
  },

  /**
   * 更新门店
   * @param code 门店代码
   * @param updates 更新内容
   */
  async updateStore(code: string, updates: Partial<StoreConfig>): Promise<StoreConfig> {
    const response = await apiClient.patch<ApiResponse<StoreConfig>>(
      `${BASE_PATH}/stores/${code}`,
      updates
    );
    return response.data.data;
  },

  /**
   * 删除门店
   * @param code 门店代码
   */
  async deleteStore(code: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/stores/${code}`);
  },

  // ========== 商品管理 ==========

  /**
   * 获取商品列表
   * @param params 查询参数
   */
  async getProducts(params?: QueryParams): Promise<PaginatedData<ProductConfig>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<ProductConfig>>>(
      `${BASE_PATH}/products`,
      { params }
    );
    return response.data.data;
  },

  /**
   * 获取所有商品（不分页）
   */
  async getAllProducts(): Promise<ProductConfig[]> {
    const response = await apiClient.get<ApiResponse<ProductConfig[]>>(`${BASE_PATH}/products/all`);
    return response.data.data;
  },

  /**
   * 获取单个商品
   * @param sku 商品SKU
   */
  async getProductBySku(sku: string): Promise<ProductConfig> {
    const response = await apiClient.get<ApiResponse<ProductConfig>>(`${BASE_PATH}/products/${sku}`);
    return response.data.data;
  },

  /**
   * 添加商品
   * @param product 商品信息
   */
  async addProduct(product: Omit<ProductConfig, 'createdAt' | 'updatedAt'>): Promise<ProductConfig> {
    const response = await apiClient.post<ApiResponse<ProductConfig>>(
      `${BASE_PATH}/products`,
      product
    );
    return response.data.data;
  },

  /**
   * 更新商品
   * @param sku 商品SKU
   * @param updates 更新内容
   */
  async updateProduct(sku: string, updates: Partial<ProductConfig>): Promise<ProductConfig> {
    const response = await apiClient.patch<ApiResponse<ProductConfig>>(
      `${BASE_PATH}/products/${sku}`,
      updates
    );
    return response.data.data;
  },

  /**
   * 删除商品
   * @param sku 商品SKU
   */
  async deleteProduct(sku: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/products/${sku}`);
  },

  // ========== 分类管理 ==========

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<CategoryConfig[]> {
    const response = await apiClient.get<ApiResponse<CategoryConfig[]>>(`${BASE_PATH}/categories`);
    return response.data.data;
  },

  /**
   * 获取单个分类
   * @param id 分类ID
   */
  async getCategoryById(id: string): Promise<CategoryConfig> {
    const response = await apiClient.get<ApiResponse<CategoryConfig>>(
      `${BASE_PATH}/categories/${id}`
    );
    return response.data.data;
  },

  /**
   * 添加分类
   * @param category 分类信息
   */
  async addCategory(category: Omit<CategoryConfig, 'id' | 'createdAt'>): Promise<CategoryConfig> {
    const response = await apiClient.post<ApiResponse<CategoryConfig>>(
      `${BASE_PATH}/categories`,
      category
    );
    return response.data.data;
  },

  /**
   * 更新分类
   * @param id 分类ID
   * @param updates 更新内容
   */
  async updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<CategoryConfig> {
    const response = await apiClient.patch<ApiResponse<CategoryConfig>>(
      `${BASE_PATH}/categories/${id}`,
      updates
    );
    return response.data.data;
  },

  /**
   * 删除分类
   * @param id 分类ID
   */
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/categories/${id}`);
  },

  /**
   * 获取分类树形结构
   */
  async getCategoryTree(): Promise<(CategoryConfig & { children?: CategoryConfig[] })[]> {
    const response = await apiClient.get<
      ApiResponse<(CategoryConfig & { children?: CategoryConfig[] })[]>
    >(`${BASE_PATH}/categories/tree`);
    return response.data.data;
  },

  // ========== 品牌管理 ==========

  /**
   * 获取品牌列表
   */
  async getBrands(): Promise<BrandConfig[]> {
    const response = await apiClient.get<ApiResponse<BrandConfig[]>>(`${BASE_PATH}/brands`);
    return response.data.data;
  },

  /**
   * 获取单个品牌
   * @param id 品牌ID
   */
  async getBrandById(id: string): Promise<BrandConfig> {
    const response = await apiClient.get<ApiResponse<BrandConfig>>(`${BASE_PATH}/brands/${id}`);
    return response.data.data;
  },

  /**
   * 添加品牌
   * @param brand 品牌信息
   */
  async addBrand(brand: Omit<BrandConfig, 'id' | 'createdAt'>): Promise<BrandConfig> {
    const response = await apiClient.post<ApiResponse<BrandConfig>>(`${BASE_PATH}/brands`, brand);
    return response.data.data;
  },

  /**
   * 更新品牌
   * @param id 品牌ID
   * @param updates 更新内容
   */
  async updateBrand(id: string, updates: Partial<BrandConfig>): Promise<BrandConfig> {
    const response = await apiClient.patch<ApiResponse<BrandConfig>>(
      `${BASE_PATH}/brands/${id}`,
      updates
    );
    return response.data.data;
  },

  /**
   * 删除品牌
   * @param id 品牌ID
   */
  async deleteBrand(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/brands/${id}`);
  },

  // ========== 批量导入 ==========

  /**
   * 批量导入基础数据
   * @param data 导入数据
   */
  async importData(data: {
    stores?: StoreConfig[];
    products?: ProductConfig[];
    categories?: CategoryConfig[];
    brands?: BrandConfig[];
  }): Promise<{ success: number; failed: number; errors: string[] }> {
    const response = await apiClient.post<
      ApiResponse<{ success: number; failed: number; errors: string[] }>
    >(`${BASE_PATH}/import`, data);
    return response.data.data;
  },

  /**
   * 导出基础数据
   * @param types 要导出的数据类型
   */
  async exportData(types: ('stores' | 'products' | 'categories' | 'brands')[]): Promise<Blob> {
    const response = await apiClient.get(`${BASE_PATH}/export`, {
      params: { types: types.join(',') },
      responseType: 'blob',
    });
    return response.data;
  },
};
