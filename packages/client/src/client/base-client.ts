import type {
  ApiClientConfig,
  ApiResponse,
} from "@igrp/platform-process-management-types";

export class BaseApiClient {
  protected baseUrl: string;
  protected timeout: number;
  protected defaultHeaders: Record<string, string>;
  private readonly getHeaders?: ApiClientConfig["getHeaders"];

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.timeout = config.timeout ?? 30000;
    this.getHeaders = config.getHeaders;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };
  }

  protected async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown,
    params?: object,
  ): Promise<ApiResponse<T>> {
    // Build URL with query parameters if provided
    const queryString = params ? this.buildQueryString(params) : "";
    const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;

    /* console.debug("[API Request]", {
      url,
      method,
      headers: this.defaultHeaders,
      body,
      params,
    }); */

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const dynamicHeaders = (await this.getHeaders?.()) ?? {};
      const requestOptions: RequestInit = {
        method,
        headers: {
          ...this.defaultHeaders,
          ...dynamicHeaders,
        },
        signal: controller.signal,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      };

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      /* console.debug("[API Response]", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      }); */

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await this.parseResponse<T>(response);

      //console.debug("[API Response Data]", data);

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
    get: <T>(endpoint: string, params?: object) =>
      this.request<T>(endpoint, "GET", undefined, params),

    post: <T>(endpoint: string, body?: unknown, params?: object) =>
      this.request<T>(endpoint, "POST", body, params),

    put: <T>(endpoint: string, body?: unknown, params?: object) =>
      this.request<T>(endpoint, "PUT", body, params),

    delete: <T>(endpoint: string, body?: unknown, params?: object) =>
      this.request<T>(endpoint, "DELETE", body, params),
  };

  // Legacy methods for backward compatibility (now using httpClient internally)
  protected async get<T>(
    endpoint: string,
    params?: object,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.get<T>(endpoint, params);
  }

  protected async post<T>(
    endpoint: string,
    body?: unknown,
    params?: object,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.post<T>(endpoint, body, params);
  }

  protected async put<T>(
    endpoint: string,
    body?: unknown,
    params?: object,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.put<T>(endpoint, body, params);
  }

  protected async delete<T>(
    endpoint: string,
    body?: unknown,
    params?: object,
  ): Promise<ApiResponse<T>> {
    return this.httpClient.delete<T>(endpoint, body, params);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204 || response.status === 205) {
      return undefined as unknown as T;
    }

    const contentType = response.headers.get("content-type");

    if (contentType && /(^|[+/])json\b/i.test(contentType)) {
      const text = await response.text();
      if (!text.trim()) {
        return undefined as unknown as T;
      }
      return JSON.parse(text) as T;
    }

    // For non-JSON responses, return the text content
    const text = await response.text();
    if (!text) {
      return undefined as unknown as T;
    }
    return text as unknown as T;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorDetails: unknown;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && /(^|[+/])json\b/i.test(contentType)) {
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

  protected encodePath(value: string): string {
    return encodeURIComponent(value);
  }

  private buildQueryString(params: object): string {
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
  public details?: unknown;

  constructor(params: { message: string; status: number; details?: unknown }) {
    super(params.message);
    this.name = "ApiClientError";
    this.status = params.status;
    this.details = params.details;

    // Required to fix prototype chain issues when extending built-ins
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}
