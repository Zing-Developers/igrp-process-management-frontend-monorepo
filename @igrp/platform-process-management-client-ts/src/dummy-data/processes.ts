import { Process } from '@igrp/platform-process-management-types';

export const processes: Process[] = [
  // Sistema de Gestão (cb919966-30d4-4933-a82f-91b84fb4a940) processes
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
  },
  // Portal do Cliente (portal-cliente-001) processes
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
  },
  // Sistema de Relatórios (sistema-relatorios-001) processes
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
  },
  // Sistema de RH (sistema-rh-001) processes
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
  },
  // Portal de Vagas (portal-vagas-001) processes
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
];
