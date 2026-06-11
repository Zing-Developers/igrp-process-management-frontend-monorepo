"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import {
  IGRPPageHeader,
  IGRPButton,
  IGRPIcon,
  IGRPLoadingSpinner,
  IGRPStepperProcess,
  IGRPCardPrimitive,
  IGRPCardContentPrimitive,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { ProcessDetailsCard } from "./components/process-details-card";
import type {
  IGRPStepComponentConfig,
  IGRPStepComponentProps,
  IGRPStepMethods,
  IGRPProcessPageRendererProps,
  IGRPStepResult,
  StepResolverProps,
} from "./types";
import { IGRPConfirmationDialog } from "./components/igrp-confirmation-dialog";
import { useIGRPProcessContext } from "./igrp-process-context";

const IGRPStepLoading = ({ userTaskKey }: { userTaskKey: string }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <IGRPLoadingSpinner />
    <p className="text-sm text-gray-500">Loading {userTaskKey} step...</p>
  </div>
);

/** Fallback quando o step não é encontrado (ex.: módulo não existe em runtime). */
const StepLoadError = ({
  processKey,
  version,
  userTaskKey,
  message,
}: {
  processKey: string;
  version: string;
  userTaskKey: string;
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[120px] p-4 text-amber-600">
    <p className="text-sm font-medium">Componente do step não encontrado</p>
    <p className="text-xs mt-1 text-center">
      {processKey} / {version} / {userTaskKey}
    </p>
    {message && (
      <p
        className="text-xs mt-1 text-red-500 truncate max-w-full"
        title={message}
      >
        {message}
      </p>
    )}
  </div>
);

function StepResolver({
  resolve,
  params,
  config,
  loadingFallback,
}: StepResolverProps) {
  const [Component, setComponent] =
    useState<ComponentType<IGRPStepComponentProps> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setComponent(null);
    setError(null);

    const load = (): Promise<ComponentType<IGRPStepComponentProps>> => {
      if (typeof resolve === "function") return resolve(params);
      if (resolve && typeof resolve === "object" && "default" in resolve) {
        const d = (
          resolve as { default: ComponentType<IGRPStepComponentProps> }
        ).default;
        if (d != null) return Promise.resolve(d);
      }
      return Promise.reject(new Error("resolveStepComponent inválido"));
    };

    load()
      .then((C) => {
        if (!cancelled) setComponent(() => C);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      });
    return () => {
      cancelled = true;
    };
  }, [
    resolve,
    params.processKey,
    params.version,
    params.userTaskKey,
    params.processName,
    params.form,
  ]);

  if (error) {
    return (
      <StepLoadError
        processKey={params.processKey}
        version={params.version}
        userTaskKey={params.userTaskKey}
        message={error.message}
      />
    );
  }
  if (!Component) return <>{loadingFallback}</>;
  return <Component config={config} />;
}

export default function IGRPProcessPageRenderer({
  stepConfig,
  processKey,
  userTaskKey,
  processInstanceId,
  userTaskInstanceId,
  resolveStepComponent: resolveStepComponentProp,
}: IGRPProcessPageRendererProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stepMethods, setStepMethods] = useState<IGRPStepMethods | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Latches `true` once `completeTask` succeeds. Drives:
  //  - hiding Save / Complete Task buttons (no double-submit)
  //  - locking the step content so the user can't keep editing
  //  - opening the success dialog as non-dismissable (user must press Voltar)
  const [taskCompleted, setTaskCompleted] = useState(false);

  const { igrpToast } = useIGRPToast();
  const router = useRouter();
  const {
    completeTask,
    saveTask,
    isLoading,
    resolveStepComponent: resolveStepComponentContext,
  } = useIGRPProcessContext();

  const { processInstance, steps, variables, form, activityProgress } =
    stepConfig || {};

  const { name, version, statusDesc, number } = processInstance || {};

  /**
   * Compat layer — the backend currently returns `userTaskKey: null` and
   * marks every entry in `steps[]` as `isCompleted: true` once any task has
   * been executed at least once. After a rectification loop (when the
   * process moves back to a previous step) the stepper renders everything
   * green even though one of the steps is actually in progress.
   *
   * Until the backend is corrected, we rebuild the truth from
   * `activityProgress`, which always contains one entry with
   * `status: "CURRENT"` pointing at the activity the engine has open.
   * Steps before the current index become "completed", steps after stay
   * "future". If no CURRENT entry exists (process finished) we mark all
   * steps as completed.
   */
  const effectiveUserTaskKey = useMemo(() => {
    const current = (activityProgress || []).find(
      (a) => a.status === "CURRENT",
    );
    return current?.activityId ?? userTaskKey ?? null;
  }, [activityProgress, userTaskKey]);

  const effectiveSteps = useMemo(() => {
    if (!steps || steps.length === 0) return steps;
    const currentIndex = effectiveUserTaskKey
      ? steps.findIndex((s) => s.stepKey === effectiveUserTaskKey)
      : -1;
    // No CURRENT activity → assume the process is done; keep everything green.
    if (currentIndex === -1) {
      return steps.map((s) => ({
        ...s,
        isCompleted: true,
        isActive: false,
      }));
    }
    return steps.map((s, i) => ({
      ...s,
      isCompleted: i < currentIndex,
      isActive: i === currentIndex,
    }));
  }, [steps, effectiveUserTaskKey]);

  const resolveStepComponent =
    resolveStepComponentProp ?? resolveStepComponentContext ?? null;

  const urlBackTemp = useMemo(() => {
    const IGRP_BASE_PATH = process.env.NEXT_PUBLIC_IGRP_BASE_PATH;
    const IGRP_APP_PAGE_TASK = process.env.NEXT_PUBLIC_IGRP_APP_PAGE_TASK || "";
    if (IGRP_BASE_PATH) {
      return `${window.location.origin}/apps/igrp-process-management/my-tasks`;
    }
    return IGRP_APP_PAGE_TASK || `/`;
  }, []);

  // Callback to register step methods
  const handleRegisterMethods = useCallback((methods: IGRPStepMethods) => {
    setStepMethods(methods);
  }, []);

  // Handle save action
  const handleSave = async () => {
    try {
      // Call the dynamic step's save method
      if (stepMethods && stepMethods.saveStep) {
        const stepResult: IGRPStepResult = await stepMethods.saveStep();
        if (stepResult.success) {
          const saveResult = await saveTask({
            userTaskInstanceId,
            variables: stepResult.variables,
            forms: stepResult.forms,
          });
          if (saveResult && saveResult.success) {
            igrpToast({
              type: "success",
              title: saveResult.title,
              description: saveResult.message,
            });
          } else {
            igrpToast({
              type: "error",
              title: saveResult.title,
              description: saveResult.message,
            });
          }
        } else {
          igrpToast({
            type: "error",
            title: stepResult.error,
          });
        }
        return stepResult;
      }

      return { success: true, data: undefined };
    } catch (error) {
      console.error("Save error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Handle complete task action
  const handleCompleteTask = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    // Defense in depth: even if the buttons are hidden after success, swallow
    // any reentrant call (keyboard shortcut, programmatic dispatch, …) to
    // guarantee the task is submitted at most once per page load.
    if (taskCompleted || isLoading) {
      return { success: false, error: "Already submitted" };
    }
    try {
      // First, try to call the dynamic step's complete method
      let stepResult: IGRPStepResult = {
        success: false,
        error: "Step is not ready",
      };

      if (stepMethods && stepMethods.completeStep) {
        stepResult = await stepMethods.completeStep();
        if (!stepResult.success) {
          setErrorMessage(stepResult.error || "Error completing step");
          setShowErrorDialog(true);
          return stepResult;
        }
      }

      // If step completion is successful, handle BPMN process logic
      if (stepResult.success) {
        const result = await completeTask({
          userTaskInstanceId,
          variables: stepResult.variables,
          forms: stepResult.forms,
        });
        if (result?.success) {
          // Latch FIRST so the buttons are hidden before the dialog renders,
          // and any in-flight click that races with the response is rejected
          // by the guard above.
          setTaskCompleted(true);
          setShowSuccessDialog(true);
        } else {
          setErrorMessage(
            `${result?.title ? `${result?.title} - ` : ""}${result?.message}`,
          );
          setShowErrorDialog(true);
        }
      }

      return stepResult;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(errorMsg);
      setShowErrorDialog(true);
      console.error("Complete task error:", error);
      return { success: false, error: errorMsg };
    }
  };

  const currentStep = useMemo(() => {
    return (
      (effectiveSteps || []).findIndex(
        (step: any) => step.stepKey === effectiveUserTaskKey,
      ) + 1
    );
  }, [effectiveSteps, effectiveUserTaskKey]);

  return (
    <div className="flex flex-col gap-6">
      <IGRPPageHeader
        title={name}
        className="py-0"
        iconBackButton={`ArrowLeft`}
        isSticky={true}
        showBackButton={true}
        urlBackButton={urlBackTemp}
      >
        <div className="flex gap-2">
          <IGRPButton
            variant="ghost"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="h-9 gap-2"
          >
            <span className="text-sm font-medium">{number}</span>
            {isDetailsOpen ? (
              <IGRPIcon iconName="ChevronUp" />
            ) : (
              <IGRPIcon iconName="ChevronDown" />
            )}
            <span className="sr-only">Toggle details</span>
          </IGRPButton>
          {statusDesc != "COMPLETED" && !taskCompleted && (
            <>
              <IGRPButton
                variant="outline"
                onClick={() => {
                  handleSave();
                }}
                iconName="Save"
                showIcon={true}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </IGRPButton>
              <IGRPButton
                variant="default"
                onClick={() => {
                  handleCompleteTask();
                }}
                disabled={isLoading}
                showIcon={true}
                iconName="CircleCheckBig"
              >
                {isLoading ? "Processing..." : "Complete Task"}
              </IGRPButton>
            </>
          )}
        </div>
      </IGRPPageHeader>

      <ProcessDetailsCard
        isVisible={isDetailsOpen}
        processInstance={processInstance}
      />

      <IGRPConfirmationDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        textHeader="Tarefa completada com sucesso!"
        description="A tarefa foi completada com sucesso!"
        // Only way out is the confirm button — Esc, X and backdrop are no-ops.
        // Prevents the user from staying on the page in a "submitted but not
        // navigated" limbo where the form is still visible.
        dismissable={false}
        labelBtnConfirm="Voltar"
        confirmDelete={async () => {
          setShowSuccessDialog(false);
          // `replace` so the back button does not return to the completed
          // task page (which would now be locked and confusing).
          router.replace(urlBackTemp as any);
        }}
        isCompleted={true}
      />

      <IGRPConfirmationDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        labelBtnConfirm="Fechar"
        textHeader="Tarefa não completada!"
        description="A tarefa não foi completada devido a erros, por favor verifique os detalhes abaixo e tente novamente!"
        message={errorMessage}
        confirmDelete={async () => {
          setShowErrorDialog(false);
        }}
        isCompleted={false}
      />

      <IGRPStepperProcess
        steps={effectiveSteps}
        // Suppress the per-step loading spinner once the task is committed.
        // The success dialog (non-dismissable) already conveys "done" — leaving
        // the spinner on while the user reads it makes the step look stuck.
        isLoading={isLoading && !taskCompleted}
        currentStep={currentStep}
      >
        {(currentStepIndex: number) => {
          const stepConfig = effectiveSteps[currentStepIndex - 1];
          if (stepConfig?.stepKey !== effectiveUserTaskKey) return <></>;

          const stepComponentConfig: IGRPStepComponentConfig = {
            processKey,
            processInstanceId,
            userTaskInstanceId,
            variables,
            processName: name,
            processNumber: number,
            onRegisterMethods: handleRegisterMethods,
          };

          if (!resolveStepComponent) {
            return (
              <IGRPCardPrimitive>
                <IGRPCardContentPrimitive>
                  <div className="flex flex-col items-center justify-center min-h-[120px] p-4 text-amber-600">
                    <p className="text-sm font-medium">
                      resolveStepComponent é obrigatório
                    </p>
                    <p className="text-xs mt-1 text-center">
                      Passe resolveStepComponent ao IGRPProcessProvider (ex.:
                      dynamic import na app com prefixo estático).
                    </p>
                  </div>
                </IGRPCardContentPrimitive>
              </IGRPCardPrimitive>
            );
          }

          return (
            <IGRPCardPrimitive>
              <IGRPCardContentPrimitive
                // Once the task is submitted, the step content stays mounted
                // (so the success dialog can overlay it) but becomes
                // uninteractive — no more keystrokes, clicks or focus moves
                // until the user navigates away via the dialog.
                className={
                  taskCompleted
                    ? "pointer-events-none select-none opacity-60"
                    : undefined
                }
                aria-disabled={taskCompleted}
              >
                <StepResolver
                  resolve={resolveStepComponent}
                  params={{
                    processKey,
                    version,
                    userTaskKey,
                    processName: name,
                    form: form || {
                      type: "shared" as const,
                      page: "default",
                      version: "1",
                    },
                  }}
                  config={stepComponentConfig}
                  loadingFallback={<IGRPStepLoading userTaskKey={name} />}
                />
              </IGRPCardContentPrimitive>
            </IGRPCardPrimitive>
          );
        }}
      </IGRPStepperProcess>
    </div>
  );
}
export { IGRPProcessPageRenderer };
