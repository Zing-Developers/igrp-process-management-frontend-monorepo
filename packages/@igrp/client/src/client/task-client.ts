import { PaginatedResponse, PostResponse } from '@igrp/platform-process-management-types/dist/response';
import { BaseApiClient } from './base-client';
import {
    ApiResponse,
    Task
} from '@igrp/platform-process-management-types';

// Shared interfaces for parameter types
interface TaskQueryParams {
    processInstanceId?: string;
    processNumber?: string;
    processKey?: string;
    user?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    applicationBase?: string;
    page?: number;
    size?: number;
}

interface TaskActionParams {
    user: string;
    note?: string;
}

interface PaginationParams {
    page?: number;
    size?: number;
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
    async getTasks(params?: TaskQueryParams): Promise<ApiResponse<PaginatedResponse<Task>>> {
        return this.get<PaginatedResponse<Task>>('/tasks-instances', params);
    }

    /**
     * GET /tasks-instances/status - Get task instance status options
     */
    async getTaskInstancesStatus(): Promise<ApiResponse<any[]>> {
        return this.get<any[]>('/tasks-instances/status');
    }

    /**
     * GET /tasks-instances/me - Get tasks assigned to current user
     */
    async getMyTasks(params?: TaskQueryParams): Promise<ApiResponse<PaginatedResponse<Task>>> {
        return this.get<PaginatedResponse<Task>>('/tasks-instances/me', params);
    }

    /**
     * GET /tasks-instances/event_type - Get task instance event types
     */
    async getTaskInstanceEventTypes(): Promise<ApiResponse<any[]>> {
        return this.get<any[]>('/tasks-instances/event_type');
    }

    /**
     * POST /tasks-instances/{id} - Complete a task
     */
    async completeTask(
        taskId: string,
        variables?: Array<{ name: string; value: string }>
    ): Promise<ApiResponse<PostResponse>> {
        return this.post<PostResponse>(`/tasks-instances/${taskId}`, { variables });
    }

    /**
     * POST /tasks-instances/{id}/unclaim - Release/unclaim a task
     */
    async unclaimTask(
        taskId: string,
        params: TaskActionParams
    ): Promise<ApiResponse<PostResponse>> {
        return this.post<PostResponse>(`/tasks-instances/${taskId}/unclaim`, params);
    }

    /**
     * POST /tasks-instances/{id}/unassign - Unassign a task
     */
    async unassignTask(
        taskId: string,
        params: TaskActionParams
    ): Promise<ApiResponse<PostResponse>> {
        return this.post<PostResponse>(`/tasks-instances/${taskId}/unassign`, params);
    }

    /**
     * POST /tasks-instances/{id}/claim - Claim a task
     */
    async claimTask(
        taskId: string,
        params: TaskActionParams
    ): Promise<ApiResponse<PostResponse>> {
        return this.post<PostResponse>(`/tasks-instances/${taskId}/claim`, params);
    }

    /**
     * POST /tasks-instances/{id}/assign - Assign a task to a user
     */
    async assignTask(
        taskId: string,
        params: TaskActionParams
    ): Promise<ApiResponse<PostResponse>> {
        return this.post<PostResponse>(`/tasks-instances/${taskId}/assign`, params);
    }

    /**
     * Get available tasks (unassigned) - using the main endpoint with filters
     */
    async getAvailableTasks(params?: TaskQueryParams): Promise<ApiResponse<PaginatedResponse<Task>>> {
        // Filter for unassigned tasks
        return this.getTasks({ ...params, user: '' });
    }

    /**
     * Get tasks by process instance ID - using the main endpoint with filters
     */
    async getTasksByProcessInstance(
        processInstanceId: string,
        params?: PaginationParams
    ): Promise<ApiResponse<PaginatedResponse<Task>>> {
        return this.getTasks({ ...params, processInstanceId: processInstanceId });
    }

    /**
     * Get tasks by user ID - using the main endpoint with filters
     */
    async getTasksByUser(
        userId: string,
        params?: PaginationParams
    ): Promise<ApiResponse<PaginatedResponse<Task>>> {
        return this.getTasks({ ...params, user: userId });
    }
}