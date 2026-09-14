import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskClient } from "../packages/client/src/client/task-client";
import type { ApiClientConfig } from "../packages/types/src/response";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const jsonResponse = (data: unknown, status = 200) => ({
  ok: true,
  status,
  statusText: "OK",
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  headers: new Headers({ "content-type": "application/json" }),
});

const emptyResponse = (status = 204) => ({
  ok: true,
  status,
  statusText: "No Content",
  text: vi.fn().mockResolvedValue(""),
  headers: new Headers(),
});

describe("TaskClient contract", () => {
  let client: TaskClient;
  const config: ApiClientConfig = { baseUrl: "https://api.example.com/" };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new TaskClient(config);
  });

  it("searches tasks with a required filter body", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ content: [] }));
    await client.getTasks({ processReleaseKey: "release 1", page: 0 });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/tasks-instances/search?processReleaseKey=release+1&page=0",
      expect.objectContaining({ method: "POST", body: "{}" }),
    );
  });

  it("does not override current-user filters", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ content: [] }));
    await client.getMyTasks({ status: "COMPLETED" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/tasks-instances/me?status=COMPLETED",
      expect.objectContaining({ method: "POST", body: "{}" }),
    );
  });

  it("claims without undocumented parameters and handles 204", async () => {
    mockFetch.mockResolvedValue(emptyResponse());
    const result = await client.claimTask("task/1");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/tasks-instances/task%2F1/claim",
      expect.objectContaining({ method: "POST", body: undefined }),
    );
    expect(result.data).toBeUndefined();
  });

  it("sends the documented unclaim body", async () => {
    mockFetch.mockResolvedValue(emptyResponse());
    await client.unclaimTask("task-1", { note: "release" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/tasks-instances/task-1/unclaim",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ note: "release" }),
      }),
    );
  });

  it("updates an assignment rule", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: "rule-1" }));
    await client.updateTaskAssignmentRule("rule-1", { assignee: "user" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/tasks-instances/assignment-rules/rule-1",
      expect.objectContaining({ method: "PUT" }),
    );
  });
});
