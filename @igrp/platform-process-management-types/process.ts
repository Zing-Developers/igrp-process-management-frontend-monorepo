export type Process = {
  id: string;
  key: string;
  projectId: string;
  name: string;
  description: string;
  version: string;
  deploymentId: string;
  deploymentTime: string;
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
