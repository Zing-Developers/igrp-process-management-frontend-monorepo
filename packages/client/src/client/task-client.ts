import {
  PaginatedResponse,
  PostResponse,
} from "@igrp/platform-process-management-types/dist/response";
import { BaseApiClient } from "./base-client";
import {
  ApiResponse,
  Task,
  TaskStats,
  TaskData,
  TaskVariablesForms,
  AssignTaskRequest,
  VariableParams,
  TaskAssignmentRuleDTO,
  TaskAssignmentRuleUpdateRequest,
  TaskAssignmentRuleFilters,
  ConfigParameter,
} from "@igrp/platform-process-management-types";

// Shared interfaces for parameter types
interface TaskQueryParams {
  processInstanceId?: string;
  processNumber?: string;
  /** @deprecated the API filters by processReleaseKey; kept for back-compat */
  processKey?: string;
  processReleaseKey?: string;
  candidateGroups?: string;
  candidateUsers?: string;
  name?: string;
  priority?: number;
  processName?: string;
  user?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  applicationBase?: string;
  page?: number;
  size?: number;
  filterByCurrentUser?: boolean;
}

interface TaskActionParams {
  user?: string;
  note?: string;
}

interface PaginationParams {
  page?: number;
  size?: number;
}

interface TaskUnclaimBody {
  note?: string;
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
    body?: {
      variables?: VariableParams;
    },
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const requestBody = body || {};
    return this.post<PaginatedResponse<Task>>(
      "/tasks-instances/search",
      requestBody,
      params,
    );
  }
  /**
   * GET /tasks-instances/{id}/variables - Get variables for a specific task instance by ID
   */
  async getTaskVariablesById(
    id: string,
  ): Promise<ApiResponse<TaskVariablesForms>> {
    return this.get<TaskVariablesForms>(`/tasks-instances/${id}/variables`);
  }

  /**
   * GET /tasks-instances/status - Get task instance status options
   */
  async getTaskInstancesStatus(): Promise<ApiResponse<ConfigParameter[]>> {
    return this.get<ConfigParameter[]>("/tasks-instances/status");
  }

  /**
   * GET /tasks-instances/me - Get tasks assigned to current user
   */
  async getMyTasks(
    params?: TaskQueryParams,
    body?: {
      variables?: VariableParams;
    },
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    // Add current user to filters
    const requestBody = body || {};
    params = {
      ...params,
      status: "ASSIGNED",
    };
    return this.post<PaginatedResponse<Task>>(
      "/tasks-instances/me",
      requestBody,
      params,
    );
  }

  /**
   * GET /tasks-instances/event_type - Get task instance event types
   */
  async getTaskInstanceEventTypes(): Promise<ApiResponse<ConfigParameter[]>> {
    return this.get<ConfigParameter[]>("/tasks-instances/event_type");
  }

  /**
   * POST /tasks-instances/{id}/complete - Complete a task
   */
  async completeTask(
    taskId: string,
    body?: TaskData,
  ): Promise<ApiResponse<Task>> {
    return this.post<Task>(`/tasks-instances/${taskId}/complete`, body);
  }

  /**
   * POST /tasks-instances/{id}/save - Save a task
   */
  async saveTask(taskId: string, body?: TaskData): Promise<ApiResponse<Task>> {
    return this.post<Task>(`/tasks-instances/${taskId}/save`, body);
  }

  /**
   * POST /tasks-instances/{id}/unclaim - Release/unclaim a task
   */
  async unclaimTask(
    taskId: string,
    body?: TaskUnclaimBody,
  ): Promise<ApiResponse<PostResponse>> {
    return this.post<PostResponse>(
      `/tasks-instances/${taskId}/unclaim`,
      body,
      undefined,
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
    body: AssignTaskRequest,
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

  /**
   * GET /tasks-instances/assignment-rules - List task assignment rules
   */
  async getTaskAssignmentRules(
    params?: TaskAssignmentRuleFilters,
  ): Promise<ApiResponse<PaginatedResponse<TaskAssignmentRuleDTO>>> {
    return this.get<PaginatedResponse<TaskAssignmentRuleDTO>>(
      "/tasks-instances/assignment-rules",
      params,
    );
  }

  /**
   * PUT /tasks-instances/assignment-rules/{id} - Update a task assignment rule
   */
  async updateTaskAssignmentRule(
    id: string,
    body: TaskAssignmentRuleUpdateRequest,
  ): Promise<ApiResponse<TaskAssignmentRuleDTO>> {
    return this.put<TaskAssignmentRuleDTO>(
      `/tasks-instances/assignment-rules/${id}`,
      body,
    );
  }

  /**
   * DELETE /tasks-instances/assignment-rules/{id} - Delete a task assignment rule
   */
  async deleteTaskAssignmentRule(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/tasks-instances/assignment-rules/${id}`);
  }
}
