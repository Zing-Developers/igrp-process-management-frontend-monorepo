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
};

export type ProcessInstance = {
  id: string;
  procReleaseKey: string;
  procReleaseId: string;
  number: string;
  status:
    | "CREATED"
    | "RUNNING"
    | "SUSPENDED"
    | "CANCELLED"
    | "COMPLETED"
    | "TERMINATED";
  statusDesc: string;
  businessKey?: string;
  version: string;
  startedAt: string;
  startedBy: string;
  endedAt: string;
  endedBy: string;
  canceledAt: string;
  canceledBy: string;
  obsCancel: string;
  applicationBase: string;
};

export interface CreateProcessInstanceRequest {
  processDefinitionId: string;
  processKey: string;
  applicationBase: string;
  businessKey?: string;
  variables?: Array<{ name: string; value: string }>;
}
