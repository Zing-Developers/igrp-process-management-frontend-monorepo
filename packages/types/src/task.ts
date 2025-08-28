export type Task = {
  id: string;
  taskKey: string;
  formKey: string;
  name: string;
  processInstanceId: string;
  processNumber: string;
  processName: string;
  processKey: string;
  assignedBy: string;
  status: "CREATED" | "ASSIGNED" | "COMPLETED" | "CANCELLED" | "DELETED";
  statusDesc?: string;
  startedAt: string;
  businessKey: string;
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
