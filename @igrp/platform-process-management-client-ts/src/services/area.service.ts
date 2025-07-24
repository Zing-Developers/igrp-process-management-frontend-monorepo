import { httpClient } from './http-client';
import {
  Area,
  CreateAreaRequest,
  UpdateAreaRequest,
  AreaProject,
  CreateAreaProjectRequest,
  Project,
  AreaWithProjects,
  PaginatedResponse
} from '@igrp/platform-process-management-types';
import {
  createDummyArea,
  createDummyUpdatedArea,
  getDummyAreaById,
  getDummySubareas,
  getDummyProjectsByAppCode,
  createDummyAreaProject,
  getDummyAreaProjects,
  getDummyAreaWithProjects,
  getDummyAreasPaginated,
  getDummyProjectsPaginated
} from '../dummy-data/areas';
import { apiConfig } from '../config/api.config';

// Area Management
export const createArea = async (areaData: CreateAreaRequest): Promise<Area> => {
  try {
    return await httpClient.post<Area>(apiConfig.endpoints.areas, areaData);
  } catch (error) {
    console.warn('API call failed, using fallback data for createArea');
    return createDummyArea(areaData);
  }
};

export const updateArea = async (id: string, areaData: UpdateAreaRequest): Promise<Area> => {
  try {
    return await httpClient.put<Area>(`${apiConfig.endpoints.areas}/${id}`, areaData);
  } catch (error) {
    console.warn('API call failed, using fallback data for updateArea');
    return createDummyUpdatedArea(id, areaData);
  }
};

export const deleteArea = async (id: string): Promise<void> => {
  try {
    await httpClient.delete(`${apiConfig.endpoints.areas}/${id}`);
  } catch (error) {
    console.warn('API call failed for deleteArea');
    // For demo purposes, just log the action
  }
};

export const getAreas = async (page = 0, size = 20): Promise<PaginatedResponse<Area>> => {
  try {
    return await httpClient.get<PaginatedResponse<Area>>(`${apiConfig.endpoints.areas}?page=${page}&size=${size}`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getAreas');
    return getDummyAreasPaginated(page, size);
  }
};

export const getAreaById = async (id: string): Promise<Area | null> => {
  try {
    return await httpClient.get<Area>(`${apiConfig.endpoints.areas}/${id}`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getAreaById');
    return getDummyAreaById(id);
  }
};

export const getSubareas = async (parentAreaId: string): Promise<Area[]> => {
  try {
    return await httpClient.get<Area[]>(`${apiConfig.endpoints.areas}/${parentAreaId}/subareas`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getSubareas');
    return getDummySubareas(parentAreaId);
  }
};

// Project Management
export const getProjectsByAppCode = async (appCode: string): Promise<Project[]> => {
  try {
    return await httpClient.get<Project[]>(`${apiConfig.endpoints.projects}?app_code=${appCode}`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getProjectsByAppCode');
    return getDummyProjectsByAppCode(appCode);
  }
};

export const getAllProjects = async (page = 0, size = 20): Promise<PaginatedResponse<Project>> => {
  try {
    return await httpClient.get<PaginatedResponse<Project>>(`${apiConfig.endpoints.projects}?page=${page}&size=${size}`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getAllProjects');
    return getDummyProjectsPaginated(page, size);
  }
};

// Area-Project Association
export const associateProjectToArea = async (associationData: CreateAreaProjectRequest): Promise<AreaProject> => {
  try {
    return await httpClient.post<AreaProject>(apiConfig.endpoints.areaProjects, associationData);
  } catch (error) {
    console.warn('API call failed, using fallback data for associateProjectToArea');
    return createDummyAreaProject(associationData);
  }
};

export const removeProjectFromArea = async (areaId: string, projectId: string): Promise<void> => {
  try {
    await httpClient.delete(`${apiConfig.endpoints.areaProjects}?area_fk=${areaId}&project_id=${projectId}`);
  } catch (error) {
    console.warn('API call failed for removeProjectFromArea');
    // For demo purposes, just log the action
  }
};

export const getAreaProjects = async (areaId: string): Promise<AreaProject[]> => {
  try {
    return await httpClient.get<AreaProject[]>(`${apiConfig.endpoints.areas}/${areaId}/projects`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getAreaProjects');
    return getDummyAreaProjects(areaId);
  }
};

export const getAreaWithProjects = async (areaId: string): Promise<AreaWithProjects | null> => {
  try {
    return await httpClient.get<AreaWithProjects>(`${apiConfig.endpoints.areas}/${areaId}/with-projects`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getAreaWithProjects');
    return getDummyAreaWithProjects(areaId);
  }
};