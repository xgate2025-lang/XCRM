/**
 * 仪表盘 API 服务
 * 处理仪表盘和分析相关的所有 API 请求
 */

import { apiClient } from '../client';
import { ApiResponse, DateRangeParams } from '../types';
import type { DashboardMetrics, DashboardConfiguration, TierMetric, MetricData } from '../../types';

// API 路径前缀
const BASE_PATH = '/dashboard';

export const dashboardApi = {
  /**
   * 获取仪表盘指标数据
   * @param params 查询参数（日期范围、门店范围）
   */
  async getMetrics(params?: {
    startDate?: string;
    endDate?: string;
    storeIds?: string[];
  }): Promise<DashboardMetrics> {
    const response = await apiClient.get<ApiResponse<DashboardMetrics>>(`${BASE_PATH}/metrics`, {
      params,
    });
    return response.data.data;
  },

  /**
   * 获取用户仪表盘配置
   */
  async getConfiguration(): Promise<DashboardConfiguration> {
    const response = await apiClient.get<ApiResponse<DashboardConfiguration>>(
      `${BASE_PATH}/configuration`
    );
    return response.data.data;
  },

  /**
   * 保存用户仪表盘配置
   * @param config 配置内容
   */
  async saveConfiguration(config: Partial<DashboardConfiguration>): Promise<DashboardConfiguration> {
    const response = await apiClient.put<ApiResponse<DashboardConfiguration>>(
      `${BASE_PATH}/configuration`,
      config
    );
    return response.data.data;
  },

  /**
   * 添加快捷操作
   * @param actionId 操作ID
   */
  async addQuickAction(actionId: string): Promise<DashboardConfiguration> {
    const response = await apiClient.post<ApiResponse<DashboardConfiguration>>(
      `${BASE_PATH}/configuration/quick-actions`,
      { actionId }
    );
    return response.data.data;
  },

  /**
   * 移除快捷操作
   * @param actionId 操作ID
   */
  async removeQuickAction(actionId: string): Promise<DashboardConfiguration> {
    const response = await apiClient.delete<ApiResponse<DashboardConfiguration>>(
      `${BASE_PATH}/configuration/quick-actions/${actionId}`
    );
    return response.data.data;
  },

  // ========== 会员洞察 ==========

  /**
   * 获取新会员数据
   * @param params 日期范围
   */
  async getNewMembersMetric(params?: DateRangeParams): Promise<MetricData> {
    const response = await apiClient.get<ApiResponse<MetricData>>(`${BASE_PATH}/insights/new-members`, {
      params,
    });
    return response.data.data;
  },

  /**
   * 获取首购转化率
   * @param params 日期范围
   */
  async getFirstPurchaseConversion(params?: DateRangeParams): Promise<MetricData> {
    const response = await apiClient.get<ApiResponse<MetricData>>(
      `${BASE_PATH}/insights/first-purchase-conversion`,
      { params }
    );
    return response.data.data;
  },

  /**
   * 获取复购率
   * @param params 日期范围
   */
  async getRepurchaseRate(params?: DateRangeParams): Promise<MetricData> {
    const response = await apiClient.get<ApiResponse<MetricData>>(
      `${BASE_PATH}/insights/repurchase-rate`,
      { params }
    );
    return response.data.data;
  },

  /**
   * 获取会员销售 GMV
   * @param params 日期范围
   */
  async getMemberSalesGMV(params?: DateRangeParams): Promise<MetricData> {
    const response = await apiClient.get<ApiResponse<MetricData>>(`${BASE_PATH}/insights/member-gmv`, {
      params,
    });
    return response.data.data;
  },

  /**
   * 获取会员 AOV（客单价）
   * @param params 日期范围
   */
  async getMemberAOV(params?: DateRangeParams): Promise<MetricData> {
    const response = await apiClient.get<ApiResponse<MetricData>>(`${BASE_PATH}/insights/member-aov`, {
      params,
    });
    return response.data.data;
  },

  // ========== 等级分布 ==========

  /**
   * 获取等级分布数据
   * @param params 日期范围
   */
  async getTierDistribution(params?: DateRangeParams): Promise<TierMetric[]> {
    const response = await apiClient.get<ApiResponse<TierMetric[]>>(
      `${BASE_PATH}/insights/tier-distribution`,
      { params }
    );
    return response.data.data;
  },

  // ========== 活动概览 ==========

  /**
   * 获取活动概览数据
   */
  async getCampaignOverview(): Promise<{
    activeCampaigns: number;
    totalParticipation: number;
    pointsRedemptionRate: number;
    couponsUsageRate: number;
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        activeCampaigns: number;
        totalParticipation: number;
        pointsRedemptionRate: number;
        couponsUsageRate: number;
      }>
    >(`${BASE_PATH}/campaigns/overview`);
    return response.data.data;
  },

  // ========== 趋势数据 ==========

  /**
   * 获取会员增长趋势
   * @param params 日期范围和粒度
   */
  async getMemberGrowthTrend(params?: DateRangeParams & { granularity?: 'day' | 'week' | 'month' }): Promise<
    { date: string; count: number }[]
  > {
    const response = await apiClient.get<ApiResponse<{ date: string; count: number }[]>>(
      `${BASE_PATH}/trends/member-growth`,
      { params }
    );
    return response.data.data;
  },

  /**
   * 获取销售趋势
   * @param params 日期范围和粒度
   */
  async getSalesTrend(params?: DateRangeParams & { granularity?: 'day' | 'week' | 'month' }): Promise<
    { date: string; amount: number }[]
  > {
    const response = await apiClient.get<ApiResponse<{ date: string; amount: number }[]>>(
      `${BASE_PATH}/trends/sales`,
      { params }
    );
    return response.data.data;
  },
};
