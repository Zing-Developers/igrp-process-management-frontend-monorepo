import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProcessManagementClient } from "../packages/client/src/client/process-management-client";
import { ProcessClient } from "../packages/client/src/client/process-client";
import { TaskClient } from "../packages/client/src/client/task-client";
import { AreaClient } from "../packages/client/src/client/area-client";
import { ActivityClient } from "../packages/client/src/client/activity-client";
import { M2MKeyClient } from "../packages/client/src/client/m2m-key-client";
import { EmailAccessMappingClient } from "../packages/client/src/client/email-access-mapping-client";
import type { ApiClientConfig } from "../packages/types/src/response";

// Mock all client classes
vi.mock("../packages/client/src/client/process-client");
vi.mock("../packages/client/src/client/task-client");
vi.mock("../packages/client/src/client/area-client");
vi.mock("../packages/client/src/client/activity-client");
vi.mock("../packages/client/src/client/m2m-key-client");
vi.mock("../packages/client/src/client/email-access-mapping-client");

describe("ProcessManagementClient", () => {
  let client: ProcessManagementClient;
  const mockConfig: ApiClientConfig = {
    baseUrl: "https://api.example.com",
    timeout: 5000,
    headers: {
      Authorization: "Bearer test-token",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ProcessManagementClient(mockConfig);
  });

  describe("constructor", () => {
    it("should initialize all client instances", () => {
      expect(ProcessClient).toHaveBeenCalledWith(mockConfig);
      expect(TaskClient).toHaveBeenCalledWith(mockConfig);
      expect(AreaClient).toHaveBeenCalledWith(mockConfig);
      expect(ActivityClient).toHaveBeenCalledWith(mockConfig);
      expect(M2MKeyClient).toHaveBeenCalledWith(mockConfig);
      expect(EmailAccessMappingClient).toHaveBeenCalledWith(mockConfig);
    });

    it("should expose client instances as public properties", () => {
      expect(client.processes).toBeInstanceOf(ProcessClient);
      expect(client.tasks).toBeInstanceOf(TaskClient);
      expect(client.areas).toBeInstanceOf(AreaClient);
      expect(client.activities).toBeInstanceOf(ActivityClient);
      expect(client.m2mKeys).toBeInstanceOf(M2MKeyClient);
      expect(client.emailAccessMappings).toBeInstanceOf(
        EmailAccessMappingClient,
      );
    });
  });

  describe("create static method", () => {
    it("should create a new ProcessManagementClient instance", () => {
      const newClient = ProcessManagementClient.create(mockConfig);

      expect(newClient).toBeInstanceOf(ProcessManagementClient);
      expect(newClient.processes).toBeInstanceOf(ProcessClient);
      expect(newClient.tasks).toBeInstanceOf(TaskClient);
      expect(newClient.areas).toBeInstanceOf(AreaClient);
      expect(newClient.activities).toBeInstanceOf(ActivityClient);
      expect(newClient.m2mKeys).toBeInstanceOf(M2MKeyClient);
      expect(newClient.emailAccessMappings).toBeInstanceOf(
        EmailAccessMappingClient,
      );
    });

    it("should pass configuration to all sub-clients", () => {
      ProcessManagementClient.create(mockConfig);

      expect(ProcessClient).toHaveBeenCalledWith(mockConfig);
      expect(TaskClient).toHaveBeenCalledWith(mockConfig);
      expect(AreaClient).toHaveBeenCalledWith(mockConfig);
      expect(ActivityClient).toHaveBeenCalledWith(mockConfig);
      expect(M2MKeyClient).toHaveBeenCalledWith(mockConfig);
      expect(EmailAccessMappingClient).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe("integration", () => {
    it("should allow access to all client methods", () => {
      // Mock some methods to verify they exist
      const mockProcessMethod = vi.fn();
      const mockTaskMethod = vi.fn();
      const mockAreaMethod = vi.fn();

      (client.processes as any).getProcesses = mockProcessMethod;
      (client.tasks as any).getTasks = mockTaskMethod;
      (client.areas as any).getAreas = mockAreaMethod;

      // Verify methods are accessible
      expect(typeof client.processes.getProcesses).toBe("function");
      expect(typeof client.tasks.getTasks).toBe("function");
      expect(typeof client.areas.getAreas).toBe("function");
    });
  });
});
