import { UserProfile } from "./shared";

/** TaskInstanceDTO.status */
export type TaskStatus =
  | "CREATED"
  | "ASSIGNED"
  | "SUSPENDED"
  | "COMPLETED"
  | "CANCELED";

/** TaskInstanceDTO */
export type Task = {
  id: string;
  taskKey: string;
  formKey: string;
  name: string;
  externalId?: string;
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
  dueDate?: string;
  candidateGroups: string;
  candidateUsers?: string;
  searchTerms?: string;
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

/** TaskVariableDTO / ProcessVariableDTO */
export type TaskVariables = {
  name: string;
  value: string | number | boolean | object | unknown;
};

/** TaskDataDTO — complete / save body */
export type TaskData = {
  variables?: Array<TaskVariables>;
  forms?: Array<TaskVariables>;
};

/** TaskVariablesFormsDTO — GET /tasks-instances/{id}/variables */
export type TaskVariablesForms = {
  variables?: Array<TaskVariables>;
  forms?: Array<TaskVariables>;
};

/** AssignTaskDTO */
export type AssignTaskRequest = {
  user?: string;
  note?: string;
  priority?: number;
  candidateGroups?: string;
  candidateUsers?: string;
};

export type TaskStats = {
  totalTaskInstances: number;
  totalAvailableTasks: number;
  totalAssignedTasks: number;
  totalSuspendedTasks: number;
  totalCompletedTasks: number;
  totalCanceledTasks: number;
};

// --- Task assignment rules (/tasks-instances/assignment-rules) ---

export type TaskAssignmentMode = "ALWAYS" | "ONE_TIME";

export interface TaskAssignmentRuleDTO {
  id: string;
  processDefinitionKey: string;
  processInstanceId: string;
  taskDefinitionKey: string;
  assignee: string;
  candidateUsers: string;
  candidateGroups: string;
  assignmentMode: TaskAssignmentMode;
  priority: number;
  consumed: boolean;
  active: boolean;
  createdByTask: string;
}

export interface TaskAssignmentRuleUpdateRequest {
  assignee?: string;
  candidateUsers?: string;
  candidateGroups?: string;
}

export interface TaskAssignmentRuleFilters {
  processInstanceId?: string;
  processDefinitionKey?: string;
  taskDefinitionKey?: string;
  assignee?: string;
  candidateUsers?: string;
  candidateGroups?: string;
  assignmentMode?: TaskAssignmentMode;
  consumed?: boolean;
  active?: boolean;
  createdByTask?: string;
  page?: number;
  size?: number;
}
