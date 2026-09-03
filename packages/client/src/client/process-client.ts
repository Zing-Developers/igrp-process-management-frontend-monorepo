import { BaseApiClient } from "./base-client.js";
import type {
  ApiResponse,
  Process,
  ProcessInstance,
  CreateProcessInstanceRequest,
  CreateAndStartProcessRequest,
  CreateProcessArtifactRequest,
  ProcessArtifact,
  ProcessStats,
  ProcessSequence,
  CreateProcessSequenceRequest,
  PaginatedResponse,
  StartProcessInstanceRequest,
  ProcessDefinitionSchema,
  Priority,
  TaskPriorityRequest,
  ProcessFilter,
  ProcessEventDTO,
  TimerRescheduleDTO,
  ProcessDeploymentRequestDTO,
  ProcessDeploymentDTO,
  ProcessDeploymentListItem,
  ProcessInstanceTaskStatus,
  ConfigParameter,
  ProcessArtifactRequestDTO,
  ProcessInstanceSearchQuery,
  VariablesFilterDTO,
} from "@igrp/platform-process-management-types";

export class ProcessClient extends BaseApiClient {
  /**
   * GET /process-definitions - Get all process definitions (deployments list)
   */
  async getProcesses(
    params?: ProcessFilter,
  ): Promise<ApiResponse<PaginatedResponse<ProcessDeploymentListItem>>> {
    return this.get<PaginatedResponse<ProcessDeploymentListItem>>(
      "/process-definitions",
      params,
    );
  }

  /**
   * @deprecated This operation is not present in the current OpenAPI contract.
   */
  async getProcessById(id: string): Promise<ApiResponse<Process>> {
    return this.get<Process>(`/process-definitions/${this.encodePath(id)}`);
  }

  /**
   * @deprecated Artifact creation is not present in the current OpenAPI contract.
   */
  async createProcessArtifact(
    processDefinitionId: string,
    artifact: CreateProcessArtifactRequest,
  ): Promise<ApiResponse<ProcessArtifact>> {
    return this.post<ProcessArtifact>(
      `/process-definitions/${this.encodePath(processDefinitionId)}/artifacts`,
      artifact,
    );
  }

  /**
   * @deprecated use configureProcessArtifact(id, taskKey, artifact).
   */
  async updateProcessArtifact(
    processDefinitionId: string,
    artifact: CreateProcessArtifactRequest,
  ): Promise<ApiResponse<ProcessArtifact>> {
    const { key, ...body } = artifact;
    return this.configureProcessArtifact(processDefinitionId, key, body);
  }

  /** PUT /process-definitions/{id}/artifacts/{taskKey}. */
  async configureProcessArtifact(
    id: string,
    taskKey: string,
    artifact: ProcessArtifactRequestDTO,
  ): Promise<ApiResponse<ProcessArtifact>> {
    return this.put<ProcessArtifact>(
      `/process-definitions/${this.encodePath(id)}/artifacts/${this.encodePath(taskKey)}`,
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
      `/process-definitions/${this.encodePath(processDefinitionId)}/artifacts`,
    );
  }

  /**
   * GET /process-definitions/{processDefinitionId}/deployed-artifacts - Get deployed artifacts for a process definition
   */
  async getProcessDeployedArtifacts(
    processDefinitionId: string,
  ): Promise<ApiResponse<ProcessArtifact[]>> {
    return this.get<ProcessArtifact[]>(
      `/process-definitions/${this.encodePath(processDefinitionId)}/deployed-artifacts`,
    );
  }

  /**
   * DELETE /process-definitions/artifacts/{artifactId} - Delete a specific process artifact
   */
  async deleteProcessArtifact(artifactId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(
      `/process-definitions/artifacts/${this.encodePath(artifactId)}`,
    );
  }

  /**
   * process-definitions/er/assign-groups - Assign groups to a process definition
   */
  async assignGroupsToProcessDefinition(
    processDefinitionId: string,
    candidateGroups: string,
  ): Promise<ApiResponse<void>> {
    return this.post<void>(
      `/process-definitions/${this.encodePath(processDefinitionId)}/assign`,
      { candidateGroups },
    );
  }

  /**
   * /process-definitions/{id}/unassign- Assign groups to a process definition
   */
  async unassignGroupsToProcessDefinition(
    processDefinitionId: string,
    candidateGroups: string,
  ): Promise<ApiResponse<void>> {
    return this.post<void>(
      `/process-definitions/${this.encodePath(processDefinitionId)}/unassign`,
      { candidateGroups },
    );
  }

  /**
   * POST /process-instances/search - Get process instances with optional filters
   */
  async getProcessInstances(
    params?: ProcessInstanceSearchQuery,
    body: VariablesFilterDTO = {},
  ): Promise<ApiResponse<PaginatedResponse<ProcessInstance>>> {
    // Backend requires a request body, so send at least an empty object
    return this.post<PaginatedResponse<ProcessInstance>>(
      "/process-instances/search",
      body,
      params,
    );
  }

  /**
   * GET /process-instances/{id} - Get a specific process instance by ID
   */
  async getProcessInstanceById(
    id: string,
  ): Promise<ApiResponse<ProcessInstance>> {
    return this.get<ProcessInstance>(
      `/process-instances/${this.encodePath(id)}`,
    );
  }

  /**
   * GET /process-instances/{id}/task-status - Get task status for a process instance
   */
  async getProcessInstanceTaskStatus(
    id: string,
  ): Promise<ApiResponse<ProcessInstanceTaskStatus[]>> {
    return this.get<ProcessInstanceTaskStatus[]>(
      `/process-instances/${this.encodePath(id)}/task-status`,
    );
  }

  /**
   * GET /process-instances/status - Get process instances status options
   */
  async getProcessInstancesStatus(): Promise<ApiResponse<ConfigParameter[]>> {
    return this.get<ConfigParameter[]>("/process-instances/status");
  }

  /**
   * GET /process-definitions/{processDefinitionKey}/sequence - Get sequence configuration for a process definition
   */
  async getProcessSequence(
    processDefinitionKey: string,
  ): Promise<ApiResponse<ProcessSequence>> {
    return this.get<ProcessSequence>(
      `/process-definitions/${this.encodePath(processDefinitionKey)}/sequence`,
    );
  }

  /**
   * POST /process-definitions/{processDefinitionKey}/sequence - Create sequence configuration for a process definition
   */
  async createProcessSequence(
    processDefinitionKey: string,
    sequence: CreateProcessSequenceRequest,
  ): Promise<ApiResponse<ProcessSequence>> {
    return this.post<ProcessSequence>(
      `/process-definitions/${this.encodePath(processDefinitionKey)}/sequence`,
      sequence,
    );
  }

  /**
   * GET /process-instances/stats - Get process instances statistics
   */
  async getProcessStats(): Promise<ApiResponse<ProcessStats>> {
    return this.get<ProcessStats>("/process-instances/stats");
  }

  /**
   * POST /process-instances - Create and start a new process instance
   */
  async createAndStartProcess(
    body: CreateAndStartProcessRequest,
  ): Promise<ApiResponse<ProcessInstance>> {
    return this.post<ProcessInstance>("/process-instances", body);
  }

  /**
   * POST /process-instances/create - Create a new process instance (without starting)
   */
  async createProcessInstance(
    body: CreateProcessInstanceRequest,
  ): Promise<ApiResponse<ProcessInstance>> {
    return this.post<ProcessInstance>("/process-instances/create", body);
  }

  /**
   * POST /process-instances/{processInstanceId}/start - Start a process instance
   */
  async startProcessInstance(
    processInstanceId: string,
    body: StartProcessInstanceRequest,
  ): Promise<ApiResponse<ProcessInstance>> {
    return this.post<ProcessInstance>(
      `/process-instances/${this.encodePath(processInstanceId)}/start`,
      body,
    );
  }

  /**
   * DELETE /process-definitions/{id}/archive - Archive a process definition
   */
  async archiveProcessDefinition(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(
      `/process-definitions/${this.encodePath(id)}/archive`,
    );
  }

  /**
   * POST /process-definitions/{id}/unarchive - Unarchive a process definition
   */
  async unarchiveProcessDefinition(id: string): Promise<ApiResponse<void>> {
    return this.post<void>(
      `/process-definitions/${this.encodePath(id)}/unarchive`,
    );
  }

  /**
   * GET /process-definitions/{id}/export - Export a process definition
   */
  async exportProcessDefinition(
    id: string,
  ): Promise<ApiResponse<ProcessDefinitionSchema>> {
    return this.get<ProcessDefinitionSchema>(
      `/process-definitions/${this.encodePath(id)}/export`,
    );
  }

  /**
   * POST /process-definitions/import - Import a process definition
   */
  async importProcessDefinition(
    body: ProcessDefinitionSchema,
  ): Promise<ApiResponse<void>> {
    return this.post<void>(`/process-definitions/import`, body);
  }

  /**
   * DELETE /process-definitions/priorities/{id} - Delete a priority for a process definition
   */
  async deleteProcessDefinitionPriority(
    id: string,
  ): Promise<ApiResponse<void>> {
    return this.delete<void>(
      `/process-definitions/priorities/${this.encodePath(id)}`,
    );
  }

  /**
   * GET /process-definitions/{processKey}/priorities - Get all priorities for a process definition
   */
  async getProcessDefinitionPriorities(
    processKey: string,
  ): Promise<ApiResponse<Priority[]>> {
    return this.get<Priority[]>(
      `/process-definitions/${this.encodePath(processKey)}/priorities`,
    );
  }

  /**
   * PUT /process-definitions/{processKey}/priorities - Create/replace priorities for a process definition
   */
  async createProcessDefinitionPriority(
    processKey: string,
    priority: TaskPriorityRequest[],
  ): Promise<ApiResponse<Priority[]>> {
    return this.put<Priority[]>(
      `/process-definitions/${this.encodePath(processKey)}/priorities`,
      priority,
    );
  }

  /**
   * POST /process-definitions/deploy - Deploy a process (BPMN XML)
   */
  async deployProcess(
    body: ProcessDeploymentRequestDTO,
  ): Promise<ApiResponse<ProcessDeploymentDTO>> {
    return this.post<ProcessDeploymentDTO>(`/process-definitions/deploy`, body);
  }

  /**
   * POST /process-instances/event - Trigger a process (message) event
   */
  async triggerProcessEvent(
    body: ProcessEventDTO,
  ): Promise<ApiResponse<string>> {
    return this.post<string>(`/process-instances/event`, body);
  }

  /**
   * POST /process-instances/{id}/timer/reschedule - Reschedule a timer
   */
  async rescheduleTimer(
    id: string,
    body: TimerRescheduleDTO,
  ): Promise<ApiResponse<void>> {
    return this.post<void>(
      `/process-instances/${this.encodePath(id)}/timer/reschedule`,
      body,
    );
  }
}
