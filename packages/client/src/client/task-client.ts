import { BaseApiClient } from "./base-client.js";
import type {
  ApiResponse,
  PaginatedResponse,
  Task,
  TaskStats,
  TaskData,
  TaskVariablesForms,
  AssignTaskRequest,
  VariablesFilterDTO,
  TaskAssignmentRuleDTO,
  TaskAssignmentRuleUpdateRequest,
  TaskAssignmentRuleFilters,
  ConfigParameter,
  TaskSearchQuery,
  MyTasksQuery,
  PaginationQuery,
  UnclaimTaskRequest,
} from "@igrp/platform-process-management-types";

export class TaskClient extends BaseApiClient {
  /**
   * GET /tasks-instances/{id} - Get a specific task instance by ID
   */
  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    return this.get<Task>(`/tasks-instances/${this.encodePath(id)}`);
  }

  /**
   * POST /tasks-instances/search - Get task instances with optional filters
   */
  async getTasks(
    params?: TaskSearchQuery,
    body: VariablesFilterDTO = {},
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    const { processKey, ...query } = params ?? {};
    return this.post<PaginatedResponse<Task>>(
      "/tasks-instances/search",
      body,
      processKey && !query.processReleaseKey
        ? { ...query, processReleaseKey: processKey }
        : query,
    );
  }
  /**
   * GET /tasks-instances/{id}/variables - Get variables for a specific task instance by ID
   */
  async getTaskVariablesById(
    id: string,
  ): Promise<ApiResponse<TaskVariablesForms>> {
    return this.get<TaskVariablesForms>(
      `/tasks-instances/${this.encodePath(id)}/variables`,
    );
  }

  /**
   * GET /tasks-instances/status - Get task instance status options
   */
  async getTaskInstancesStatus(): Promise<ApiResponse<ConfigParameter[]>> {
    return this.get<ConfigParameter[]>("/tasks-instances/status");
  }

  /**
   * POST /tasks-instances/me - Get tasks for the current user
   */
  async getMyTasks(
    params?: MyTasksQuery,
    body: VariablesFilterDTO = {},
  ): Promise<ApiResponse<PaginatedResponse<Task>>> {
    return this.post<PaginatedResponse<Task>>(
      "/tasks-instances/me",
      body,
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
    return this.post<Task>(
      `/tasks-instances/${this.encodePath(taskId)}/complete`,
      body ?? {},
    );
  }

  /**
   * POST /tasks-instances/{id}/save - Save a task
   */
  async saveTask(taskId: string, body?: TaskData): Promise<ApiResponse<Task>> {
    return this.post<Task>(
      `/tasks-instances/${this.encodePath(taskId)}/save`,
      body ?? {},
    );
  }

  /**
   * POST /tasks-instances/{id}/unclaim - Release/unclaim a task
   */
  async unclaimTask(
    taskId: string,
    body: UnclaimTaskRequest = {},
  ): Promise<ApiResponse<void>> {
    return this.post<void>(
      `/tasks-instances/${this.encodePath(taskId)}/unclaim`,
      body,
    );
  }

  /**
   * POST /tasks-instances/{id}/claim - Claim a task
   */
  async claimTask(taskId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/tasks-instances/${this.encodePath(taskId)}/claim`);
  }

  /**
   * POST /tasks-instances/{id}/assign - Assign a task to a user
   */
  async assignTask(
    taskId: string,
    body: AssignTaskRequest,
  ): Promise<ApiResponse<void>> {
    return this.post<void>(
      `/tasks-instances/${this.encodePath(taskId)}/assign`,
      body,
    );
  }

  /**
   * Get available tasks (unassigned) - using the main endpoint with filters
   */
  async getAvailableTasks(
    params?: TaskSearchQuery,
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
    params?: PaginationQuery,
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
    params?: PaginationQuery,
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
      `/tasks-instances/assignment-rules/${this.encodePath(id)}`,
      body,
    );
  }

  /**
   * DELETE /tasks-instances/assignment-rules/{id} - Delete a task assignment rule
   */
  async deleteTaskAssignmentRule(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(
      `/tasks-instances/assignment-rules/${this.encodePath(id)}`,
    );
  }
}
