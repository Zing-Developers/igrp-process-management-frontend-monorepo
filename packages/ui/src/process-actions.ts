"use server";

import type { IGRPStepProcessProps } from "@igrp/igrp-framework-react-design-system";
import type { IGRPProcessClientConfig, IGRPStepConfigParams } from "./types";
import { getIGRPProcessClient } from "./lib/api-client";

export interface FetchStepConfigResult {
  name: string;
  version: string;
  statusDesc: string;
  number: string;
  startedAt: string;
  variables: Array<{ name: string; value: any }>;
  userTaskKey: string | null;
  steps: IGRPStepProcessProps[];
}

export async function fetchStepConfig(
  params: IGRPStepConfigParams,
  config: IGRPProcessClientConfig,
): Promise<FetchStepConfigResult> {
  const processManagementClient = await getIGRPProcessClient(config);

  const processInstance =
    await processManagementClient.processes.getProcessInstanceById(
      params.processInstanceId,
    );

  const processInstanceTaskStatus =
    await processManagementClient.processes.getProcessInstanceTaskStatus(
      params.processInstanceId,
    );

  const task = await processManagementClient.tasks.getTaskById(
    params.userTaskInstanceId,
  );

  const variables = [
    ...(task.data.variables || []),
    ...(processInstance.data.variables || []),
    ...[
      {
        name: `${params.userTaskInstanceId}_forms`,
        value: task.data.forms || [],
      },
    ],
  ];

  const userTaskKey = processInstanceTaskStatus.data.some(
    (item: { status: string }) => item.status === "CURRENT",
  )
    ? processInstanceTaskStatus.data.find(
        (item: { status: string }) => item.status === "CURRENT",
      )?.taskKey
    : null;

  const steps = processInstanceTaskStatus.data.map(
    (
      item: {
        name: string;
        description: string;
        status: string;
        taskKey: string;
      },
      index: number,
    ) => ({
      step: index + 1,
      title: item.name,
      description: item.description,
      isCompleted: item.status === "COMPLETED",
      isActive: item.status === "CURRENT",
      isSkipped: item.status === "CREATED",
      stepKey: item.taskKey,
    }),
  );

  return {
    name: processInstance.data.name || processInstance.data.procReleaseKey,
    version: `v${processInstance.data.version}`,
    statusDesc: processInstance.data.statusDesc,
    number: processInstance.data.number,
    startedAt: processInstance.data.startedAt,
    variables: variables,
    userTaskKey,
    steps,
  };
}

export async function callCompleteTask(
  {
    userTaskInstanceId,
    variables,
    forms,
  }: {
    userTaskInstanceId: string;
    variables?: Array<{ name: string; value: string }>;
    forms?: Array<{ name: string; value: string }>;
  },
  config: IGRPProcessClientConfig,
) {
  try {
    const processManagementClient = await getIGRPProcessClient(config);

    const filteredVariables = variables?.filter(
      (variable) => variable.value !== "" && variable.value !== undefined,
    );
    const filteredForms = forms?.filter(
      (form) => form.value !== "" && form.value !== undefined,
    );

    await processManagementClient.tasks.completeTask(userTaskInstanceId, {
      variables: filteredVariables,
      forms: filteredForms,
    });
    return {
      success: true,
      title: "Tarefa completada com sucesso!",
      message: "Tarefa completada com sucesso!",
    };
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function callSaveTask(
  {
    userTaskInstanceId,
    variables,
    forms,
  }: {
    userTaskInstanceId: string;
    variables?: Array<{ name: string; value: string }>;
    forms?: Array<{ name: string; value: string }>;
  },
  config: IGRPProcessClientConfig,
) {
  try {
    const processManagementClient = await getIGRPProcessClient(config);

    const filteredVariables = variables?.filter(
      (variable) => variable.value !== "" && variable.value !== undefined,
    );

    const filteredForms = forms?.filter(
      (form) => form.value !== "" && form.value !== undefined,
    );

    await processManagementClient.tasks.saveTask(userTaskInstanceId, {
      variables: filteredVariables,
      forms: filteredForms,
    });
    return {
      success: true,
      title: "Tarefa",
      message: "Tarefa salva com sucesso!",
    };
  } catch (error: unknown) {
    return handleError(error);
  }
}

function handleError(error: unknown): {
  success: boolean;
  title: string;
  message: string;
} {
  let details: Record<string, unknown> = {};
  if (error instanceof Error && "details" in error) {
    const errorDetails = (error as Error & { details: unknown }).details;
    if (typeof errorDetails === "string") {
      try {
        details = JSON.parse(errorDetails) as Record<string, unknown>;
      } catch (e) {
        console.log("error parse details", e, "error-details", errorDetails);
      }
    } else if (typeof errorDetails === "object" && errorDetails !== null) {
      details = errorDetails as Record<string, unknown>;
    }
  }
  return {
    success: false,
    title: (details.title as string) || "Error",
    message: (details.instance as string) || "Unknown error",
  };
}
