import { BaseApiClient } from "./base-client.js";
import type {
  ActivityEvent,
  ActivityProgress,
  ApiResponse,
} from "@igrp/platform-process-management-types";

export class ActivityClient extends BaseApiClient {
  /**
   * GET /activities/{id} - Get a specific activity by ID
   */
  async getActivityById(id: string): Promise<ApiResponse<ActivityEvent>> {
    return this.get<ActivityEvent>(`/activities/${this.encodePath(id)}`);
  }

  /**
   * GET /activities/progress - Get process activity progress
   */
  async getActivityProgress(
    processInstanceId: string,
    type?: string,
  ): Promise<ApiResponse<ActivityProgress[]>> {
    return this.get<ActivityProgress[]>("/activities/progress", {
      processIdentifier: processInstanceId,
      type,
    });
  }

  /**
   * GET /activities/instances - Get activity instances for a process
   */
  async getActivityInstances(
    processInstanceId: string,
    type?: string,
  ): Promise<ApiResponse<ActivityEvent[]>> {
    return this.get<ActivityEvent[]>("/activities/instances", {
      processIdentifier: processInstanceId,
      type,
    });
  }
}
