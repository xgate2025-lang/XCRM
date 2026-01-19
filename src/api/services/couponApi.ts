/**
 * 优惠券 API 服务
 * 处理优惠券模板和优惠券相关的所有 API 请求
 */

import { apiClient } from '../client';
import { ApiResponse, PaginatedData, QueryParams } from '../types';
import type { Coupon, CouponStatus, CouponTemplate, CouponData } from '../../types';

// API 路径前缀
const BASE_PATH = '/coupons';

export const couponApi = {
  /**
   * 获取优惠券列表（带分页）
   * @param params 查询参数
   */
  async getCoupons(params?: QueryParams): Promise<PaginatedData<CouponData>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<CouponData>>>(BASE_PATH, {
      params,
    });
    return response.data.data;
  },

  /**
   * 获取所有优惠券（不分页）
   */
  async getAllCoupons(): Promise<Coupon[]> {
    const response = await apiClient.get<ApiResponse<Coupon[]>>(`${BASE_PATH}/all`);
    return response.data.data;
  },

  /**
   * 获取单个优惠券详情
   * @param id 优惠券ID
   */
  async getCouponById(id: string): Promise<Coupon> {
    const response = await apiClient.get<ApiResponse<Coupon>>(`${BASE_PATH}/${id}`);
    return response.data.data;
  },

  /**
   * 创建优惠券（保存为草稿）
   * @param coupon 优惠券信息
   */
  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const response = await apiClient.post<ApiResponse<Coupon>>(BASE_PATH, coupon);
    return response.data.data;
  },

  /**
   * 更新优惠券
   * @param id 优惠券ID
   * @param updates 更新内容
   */
  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const response = await apiClient.put<ApiResponse<Coupon>>(`${BASE_PATH}/${id}`, updates);
    return response.data.data;
  },

  /**
   * 删除优惠券
   * @param id 优惠券ID
   */
  async deleteCoupon(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
  },

  /**
   * 发布优惠券（从草稿变为上线）
   * @param id 优惠券ID
   */
  async publishCoupon(id: string): Promise<Coupon> {
    const response = await apiClient.post<ApiResponse<Coupon>>(`${BASE_PATH}/${id}/publish`);
    return response.data.data;
  },

  /**
   * 更新优惠券状态
   * @param id 优惠券ID
   * @param status 新状态
   */
  async updateCouponStatus(id: string, status: CouponStatus): Promise<Coupon> {
    const response = await apiClient.patch<ApiResponse<Coupon>>(`${BASE_PATH}/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  /**
   * 暂停优惠券
   * @param id 优惠券ID
   */
  async pauseCoupon(id: string): Promise<Coupon> {
    return this.updateCouponStatus(id, 'Paused');
  },

  /**
   * 恢复优惠券
   * @param id 优惠券ID
   */
  async resumeCoupon(id: string): Promise<Coupon> {
    return this.updateCouponStatus(id, 'Live');
  },

  /**
   * 复制优惠券
   * @param id 优惠券ID
   */
  async duplicateCoupon(id: string): Promise<Coupon> {
    const response = await apiClient.post<ApiResponse<Coupon>>(`${BASE_PATH}/${id}/duplicate`);
    return response.data.data;
  },

  // ========== 优惠券模板相关 ==========

  /**
   * 获取优惠券模板列表
   */
  async getTemplates(): Promise<CouponTemplate[]> {
    const response = await apiClient.get<ApiResponse<CouponTemplate[]>>(`${BASE_PATH}/templates`);
    return response.data.data;
  },

  /**
   * 获取单个优惠券模板
   * @param id 模板ID
   */
  async getTemplateById(id: string): Promise<CouponTemplate> {
    const response = await apiClient.get<ApiResponse<CouponTemplate>>(
      `${BASE_PATH}/templates/${id}`
    );
    return response.data.data;
  },

  /**
   * 创建优惠券模板
   * @param template 模板信息
   */
  async createTemplate(template: Partial<CouponTemplate>): Promise<CouponTemplate> {
    const response = await apiClient.post<ApiResponse<CouponTemplate>>(
      `${BASE_PATH}/templates`,
      template
    );
    return response.data.data;
  },

  /**
   * 更新优惠券模板
   * @param id 模板ID
   * @param updates 更新内容
   */
  async updateTemplate(id: string, updates: Partial<CouponTemplate>): Promise<CouponTemplate> {
    const response = await apiClient.put<ApiResponse<CouponTemplate>>(
      `${BASE_PATH}/templates/${id}`,
      updates
    );
    return response.data.data;
  },

  // ========== 草稿管理 ==========

  /**
   * 保存优惠券草稿
   * @param coupon 优惠券草稿数据
   */
  async saveDraft(coupon: Partial<Coupon>): Promise<Coupon> {
    const response = await apiClient.post<ApiResponse<Coupon>>(`${BASE_PATH}/draft`, coupon);
    return response.data.data;
  },

  /**
   * 获取当前用户的优惠券草稿
   */
  async loadDraft(): Promise<Coupon | null> {
    const response = await apiClient.get<ApiResponse<Coupon | null>>(`${BASE_PATH}/draft`);
    return response.data.data;
  },

  /**
   * 清除优惠券草稿
   */
  async clearDraft(): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/draft`);
  },

  // ========== 唯一码生成 ==========

  /**
   * 为优惠券批量生成唯一码
   * @param couponId 优惠券ID
   * @param count 生成数量
   */
  async generateUniqueCodes(couponId: string, count: number): Promise<string[]> {
    const response = await apiClient.post<ApiResponse<string[]>>(
      `${BASE_PATH}/${couponId}/codes/generate`,
      { count }
    );
    return response.data.data;
  },

  // ========== 统计相关 ==========

  /**
   * 获取优惠券使用统计
   * @param id 优惠券ID
   */
  async getCouponStats(id: string): Promise<{
    totalIssued: number;
    totalUsed: number;
    totalExpired: number;
    usageRate: number;
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        totalIssued: number;
        totalUsed: number;
        totalExpired: number;
        usageRate: number;
      }>
    >(`${BASE_PATH}/${id}/stats`);
    return response.data.data;
  },
};
