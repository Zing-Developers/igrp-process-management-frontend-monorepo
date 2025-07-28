import {
  PaginatedResponse,
  Task,
  PostResponse,
} from '@igrp/platform-process-management-types';
import { tasks } from '../dummy-data/tasks';
import { httpClient, post } from './http-client';
import { apiConfig } from '../config/api.config';

/**
 * Fetches a paginated list of tasks.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getTasks = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Task>> => {
  try {
    const response = await httpClient.get<PaginatedResponse<Task>>(
      `${apiConfig.endpoints.tasks}?page=${page}&size=${size}`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch tasks, returning dummy data.', error);
    return {
      content: tasks,
      pageNumber: page,
      pageSize: size,
      totalElements: tasks.length,
      totalPages: Math.ceil(tasks.length / size),
      first: page === 0,
      last: page * size + size >= tasks.length,
      empty: tasks.length === 0,
    };
  }
};

/**
 * Fetches a single task by its ID.
 * @param id The ID of the task to fetch.
 * @returns A promise that resolves to the task, or undefined if not found.
 */
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  try {
    const response = await httpClient.get<Task>(`${apiConfig.endpoints.tasks}/${id}`);
    return response;
  } catch (error) {
    console.error(
      `Failed to fetch task with id ${id}, returning dummy data.`,
      error
    );
    return tasks.find((t) => t.id === id);
  }
};

/**
 * Fetches all tasks assigned to the current user with pagination.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getMyTasks = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Task>> => {
  try {
    const response = await httpClient.get<PaginatedResponse<Task>>(
      `${apiConfig.endpoints.tasks}/my?page=${page}&size=${size}`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch my tasks, returning dummy data.', error);
    // For dummy data, simulate pagination
    const myTasks = tasks.filter((t) => t.assignee === 'current-user');
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedTasks = myTasks.slice(startIndex, endIndex);
    
    return {
      content: paginatedTasks,
      pageNumber: page,
      pageSize: size,
      totalElements: myTasks.length,
      totalPages: Math.ceil(myTasks.length / size),
      first: page === 0,
      last: endIndex >= myTasks.length,
      empty: myTasks.length === 0,
    };
  }
};

/**
 * Fetches all tasks assigned to a specific user.
 * @param userId The ID of the user.
 * @returns A promise that resolves to a list of tasks.
 */
export const getTasksByUser = async (userId: string): Promise<Task[]> => {
  try {
    const response = await httpClient.get<Task[]>(`${apiConfig.endpoints.tasks}/user/${userId}`);
    return response;
  } catch (error) {
    console.error(
      `Failed to fetch tasks for user ${userId}, returning dummy data.`,
      error
    );
    return tasks.filter((t) => t.assignee === userId);
  }
};

/**
 * Fetches all available tasks for a user with pagination.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of tasks.
 */
export const getAvailableTasks = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Task>> => {
  try {
    const response = await httpClient.get<PaginatedResponse<Task>>(
      `${apiConfig.endpoints.tasks}/available?page=${page}&size=${size}`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch available tasks, returning dummy data.', error);
    // For dummy data, simulate pagination
    const availableTasks = tasks.filter((t) => !t.assignee && t.status === 'CREATED');
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedTasks = availableTasks.slice(startIndex, endIndex);
    
    return {
      content: paginatedTasks,
      pageNumber: page,
      pageSize: size,
      totalElements: availableTasks.length,
      totalPages: Math.ceil(availableTasks.length / size),
      first: page === 0,
      last: endIndex >= availableTasks.length,
      empty: availableTasks.length === 0,
    };
  }
};

/**
 * Fetches all tasks for a specific process instance.
 * @param processInstanceId The ID of the process instance.
 * @returns A promise that resolves to a list of tasks.
 */
export const getTasksByProcessInstance = async (
  processInstanceId: string
): Promise<Task[]> => {
  try {
    const response = await httpClient.get<Task[]>(
      `${apiConfig.endpoints.tasks}/process/${processInstanceId}`
    );
    return response;
  } catch (error) {
    console.error(
      `Failed to fetch tasks for process instance ${processInstanceId}, returning dummy data.`,
      error
    );
    return tasks.filter((t) => t.processInstanceId === processInstanceId);
  }
};

/**
 * Claims a task for a user.
 * @param taskId The ID of the task to claim.
 * @param userId The ID of the user claiming the task.
 * @returns A promise that resolves to a PostResponse.
 */
export const claimTask = (taskId: string, userId: string): Promise<PostResponse> =>
  post(apiConfig.endpoints.tasksClaim, { taskId, userId });

/**
 * Releases a claimed task.
 * @param taskId The ID of the task to release.
 * @returns A promise that resolves to a PostResponse.
 */
export const releaseTask = (taskId: string): Promise<PostResponse> =>
  post(apiConfig.endpoints.tasksRelease, { taskId });

/**
 * Completes a task.
 * @param taskId The ID of the task to complete.
 * @param variables Optional variables to pass to the task.
 * @returns A promise that resolves to a PostResponse.
 */
export const completeTask = (
  taskId: string,
  variables?: Record<string, any>
): Promise<PostResponse> => post(apiConfig.endpoints.tasksComplete, { taskId, variables });
