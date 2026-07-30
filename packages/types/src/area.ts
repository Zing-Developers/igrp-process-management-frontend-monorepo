import { Process } from "./process";

export type AreaStatus = "ACTIVE" | "INACTIVE";

export interface Area {
  id: string;
  code: string;
  name: string;
  applicationBase: string;
  areaId?: string; // Parent area ID for subareas
  status: AreaStatus | string;
  statusDesc: string;
  process?: Process[]; // Array of processes associated with this area
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  description?: string;
  color?: string;
}

/** AreaRequestDTO */
export interface CreateAreaRequest {
  code: string;
  name: string;
  description?: string;
  applicationBase: string;
  parentId?: string;
  color?: string;
}

/** AreaRequestDTO (partial update) */
export interface UpdateAreaRequest {
  code?: string;
  name?: string;
  description?: string;
  applicationBase: string;
  parentId?: string;
  color?: string;
}

export interface AreaWithProcesses extends Area {
  process?: Process[];
  subareas?: AreaWithProcesses[];
}

// Process data structure used in area-client
export interface ProcessData {
  processKey: string;
  releaseId: string;
  version: string;
  name: string;
}
