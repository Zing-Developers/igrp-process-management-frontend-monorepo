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
  activityKey: string;
  activityName: string;
  status: string;
  type: string;
  processInstanceId: string;
  assignee: string;
  candidateUsers: string[];
  candidateGroups: string[];
  startTime: Date;
  endTime: Date;
  durationMillis: number;
  activityId: string;
}
