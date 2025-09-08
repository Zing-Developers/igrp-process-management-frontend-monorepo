import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProcessManagementClient } from '../packages/@igrp/client/src/client/process-management-client';
import { ProcessClient } from '../packages/@igrp/client/src/client/process-client';
import { TaskClient } from '../packages/@igrp/client/src/client/task-client';
import { AreaClient } from '../packages/@igrp/client/src/client/area-client';
import type { ApiClientConfig } from '@igrp/platform-process-management-types';

// Mock all client classes
vi.mock('../packages/@igrp/client/src/client/process-client');
vi.mock('../packages/@igrp/client/src/client/task-client');
vi.mock('../packages/@igrp/client/src/client/area-client');

describe('ProcessManagementClient', () => {
  let client: ProcessManagementClient;
  const mockConfig: ApiClientConfig = {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
    headers: {
      'Authorization': 'Bearer test-token'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ProcessManagementClient(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize all client instances', () => {
      expect(ProcessClient).toHaveBeenCalledWith(mockConfig);
      expect(TaskClient).toHaveBeenCalledWith(mockConfig);
      expect(AreaClient).toHaveBeenCalledWith(mockConfig);
    });

    it('should expose client instances as public properties', () => {
      expect(client.processes).toBeInstanceOf(ProcessClient);
      expect(client.tasks).toBeInstanceOf(TaskClient);
      expect(client.areas).toBeInstanceOf(AreaClient);
    });
  });

  describe('create static method', () => {
    it('should create a new ProcessManagementClient instance', () => {
      const newClient = ProcessManagementClient.create(mockConfig);
      
      expect(newClient).toBeInstanceOf(ProcessManagementClient);
      expect(newClient.processes).toBeInstanceOf(ProcessClient);
      expect(newClient.tasks).toBeInstanceOf(TaskClient);
      expect(newClient.areas).toBeInstanceOf(AreaClient);
    });

    it('should pass configuration to all sub-clients', () => {
      ProcessManagementClient.create(mockConfig);
      
      expect(ProcessClient).toHaveBeenCalledWith(mockConfig);
      expect(TaskClient).toHaveBeenCalledWith(mockConfig);
      expect(AreaClient).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe('integration', () => {
    it('should allow access to all client methods', () => {
      // Mock some methods to verify they exist
      const mockProcessMethod = vi.fn();
      const mockTaskMethod = vi.fn();
      const mockAreaMethod = vi.fn();

      (client.processes as any).getProcesses = mockProcessMethod;
      (client.tasks as any).getTasks = mockTaskMethod;
      (client.areas as any).getAreas = mockAreaMethod;

      // Verify methods are accessible
      expect(typeof client.processes.getProcesses).toBe('function');
      expect(typeof client.tasks.getTasks).toBe('function');
      expect(typeof client.areas.getAreas).toBe('function');
    });
  });
});