"use client";
import { IGRPLoadingSpinner } from "@igrp/igrp-framework-react-design-system";
import { useIGRPProcessContext } from "./igrp-process-context";
import { IGRPProcessPageRenderer } from "./process-page-renderer";

function IGRPProcessPage() {
  const {
    stepConfig,
    isLoadingStepConfig,
    stepConfigError,
    processKey,
    processInstanceId,
    userTaskKey,
    userTaskInstanceId,
    mode,
  } = useIGRPProcessContext();

  // Pending (no data yet, no error) must look like loading — never the
  // error fallback. That flash happened when isLoadingStepConfig was still
  // false on the first paint before useEffect kicked off the fetch.
  if (isLoadingStepConfig || (!stepConfig && !stepConfigError)) {
    // Compact loader that stays inside the host shell layout — using
    // `h-screen` here used to take over the whole viewport on top of any
    // app chrome the consumer renders around <IGRPProcessPage />.
    return (
      <div className="flex w-full items-center justify-center py-16">
        <IGRPLoadingSpinner />
      </div>
    );
  }

  if (stepConfigError || !stepConfig) {
    const message =
      stepConfigError?.message ||
      "Não foi possível carregar a configuração do processo.";
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 py-16 px-4 text-center">
        <p className="text-sm font-medium text-amber-600">
          Erro ao carregar o processo
        </p>
        <p className="text-xs text-muted-foreground max-w-lg break-words">
          {message}
        </p>
        {processInstanceId && (
          <p className="text-xs text-muted-foreground/80 font-mono">
            {processKey ? `${processKey} / ` : ""}
            {processInstanceId}
          </p>
        )}
      </div>
    );
  }

  return (
    <IGRPProcessPageRenderer
      stepConfig={stepConfig}
      processKey={processKey}
      userTaskKey={userTaskKey ?? ""}
      processInstanceId={processInstanceId}
      userTaskInstanceId={userTaskInstanceId ?? ""}
      mode={mode}
    />
  );
}

export { IGRPProcessPage };
