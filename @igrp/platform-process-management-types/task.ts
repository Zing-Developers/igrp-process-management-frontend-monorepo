export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Task = {
  id: string;
  name: string;
  description?: string;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  processName: string;
  createdDate: string;
  dueDate?: string;
  priority?: TaskPriority;
  assignee?: string;
  formKey?: string;
  status: 'CREATED' | 'ASSIGNED' | 'COMPLETED';
  variables?: Record<string, any>;
};

export type FormField = {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  required: boolean;
  options?: { label: string; value: string }[];
  value?: any;
};

export type TaskForm = {
  id: string;
  name: string;
  fields: FormField[];
};
