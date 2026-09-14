import type { UserProfile } from "./shared.js";
import type { TaskVariables } from "./task.js";

/** ActivityDTO */
export interface ActivityEvent {
  id?: string;
  name?: string;
  description?: string;
  processInstanceId?: string;
  parentId?: string;
  parentProcessInstanceId?: string;
  status?: string;
  type?: string;
  variables?: TaskVariables[];
}

export type ActivityDTO = ActivityEvent;

/** ActivityProgressDTO */
export interface ActivityProgress {
  activityId?: string;
  activityKey?: string;
  activityName?: string;
  activityInstanceId?: string;
  taskId?: string;
  /** @deprecated not in OpenAPI — prefer durationMillis */
  duration?: number;
  durationMillis?: number;
  startTime?: string;
  endTime?: string;
  executionId?: string;
  processInstanceId?: string;
  status?: string;
  type?: string;
  treeNumber?: string;
  assignee?: string;
  candidateUsers?: string;
  candidateGroups?: string;
  variables?: TaskVariables[];
  forms?: TaskVariables[];
  userProfileAssignee?: UserProfile;
}

export type ActivityProgressDTO = ActivityProgress;
