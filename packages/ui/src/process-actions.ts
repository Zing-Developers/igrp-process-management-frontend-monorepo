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

  const activityProgressData = activityProgress.data?.filter(
    (item: any) => item.type === "USER_TASK",
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

  if (!params.userTaskInstanceId) {
    return {
      processInstance: processInstance.data,
      variables: processInstance.data.variables || [],
      userTaskKey,
      steps,
      activityProgress: activityProgressData,
    };
  }

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

  return {
    task: task.data,
    processInstance: processInstance.data,
    variables,
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

  const errorData = parseSaveTaskError(error);
  return {
    success: false,
    title: errorData.title,
    message: errorData.message,
  };
}

/**
 * {"type":"about:blank","title":"Failed to save task. Unable to find task for the given id: cceec5dc-10d3-11f1-a3b8-5efddd07dfd4 for user: a667f627-5602-4ac2-4ac2-1fb6072c71c8 (with groups: [DSIP, DC, GEP, DAAP, GPE, DEPT_IGRP.superadmin, IT, QA, DF, UBUBA, UB, DEPT_IGRP] & with roles: [ACTIVITI_USER, DEPT_IGRP.superadmin, ACTIVITI_ADMIN])","status":500,"instance":"/tasks-instances/231ff9b9-61bd-411e-a0cc-a3c759948149/save"}
 * @param error
 * @returns
 */
const parseSaveTaskError = (
  error: unknown,
): {
  title: string;
  message: string;
} => {
  const details = (error as { details?: string }).details;
  const status = (error as { status?: number }).status;
  if (status === 401) {
    return {
      title: "Não autorizado",
      message: "Não autorizado para completar a tarefa",
    };
  }
  if (!details)
    return {
      title: "Error",
      message: "Unknown error",
    };
  const errorData = JSON.parse(details);
  return {
    title: errorData.title || "Error",
    message:
      errorData.instance ||
      errorData.message ||
      `Call completed with unknown error: ${JSON.stringify(error, null, 2)}`,
  };
};
