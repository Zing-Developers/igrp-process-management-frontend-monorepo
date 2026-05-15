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

/** Entrada de form persistida no engine BPMN. */
export interface IGRPFormEntry {
  name: string;
  value: unknown;
}

/**
 * Opções para `getFormDataForTask`.
 *
 * A lib oferece apenas o mecanismo genérico: "se o step actual está
 * vazio, cai no histórico". A decisão de QUANDO activar pertence ao
 * consumidor (que conhece as regras de negócio do seu processo —
 * ex.: ciclos de RECTIFICAR).
 */
export interface IGRPGetFormDataForTaskOptions {
  /**
   * Quando `true` E o step actual está vazio, carrega automaticamente
   * do histórico do MESMO step (via `getFormDataByTaskKey(userTaskKey)`).
   *
   * O consumidor é responsável por decidir quando activar — tipicamente
   * com base em regras de negócio do seu processo, ex.:
   *
   * ```ts
   * const isRectifying = decision === "RECTIFICAR";
   * getFormDataForTask({ fallbackToHistory: isRectifying });
   * ```
   *
   * @default false
   */
  fallbackToHistory?: boolean;
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
