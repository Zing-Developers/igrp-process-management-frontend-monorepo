import {
  PaginatedResponse,
  PostResponse,
} from "@igrp/platform-process-management-types/dist/response";
import { BaseApiClient } from "./base-client";
import {
  ApiResponse,
  Area,
  CreateAreaRequest,
  Process,
  UpdateAreaRequest,
  ProcessData,
} from "@igrp/platform-process-management-types";

export class AreaClient extends BaseApiClient {
  /**
   * GET /areas - Get all areas with optional filters
   */
  async getAreas(params?: {
    code?: string;
    name?: string;
    applicationBase?: string;
    status?: string;
    parentId?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PaginatedResponse<Area>>> {
    return this.get<PaginatedResponse<Area>>("/areas", params);
  }

  /**
   * GET /areas/{id} - Get a specific area by ID
   */
  async getAreaById(id: string): Promise<ApiResponse<Area>> {
    return this.get<Area>(`/areas/${id}`);
  }

  /**
   * GET /areas/status - Get area status options
   */
  async getAreaStatus(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>("/areas/status");
  }

  /**
   * POST /areas - Create a new area
   */
  async createArea(area: CreateAreaRequest): Promise<ApiResponse<Area>> {
    return this.post<Area>("/areas", area);
  }

  /**
   * PUT /areas/{id} - Update an existing area
   */
  async updateArea(
    id: string,
    area: UpdateAreaRequest,
  ): Promise<ApiResponse<Area>> {
    return this.put<Area>(`/areas/${id}`, area);
  }

  /**
   * DELETE /areas/{id} - Delete an area
   */
  async deleteArea(id: string): Promise<ApiResponse<PostResponse>> {
    return this.delete<PostResponse>(`/areas/${id}`);
  }

  /**
   * GET /areas/{areaId}/process-definitions - Get processes associated with an area
   */
  async getAreaProcesses(
    areaId: string,
    params?: {
      processKey?: string;
      status?: string;
      releaseId?: string;
      page?: number;
      size?: number;
    },
  ): Promise<ApiResponse<PaginatedResponse<Process>>> {
    return this.get<PaginatedResponse<Process>>(
      `/areas/${areaId}/process-definitions`,
      params,
    );
  }

  /**
   * POST /areas/{areaId}/process-definitions - Associate a process to an area
   */
  async associateProcessToArea(
    areaId: string,
    processData: ProcessData,
  ): Promise<ApiResponse<Process>> {
    return this.post<Process>(
      `/areas/${areaId}/process-definitions`,
      processData,
    );
  }

  /**
   * DELETE /areas/{areaId}/process-definitions/{processDefinitionId} - Remove a process from an area
   */
  async removeProcessFromArea(
    areaId: string,
    processDefinitionId: string,
  ): Promise<ApiResponse<void>> {
    return this.delete<void>(
      `/areas/${areaId}/process-definitions/${processDefinitionId}`,
    );
  }
}
