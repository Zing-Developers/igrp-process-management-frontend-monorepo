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
    projectId: 'cb919966-30d4-4933-a82f-91b84fb4a940',
    code: 'IGRP',
    name: 'Sistema de Gestão',
    description: 'Sistema principal de gestão empresarial',
    active: true,
    app_code: 'IGRP',
    status: 'ACTIVE',
    processDefinitions: [
      {
        processDefinitionId: 'c396655e-850a-41d0-9280-90168ab6b8ea',
        projectId: 'cb919966-30d4-4933-a82f-91b84fb4a940',
        processKey: 'vacation_request',
        code: 'VAC_REQ',
        title: 'Processo de Gestão de Férias',
        description: 'Este processo automatiza o pedido e a aprovação de férias dos colaboradores.',
        version: '1.0',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_1',
        deploymentDate: '2023-01-10T10:00:00Z',
        category: 'Recursos Humanos',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/3062/3062334.png'
      },
      {
        processDefinitionId: 'expense-approval-001',
        projectId: 'cb919966-30d4-4933-a82f-91b84fb4a940',
        processKey: 'expense_approval',
        code: 'EXP_APP',
        title: 'Processo de Aprovação de Despesas',
        description: 'Processo para aprovação de despesas corporativas.',
        version: '1.1',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_2',
        deploymentDate: '2023-02-15T14:30:00Z',
        category: 'Financeiro',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/2621/2621864.png'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    projectId: 'portal-cliente-001',
    code: 'PORTAL',
    name: 'Portal do Cliente',
    description: 'Portal de atendimento ao cliente',
    active: true,
    app_code: 'PORTAL',
    status: 'ACTIVE',
    processDefinitions: [
      {
        processDefinitionId: 'customer-support-001',
        projectId: 'portal-cliente-001',
        processKey: 'customer_support',
        code: 'CUST_SUP',
        title: 'Processo de Atendimento ao Cliente',
        description: 'Processo para gestão de tickets de atendimento.',
        version: '2.0',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_3',
        deploymentDate: '2023-03-20T09:00:00Z',
        category: 'Atendimento',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/3062/3062334.png'
      },
      {
        processDefinitionId: 'customer-feedback-001',
        projectId: 'portal-cliente-001',
        processKey: 'customer_feedback',
        code: 'CUST_FEED',
        title: 'Processo de Feedback do Cliente',
        description: 'Coleta e análise de feedback dos clientes.',
        version: '1.0',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_4',
        deploymentDate: '2023-04-10T11:00:00Z',
        category: 'Qualidade',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/2621/2621864.png'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    projectId: 'sistema-relatorios-001',
    code: 'REPORTS',
    name: 'Sistema de Relatórios',
    description: 'Sistema de geração de relatórios',
    active: false,
    app_code: 'IGRP',
    status: 'INACTIVE',
    processDefinitions: [
      {
        processDefinitionId: 'financial-reports-001',
        projectId: 'sistema-relatorios-001',
        processKey: 'financial_reports',
        code: 'FIN_REP',
        title: 'Geração de Relatórios Financeiros',
        description: 'Processo automatizado para geração de relatórios financeiros.',
        version: '1.5',
        status: 'INACTIVE',
        statusDesc: 'Processo inativo',
        deploymentId: 'dep_5',
        deploymentDate: '2023-05-15T16:00:00Z',
        category: 'Relatórios',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/3062/3062334.png'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    projectId: 'sistema-rh-001',
    code: 'HR_SYS',
    name: 'Sistema de RH',
    description: 'Sistema de gestão de recursos humanos',
    active: true,
    app_code: 'HR_SYSTEM',
    status: 'ACTIVE',
    processDefinitions: [
      {
        processDefinitionId: 'onboarding-001',
        projectId: 'sistema-rh-001',
        processKey: 'employee_onboarding',
        code: 'EMP_ONB',
        title: 'Onboarding de Novo Colaborador',
        description: 'Processo para integração de novos colaboradores na empresa.',
        version: '2.0',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_6',
        deploymentDate: '2023-06-20T09:00:00Z',
        category: 'Recursos Humanos',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/3062/3062334.png'
      },
      {
        processDefinitionId: 'performance-review-001',
        projectId: 'sistema-rh-001',
        processKey: 'performance_review',
        code: 'PERF_REV',
        title: 'Processo de Avaliação de Desempenho',
        description: 'Avaliação periódica de desempenho dos colaboradores.',
        version: '1.3',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_7',
        deploymentDate: '2023-07-10T14:00:00Z',
        category: 'Recursos Humanos',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/2621/2621864.png'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    projectId: 'portal-vagas-001',
    code: 'JOBS',
    name: 'Portal de Vagas',
    description: 'Portal para publicação e gestão de vagas',
    active: true,
    app_code: 'JOBS_PORTAL',
    status: 'ACTIVE',
    processDefinitions: [
      {
        processDefinitionId: 'job-posting-001',
        projectId: 'portal-vagas-001',
        processKey: 'job_posting',
        code: 'JOB_POST',
        title: 'Processo de Publicação de Vagas',
        description: 'Publicação e gestão de vagas de emprego.',
        version: '1.0',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_8',
        deploymentDate: '2023-08-05T10:00:00Z',
        category: 'Recrutamento',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/3062/3062334.png'
      },
      {
        processDefinitionId: 'candidate-selection-001',
        projectId: 'portal-vagas-001',
        processKey: 'candidate_selection',
        code: 'CAND_SEL',
        title: 'Processo de Seleção de Candidatos',
        description: 'Triagem e seleção de candidatos para vagas.',
        version: '1.2',
        status: 'ACTIVE',
        statusDesc: 'Processo ativo e disponível',
        deploymentId: 'dep_9',
        deploymentDate: '2023-08-20T15:30:00Z',
        category: 'Recrutamento',
        thumbnail: 'https://cdn-icons-png.flaticon.com/512/2621/2621864.png'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Enhanced area-project associations
export const dummyAreaProjects: AreaProject[] = [
  // Tecnologia area projects
  {
    id: 'area_proj_1',
    area_fk: '1',
    project_id: 'cb919966-30d4-4933-a82f-91b84fb4a940',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'area_proj_2',
    area_fk: '1',
    project_id: 'portal-cliente-001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Development subarea projects
  {
    id: 'area_proj_3',
    area_fk: '3',
    project_id: 'cb919966-30d4-4933-a82f-91b84fb4a940',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'area_proj_4',
    area_fk: '3',
    project_id: 'sistema-relatorios-001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Infrastructure subarea projects
  {
    id: 'area_proj_5',
    area_fk: '4',
    project_id: 'portal-cliente-001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // HR area projects
  {
    id: 'area_proj_6',
    area_fk: '2',
    project_id: 'sistema-rh-001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Recruitment subarea projects
  {
    id: 'area_proj_7',
    area_fk: '5',
    project_id: 'portal-vagas-001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // Payroll subarea projects
  {
    id: 'area_proj_8',
    area_fk: '6',
    project_id: 'sistema-rh-001',
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

// Add this new function to get all area projects at once
export const getAllDummyAreaProjects = (): AreaProject[] => dummyAreaProjects;

export const getDummyAreaWithProjects = (areaId: string): AreaWithProjects => {
  const area = dummyAreas.find(a => a.id === areaId);
  if (!area) {
    throw new Error(`Area with id ${areaId} not found`);
  }

  // Get projects associated with this area
  const areaProjectAssociations = dummyAreaProjects.filter(ap => ap.area_fk === areaId);
  const projects = areaProjectAssociations.map(ap => 
    dummyProjects.find(p => p.projectId === ap.project_id)
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