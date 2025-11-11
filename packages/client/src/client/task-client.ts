import {
  PaginatedResponse,
  PostResponse,
} from "@igrp/platform-process-management-types/dist/response";
import { BaseApiClient } from "./base-client";
import {
  ApiResponse,
  Task,
  TaskVariables,
  TaskStats,
} from "@igrp/platform-process-management-types";

// Shared interfaces for parameter types
interface TaskQueryParams {
  processInstanceId?: string;
  processNumber?: string;
  processKey?: string;
  processName?: string;
  user?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  applicationBase?: string;
  page?: number;
  size?: number;
}

interface TaskActionParams {
  user?: string;
  note?: string;
}

interface TaskActionBody {
  user: string;
  priority?: number;
  note?: string;
}

interface PaginationParams {
  page?: number;
  size?: number;
}

interface TaskCompletionBody {
  variables?: Array<{ name: string; value: string }>;
  forms?: Array<{ name: string; value: string }>;
}

export class TaskClient extends BaseApiClient {
  /**
   * GET /tasks-instances/{id} - Get a specific task instance by ID
   */
  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    return this.get<Task>(`/tasks-instances/${id}`);
  }

  /**
   * GET /tasks-instances - Get all task instances with optional filters
   */
  async getTasks(
    params?: TaskQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return this.get<PaginatedResponse<Task>>("/tasks-instances", params);
  }
  /**
   * GET /tasks-instances/{id}/variables - Get variables for a specific task instance by ID
   */
  async getTaskVariablesById(id: string): Promise<ApiResponse<TaskVariables>> {
    return this.get<TaskVariables>(`/tasks-instances/${id}/variables`);
  }

  /**
   * GET /tasks-instances/status - Get task instance status options
   */
  async getTaskInstancesStatus(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>("/tasks-instances/status");
  }

  /**
   * GET /tasks-instances/me - Get tasks assigned to current user
   */
  async getMyTasks(
    params?: TaskQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    // Add current user to filters
    params = {
      ...params,
      status: "ASSIGNED",
    };
    return this.get<PaginatedResponse<Task>>("/tasks-instances/me", params);
  }

  /**
   * GET /tasks-instances/event_type - Get task instance event types
   */
  async getTaskInstanceEventTypes(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>("/tasks-instances/event_type");
  }

  /**
   * POST /tasks-instances/{id} - Complete a task
   */
  async completeTask(
    taskId: string,
    body?: TaskCompletionBody,
  ): Promise<ApiResponse<PostResponse>> {
    return this.post<PostResponse>(`/tasks-instances/${taskId}/complete`, body);
  }

  /**
   * POST /tasks-instances/{id} - Save a task
   */
  async saveTask(
    taskId: string,
    body?: TaskCompletionBody,
  ): Promise<ApiResponse<PostResponse>> {
    return this.post<PostResponse>(`/tasks-instances/${taskId}/save`, body);
  }

  /**
   * POST /tasks-instances/{id}/unclaim - Release/unclaim a task
   */
  async unclaimTask(
    taskId: string,
    note?: string,
  ): Promise<ApiResponse<PostResponse>> {
    return this.post<PostResponse>(
      `/tasks-instances/${taskId}/unclaim`,
      undefined,
      { note },
    );
  }

  /**
   * POST /tasks-instances/{id}/claim - Claim a task
   */
  async claimTask(
    taskId: string,
    params: TaskActionParams,
  ): Promise<ApiResponse<PostResponse>> {
    return this.post<PostResponse>(
      `/tasks-instances/${taskId}/claim`,
      undefined,
      params,
    );
  }

  /**
   * POST /tasks-instances/{id}/assign - Assign a task to a user
   */
  async assignTask(
    taskId: string,
    body: TaskActionBody,
  ): Promise<ApiResponse<PostResponse>> {
    return this.post<PostResponse>(`/tasks-instances/${taskId}/assign`, body);
  }

  /**
   * Get available tasks (unassigned) - using the main endpoint with filters
   */
  async getAvailableTasks(
    params?: TaskQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    // Filter for unassigned tasks
    params = {
      ...params,
      status: "CREATED",
    };
    return this.getTasks(params);
  }

  /**
   * Get tasks by process instance ID - using the main endpoint with filters
   */
  async getTasksByProcessInstance(
    processInstanceId: string,
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return this.getTasks({ ...params, processInstanceId: processInstanceId });
  }

  /**
   * GET /tasks-instances/stats - Get general task statistics
   */
  async getTaskStats(): Promise<ApiResponse<TaskStats>> {
    return this.get<TaskStats>("/tasks-instances/stats");
  }

  /**
   * GET /tasks-instances/stats/me - Get task statistics for current user
   */
  async getMyTaskStats(): Promise<ApiResponse<TaskStats>> {
    return this.get<TaskStats>("/tasks-instances/stats/me");
  }

  /**
   * Get tasks by user ID - using the main endpoint with filters
   */
  async getTasksByUser(
    userId: string,
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return this.getTasks({ ...params, user: userId });
  }
}
