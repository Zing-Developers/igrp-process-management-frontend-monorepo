export type Task = {
  id: string;
  taskKey: string;
  formKey: string;
  name: string;
  processInstanceId: string;
  processNumber: string;
  processName: string;
  assignedBy: string;
  status: "CREATED" | "ASSIGNED" | "COMPLETED" | "CANCELLED" | "DELETED";
  statusDesc?: string;
  startedAt: string;
  businessKey: string;
};
