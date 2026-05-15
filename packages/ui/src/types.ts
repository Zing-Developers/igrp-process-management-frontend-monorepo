import type { ComponentType, ReactNode } from "react";
import type { IGRPStepProcessProps } from "@igrp/igrp-framework-react-design-system";
import type { FormKeyType } from "./lib/form-key-utils";
import type {
  ActivityProgress,
  ProcessInstance,
  Task,
} from "@igrp/platform-process-management-types";

export interface IGRPFetchStepConfigResult {
  name: string;
  version: string;
  statusDesc: string;
  number: string;
  startedAt: string;
  variables: Array<{ name: string; value: unknown }>;
  userTaskKey: string | null;
  steps: IGRPStepProcessProps[];
}

export interface IGRPStepConfigParams {
  processKey: string;
  processInstanceId: string;
  userTaskInstanceId: string;
  userTaskKey: string;
}

export interface IGRPTaskResult {
  success: boolean;
  title: string;
  message: string;
}

export interface IGRPCompleteTaskParams {
  userTaskInstanceId: string;
  variables?: Array<{ name: string; value: string }>;
  forms?: Array<{ name: string; value: string }>;
}

export interface IGRPSaveTaskParams {
  userTaskInstanceId: string;
  variables?: Array<{ name: string; value: string }>;
  forms?: Array<{ name: string; value: string }>;
}

export interface IGRPProcessActions {
  fetchStepConfig: (
    params: IGRPStepConfigParams,
  ) => Promise<IGRPFetchStepConfigResult>;
  callCompleteTask: (params: IGRPCompleteTaskParams) => Promise<IGRPTaskResult>;
  callSaveTask: (params: IGRPSaveTaskParams) => Promise<IGRPTaskResult>;
}

export interface IGRPStepComponentConfig {
  variables?: Array<{ name: string; value: string }>;
  processKey: string;
  processInstanceId: string;
  userTaskInstanceId: string;
  processName: string;
  processNumber: string;
  onRegisterMethods: (methods: IGRPStepMethods) => void;
  loading?: boolean;
}

export interface IGRPStepMethods {
  saveStep: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
  completeStep: () => Promise<{
    success: boolean;
    nextStep?: number;
    callActivity?: string;
    data?: unknown;
    error?: string;
  }>;
}

export interface Form {
  type: FormKeyType;
  page: string;
  version: string;
}

export interface IGRPResolveStepComponentParams {
  processKey: string;
  version: string;
  userTaskKey: string;
  processName: string;
  form: Form;
}

export type IGRPStepComponentProps = {
  config: IGRPStepComponentConfig;
};

/** Função que resolve o componente do step (ex.: dynamic import no app). */
export type IGRPResolveStepComponent = (
  params: IGRPResolveStepComponentParams,
) => Promise<ComponentType<IGRPStepComponentProps>>;

/** Configuração do cliente da API de gestão de processo (base URL + token). */
export interface IGRPProcessClientConfig {
  /** URL base da API de gestão de processo (ex: process.env.PROCESS_MANAGEMENT_CLIENT_BASE_URL). */
  baseUrl: string;
  /** Token de acesso para autenticação na API. */
  accessToken: string | null;
  /** Base path do componente do step (ex: "/(igrp)/(generated)/process"). */
  basePathComponent?: string;
}

export interface IGRPProcessPageRendererProps {
  stepConfig: StepConfigResult;
  processKey: string;
  userTaskKey: string;
  processInstanceId: string;
  userTaskInstanceId: string;
  resolveStepComponent?: IGRPResolveStepComponent | null;
}

/** Entrada (nome/valor) de uma variável BPMN do processo. */
export interface IGRPProcessVariable {
  name: string;
  value: unknown;
}

/** Entrada de form persistida no engine BPMN. */
export type IGRPFormEntry = IGRPProcessVariable;

/**
 * Opções para `getFormDataForTask`.
 *
 * Permite que, quando o step actual ainda não tem dados persistidos,
 * a função carregue automaticamente os dados do histórico do MESMO step
 * — útil em ciclos de rectificação (RECTIFICAR/RETIFICAR) onde o
 * utilizador volta a uma etapa anterior.
 */
export interface IGRPGetFormDataForTaskOptions {
  /**
   * Quando o step actual não tem dados ainda, tentar carregar do
   * histórico do MESMO step (taskKey actual). Útil em ciclos de
   * RECTIFICAR onde o utilizador volta a uma etapa anterior.
   * @default false
   */
  fallbackToHistory?: boolean;

  /**
   * Variáveis BPMN do processo. Quando passado, o fallback só dispara
   * se houver uma `decision` com valor "RECTIFICAR" (ou "RETIFICAR"
   * legacy) — evita reidratar acidentalmente em cenários onde o step
   * actual está vazio por outras razões.
   * Opcional: se omitido, o fallback dispara sempre que current está vazio.
   */
  variables?: Array<IGRPProcessVariable>;
}

export interface IGRPStepResult {
  success: boolean;
  error?: string;
  variables?: Array<{ name: string; value: string }> | undefined;
  forms?: Array<{ name: string; value: string }> | undefined;
}

export interface StepResolverProps {
  resolve:
    | IGRPResolveStepComponent
    | { default: ComponentType<IGRPStepComponentProps> };
  params: IGRPResolveStepComponentParams;
  config: IGRPStepComponentConfig;
  loadingFallback: ReactNode;
}

export interface StepConfigResult {
  task?: Task;
  processInstance: ProcessInstance;
  variables: Array<{ name: string; value: any }>;
  userTaskKey: string | null;
  steps: IGRPStepProcessProps[];
  form?: Form;
  activityProgress: ActivityProgress[];
}

export interface StepConfigParams {
  processKey: string;
  processInstanceId: string;
  userTaskInstanceId: string;
  userTaskKey: string;
}

export interface TaskResult {
  success: boolean;
  title: string;
  message: string;
}

export interface CompleteTaskParams {
  userTaskInstanceId: string;
  variables?: Array<{ name: string; value: string }>;
  forms?: Array<{ name: string; value: string }>;
}

export interface SaveTaskParams {
  userTaskInstanceId: string;
  variables?: Array<{ name: string; value: string }>;
  forms?: Array<{ name: string; value: string }>;
}
