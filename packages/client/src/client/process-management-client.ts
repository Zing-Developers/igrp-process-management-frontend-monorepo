import { ApiClientConfig } from "@igrp/platform-process-management-types";
import { ProcessClient } from "./process-client";
import { TaskClient } from "./task-client";
import { AreaClient } from "./area-client";

/**
 * Main Process Management API Client
 * Provides access to Process, Task, and Area management
 */
export class ProcessManagementClient {
  public readonly processes: ProcessClient;
  public readonly tasks: TaskClient;
  public readonly areas: AreaClient;

  constructor(config: ApiClientConfig) {
    this.processes = new ProcessClient(config);
    this.tasks = new TaskClient(config);
    this.areas = new AreaClient(config);
  }

  /**
   * Create a client instance with custom configuration
   */
  static create(config: ApiClientConfig): ProcessManagementClient {
    return new ProcessManagementClient(config);
  }
}
