import type { AuditMetadata, UserProfileDTO } from "./shared.js";

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

export type EmailAccessMappingDTO = EmailAccessMapping;
export type EmailAccessMappingRequestDTO = EmailAccessMappingRequest;
