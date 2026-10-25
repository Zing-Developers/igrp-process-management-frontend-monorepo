import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { FailedJobClient } from "../packages/client/src/client/failed-job-client";
import type { FailedJob, PaginatedResponse } from "../packages/types/src";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const jsonResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  headers: new Headers({ "content-type": "application/json" }),
});

const emptyResponse = () => ({
  ok: true,
  status: 204,
  statusText: "No Content",
  text: vi.fn().mockResolvedValue(""),
  headers: new Headers(),
});

describe("FailedJobClient contract", () => {
  let client: FailedJobClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new FailedJobClient({ baseUrl: "https://api.example.com/" });
  });

  it("lists failed jobs with serialized query parameters", async () => {
    const page = {
      content: [
        {
          jobId: "job-1",
          attempts: 8,
          reprocessCount: 2,
          lastReprocessedAt: "2026-10-25T12:00:00Z",
          lastReprocessedBy: "user-1",
        },
      ],
      pageNumber: 0,
      pageSize: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };
    mockFetch.mockResolvedValueOnce(jsonResponse(page));
    const result = await client.getFailedJobs({
      processInstanceId: "process/id",
      page: 0,
      size: 20,
    });

    expect(mockFetch).toHaveBeenLastCalledWith(
      "https://api.example.com/failed-jobs?processInstanceId=process%2Fid&page=0&size=20",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result.data).toEqual(page);
    expectTypeOf(result.data).toEqualTypeOf<PaginatedResponse<FailedJob>>();
    expectTypeOf(result.data.content[0]?.reprocessCount).toEqualTypeOf<
      number | undefined
    >();
  });

  it("retries an encoded job ID with an optional body and fetches its stack trace", async () => {
    mockFetch.mockResolvedValueOnce(emptyResponse());
    await client.retryFailedJob("job/1", { retries: 3 });
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "https://api.example.com/failed-jobs/job%2F1/retry",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ retries: 3 }) }),
    );

    mockFetch.mockResolvedValueOnce(jsonResponse("stack trace"));
    const result = await client.getFailedJobStacktrace("job/1");
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://api.example.com/failed-jobs/job%2F1/stacktrace",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result.data).toBe("stack trace");
  });
});
