import { beforeEach, describe, expect, it, vi } from "vitest";
import { M2MKeyClient } from "../packages/client/src/client/m2m-key-client";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const jsonResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  statusText: "OK",
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  headers: new Headers({ "content-type": "application/json" }),
});

describe("M2MKeyClient", () => {
  let client: M2MKeyClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new M2MKeyClient({ baseUrl: "https://api.example.com" });
  });

  it("lists and creates keys", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse([]));
    await client.getKeys();
    expect(mockFetch).toHaveBeenLastCalledWith(
      "https://api.example.com/m2m-keys",
      expect.objectContaining({ method: "GET" }),
    );

    mockFetch.mockResolvedValueOnce(jsonResponse({ key: "secret" }));
    const body = { clientName: "worker", permissions: ["process:read"] };
    await client.createKey(body);
    expect(mockFetch).toHaveBeenLastCalledWith(
      "https://api.example.com/m2m-keys",
      expect.objectContaining({ method: "POST", body: JSON.stringify(body) }),
    );
  });

  it("rotates and revokes an encoded key ID", async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse({ key: "rotated" }))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        text: vi.fn().mockResolvedValue(""),
        headers: new Headers(),
      });
    await client.rotateKey("key/1");
    await client.revokeKey("key/1");
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "https://api.example.com/m2m-keys/key%2F1/rotate",
      expect.objectContaining({ method: "POST" }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://api.example.com/m2m-keys/key%2F1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
