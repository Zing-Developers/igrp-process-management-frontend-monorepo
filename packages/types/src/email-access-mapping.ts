import type { AuditMetadata, UserProfileDTO } from "./shared.js";
import type { PaginatedResponse } from "./response.js";

/** EmailAccessMappingDTO. */
export interface EmailAccessMapping extends AuditMetadata {
  id?: string;
  email?: string;
  description?: string;
  notes?: string;
  permissions?: string[];
  active?: boolean;
  expiresAt?: string;
  revokedAt?: string;
  revokedBy?: string;
  userProfileRevokedBy?: UserProfileDTO;
}

/** EmailAccessMappingRequestDTO — create/update request body. */
export interface EmailAccessMappingRequest {
  email?: string;
  permissions?: string[];
  description?: string;
  notes?: string;
  expiresAt?: string;
}

/** Query parameters for GET /email-access-mappings. */
export interface EmailAccessMappingQuery {
  email?: string;
  status?: string;
  page?: number;
  size?: number;
}

export type EmailAccessMappingDTO = EmailAccessMapping;
export type EmailAccessMappingRequestDTO = EmailAccessMappingRequest;
export type EmailAccessMappingListPageDTO =
  PaginatedResponse<EmailAccessMappingDTO>;
