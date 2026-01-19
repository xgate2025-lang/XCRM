/**
 * Axios HTTP 客户端配置
 * 统一处理请求和响应，包含拦截器
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError, ResponseCode } from './types';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  // 后端 API 基础 URL，可通过环境变量配置
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求时间戳（用于调试）
    (config as InternalAxiosRequestConfig & { metadata?: { startTime: number } }).metadata = {
      startTime: Date.now(),
    };

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 计算请求耗时
    const config = response.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } };
    const duration = config.metadata ? Date.now() - config.metadata.startTime : 0;

    // 开发环境打印请求日志
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`, response.data);
    }

    const apiResponse = response.data;

    // 检查业务状态码
    if (apiResponse.code !== ResponseCode.OK) {
      // 业务逻辑错误，抛出 ApiError
      throw new ApiError(apiResponse.code, apiResponse.msg, apiResponse.data);
    }

    // 返回完整响应，让调用者可以访问 data
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // 计算请求耗时
    const config = error.config as InternalAxiosRequestConfig & { metadata?: { startTime: number } } | undefined;
    const duration = config?.metadata ? Date.now() - config.metadata.startTime : 0;

    // 开发环境打印错误日志
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${config?.method?.toUpperCase()} ${config?.url} - ${duration}ms`, error);
    }

    // 处理 HTTP 错误
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // 如果后端返回了标准格式的错误信息
      if (data && data.code && data.msg) {
        throw new ApiError(data.code, data.msg, data.data);
      }

      // 根据 HTTP 状态码生成错误信息
      switch (status) {
        case 401:
          // 清除 token 并重定向到登录页
          localStorage.removeItem('auth_token');
          throw new ApiError(ResponseCode.UNAUTHORIZED, '登录已过期，请重新登录');
        case 403:
          throw new ApiError(ResponseCode.FORBIDDEN, '没有权限执行此操作');
        case 404:
          throw new ApiError(ResponseCode.NOT_FOUND, '请求的资源不存在');
        case 422:
          throw new ApiError(ResponseCode.VALIDATION_ERROR, '请求参数验证失败');
        default:
          throw new ApiError(ResponseCode.SERVER_ERROR, `服务器错误 (${status})`);
      }
    }

    // 网络错误或超时
    if (error.code === 'ECONNABORTED') {
      throw new ApiError(ResponseCode.ERROR, '请求超时，请稍后重试');
    }

    throw new ApiError(ResponseCode.ERROR, '网络错误，请检查网络连接');
  }
);

// 辅助函数：设置认证 token
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// 辅助函数：清除认证 token
export function clearAuthToken(): void {
  localStorage.removeItem('auth_token');
}

export { apiClient };
