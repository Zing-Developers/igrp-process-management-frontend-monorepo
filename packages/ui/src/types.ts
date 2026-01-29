import type { ComponentType } from "react";
import type { IGRPStepProcessProps } from "@igrp/igrp-framework-react-design-system";

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

export interface IGRPResolveStepComponentParams {
  processKey: string;
  version: string;
  userTaskKey: string;
  processName: string;
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
  version: string;
  stepData?: undefined;
  processKey: string;
  userTaskKey: string;
  processName: string;
  processInstanceId: string;
  userTaskInstanceId: string;
  statusDesc: string;
  number: string;
  steps: IGRPStepProcessProps[];
  startedAt: string;
  variables: Array<{ name: string; value: string }>;
  resolveStepComponent?: IGRPResolveStepComponent | null;
  getBackUrl?: () => string;
}

export interface IGRPStepResult {
  success: boolean;
  error?: string;
  variables?: Array<{ name: string; value: string }> | undefined;
  forms?: Array<{ name: string; value: string }> | undefined;
}
