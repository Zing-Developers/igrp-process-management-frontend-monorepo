"use client";
import { IGRPLoadingSpinner } from "@igrp/igrp-framework-react-design-system/dist/components/horizon/loading-spiner";
import { useIGRPProcessContext } from "./igrp-process-context";
import { IGRPProcessPageRenderer } from "./process-page-renderer";

function IGRPProcessPage({ getBackUrl }: { getBackUrl?: () => string }) {
  const {
    stepConfig,
    isLoadingStepConfig,
    processKey,
    processInstanceId,
    userTaskKey,
    userTaskInstanceId,
  } = useIGRPProcessContext();

  const { version, statusDesc, number, steps, startedAt, name, variables } =
    stepConfig || {};

  if (isLoadingStepConfig || !stepConfig) {
    return (
      <div className="flex justify-center items-center h-screen">
        <IGRPLoadingSpinner />
      </div>
    );
  }

  return (
    <IGRPProcessPageRenderer
      version={version || ""}
      statusDesc={statusDesc || ""}
      number={number || ""}
      stepData={undefined}
      processKey={processKey}
      userTaskKey={userTaskKey}
      processName={name || ""}
      processInstanceId={processInstanceId}
      userTaskInstanceId={userTaskInstanceId}
      steps={steps || []}
      startedAt={startedAt || ""}
      variables={variables || []}
      getBackUrl={getBackUrl}
    />
  );
}

export { IGRPProcessPage };
