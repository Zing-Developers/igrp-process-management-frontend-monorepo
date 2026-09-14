import type {
  ApiResponse,
  CreateM2MKeyRequest,
  CreatedM2MKeyResponse,
  M2MKeySummary,
} from "@irn/platform-process-management-types";
import { BaseApiClient } from "./base-client.js";

export class M2MKeyClient extends BaseApiClient {
  /** GET /m2m-keys. */
  async getKeys(): Promise<ApiResponse<M2MKeySummary[]>> {
    return this.get<M2MKeySummary[]>("/m2m-keys");
  }

  /** POST /m2m-keys. */
  async createKey(
    body: CreateM2MKeyRequest,
  ): Promise<ApiResponse<CreatedM2MKeyResponse>> {
    return this.post<CreatedM2MKeyResponse>("/m2m-keys", body);
  }

  /** POST /m2m-keys/{id}/rotate. */
  async rotateKey(id: string): Promise<ApiResponse<CreatedM2MKeyResponse>> {
    return this.post<CreatedM2MKeyResponse>(
      `/m2m-keys/${this.encodePath(id)}/rotate`,
    );
  }

  /** DELETE /m2m-keys/{id}. */
  async revokeKey(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/m2m-keys/${this.encodePath(id)}`);
  }
}
