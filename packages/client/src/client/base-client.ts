import {
  ApiClientConfig,
  ApiResponse,
} from "@igrp/platform-process-management-types";

export class BaseApiClient {
  protected baseUrl: string;
  protected timeout: number;
  protected defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };
  }

  protected async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    // Build URL with query parameters if provided
    const queryString = params ? this.buildQueryString(params) : "";
    const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;

    console.debug("[API Request]", {
      url,
      method,
      headers: this.defaultHeaders,
      body,
      params,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
      },
      signal: controller.signal,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      console.debug("[API Response]", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await this.parseResponse<T>(response);

      console.debug("[API Response Data]", data);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      console.error("[API Error]", error);

      if (error instanceof ApiClientError) {
        throw error;
      }

      throw new ApiClientError({
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        status: 0,
        details: error,
      });
    }
  }

  // Simplified HTTP methods using the refactored request method
  protected httpClient = {
    get: <T>(endpoint: string, params?: Record<string, any>) =>
      this.request<T>(endpoint, "GET", undefined, params),

    post: <T>(endpoint: string, body?: any, params?: Record<string, any>) =>
      this.request<T>(endpoint, "POST", body, params),

    put: <T>(endpoint: string, body?: any, params?: Record<string, any>) =>
      this.request<T>(endpoint, "PUT", body, params),

    delete: <T>(endpoint: string, body?: any, params?: Record<string, any>) =>
      this.request<T>(endpoint, "DELETE", body, params),
  };

  // Legacy methods for backward compatibility (now using httpClient internally)
  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.get<T>(endpoint, params);
  }

  protected async post<T>(
    endpoint: string,
    body?: any,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.post<T>(endpoint, body, params);
  }

  protected async put<T>(
    endpoint: string,
    body?: any,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.put<T>(endpoint, body);
  }

  protected async delete<T>(
    endpoint: string,
    body?: any,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.delete<T>(endpoint, body);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      // Handle empty responses
      if (!text.trim()) {
        return {} as T;
      }
      return JSON.parse(text) as T;
    }

    // For non-JSON responses, return the text content
    const text = await response.text();
    return text as unknown as T;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorDetails: any;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorDetails = await response.json();
      } else {
        errorDetails = await response.text();
      }
    } catch {
      errorDetails = null;
    }

    throw new ApiClientError({
      message: `HTTP Error: ${response.status} ${response.statusText}`,
      status: response.status,
      details: errorDetails,
    });
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }
}

export class ApiClientError extends Error {
  public status: number;
  public details?: any;

  constructor(params: { message: string; status: number; details?: any }) {
    super(params.message);
    this.name = "ApiClientError";
    this.status = params.status;
    this.details = params.details;

    // Required to fix prototype chain issues when extending built-ins
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}
