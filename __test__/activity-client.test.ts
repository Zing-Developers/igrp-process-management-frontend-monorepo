import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { ActivityClient } from "../packages/client/src/client/activity-client";
import type {
  ActivityProgress,
  ActivityProgressStatus,
} from "../packages/types/src";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const jsonResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  headers: new Headers({ "content-type": "application/json" }),
});

describe("ActivityClient contract", () => {
  beforeEach(() => vi.clearAllMocks());

  it("preserves the progress endpoint and supports reprocessing states", async () => {
    const progress: ActivityProgress[] = [
      {
        status: "REPROCESSING",
        reprocessCount: 2,
        lastReprocessedAt: "2026-10-25T12:00:00Z",
      },
      { status: "RETRYING" },
    ];
    mockFetch.mockResolvedValueOnce(jsonResponse(progress));

    const client = new ActivityClient({ baseUrl: "https://api.example.com/" });
    const result = await client.getActivityProgress("process/1", "blocked");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/activities/progress?processIdentifier=process%2F1&type=blocked",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result.data).toEqual(progress);
    expectTypeOf<ActivityProgressStatus>().toMatchTypeOf("REPROCESSING");
    expectTypeOf<ActivityProgressStatus>().toMatchTypeOf("RETRYING");
  });
});
