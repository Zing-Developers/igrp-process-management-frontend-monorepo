export type Process = {
  processDefinitionId: string;
  projectId: string;
  processKey: string;
  code: string;
  title: string;
  description: string;
  version: string;
  status: string;
  statusDesc: string;
  deploymentId: string;
  deploymentDate: string;
  category?: string;
  thumbnail?: string;
};

export type ProcessInstance = {
  id: string;
  processDefinitionId: string;
  processDefinitionName: string;
  businessKey?: string;
  startDate: string;
  endTime?: string;
  initiator: string;
  status: 'CREATED' | 'COMPLETED' | 'SUSPENDED' | 'TERMINATED' | 'RUNNING';
  startedBy: string;
  variables?: Record<string, any>;
};
