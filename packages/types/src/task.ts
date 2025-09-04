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
  endedBy: string;
  endAt: string;
  status: "CREATED" | "ASSIGNED" | "COMPLETED" | "CANCELED" | "DELETED";
  statusDesc?: string;
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
