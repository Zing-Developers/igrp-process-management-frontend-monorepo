import type { PaginatedResponse } from "./response.js";

/** FailedJobDTO — a dead-letter job returned by the runtime. */
export interface FailedJob {
  jobId?: string;
  processInstanceId?: string;
  processNumber?: string;
  processName?: string;
  engineProcessInstanceId?: string;
  processDefinitionId?: string;
  executionId?: string;
  activityId?: string;
  exceptionMessage?: string;
  attempts?: number;
  firstFailedAt?: string;
  lastFailedAt?: string;
  /** Number of manual reprocessings. `attempts` remains the cumulative total. */
  reprocessCount?: number;
  lastReprocessedAt?: string;
  lastReprocessedBy?: string;
}

/** FailedJobRetryRequestDTO — optional retry count for a requeued job. */
export interface FailedJobRetryRequest {
  retries?: number;
}

/** Query parameters for GET /failed-jobs. */
export interface FailedJobQuery {
  processInstanceId?: string;
  page?: number;
  size?: number;
}

export type FailedJobDTO = FailedJob;
export type FailedJobRetryRequestDTO = FailedJobRetryRequest;
export type FailedJobListPageDTO = PaginatedResponse<FailedJobDTO>;
