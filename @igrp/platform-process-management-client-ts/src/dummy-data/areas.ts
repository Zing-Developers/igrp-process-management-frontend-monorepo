import {
  Area,
  AreaProject,
  Project,
  AreaWithProjects,
  PaginatedResponse
} from '@igrp/platform-process-management-types';

export const dummyAreas: Area[] = [
  {
    id: '1',
    code: 'TECH',
    name: 'Tecnologia',
    description: 'Área de Tecnologia da Informação',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'HR',
    name: 'Recursos Humanos',
    description: 'Área de Gestão de Pessoas',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'TECH_DEV',
    name: 'Desenvolvimento',
    description: 'Subárea de Desenvolvimento de Software',
    area_fk: '1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'TECH_INFRA',
    name: 'Infraestrutura',
    description: 'Subárea de Infraestrutura de TI',
    area_fk: '1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    code: 'HR_RECRUIT',
    name: 'Recrutamento',
    description: 'Subárea de Recrutamento e Seleção',
    area_fk: '2',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    code: 'HR_PAYROLL',
    name: 'Folha de Pagamento',
    description: 'Subárea de Folha de Pagamento',
    area_fk: '2',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const dummyProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'Sistema de Gestão',
    description: 'Sistema principal de gestão empresarial',
    app_code: 'IGRP',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj_2',
    name: 'Portal do Cliente',
    description: 'Portal de atendimento ao cliente',
    app_code: 'PORTAL',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj_3',
    name: 'Sistema de Relatórios',
    description: 'Sistema de geração de relatórios',
    app_code: 'IGRP',
    status: 'INACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj_4',
    name: 'Sistema de RH',
    description: 'Sistema de gestão de recursos humanos',
    app_code: 'HR_SYSTEM',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'proj_5',
    name: 'Portal de Vagas',
    description: 'Portal para publicação e gestão de vagas',
    app_code: 'JOBS_PORTAL',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Enhanced area-project associations
export const dummyAreaProjects: AreaProject[] = [
  // Tecnologia area projects
  {
    id: 'area_proj_1',
    area_fk: '1',
    project_id: 'proj_1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'area_proj_2',
    area_fk: '1',
    project_id: 'proj_2',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Development subarea projects
  {
    id: 'area_proj_3',
    area_fk: '3',
    project_id: 'proj_1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'area_proj_4',
    area_fk: '3',
    project_id: 'proj_3',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Infrastructure subarea projects
  {
    id: 'area_proj_5',
    area_fk: '4',
    project_id: 'proj_2',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // HR area projects
  {
    id: 'area_proj_6',
    area_fk: '2',
    project_id: 'proj_4',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Recruitment subarea projects
  {
    id: 'area_proj_7',
    area_fk: '5',
    project_id: 'proj_5',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Payroll subarea projects
  {
    id: 'area_proj_8',
    area_fk: '6',
    project_id: 'proj_4',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const createDummyArea = (areaData: any): Area => ({
  id: `area_${Date.now()}`,
  code: areaData.code,
  name: areaData.name,
  description: areaData.description,
  area_fk: areaData.area_fk,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const createDummyUpdatedArea = (id: string, areaData: any): Area => ({
  id,
  code: areaData.code || 'UPDATED_CODE',
  name: areaData.name || 'Updated Area',
  description: areaData.description,
  area_fk: areaData.area_fk,
  updatedAt: new Date().toISOString()
});

export const getDummyAreaById = (id: string): Area => ({
  id,
  code: 'SAMPLE_CODE',
  name: 'Sample Area',
  description: 'Sample area description',
  createdAt: '2024-01-01T00:00:00Z'
});

export const getDummySubareas = (parentAreaId: string): Area[] => 
  dummyAreas.filter(area => area.area_fk === parentAreaId);

export const getDummyProjectsByAppCode = (appCode: string): Project[] => 
  dummyProjects.filter(project => project.app_code === appCode);

export const createDummyAreaProject = (associationData: any): AreaProject => ({
  id: `area_proj_${Date.now()}`,
  area_fk: associationData.area_fk,
  project_id: associationData.project_id,
  createdAt: new Date().toISOString()
});

export const getDummyAreaProjects = (areaId: string): AreaProject[] => 
  dummyAreaProjects.filter(ap => ap.area_fk === areaId);

export const getDummyAreaWithProjects = (areaId: string): AreaWithProjects => {
  const area = dummyAreas.find(a => a.id === areaId);
  if (!area) {
    throw new Error(`Area with id ${areaId} not found`);
  }

  // Get projects associated with this area
  const areaProjectAssociations = dummyAreaProjects.filter(ap => ap.area_fk === areaId);
  const projects = areaProjectAssociations.map(ap => 
    dummyProjects.find(p => p.id === ap.project_id)
  ).filter(Boolean) as Project[];

  // Get subareas
  const subareas = dummyAreas
    .filter(subarea => subarea.area_fk === areaId)
    .map(subarea => getDummyAreaWithProjects(subarea.id));

  return {
    ...area,
    projects,
    subareas
  };
};

export const getDummyAreasPaginated = (page = 0, size = 20): PaginatedResponse<Area> => ({
  content: dummyAreas,
  totalElements: dummyAreas.length,
  totalPages: Math.ceil(dummyAreas.length / size),
  pageSize: size,
  pageNumber: page,
  first: page === 0,
  last: page >= Math.ceil(dummyAreas.length / size) - 1,
  empty: dummyAreas.length === 0
});

export const getDummyProjectsPaginated = (page = 0, size = 20): PaginatedResponse<Project> => ({
  content: dummyProjects,
  totalElements: dummyProjects.length,
  totalPages: Math.ceil(dummyProjects.length / size),
  pageSize: size,
  pageNumber: page,
  first: page === 0,
  last: page >= Math.ceil(dummyProjects.length / size) - 1,
  empty: dummyProjects.length === 0
});