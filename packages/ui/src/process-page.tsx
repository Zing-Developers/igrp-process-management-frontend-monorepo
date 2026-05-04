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
    return (
      <IGRPLoadingSpinner className="flex justify-center items-center h-screen" />
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
