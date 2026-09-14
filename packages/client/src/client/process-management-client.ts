import type { ApiClientConfig } from "@irn/platform-process-management-types";
import { ProcessClient } from "./process-client.js";
import { TaskClient } from "./task-client.js";
import { AreaClient } from "./area-client.js";
import { ActivityClient } from "./activity-client.js";
import { M2MKeyClient } from "./m2m-key-client.js";
import { EmailAccessMappingClient } from "./email-access-mapping-client.js";

/**
 * Main Process Management API Client
 * Provides access to Process, Task, and Area management
 */
export class ProcessManagementClient {
  public readonly processes: ProcessClient;
  public readonly tasks: TaskClient;
  public readonly areas: AreaClient;
  public readonly activities: ActivityClient;
  public readonly m2mKeys: M2MKeyClient;
  public readonly emailAccessMappings: EmailAccessMappingClient;

  constructor(config: ApiClientConfig) {
    this.processes = new ProcessClient(config);
    this.tasks = new TaskClient(config);
    this.areas = new AreaClient(config);
    this.activities = new ActivityClient(config);
    this.m2mKeys = new M2MKeyClient(config);
    this.emailAccessMappings = new EmailAccessMappingClient(config);
  }

  /**
   * Create a client instance with custom configuration
   */
  static create(config: ApiClientConfig): ProcessManagementClient {
    return new ProcessManagementClient(config);
  }
}
