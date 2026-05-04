import { Process } from "./process";

export interface Area {
  id: string;
  code: string;
  name: string;
  applicationBase: string;
  areaId?: string; // Parent area ID for subareas
  status: string;
  statusDesc: string;
  process?: Process[]; // Array of processes associated with this area
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  description?: string;
  color?: string;
}

export interface CreateAreaRequest {
  code: string;
  name: string;
  description?: string;
  applicationBase: string;
  parentId?: string; // Parent area ID for creating subareas
}

export interface UpdateAreaRequest {
  code?: string;
  name?: string;
  description?: string;
  applicationBase: string;
  parentId?: string;
}

export interface AreaWithProcesses extends Area {
  process?: Process[];
  subareas?: AreaWithProcesses[];
}

// New type for process data structure used in area-client
export interface ProcessData {
  processKey: string;
  releaseId: string;
  version: string;
  name: string;
}
