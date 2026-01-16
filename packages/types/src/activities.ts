import { TaskVariables } from "./task";

export interface ActivityEvent {
  id: string;
  name: string;
  description: string;
  processInstanceId: string;
  parentId: string;
  parentProcessInstanceId: string;
  status: string;
  type: string;
  variables: [
    {
      name: string;
      value: string;
    },
  ];
}

export interface ActivityProgress {
  activityId: string;
  activityName: string;
  activityInstanceId: string;
  duration: number;
  durationMillis: number;
  startTime: Date;
  endTime: Date;
  executionId: string;
  processInstanceId: string;
  status: string;
  type: string;
  treeNumber: string;
  assignee: string;
  candidateUsers: string[];
  candidateGroups: string[];
  variables?: TaskVariables[];
  forms?: TaskVariables[];
}
