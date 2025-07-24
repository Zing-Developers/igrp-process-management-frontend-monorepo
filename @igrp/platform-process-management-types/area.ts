export interface Area {
  id: string;
  code: string;
  name: string;
  description?: string;
  area_fk?: string; // Parent area ID for subareas
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAreaRequest {
  code: string;
  name: string;
  description?: string;
  area_fk?: string; // Parent area ID for creating subareas
}

export interface UpdateAreaRequest {
  code?: string;
  name?: string;
  description?: string;
  area_fk?: string;
}

export interface AreaProject {
  id: string;
  area_fk: string;
  project_id: string;
  createdAt?: string;
}

export interface CreateAreaProjectRequest {
  area_fk: string;
  project_id: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  app_code: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface AreaWithProjects extends Area {
  projects?: Project[];
  subareas?: AreaWithProjects[];
}