/**
 * 系统设置 API 服务
 * 处理全局设置和集成设置相关的所有 API 请求
 */

import { apiClient } from '../client';
import { ApiResponse } from '../types';
import type {
  CurrencyConfig,
  CustomerAttribute,
  APIToken,
  OnboardingState,
  MissionId,
} from '../../types';

// API 路径前缀
const BASE_PATH = '/settings';

export const settingsApi = {
  // ========== 货币设置 ==========

  /**
   * 获取所有货币配置
   */
  async getCurrencies(): Promise<CurrencyConfig[]> {
    const response = await apiClient.get<ApiResponse<CurrencyConfig[]>>(`${BASE_PATH}/currencies`);
    return response.data.data;
  },

  /**
   * 添加货币
   * @param currency 货币信息
   */
  async addCurrency(currency: Omit<CurrencyConfig, 'createdAt' | 'updatedAt'>): Promise<CurrencyConfig> {
    const response = await apiClient.post<ApiResponse<CurrencyConfig>>(
      `${BASE_PATH}/currencies`,
      currency
    );
    return response.data.data;
  },

  /**
   * 更新货币汇率
   * @param code 货币代码
   * @param rate 新汇率
   */
  async updateCurrency(code: string, rate: number): Promise<CurrencyConfig> {
    const response = await apiClient.patch<ApiResponse<CurrencyConfig>>(
      `${BASE_PATH}/currencies/${code}`,
      { rate }
    );
    return response.data.data;
  },

  /**
   * 删除货币
   * @param code 货币代码
   */
  async deleteCurrency(code: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/currencies/${code}`);
  },

  /**
   * 设置默认货币
   * @param code 货币代码
   */
  async setDefaultCurrency(code: string): Promise<CurrencyConfig> {
    const response = await apiClient.post<ApiResponse<CurrencyConfig>>(
      `${BASE_PATH}/currencies/${code}/set-default`
    );
    return response.data.data;
  },

  // ========== 客户属性设置 ==========

  /**
   * 获取所有客户属性
   */
  async getAttributes(): Promise<CustomerAttribute[]> {
    const response = await apiClient.get<ApiResponse<CustomerAttribute[]>>(`${BASE_PATH}/attributes`);
    return response.data.data;
  },

  /**
   * 添加自定义属性
   * @param attribute 属性信息
   */
  async addAttribute(attribute: CustomerAttribute): Promise<CustomerAttribute> {
    const response = await apiClient.post<ApiResponse<CustomerAttribute>>(
      `${BASE_PATH}/attributes`,
      attribute
    );
    return response.data.data;
  },

  /**
   * 更新属性
   * @param code 属性代码
   * @param updates 更新内容
   */
  async updateAttribute(code: string, updates: Partial<CustomerAttribute>): Promise<CustomerAttribute> {
    const response = await apiClient.patch<ApiResponse<CustomerAttribute>>(
      `${BASE_PATH}/attributes/${code}`,
      updates
    );
    return response.data.data;
  },

  /**
   * 删除属性
   * @param code 属性代码
   */
  async deleteAttribute(code: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/attributes/${code}`);
  },

  // ========== API Token 管理（集成设置） ==========

  /**
   * 获取所有 API Token
   */
  async getTokens(): Promise<APIToken[]> {
    const response = await apiClient.get<ApiResponse<APIToken[]>>(`${BASE_PATH}/integration/tokens`);
    return response.data.data;
  },

  /**
   * 生成新的 API Token
   * @param name Token 名称
   */
  async generateToken(name: string): Promise<{ token: APIToken; fullToken: string }> {
    const response = await apiClient.post<ApiResponse<{ token: APIToken; fullToken: string }>>(
      `${BASE_PATH}/integration/tokens`,
      { name }
    );
    return response.data.data;
  },

  /**
   * 更新 Token 名称
   * @param id Token ID
   * @param newName 新名称
   */
  async updateTokenName(id: string, newName: string): Promise<APIToken> {
    const response = await apiClient.patch<ApiResponse<APIToken>>(
      `${BASE_PATH}/integration/tokens/${id}`,
      { name: newName }
    );
    return response.data.data;
  },

  /**
   * 吊销 Token
   * @param id Token ID
   */
  async revokeToken(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/integration/tokens/${id}`);
  },

  // ========== 引导流程 ==========

  /**
   * 获取引导状态
   */
  async getOnboardingState(): Promise<OnboardingState> {
    const response = await apiClient.get<ApiResponse<OnboardingState>>(`${BASE_PATH}/onboarding`);
    return response.data.data;
  },

  /**
   * 跳过引导任务
   * @param missionId 任务ID
   */
  async skipMission(missionId: MissionId): Promise<OnboardingState> {
    const response = await apiClient.post<ApiResponse<OnboardingState>>(
      `${BASE_PATH}/onboarding/missions/${missionId}/skip`
    );
    return response.data.data;
  },

  /**
   * 恢复引导任务
   * @param missionId 任务ID
   */
  async resumeMission(missionId: MissionId): Promise<OnboardingState> {
    const response = await apiClient.post<ApiResponse<OnboardingState>>(
      `${BASE_PATH}/onboarding/missions/${missionId}/resume`
    );
    return response.data.data;
  },

  /**
   * 关闭引导
   */
  async dismissOnboarding(): Promise<OnboardingState> {
    const response = await apiClient.post<ApiResponse<OnboardingState>>(
      `${BASE_PATH}/onboarding/dismiss`
    );
    return response.data.data;
  },

  /**
   * 重置引导状态
   */
  async resetOnboarding(): Promise<OnboardingState> {
    const response = await apiClient.post<ApiResponse<OnboardingState>>(
      `${BASE_PATH}/onboarding/reset`
    );
    return response.data.data;
  },

  /**
   * 切换子任务状态（调试用）
   * @param missionId 任务ID
   * @param subtaskId 子任务ID
   * @param isDone 是否完成
   */
  async debugToggleSubtask(
    missionId: MissionId,
    subtaskId: string,
    isDone: boolean
  ): Promise<OnboardingState> {
    const response = await apiClient.post<ApiResponse<OnboardingState>>(
      `${BASE_PATH}/onboarding/debug/toggle-subtask`,
      { missionId, subtaskId, isDone }
    );
    return response.data.data;
  },
};
