import { UserProfile } from "./shared";

export type TaskStatus =
  | "CREATED"
  | "ASSIGNED"
  | "COMPLETED"
  | "CANCELED"
  | "DELETED";

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
  dueDate: string;
  candidateGroups: string;
  status: TaskStatus;
  statusDesc?: string;
  variables?: Array<TaskVariables>;
  forms?: Array<TaskVariables>;
  processVariables?: Array<TaskVariables>;
  applicationBase?: string;
  taskInstanceEvents?: TaskInstanceEvent[];
  userProfileAssignedBy?: UserProfile;
  userProfileStartedBy?: UserProfile;
  userProfileEndedBy?: UserProfile;
};

export type TaskInstanceEvent = {
  id: string;
  eventType: string;
  status: string;
  performedAt: string;
  performedBy: string;
  obs?: string;
  taskInstanceId: string;
  userProfilePerformedBy?: UserProfile;
};

export type TaskVariables = {
  name: string;
  value: string | number | boolean | object;
};

export type TaskStats = {
  totalTaskInstances: number;
  totalAvailableTasks: number;
  totalAssignedTasks: number;
  totalSuspendedTasks: number;
  totalCompletedTasks: number;
  totalCanceledTasks: number;
};
