/**
 * 营销活动 API 服务
 * 处理营销活动相关的所有 API 请求
 */

import { apiClient } from '../client';
import { ApiResponse, PaginatedData, QueryParams } from '../types';
import type { Campaign, CampaignLog, CampaignStatus, AnalyticsSummary, QuickLookData } from '../../types';

// API 路径前缀
const BASE_PATH = '/campaigns';

export const campaignApi = {
  /**
   * 获取营销活动列表
   * @param params 查询参数（分页、状态筛选等）
   */
  async getCampaigns(params?: QueryParams): Promise<PaginatedData<Campaign>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<Campaign>>>(BASE_PATH, {
      params,
    });
    return response.data.data;
  },

  /**
   * 获取所有营销活动（不分页）
   */
  async getAllCampaigns(): Promise<Campaign[]> {
    const response = await apiClient.get<ApiResponse<Campaign[]>>(`${BASE_PATH}/all`);
    return response.data.data;
  },

  /**
   * 获取单个营销活动详情
   * @param id 活动ID
   */
  async getCampaignById(id: string): Promise<Campaign> {
    const response = await apiClient.get<ApiResponse<Campaign>>(`${BASE_PATH}/${id}`);
    return response.data.data;
  },

  /**
   * 创建营销活动
   * @param campaign 活动信息
   */
  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.post<ApiResponse<Campaign>>(BASE_PATH, campaign);
    return response.data.data;
  },

  /**
   * 更新营销活动
   * @param id 活动ID
   * @param updates 更新内容
   */
  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.put<ApiResponse<Campaign>>(`${BASE_PATH}/${id}`, updates);
    return response.data.data;
  },

  /**
   * 删除营销活动
   * @param id 活动ID
   */
  async deleteCampaign(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
  },

  /**
   * 更新营销活动状态
   * @param id 活动ID
   * @param status 新状态
   */
  async updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    const response = await apiClient.patch<ApiResponse<Campaign>>(`${BASE_PATH}/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  /**
   * 启动营销活动
   * @param id 活动ID
   */
  async startCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<ApiResponse<Campaign>>(`${BASE_PATH}/${id}/start`);
    return response.data.data;
  },

  /**
   * 暂停营销活动
   * @param id 活动ID
   */
  async pauseCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<ApiResponse<Campaign>>(`${BASE_PATH}/${id}/pause`);
    return response.data.data;
  },

  /**
   * 结束营销活动
   * @param id 活动ID
   */
  async endCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<ApiResponse<Campaign>>(`${BASE_PATH}/${id}/end`);
    return response.data.data;
  },

  /**
   * 复制营销活动
   * @param id 活动ID
   */
  async duplicateCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<ApiResponse<Campaign>>(`${BASE_PATH}/${id}/duplicate`);
    return response.data.data;
  },

  // ========== 活动日志 ==========

  /**
   * 获取活动参与日志
   * @param campaignId 活动ID
   * @param params 分页参数
   */
  async getCampaignLogs(
    campaignId: string,
    params?: QueryParams
  ): Promise<PaginatedData<CampaignLog>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<CampaignLog>>>(
      `${BASE_PATH}/${campaignId}/logs`,
      { params }
    );
    return response.data.data;
  },

  /**
   * 获取会员在特定活动的参与历史
   * @param campaignId 活动ID
   * @param memberId 会员ID
   */
  async getMemberCampaignHistory(
    campaignId: string,
    memberId: string
  ): Promise<{
    totalTriggers: number;
    totalRewards: number;
    logs: CampaignLog[];
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        totalTriggers: number;
        totalRewards: number;
        logs: CampaignLog[];
      }>
    >(`${BASE_PATH}/${campaignId}/members/${memberId}/history`);
    return response.data.data;
  },

  // ========== 活动分析 ==========

  /**
   * 获取活动分析汇总数据
   * @param campaignId 活动ID
   */
  async getAnalyticsSummary(campaignId: string): Promise<AnalyticsSummary> {
    const response = await apiClient.get<ApiResponse<AnalyticsSummary>>(
      `${BASE_PATH}/${campaignId}/analytics/summary`
    );
    return response.data.data;
  },

  /**
   * 获取活动快速预览数据
   * @param campaignId 活动ID
   */
  async getQuickLookData(campaignId: string): Promise<QuickLookData> {
    const response = await apiClient.get<ApiResponse<QuickLookData>>(
      `${BASE_PATH}/${campaignId}/quick-look`
    );
    return response.data.data;
  },

  /**
   * 获取活动图表数据
   * @param campaignId 活动ID
   * @param dateRange 日期范围
   */
  async getChartData(
    campaignId: string,
    dateRange?: { startDate: string; endDate: string }
  ): Promise<{ date: string; revenue?: number; cost: number; signups?: number }[]> {
    const response = await apiClient.get<
      ApiResponse<{ date: string; revenue?: number; cost: number; signups?: number }[]>
    >(`${BASE_PATH}/${campaignId}/analytics/chart`, {
      params: dateRange,
    });
    return response.data.data;
  },

  // ========== 活动种子数据（仅开发环境） ==========

  /**
   * 为活动生成模拟数据（开发用）
   * @param campaignId 活动ID
   */
  async seedCampaignData(campaignId: string): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${BASE_PATH}/${campaignId}/seed`);
  },

  /**
   * 重置活动数据（开发用）
   */
  async resetData(): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${BASE_PATH}/reset`);
  },
};
