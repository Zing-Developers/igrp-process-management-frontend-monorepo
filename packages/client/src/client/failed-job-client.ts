import type {
  ApiResponse,
  FailedJob,
  FailedJobQuery,
  FailedJobRetryRequest,
  PaginatedResponse,
} from "@irn/platform-process-management-types";
import { BaseApiClient } from "./base-client.js";

/** Client for dead-letter Process Runtime jobs. */
export class FailedJobClient extends BaseApiClient {
  /** GET /failed-jobs. */
  async getFailedJobs(
    params?: FailedJobQuery,
  ): Promise<ApiResponse<PaginatedResponse<FailedJob>>> {
    return this.get<PaginatedResponse<FailedJob>>("/failed-jobs", params);
  }

  /** POST /failed-jobs/{jobId}/retry. The request body is optional. */
  async retryFailedJob(
    jobId: string,
    body?: FailedJobRetryRequest,
  ): Promise<ApiResponse<void>> {
    return this.post<void>(
      `/failed-jobs/${this.encodePath(jobId)}/retry`,
      body,
    );
  }

  /** GET /failed-jobs/{jobId}/stacktrace. */
  async getFailedJobStacktrace(jobId: string): Promise<ApiResponse<string>> {
    return this.get<string>(
      `/failed-jobs/${this.encodePath(jobId)}/stacktrace`,
    );
  }
}
