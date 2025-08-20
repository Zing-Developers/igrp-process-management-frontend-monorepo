import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AreaClient } from '../packages/@igrp/client/src/client/area-client';
import { ApiClientConfig } from '../packages/@igrp/types/src/response';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AreaClient', () => {
  let areaClient: AreaClient;
  const config: ApiClientConfig = {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  };

  beforeEach(() => {
    vi.clearAllMocks();
    areaClient = new AreaClient(config);
  });

  describe('getAreas', () => {
    it('should get all areas without filters', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Area 1', code: 'A1' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await areaClient.getAreas();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });

    it('should get areas with filters', async () => {
      const filters = { code: 'A1', status: 'ACTIVE', page: 0, size: 10 };
      const mockResponse = {
        data: [{ id: '1', name: 'Area 1', code: 'A1' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await areaClient.getAreas(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas?code=A1&status=ACTIVE&page=0&size=10',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('getAreaById', () => {
    it('should get area by ID', async () => {
      const mockResponse = { id: '1', name: 'Area 1', code: 'A1' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await areaClient.getAreaById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas/1',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('createArea', () => {
    it('should create a new area', async () => {
      const areaData = {
        name: 'New Area',
        code: 'NA',
        description: 'Test area',
        applicationBase: 'test-app'
      };
      const mockResponse = { id: '2', ...areaData };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await areaClient.createArea(areaData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(areaData)
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 201,
        statusText: undefined
      });
    });
  });

  describe('updateArea', () => {
    it('should update an existing area', async () => {
      const areaData = {
        name: 'Updated Area',
        code: 'A1',
        description: 'Updated description',
        applicationBase: 'test-app'
      };
      const mockResponse = { id: '1', ...areaData };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await areaClient.updateArea('1', areaData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(areaData)
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('deleteArea', () => {
    it('should delete an area', async () => {
      const mockResponse = { success: true, message: 'Area deleted' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await areaClient.deleteArea('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas/1',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('getAreaProcesses', () => {
    it('should get processes associated with an area', async () => {
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

      const result = await areaClient.getAreaProcesses('area1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas/area1/process-definitions',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('removeProcessFromArea', () => {
    it('should remove a process from an area', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
        text: vi.fn().mockResolvedValue(''),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await areaClient.removeProcessFromArea('area1', 'process1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/areas/area1/process-definitions/process1',
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(result).toEqual({
        data: {},  // Change this to empty object instead of empty string
        status: 204,
        statusText: undefined
      });
    });
  });
});

// Add missing method tests:
describe('getAreaStatus', () => {
  it('should get area status options', async () => {
    // ... test implementation
  });
});

describe('associateProcessToArea', () => {
  it('should associate a process to an area', async () => {
    // ... test implementation
  });
});