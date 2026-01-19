/**
 * API 响应类型定义
 * 统一的响应格式：{ code: string, msg: string, data: T }
 */

// 统一 API 响应格式
export interface ApiResponse<T = unknown> {
  code: string;
  msg: string;
  data: T;
}

// 响应状态码常量
export const ResponseCode = {
  OK: 'OK',
  ERROR: 'ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ResponseCodeType = (typeof ResponseCode)[keyof typeof ResponseCode];

// 分页请求参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应数据
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API 错误类
export class ApiError extends Error {
  code: string;
  data?: unknown;

  constructor(code: string, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }
}

// 日期范围查询参数
export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// 通用查询参数
export interface QueryParams extends PaginationParams, DateRangeParams {
  search?: string;
  status?: string;
  [key: string]: unknown;
}
