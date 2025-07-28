// http-client.ts
import { PostResponse } from '@igrp/platform-process-management-types';
import { apiConfig } from '../config/api.config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Check if we should use dummy data immediately (for development)
// Safe way to check environment variables in both Node.js and browser environments
const isDevelopment = (() => {
  try {
    // Try to access process.env (works in Node.js and Next.js with proper config)
    return typeof process !== 'undefined' && 
           (process.env.NODE_ENV === 'development' || 
            process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true');
  } catch {
    // Fallback for pure browser environments
    return false;
  }
})();

const USE_DUMMY_DATA_ONLY = isDevelopment;

async function request<T>(
  endpoint: string,
  method: HttpMethod,
  body?: any,
  retries = USE_DUMMY_DATA_ONLY ? 0 : 1,  // No retries in dev mode
  delay = USE_DUMMY_DATA_ONLY ? 0 : 100   // No delay in dev mode
): Promise<T> {
  // In development mode with dummy data flag, immediately use dummy data
  console.log("isDevelopment", isDevelopment);
  console.log("process.env.NODE_ENV"+process.env.NODE_ENV)
  if (USE_DUMMY_DATA_ONLY) {
    throw new Error('Development mode: using dummy data only');
  }

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
      return request<T>(endpoint, method, body, retries - 1, delay * 1.5);
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
