import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessClient } from '../packages/@igrp/client/src/client/process-client';
import { ApiClientConfig } from '../packages/@igrp/types/src/response';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ProcessClient', () => {
  let processClient: ProcessClient;
  const config: ApiClientConfig = {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  };

  beforeEach(() => {
    vi.clearAllMocks();
    processClient = new ProcessClient(config);
  });

  describe('getProcesses', () => {
    it('should get all processes without filters', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Process 1' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await processClient.getProcesses();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/process-definitions',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });

    // Remove the duplicate test case starting around line 215
    // Remove the orphaned test case around line 225
    // The file should end after the startProcess describe block
    
    // Also fix the getProcesses filter parameter:
    describe('getProcesses', () => {
      it('should get processes with filters', async () => {
        const filters = { processName: 'Test', applicationBase: 'test-app', page: 0, size: 10 };
        const mockResponse = {
          data: [{ id: '1', name: 'Process 1' }],
          totalElements: 1,
          totalPages: 1
        };
        
        mockFetch.mockResolvedValue({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
          headers: new Headers({ 'content-type': 'application/json' })
        });
    
        const result = await processClient.getProcesses(filters);
    
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/process-definitions?processName=Test&applicationBase=test-app&page=0&size=10',
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual({
          data: mockResponse,
          status: 200,
          statusText: undefined
        });
      });
    });
  });

  describe('getProcessById', () => {
    it('should get process by ID', async () => {
      const mockResponse = { id: '1', name: 'Process 1' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await processClient.getProcessById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/process-definitions/1',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('getProcessInstances', () => {
    it('should get process instances with filters', async () => {
      const filters = { procReleaseId: '1', status: 'RUNNING' as const };
      const mockResponse = {
        data: [{ id: '1', status: 'RUNNING' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await processClient.getProcessInstances(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/process-instances?procReleaseId=1&status=RUNNING',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('getProcessInstanceById', () => {
    it('should get process instance by ID', async () => {
      const mockResponse = { id: '1', status: 'RUNNING' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await processClient.getProcessInstanceById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/process-instances/1',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('startProcess', () => {
    it('should start a process without variables', async () => {
      const mockResponse = { id: '1', status: 'RUNNING' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await processClient.startProcess('proc-def-1', 'proc-key', 'test-app');
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/process-instances',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            processDefinitionId: 'proc-def-1',
            processKey: 'proc-key',
            applicationBase: 'test-app'
          })
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 201,
        statusText: undefined
      });
    });
  
    it('should start a process with variables', async () => {
      const variables = [{ name: 'var1', value: 'value1' }, { name: 'var2', value: 'value2' }];
      const mockResponse = { id: '1', status: 'RUNNING' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await processClient.startProcess('proc-def-1', 'proc-key', 'test-app', 'business-key', variables);
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/process-instances',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            processDefinitionId: 'proc-def-1',
            processKey: 'proc-key',
            applicationBase: 'test-app',
            businessKey: 'business-key',
            variables
          })
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 201,
        statusText: undefined
      });
    });
  });
  
  // Fix parameter names in getProcesses:
  // Change 'name' to 'processName'
  
  // Fix getProcessInstances parameters to match actual client:
  // Use: number, procReleaseKey, procReleaseId, status, searchTerms, applicationBase
  it('should get process instances with filters', async () => {
    const filters = { procReleaseId: '1', status: 'RUNNING' };
    const mockResponse = {
      data: [{ id: '1', status: 'RUNNING' }],
      totalElements: 1,
      totalPages: 1
    };
    
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
      headers: new Headers({ 'content-type': 'application/json' })
    });
  });
  
  describe('getProcessInstanceById', () => {
    it('should get process instance by ID', async () => {
      const mockResponse = { id: '1', status: 'RUNNING' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await processClient.getProcessInstanceById('1');
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/process-instances/1',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });
});