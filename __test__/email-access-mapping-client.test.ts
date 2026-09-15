import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { EmailAccessMappingClient } from "../packages/client/src/client/email-access-mapping-client";
import type {
  EmailAccessMapping,
  PaginatedResponse,
} from "../packages/types/src";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const jsonResponse = (data: unknown, status = 200) => ({
  ok: true,
  status,
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

describe("EmailAccessMappingClient contract", () => {
  let client: EmailAccessMappingClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new EmailAccessMappingClient({
      baseUrl: "https://api.example.com/",
    });
  });

  it("lists and creates email access mappings", async () => {
    const page = {
      content: [],
      pageNumber: 1,
      pageSize: 25,
      totalElements: 0,
      totalPages: 0,
      first: false,
      last: true,
    };
    mockFetch.mockResolvedValueOnce(jsonResponse(page));
    const result = await client.getEmailAccessMappings({
      email: "developer+sdk@example.com",
      status: "active",
      page: 1,
      size: 25,
    });
    expect(mockFetch).toHaveBeenLastCalledWith(
      "https://api.example.com/email-access-mappings?email=developer%2Bsdk%40example.com&status=active&page=1&size=25",
      expect.objectContaining({ method: "GET" }),
    );
    expect(result.data).toEqual(page);
    expectTypeOf(result.data).toEqualTypeOf<
      PaginatedResponse<EmailAccessMapping>
    >();

    const body = {
      email: "developer@example.com",
      permissions: ["PROCESS:read"],
    };
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ id: "mapping-1", ...body }, 201),
    );
    await client.createEmailAccessMapping(body);
    expect(mockFetch).toHaveBeenLastCalledWith(
      "https://api.example.com/email-access-mappings",
      expect.objectContaining({ method: "POST", body: JSON.stringify(body) }),
    );
  });

  it("updates and revokes an encoded mapping ID", async () => {
    const body = { notes: "Updated access" };
    mockFetch.mockResolvedValueOnce(jsonResponse({ id: "mapping/1", ...body }));
    await client.updateEmailAccessMapping("mapping/1", body);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "https://api.example.com/email-access-mappings/mapping%2F1",
      expect.objectContaining({ method: "PUT", body: JSON.stringify(body) }),
    );

    mockFetch.mockResolvedValueOnce(emptyResponse());
    const result = await client.revokeEmailAccessMapping("mapping/1");
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://api.example.com/email-access-mappings/mapping%2F1",
      expect.objectContaining({ method: "DELETE", body: undefined }),
    );
    expect(result.data).toBeUndefined();
  });
});
