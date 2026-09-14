import type {
  ApiResponse,
  EmailAccessMapping,
  EmailAccessMappingRequest,
} from "@irn/platform-process-management-types";
import { BaseApiClient } from "./base-client.js";

export class EmailAccessMappingClient extends BaseApiClient {
  /** GET /email-access-mappings. */
  async getEmailAccessMappings(): Promise<ApiResponse<EmailAccessMapping[]>> {
    return this.get<EmailAccessMapping[]>("/email-access-mappings");
  }

  /** POST /email-access-mappings. */
  async createEmailAccessMapping(
    body: EmailAccessMappingRequest,
  ): Promise<ApiResponse<EmailAccessMapping>> {
    return this.post<EmailAccessMapping>("/email-access-mappings", body);
  }

  /** PUT /email-access-mappings/{id}. */
  async updateEmailAccessMapping(
    id: string,
    body: EmailAccessMappingRequest,
  ): Promise<ApiResponse<EmailAccessMapping>> {
    return this.put<EmailAccessMapping>(
      `/email-access-mappings/${this.encodePath(id)}`,
      body,
    );
  }

  /** DELETE /email-access-mappings/{id}. */
  async revokeEmailAccessMapping(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/email-access-mappings/${this.encodePath(id)}`);
  }
}
