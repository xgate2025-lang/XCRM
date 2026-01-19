/**
 * API 模块统一入口
 * 提供 axios 实例配置和所有 API 服务的导出
 */

// HTTP 客户端
export { apiClient, setAuthToken, clearAuthToken } from './client';

// 类型定义
export * from './types';

// API 服务
export { memberApi } from './services/memberApi';
export { couponApi } from './services/couponApi';
export { campaignApi } from './services/campaignApi';
export { dashboardApi } from './services/dashboardApi';
export { settingsApi } from './services/settingsApi';
export { basicDataApi } from './services/basicDataApi';
