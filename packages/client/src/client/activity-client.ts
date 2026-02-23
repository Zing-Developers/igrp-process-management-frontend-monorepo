import { BaseApiClient } from "./base-client";
import {
  ActivityEvent,
  ActivityProgress,
  ApiResponse,
} from "@igrp/platform-process-management-types";

export class ActivityClient extends BaseApiClient {
  /**
   * GET /activities - Get all activities with optional filters
   */
  async getActivityById(id: string): Promise<ApiResponse<ActivityEvent>> {
    return this.get<ActivityEvent>(`/activities/${id}`);
  }

  /**
   * GET /activities/{id} - Get a specific activity by ID
   */
  async getActivityProgress(
    processInstanceId: string,
    type?: string,
  ): Promise<ApiResponse<ActivityProgress[]>> {
    return this.get<ActivityProgress[]>(
      `/activities/progress?processIdentifier=${processInstanceId}${type ? `&type=${type}` : ""}`,
    );
  }

  /**
   * GET /areas/status - Get area status options
   */
  async getActivityInstances(
    processInstanceId: string,
    type?: string,
  ): Promise<ApiResponse<ActivityEvent[]>> {
    return this.get<ActivityEvent[]>(
      `/activities/instances?processInstanceId=${processInstanceId}${type ? `&type=${type}` : ""}`,
    );
  }
}
