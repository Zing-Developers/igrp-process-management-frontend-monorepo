import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseApiClient, ApiClientError } from '../packages/@igrp/client/src/client/base-client';
import { ApiClientConfig } from '../packages/@igrp/types/src/response';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Create a test class that extends BaseApiClient to access protected methods
class TestApiClient extends BaseApiClient {
  // Expose protected methods for testing
  public testGet<T>(endpoint: string, params?: Record<string, any>) {
    return this.get<T>(endpoint, params);
  }

  public testPost<T>(endpoint: string, body?: any, params?: Record<string, any>) {
    return this.post<T>(endpoint, body, params);
  }

  public testPut<T>(endpoint: string, body?: any) {
    return this.put<T>(endpoint, body);
  }

  public testDelete<T>(endpoint: string, body?: any) {
    return this.delete<T>(endpoint, body);
  }

  public getHttpClient() {
    return this.httpClient;
  }
}

describe('BaseApiClient', () => {
  let client: TestApiClient;
  const config: ApiClientConfig = {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new TestApiClient(config);
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client['baseUrl']).toBe('https://api.example.com');
      expect(client['timeout']).toBe(5000);
      expect(client['defaultHeaders']).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
    });

    it('should remove trailing slash from baseUrl', () => {
      const clientWithSlash = new TestApiClient({
        baseUrl: 'https://api.example.com/',
        timeout: 5000
      });
      expect(clientWithSlash['baseUrl']).toBe('https://api.example.com');
    });

    it('should use default timeout if not provided', () => {
      const clientWithoutTimeout = new TestApiClient({
        baseUrl: 'https://api.example.com'
      });
      expect(clientWithoutTimeout['timeout']).toBe(30000);
    });
  });

  describe('HTTP methods', () => {
    const mockResponseData = { id: 1, name: 'Test' };

    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify({ data: mockResponseData })),
        headers: new Headers({ 'content-type': 'application/json' })
      });
    });

    describe('get', () => {
      it('should make GET request without parameters', async () => {
        const mockResponseData = { id: 1, name: 'Test' };
        
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
          headers: new Headers({ 'content-type': 'application/json' })
        });

        const result = await client.testGet('/test');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/test',
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            })
          })
        );
        // Expect the full ApiResponse format
        expect(result).toEqual({
          data: mockResponseData,
          status: 200,
          statusText: undefined
        });
      });

      it('should make GET request with query parameters', async () => {
        const params = { page: 1, size: 10 };
        await client.testGet('/test', params);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/test?page=1&size=10',
          expect.objectContaining({ method: 'GET' })
        );
      });
    });

    describe('post', () => {
      it('should make POST request with body', async () => {
        const mockResponseData = { id: 1, name: 'Test' };
        const requestBody = { name: 'Test' };
        
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
          headers: new Headers({ 'content-type': 'application/json' })
        });

        const result = await client.testPost('/test', requestBody);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/test',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(requestBody)
          })
        );
        expect(result).toEqual({
          data: mockResponseData,
          status: 200,
          statusText: undefined
        });
      });
    });

    describe('put', () => {
      it('should make PUT request with body', async () => {
        const mockResponseData = { id: 1, name: 'Test' };
        const requestBody = { name: 'Test' };
        
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
          headers: new Headers({ 'content-type': 'application/json' })
        });

        const result = await client.testPut('/test', requestBody);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/test',
          expect.objectContaining({ method: 'PUT' })
        );
        expect(result).toEqual({
          data: mockResponseData,
          status: 200,
          statusText: undefined
        });
      });
    });

    describe('delete', () => {
      it('should make DELETE request', async () => {
        const mockResponseData = { id: 1, name: 'Test' };
        
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
          headers: new Headers({ 'content-type': 'application/json' })
        });

        const result = await client.testDelete('/test');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/test',
          expect.objectContaining({ method: 'DELETE' })
        );
        expect(result).toEqual({
          data: mockResponseData,
          status: 200,
          statusText: undefined
        });
      });
    });
  });

  describe('httpClient', () => {
    const mockResponseData = { id: 1, name: 'Test' };

    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify({ data: mockResponseData })),
        headers: new Headers({ 'content-type': 'application/json' })
      });
    });

    describe('httpClient', () => {
      it('should have httpClient with all HTTP methods', () => {
        const httpClient = client.getHttpClient();
        expect(httpClient).toHaveProperty('get');
        expect(httpClient).toHaveProperty('post');
        expect(httpClient).toHaveProperty('put');
        expect(httpClient).toHaveProperty('delete');
      });

      it('should make requests through httpClient.get', async () => {
        const mockResponseData = { id: 1, name: 'Test' };
        
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
          headers: new Headers({ 'content-type': 'application/json' })
        });

        const httpClient = client.getHttpClient();
        const result = await httpClient.get('/test');

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/test',
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual({
          data: mockResponseData,
          status: 200,
          statusText: undefined
        });
      });

      it('should make requests through httpClient.post', async () => {
        const mockResponseData = { id: 1, name: 'Test' };
        const requestBody = { name: 'Test' };
        
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
          headers: new Headers({ 'content-type': 'application/json' })
        });

        const httpClient = client.getHttpClient();
        const result = await httpClient.post('/test', requestBody);

        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/test',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(requestBody)
          })
        );
        expect(result).toEqual({
          data: mockResponseData,
          status: 200,
          statusText: undefined
        });
      });
    });

    it('should make requests through httpClient.get', async () => {
      const httpClient = client.getHttpClient();
      const result = await httpClient.get('/test', { page: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test?page=1',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({ 
        data: { data: mockResponseData }, 
        status: 200, 
        statusText: undefined 
      });
    });

    it('should make requests through httpClient.post', async () => {
      const httpClient = client.getHttpClient();
      const body = { name: 'Test' };
      const result = await httpClient.post('/test', body);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body)
        })
      );
      expect(result).toEqual({ 
        data: { data: mockResponseData }, 
        status: 200, 
        statusText: undefined 
      });
    });
  });

  describe('error handling', () => {
    it('should throw ApiClientError for HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue(JSON.stringify({ message: 'Not found' })),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      await expect(client.testGet('/test')).rejects.toThrow(ApiClientError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(client.testGet('/test')).rejects.toThrow('Network error');
    });
  });
});

describe('ApiClientError', () => {
  it('should create error with message and status', () => {
    const error = new ApiClientError({
      message: 'Test error',
      status: 500
    });

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(500);
    expect(error).toBeInstanceOf(Error);
  });
});
