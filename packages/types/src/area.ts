import type { Process } from "./process.js";
import type { PaginatedResponse } from "./response.js";

export type AreaStatus = "ACTIVE" | "INACTIVE";

export interface AreaDTO {
  id: string;
  code: string;
  name: string;
  applicationBase: string;
  areaId: string;
  status: AreaStatus;
  statusDesc?: string;
  process?: Process[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  description?: string;
  color?: string;
}

export type Area = AreaDTO;

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
  code: string;
  name: string;
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
  version?: string;
  name: string;
}

export type AreaRequestDTO = CreateAreaRequest;
export type ProcessDefinitionRequestDTO = ProcessData;

export interface AreaQuery {
  code?: string;
  name?: string;
  applicationBase?: string;
  status?: string;
  parentId?: string;
  page?: number;
  size?: number;
}

export interface AreaProcessDefinitionQuery {
  processKey?: string;
  status?: string;
  releaseId?: string;
  page?: number;
  size?: number;
}

export type AreaListPageDTO = PaginatedResponse<AreaDTO>;
