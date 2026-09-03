export type PostResponse = {
  code: string;
  message: string;
};

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty?: boolean;
}

// API Response wrapper types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// API Client Configuration
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  /** Resolve headers immediately before each request (for rotating bearer tokens). */
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
}
