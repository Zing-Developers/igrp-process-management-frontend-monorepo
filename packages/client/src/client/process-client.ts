import { BaseApiClient } from "./base-client";
import {
  ApiResponse,
  Process,
  ProcessInstance,
  CreateProcessInstanceRequest,
  CreateProcessArtifactRequest,
  ProcessArtifact,
  PaginatedResponse,
} from "@igrp/platform-process-management-types";

export class ProcessClient extends BaseApiClient {
  /**
   * GET /process-definitions - Get all process definitions
   */
  async getProcesses(params?: {
    applicationBase?: string;
    processName?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PaginatedResponse<Process>>> {
    return this.get<PaginatedResponse<Process>>("/process-definitions", params);
  }

  /**
   * GET /process-definitions/{id} - Get a specific process definition by ID
   */
  async getProcessById(id: string): Promise<ApiResponse<Process>> {
    return this.get<Process>(`/process-definitions/${id}`);
  }

  /**
   * POST /process-definitions/{processDefinitionId}/artifacts - Create a new process artifact
   */
  async createProcessArtifact(
    processDefinitionId: string,
    artifact: CreateProcessArtifactRequest,
  ): Promise<ApiResponse<ProcessArtifact>> {
    return this.post<ProcessArtifact>(
      `/process-definitions/${processDefinitionId}/artifacts`,
      artifact,
    );
  }

  /**
   * GET /process-definitions/{processDefinitionId}/artifacts - Get artifacts for a process definition
   */
  async getProcessArtifacts(
    processDefinitionId: string,
  ): Promise<ApiResponse<ProcessArtifact[]>> {
    return this.get<ProcessArtifact[]>(
      `/process-definitions/${processDefinitionId}/artifacts`,
    );
  }

  /**
   * GET /process-definitions/{processDefinitionId}/deployed-artifacts - Get deployed artifacts for a process definition
   */
  async getProcessDeployedArtifacts(
    processDefinitionId: string,
  ): Promise<ApiResponse<ProcessArtifact[]>> {
    return this.get<ProcessArtifact[]>(
      `/process-definitions/${processDefinitionId}/deployed-artifacts`,
    );
  }

  /**
   * DELETE /process-definitions/artifacts/{artifactId} - Delete a specific process artifact
   */
  async deleteProcessArtifact(artifactId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/process-definitions/artifacts/${artifactId}`);
  }

  /**
   * GET /process-instances - Get process instances with optional filters
   */
  async getProcessInstances(params?: {
    number?: string;
    procReleaseKey?: string;
    procReleaseId?: string;
    status?:
      | "CREATED"
      | "RUNNING"
      | "SUSPENDED"
      | "CANCELLED"
      | "COMPLETED"
      | "TERMINATED";
    searchTerms?: string;
    applicationBase?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PaginatedResponse<ProcessInstance>>> {
    return this.get<PaginatedResponse<ProcessInstance>>(
      "/process-instances",
      params,
    );
  }

  /**
   * GET /process-instances/{id} - Get a specific process instance by ID
   */
  async getProcessInstanceById(
    id: string,
  ): Promise<ApiResponse<ProcessInstance>> {
    return this.get<ProcessInstance>(`/process-instances/${id}`);
  }

  /**
   * GET /process-instances/{id}/task-status - Get task status for a process instance
   */
  async getProcessInstanceTaskStatus(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/process-instances/${id}/task-status`);
  }

  /**
   * GET /process-instances/status - Get process instances status options
   */
  async getProcessInstancesStatus(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>("/process-instances/status");
  }

  /**
   * POST /process-instances - Start a new process instance
   */
  async startProcess(
    processDefinitionId: string,
    processKey: string,
    applicationBase: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ): Promise<ApiResponse<ProcessInstance>> {
    const body: CreateProcessInstanceRequest = {
      processDefinitionId,
      processKey,
      applicationBase,
      businessKey,
      variables,
    };
    return this.post<ProcessInstance>("/process-instances", body);
  }
}
