import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskClient } from '../packages/@igrp/client/src/client/task-client';
import { ApiClientConfig } from '../packages/@igrp/types/src/response';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('TaskClient', () => {
  let taskClient: TaskClient;
  const config: ApiClientConfig = {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  };

  beforeEach(() => {
    vi.clearAllMocks();
    taskClient = new TaskClient(config);
  });

  describe('getTaskById', () => {
    it('should get task by ID', async () => {
      const mockResponse = { id: '1', name: 'Task 1' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await taskClient.getTaskById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances/1',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('getTasks', () => {
    it('should get all tasks without filters', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Task 1' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await taskClient.getTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });

    it('should get tasks with filters', async () => {
      const filters = { assignee: 'user1', status: 'ACTIVE', page: 0, size: 10 };
      const mockResponse = {
        data: [{ id: '1', name: 'Task 1', status: 'ACTIVE' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await taskClient.getTasks(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances?assignee=user1&status=ACTIVE&page=0&size=10',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  describe('getTaskInstancesStatus', () => {
    it('should get task status options', async () => {
      const mockResponse = ['ACTIVE', 'COMPLETED', 'SUSPENDED'];
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await taskClient.getTaskInstancesStatus();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances/status',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });

  // Fix the claimTask test (around line 141):
  describe('claimTask', () => {
    it('should claim a task', async () => {
      const mockResponse = { success: true, message: 'Task claimed' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await taskClient.claimTask('task1', { user: 'user1' });
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances/task1/claim',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ user: 'user1' })
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });
  
  // Fix the unclaimTask test (around line 169):
  describe('unclaimTask', () => {
    it('should unclaim a task', async () => {
      const mockResponse = { success: true, message: 'Task unclaimed' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await taskClient.unclaimTask('task1', { user: 'john' });
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances/task1/unclaim',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ user: 'john' })
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });
  
  // Fix the assignTask test (around line 197):
  describe('assignTask', () => {
    it('should assign a task to user', async () => {
      const mockResponse = { success: true, message: 'Task assigned' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await taskClient.assignTask('task1', { user: 'jane' });
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances/task1/assign',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ user: 'jane' })
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });
  
  // Fix the unassignTask test (around line 225):
  describe('unassignTask', () => {
    it('should unassign a task', async () => {
      const mockResponse = { success: true, message: 'Task unassigned' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await taskClient.unassignTask('task1', { user: 'jane' });
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances/task1/unassign',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ user: 'jane' })
        })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });
  
  // Fix the getTasksByProcessInstance test (around line 316):
  describe('getTasksByProcessInstance', () => {
    it('should get tasks by process instance ID', async () => {
      const mockResponse = {
        data: [{ id: '1', processInstanceId: 'proc1' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await taskClient.getTasksByProcessInstance('proc1');
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances?processInstanceId=proc1',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({
        data: mockResponse,
        status: 200,
        statusText: undefined
      });
    });
  });
  
  // Fix the getTasksByUser test (around line 341):
  describe('getTasksByUser', () => {
    it('should get tasks by user ID', async () => {
      const mockResponse = {
        data: [{ id: '1', assignee: 'user1' }],
        totalElements: 1,
        totalPages: 1
      };
      
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify(mockResponse)),
        headers: new Headers({ 'content-type': 'application/json' })
      });
  
      const result = await taskClient.getTasksByUser('user1');
  
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/tasks-instances?user=user1',
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