import type { ComponentType, ReactNode } from "react";
import type { IGRPStepProcessProps } from "@igrp/igrp-framework-react-design-system";
import type { FormKeyType } from "./lib/form-key-utils";
import type {
  ActivityProgress,
  ProcessInstance,
  Task,
} from "@irn/platform-process-management-types";

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

/** Runtime mode for the process page. */
export type IGRPProcessMode = "execution" | "consultation";

export interface IGRPStepConfigParams {
  /** Optional in consultation — resolved from process instance (`procReleaseKey`). */
  processKey?: string;
  /**
   * Process instance UUID **or** business process number (e.g. `MD-2026-1717`).
   * Consultation URLs may use either; the package resolves to the canonical id.
   */
  processInstanceId: string;
  /** Required for execution; optional/empty in consultation. */
  userTaskInstanceId?: string;
  /** Required for execution; optional/empty in consultation. */
  userTaskKey?: string;
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
  /** Used after complete to resolve the next assignee for IN_APP notify. */
  processInstanceId?: string;
  processKey?: string;
  processName?: string;
  processNumber?: string;
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
  /** When true, the step should render as read-only (consultation). */
  readOnly?: boolean;
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
  /**
   * Página para onde voltar depois de completar a tarefa, quando o URL da
   * tarefa não traz `?returnUrl=` (ex.: lista de tarefas do process-management
   * em cluster: `https://<host>/apps/igrp-process-management/my-tasks`).
   *
   * Deve ser lido pela app no servidor a partir de `IGRP_APP_PAGE_TASK`
   * (base da app Process Management) e passado com
   * `processManagementAppHref("my-tasks", process.env.IGRP_APP_PAGE_TASK)`.
   * Variáveis `NEXT_PUBLIC_*` são inlined no build e não apanham o env do
   * cluster.
   */
  taskReturnUrl?: string;
  /**
   * Página de resumo após concluir a tarefa (ex.: `/process/resumo`).
   * Quando definido, a lib **não** mostra o modal de sucesso e navega para
   * `{summaryPage}/{processInstanceId}`. Quando omitido, o modal verde
   * (Voltar / `returnUrl` / `taskReturnUrl`) mantém-se.
   */
  summaryPage?: string;
}

export interface IGRPProcessPageRendererProps {
  stepConfig: StepConfigResult;
  processKey: string;
  userTaskKey: string;
  processInstanceId: string;
  userTaskInstanceId: string;
  resolveStepComponent?: IGRPResolveStepComponent | null;
  /** Defaults to execution. Consultation hides mutations and allows step navigation. */
  mode?: IGRPProcessMode;
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
   * Activar o fallback quando o step actual está vazio.
   *
   * Aceita dois formatos:
   *
   * - `boolean` — `true` activa sempre que current está vazio.
   * - `(variables) => boolean` — predicate que recebe as variáveis BPMN
   *   do step actual (`stepConfig.variables`, injectadas pelo hook) e
   *   devolve `true`/`false`. Permite ao consumidor decidir com base
   *   em regras de negócio sem precisar de ir buscar as variáveis ao
   *   contexto.
   *
   * Exemplos:
   *
   * ```ts
   * // Sempre que vazio
   * getFormDataForTask({ fallbackToHistory: true });
   *
   * // Apenas em ciclos de rectificação (regra do consumidor)
   * getFormDataForTask({
   *   fallbackToHistory: (vars) => {
   *     const d = vars.find((v) => v.name === "decision")?.value;
   *     return typeof d === "string" &&
   *       ["RECTIFICAR", "RETIFICAR"].includes(d.toUpperCase());
   *   },
   * });
   * ```
   *
   * @default false
   */
  fallbackToHistory?: boolean | ((variables: Array<IGRPFormEntry>) => boolean);
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
  /** form definition per taskKey — used in consultation to resolve step components. */
  formsByStepKey?: Record<string, Form>;
  /** activityInstanceId (task id) per taskKey — used when injecting form variables. */
  taskIdsByStepKey?: Record<string, string>;
}

export interface StepConfigParams {
  processKey?: string;
  processInstanceId: string;
  userTaskInstanceId?: string;
  userTaskKey?: string;
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
  processInstanceId?: string;
  processKey?: string;
  processName?: string;
  processNumber?: string;
}

export interface SaveTaskParams {
  userTaskInstanceId: string;
  variables?: Array<{ name: string; value: string }>;
  forms?: Array<{ name: string; value: string }>;
}
