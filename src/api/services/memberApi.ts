/**
 * 会员 API 服务
 * 处理会员相关的所有 API 请求
 */

import { apiClient } from '../client';
import { ApiResponse, PaginatedData, QueryParams } from '../types';
import type {
  Member,
  AssetLog,
  PointPacket,
  PointsSummary,
  MemberCoupon,
  MemberCouponStatus,
  ManualRedemptionForm,
  ManualVoidForm,
} from '../../types';

// API 路径前缀
const BASE_PATH = '/members';

export const memberApi = {
  /**
   * 获取会员列表
   * @param params 查询参数（分页、搜索、状态筛选等）
   */
  async getMembers(params?: QueryParams): Promise<PaginatedData<Member>> {
    const response = await apiClient.get<ApiResponse<PaginatedData<Member>>>(BASE_PATH, { params });
    return response.data.data;
  },

  /**
   * 获取单个会员详情
   * @param id 会员ID
   */
  async getMemberById(id: string): Promise<Member> {
    const response = await apiClient.get<ApiResponse<Member>>(`${BASE_PATH}/${id}`);
    return response.data.data;
  },

  /**
   * 创建新会员
   * @param member 会员信息
   */
  async createMember(member: Partial<Member>): Promise<Member> {
    const response = await apiClient.post<ApiResponse<Member>>(BASE_PATH, member);
    return response.data.data;
  },

  /**
   * 更新会员信息
   * @param id 会员ID
   * @param updates 更新内容
   */
  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    const response = await apiClient.put<ApiResponse<Member>>(`${BASE_PATH}/${id}`, updates);
    return response.data.data;
  },

  /**
   * 删除会员
   * @param id 会员ID
   */
  async deleteMember(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
  },

  // ========== 积分相关 ==========

  /**
   * 获取会员积分汇总
   * @param memberId 会员ID
   */
  async getPointsSummary(memberId: string): Promise<PointsSummary> {
    const response = await apiClient.get<ApiResponse<PointsSummary>>(
      `${BASE_PATH}/${memberId}/points/summary`
    );
    return response.data.data;
  },

  /**
   * 获取会员积分包列表
   * @param memberId 会员ID
   */
  async getPointPackets(memberId: string): Promise<PointPacket[]> {
    const response = await apiClient.get<ApiResponse<PointPacket[]>>(
      `${BASE_PATH}/${memberId}/points/packets`
    );
    return response.data.data;
  },

  /**
   * 调整会员积分
   * @param memberId 会员ID
   * @param data 调整信息
   */
  async adjustPoints(
    memberId: string,
    data: { amount: number; reasonType: string; remark: string }
  ): Promise<Member> {
    const response = await apiClient.post<ApiResponse<Member>>(
      `${BASE_PATH}/${memberId}/points/adjust`,
      data
    );
    return response.data.data;
  },

  // ========== 等级相关 ==========

  /**
   * 变更会员等级
   * @param memberId 会员ID
   * @param data 变更信息
   */
  async changeTier(
    memberId: string,
    data: { newTier: string; reasonType: string; remark: string }
  ): Promise<Member> {
    const response = await apiClient.post<ApiResponse<Member>>(
      `${BASE_PATH}/${memberId}/tier/change`,
      data
    );
    return response.data.data;
  },

  // ========== 资产日志 ==========

  /**
   * 获取会员资产变动日志
   * @param memberId 会员ID
   * @param type 日志类型（point/tier）
   */
  async getAssetLogs(memberId: string, type?: 'point' | 'tier'): Promise<AssetLog[]> {
    const response = await apiClient.get<ApiResponse<AssetLog[]>>(
      `${BASE_PATH}/${memberId}/asset-logs`,
      { params: { type } }
    );
    return response.data.data;
  },

  // ========== 会员优惠券钱包 ==========

  /**
   * 获取会员优惠券列表
   * @param memberId 会员ID
   * @param status 优惠券状态筛选
   */
  async getMemberCoupons(memberId: string, status?: MemberCouponStatus): Promise<MemberCoupon[]> {
    const response = await apiClient.get<ApiResponse<MemberCoupon[]>>(
      `${BASE_PATH}/${memberId}/coupons`,
      { params: { status } }
    );
    return response.data.data;
  },

  /**
   * 获取单个会员优惠券详情
   * @param memberId 会员ID
   * @param couponId 优惠券ID
   */
  async getMemberCoupon(memberId: string, couponId: string): Promise<MemberCoupon> {
    const response = await apiClient.get<ApiResponse<MemberCoupon>>(
      `${BASE_PATH}/${memberId}/coupons/${couponId}`
    );
    return response.data.data;
  },

  /**
   * 手动核销会员优惠券
   * @param memberId 会员ID
   * @param couponId 优惠券ID
   * @param form 核销表单
   */
  async redeemCoupon(
    memberId: string,
    couponId: string,
    form: ManualRedemptionForm
  ): Promise<MemberCoupon> {
    const response = await apiClient.post<ApiResponse<MemberCoupon>>(
      `${BASE_PATH}/${memberId}/coupons/${couponId}/redeem`,
      form
    );
    return response.data.data;
  },

  /**
   * 手动作废会员优惠券
   * @param memberId 会员ID
   * @param couponId 优惠券ID
   * @param form 作废表单
   */
  async voidCoupon(
    memberId: string,
    couponId: string,
    form: ManualVoidForm
  ): Promise<MemberCoupon> {
    const response = await apiClient.post<ApiResponse<MemberCoupon>>(
      `${BASE_PATH}/${memberId}/coupons/${couponId}/void`,
      form
    );
    return response.data.data;
  },

  /**
   * 手动发放优惠券给会员
   * @param memberId 会员ID
   * @param couponTemplateId 优惠券模板ID
   */
  async issueCoupon(memberId: string, couponTemplateId: string): Promise<MemberCoupon> {
    const response = await apiClient.post<ApiResponse<MemberCoupon>>(
      `${BASE_PATH}/${memberId}/coupons/issue`,
      { couponTemplateId }
    );
    return response.data.data;
  },
};
