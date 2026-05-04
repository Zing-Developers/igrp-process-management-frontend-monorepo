"use client";

import { useState, useCallback, useEffect } from "react";
import {
  fetchStepConfig as fetchStepConfigAction,
  callCompleteTask as callCompleteTaskAction,
  callSaveTask as callSaveTaskAction,
} from "./process-actions";
import type {
  StepConfigResult,
  IGRPProcessClientConfig,
  StepConfigParams,
  TaskResult,
  SaveTaskParams,
  CompleteTaskParams,
} from "./types";
import type { ActivityProgress } from "@igrp/platform-process-management-types";

/**
 * Unified hook for process management operations.
 * Receives params (process/task ids) and config (API baseUrl + accessToken).
 * Config is used internally by fetchStepConfig, completeTask, saveTask and is
 * also exposed so consumers can use it via useIGRPProcessContext().
 */
export function useIGRPProcess(
  params: StepConfigParams,
  config: IGRPProcessClientConfig,
) {
  const { processKey, processInstanceId, userTaskInstanceId, userTaskKey } =
    params;
  // Step config state
  const [stepConfigData, setStepConfigData] = useState<StepConfigResult | null>(
    null,
  );
  const [isLoadingStepConfig, setIsLoadingStepConfig] = useState(false);
  const [stepConfigError, setStepConfigError] = useState<Error | null>(null);

  // Complete task state
  const [completeTaskResult, setCompleteTaskResult] =
    useState<TaskResult | null>(null);
  const [isLoadingCompleteTask, setIsLoadingCompleteTask] = useState(false);
  const [completeTaskError, setCompleteTaskError] = useState<Error | null>(
    null,
  );

  // Save task state
  const [saveTaskResult, setSaveTaskResult] = useState<TaskResult | null>(null);
  const [isLoadingSaveTask, setIsLoadingSaveTask] = useState(false);
  const [saveTaskError, setSaveTaskError] = useState<Error | null>(null);

  // Fetch step configuration
  const fetchStepConfig = useCallback(async (): Promise<StepConfigResult> => {
    setIsLoadingStepConfig(true);
    setStepConfigError(null);
    try {
      const result = await fetchStepConfigAction(params, config);
      setStepConfigData(result);
      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch step config");
      setStepConfigError(error);
      throw error;
    } finally {
      setIsLoadingStepConfig(false);
    }
  }, [params, config]);

  // Complete task
  const completeTask = useCallback(
    async (params: CompleteTaskParams): Promise<TaskResult> => {
      setIsLoadingCompleteTask(true);
      setCompleteTaskError(null);
      setCompleteTaskResult(null);
      try {
        const taskResult = await callCompleteTaskAction(params, config);
        setCompleteTaskResult(taskResult);
        return taskResult;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to complete task");
        setCompleteTaskError(error);
        throw error;
      } finally {
        setIsLoadingCompleteTask(false);
      }
    },
    [config],
  );

  // Save task
  const saveTask = useCallback(
    async (params: SaveTaskParams): Promise<TaskResult> => {
      setIsLoadingSaveTask(true);
      setSaveTaskError(null);
      setSaveTaskResult(null);
      try {
        const taskResult = await callSaveTaskAction(params, config);
        setSaveTaskResult(taskResult);
        return taskResult;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to save task");
        setSaveTaskError(error);
        throw error;
      } finally {
        setIsLoadingSaveTask(false);
      }
    },
    [config],
  );

  useEffect(() => {
    fetchStepConfig();
  }, [fetchStepConfig]);

  const getVariableNameForTask = useCallback(() => {
    return `${userTaskInstanceId}_forms`;
  }, [userTaskInstanceId]);

  const getVariableForTask = useCallback(
    (variableName: string) => {
      return stepConfigData?.variables?.find(
        (variable: { name: string; value: string }) =>
          variable.name === variableName,
      )?.value;
    },
    [stepConfigData],
  );

  const getFormDataForTask = useCallback(() => {
    const variableName = getVariableNameForTask();
    const variable = getVariableForTask(variableName);

    return variable;
  }, [stepConfigData, getVariableNameForTask]);
  
  const getFormDataByTaskKey = useCallback(
    (taskKey: string) => {
      const matches = stepConfigData?.activityProgress?.filter(
        (item: ActivityProgress) => item.activityId === taskKey,
      );

      if (!matches?.length) return undefined;

      const latest = matches.reduce((acc: ActivityProgress, current: ActivityProgress) => {
        const accTime = new Date(acc.endTime).getTime();
        const currentTime = new Date(current.endTime).getTime();

        if (Number.isNaN(accTime) && !Number.isNaN(currentTime)) return current;
        if (Number.isNaN(currentTime)) return acc;

        return currentTime >= accTime ? current : acc;
      });

      return latest.forms;
    },
    [stepConfigData],
  );

  return {
    // Config (API baseUrl + accessToken) – use for custom API calls or debugging
    config,

    // Process context
    processKey,
    processInstanceId,
    userTaskInstanceId,
    userTaskKey,

    // Step config
    stepConfig: stepConfigData,
    isLoadingStepConfig,
    stepConfigError,
    fetchStepConfig,

    // Complete task
    completeTaskResult,
    isLoadingCompleteTask,
    completeTaskError,
    completeTask,

    // Save task
    saveTaskResult,
    isLoadingSaveTask,
    saveTaskError,
    saveTask,

    // Helpers
    getVariableNameForTask,
    getVariableForTask,
    getFormDataForTask,
    getFormDataByTaskKey,

    // Combined loading state
    isLoading:
      isLoadingStepConfig || isLoadingCompleteTask || isLoadingSaveTask,
  };
}
