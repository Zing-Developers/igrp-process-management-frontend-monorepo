"use client";
import { IGRPLoadingSpinner } from "@igrp/igrp-framework-react-design-system/dist/components/horizon/loading-spiner";
import { useIGRPProcessContext } from "./igrp-process-context";
import { IGRPProcessPageRenderer } from "./process-page-renderer";

function IGRPProcessPage() {
  const {
    stepConfig,
    isLoadingStepConfig,
    processKey,
    processInstanceId,
    userTaskKey,
    userTaskInstanceId,
  } = useIGRPProcessContext();

  if (isLoadingStepConfig || !stepConfig) {
    // Compact loader that stays inside the host shell layout — using
    // `h-screen` here used to take over the whole viewport on top of any
    // app chrome the consumer renders around <IGRPProcessPage />.
    return (
      <div className="flex w-full items-center justify-center py-16">
        <IGRPLoadingSpinner />
      </div>
    );
  }

  return (
    <IGRPProcessPageRenderer
      stepConfig={stepConfig}
      processKey={processKey}
      userTaskKey={userTaskKey}
      processInstanceId={processInstanceId}
      userTaskInstanceId={userTaskInstanceId}
    />
  );
}

export { IGRPProcessPage };
