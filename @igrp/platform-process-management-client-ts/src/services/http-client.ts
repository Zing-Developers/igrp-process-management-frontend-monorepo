// http-client.ts
import { PostResponse } from '@igrp/platform-process-management-types';
import { apiConfig } from '../config/api.config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  endpoint: string,
  method: HttpMethod,
  body?: any,
  retries = 1,
  delay = 1000
): Promise<T> {
  const url = `${apiConfig.baseUrl}/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, delay));
      return request<T>(endpoint, method, body, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const httpClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, 'GET'),
  post: <T>(endpoint: string, body: any) => request<T>(endpoint, 'POST', body),
  put: <T>(endpoint: string, body: any) => request<T>(endpoint, 'PUT', body),
  delete: <T>(endpoint: string) => request<T>(endpoint, 'DELETE'),
};

export const post = async (
  endpoint: string,
  body: any
): Promise<PostResponse> => {
  try {
    const response = await httpClient.post<PostResponse>(endpoint, body);
    return response;
  } catch (error: any) {
    console.error(`Error posting to ${endpoint}:`, error);
    return {
      code: '500',
      message: error.message,
    };
  }
};
