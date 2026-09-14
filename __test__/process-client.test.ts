import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProcessClient } from "../packages/client/src/client/process-client";
import type { ApiClientConfig } from "../packages/types/src/response";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const response = (
  data: unknown,
  status = 200,
  contentType = "application/json",
) => ({
  ok: true,
  status,
  statusText: "OK",
  text: vi
    .fn()
    .mockResolvedValue(
      contentType === "application/json" ? JSON.stringify(data) : String(data),
    ),
  headers: new Headers({ "content-type": contentType }),
});

describe("ProcessClient contract", () => {
  let client: ProcessClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ProcessClient({ baseUrl: "https://api.example.com" });
  });

  it("lists process deployments", async () => {
    mockFetch.mockResolvedValue(response({ content: [] }));
    await client.getProcesses({ applicationBase: "app" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/process-definitions?applicationBase=app",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("searches instances using POST and a filter body", async () => {
    mockFetch.mockResolvedValue(response({ content: [] }));
    await client.getProcessInstances(
      { status: "RUNNING" },
      { variables: [{ name: "amount", operator: "GREATER_THAN", value: 10 }] },
    );
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/process-instances/search?status=RUNNING",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("configures an artifact with taskKey in the path", async () => {
    mockFetch.mockResolvedValue(response({ id: "artifact-1" }));
    const body = { name: "Form", formKey: "form-key" };
    await client.configureProcessArtifact("definition/1", "task/1", body);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/process-definitions/definition%2F1/artifacts/task%2F1",
      expect.objectContaining({ method: "PUT", body: JSON.stringify(body) }),
    );
  });

  it("returns the string response from a process event", async () => {
    mockFetch.mockResolvedValue(response("triggered", 200, "text/plain"));
    const result = await client.triggerProcessEvent({
      messageName: "continue",
    });
    expect(result.data).toBe("triggered");
  });
});
