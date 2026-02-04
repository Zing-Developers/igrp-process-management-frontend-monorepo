import { TaskVariables } from "./task";

export type ProcessStatus =
  | "CREATED"
  | "RUNNING"
  | "SUSPENDED"
  | "CANCELED"
  | "COMPLETED"
  | "TERMINATED";

export type Process = {
  id: string;
  processKey: string;
  name?: string; // Add this for compatibility
  description?: string; // Add this for compatibility
  releaseId: string;
  areaId: string;
  status: string;
  statusDesc: string;
  version: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
  removedAt?: string | null;
  removedBy?: string | null;
  applicationBase?: string;
};

export type ProcessInstance = {
  id: string;
  procReleaseKey: string;
  procReleaseId: string;
  number: string;
  status: ProcessStatus;
  statusDesc: string;
  businessKey?: string;
  version: string;
  startedAt: string;
  startedBy: string;
  endedAt: string;
  endedBy: string;
  canceledAt: string;
  canceledBy: string;
  priority: number;
  obsCancel: string;
  applicationBase: string;
  name: string;
  progress: string;
  variables: Array<TaskVariables>;
};

export interface CreateProcessInstanceRequest {
  processDefinitionId: string;
  processKey: string;
  applicationBase: string;
  priority: number;
  businessKey?: string;
  variables?: Array<{ name: string; value: string }>;
}

export interface StartProcessInstanceRequest {
  variables?: Array<{ name: string; value: string }>;
}

export interface CreateProcessArtifactRequest {
  name: string;
  key: string;
  formKey: string;
  candidateGroups?: string;
}

export interface ProcessArtifact {
  id: string;
  name: string;
  key: string;
  processDefinitionId: string;
  formKey: string;
  candidateGroups?: string;
}

export interface ProcessDefinition {
  id: string;
  processKey: string;
  name: string;
  description: string;
  version: string;
  deploymentId: string;
  applicationBase: string;
  candidateGroups: string;
}

export interface ProcessSequence {
  id: string;
  name: string;
  prefix: string;
  checkDigitSize: number;
  padding: number;
  dateFormat: string;
  nextNumber: number;
  numberIncrement: number;
  processDefinitionId: string;
}

export interface CreateProcessSequenceRequest {
  name: string;
  prefix: string;
  dateFormat: string;
  checkDigitSize: number;
  padding: number;
  numberIncrement: number;
}

export type ProcessStats = {
  totalProcessInstances: number;
  totalCreatedProcess: number;
  totalRunningProcess: number;
  totalCompletedProcess: number;
  totalSuspendedProcess: number;
  totalCanceledProcess: number;
};
