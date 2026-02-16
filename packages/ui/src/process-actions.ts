"use server";

import type {
  IGRPProcessClientConfig,
  IGRPStepConfigParams,
  StepConfigResult,
} from "./types";
import { getIGRPProcessClient } from "./lib/api-client";
import {
  getFormKeyType,
  getKeyFromFormKey,
  getVersionFromFormKey,
} from "./lib/form-key-utils";
import type { ActivityProgress } from "@igrp/platform-process-management-types";

export async function fetchStepConfig(
  params: IGRPStepConfigParams,
  config: IGRPProcessClientConfig,
): Promise<StepConfigResult> {
  const processManagementClient = await getIGRPProcessClient(config);

  const processInstance =
    await processManagementClient.processes.getProcessInstanceById(
      params.processInstanceId,
    );

  const processInstanceTaskStatus =
    await processManagementClient.processes.getProcessInstanceTaskStatus(
      params.processInstanceId,
    );

  const activityProgress =
    await processManagementClient.activities.getActivityProgress(
      params.processInstanceId,
      "USER_TASK",
    );

  const task = await processManagementClient.tasks.getTaskById(
    params.userTaskInstanceId,
  );

  const formKey = task.data.formKey;

  const page = getKeyFromFormKey(formKey);
  const formType = getFormKeyType(formKey);
  const formVersion = getVersionFromFormKey(formKey);

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

  const activityProgressData = activityProgress.data?.filter(
    (item: ActivityProgress) => item.type === "USER_TASK",
  );

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
    task: task.data,
    name: processInstance.data.name || processInstance.data.procReleaseKey,
    version: `v${processInstance.data.version}`,
    statusDesc: processInstance.data.statusDesc,
    number: processInstance.data.number,
    startedAt: processInstance.data.startedAt,
    variables: variables,
    userTaskKey,
    steps,
    form: { type: formType, page, version: formVersion },
    activityProgress: activityProgressData,
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
  console.log("call completed with error", error);
  return {
    success: false,
    title: (error as { title?: string }).title || "Error",
    message:
      (error as { instance?: string }).instance ||
      (error as { message?: string }).message ||
      `Call completed with unknown error: ${JSON.stringify(error, null, 2)}`,
  };
}
