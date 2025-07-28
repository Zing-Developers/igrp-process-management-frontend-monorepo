import {
  PaginatedResponse,
  Process,
  ProcessInstance,
  PostResponse,
} from '@igrp/platform-process-management-types';

import { processes } from '../dummy-data/processes';
import { httpClient, post } from './http-client';
import { apiConfig } from '../config/api.config';

/**
 * Fetches a paginated list of processes.
 * @param page The page number to fetch.
 * @param size The number of items per page.
 * @returns A promise that resolves to a paginated response of processes.
 */
export const getProcesses = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Process>> => {
  try {
    const response = await httpClient.get<PaginatedResponse<Process>>(
      `${apiConfig.endpoints.processes}?page=${page}&size=${size}`
    );
    return response;
  } catch (error) {
    console.log("config:"+apiConfig.endpoints.processes);
    console.error('Failed to fetch processes, returning dummy data.', error);
    return {
      content: processes,
      pageNumber: page,
      pageSize: size,
      totalElements: processes.length,
      totalPages: Math.ceil(processes.length / size),
      first: page === 0,
      last: page * size + size >= processes.length,
      empty: processes.length === 0,
    };
  }
};

/**
 * Fetches a single process by its ID.
 * @param id The ID of the process to fetch.
 * @returns A promise that resolves to the process, or undefined if not found.
 */
export const getProcessById = async (
  id: string
): Promise<Process | undefined> => {
  try {
    const response = await httpClient.get<Process>(`${apiConfig.endpoints.processes}/${id}`);
    return response;
  } catch (error) {
    console.error(
      `Failed to fetch process with id ${id}, returning dummy data.`,
      error
    );
    return processes.find((p) => p.processDefinitionId === id);
  }
};

/**
 * Starts a new process instance.
 * @param processDefinitionId The ID of the process definition to start.
 * @param businessKey Optional business key for the process instance.
 * @param variables Optional variables to pass to the process instance.
 * @returns A promise that resolves to the newly created process instance.
 */
export const startProcess = async (
  processDefinitionId: string,
  businessKey?: string,
  variables?: Record<string, any>
): Promise<ProcessInstance> => {
  const endpoint = apiConfig.endpoints.processStart;
  const body = { processDefinitionId, businessKey, variables };

  try {
    const response = await httpClient.post<ProcessInstance>(endpoint, body);
    return response;
  } catch (error: any) {
    console.error('Error starting process:', error);
    // Simulating a successful response with dummy data
    return {
      id: `pi_${Date.now()}`,
      processDefinitionId,
      processDefinitionName:
        processes.find((p) => p.processDefinitionId === processDefinitionId)?.title ||
        'Unknown Process',
      businessKey,
      startDate: new Date().toISOString(),
      initiator: 'currentUser', // Replace with actual user
      status: 'RUNNING',
      startedBy: 'currentUser',
      variables,
    };
  }
};
