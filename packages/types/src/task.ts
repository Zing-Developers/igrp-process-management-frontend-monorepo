export type Task = {
  id: string;
  taskKey: string;
  formKey: string;
  name: string;
  processInstanceId: string;
  processNumber: string;
  processName: string;
  processKey: string;
  priority: number;
  businessKey: string;
  assignedBy: string;
  assignedAt: string;
  startedBy: string;
  startedAt: string;
  endedAt: string;
  endedBy: string;
  candidateGroups: string;
  status: "CREATED" | "ASSIGNED" | "COMPLETED" | "CANCELED" | "DELETED";
  statusDesc?: string;
  variables?: Array<TaskVariables>;
  applicationBase?: string;
  taskInstanceEvents?: TaskInstanceEvent[];
};

export type TaskInstanceEvent = {
  id: string;
  eventType: string;
  status: string;
  performedAt: string;
  performedBy: string;
  obs?: string;
  taskInstanceId: string;
};

export type TaskVariables = {
  name: string;
  value: string;
};

export type TaskStats = {
  totalTaskInstances: number;
  totalAvailableTasks: number;
  totalAssignedTasks: number;
  totalSuspendedTasks: number;
  totalCompletedTasks: number;
  totalCanceledTasks: number;
};
