import type { AuditMetadata, UserProfileDTO } from "./shared.js";

/** CreateRequest — POST /m2m-keys. */
export interface CreateM2MKeyRequest {
  clientName?: string;
  permissions?: string[];
  email?: string;
  expiresAt?: string;
}

/** CreatedResponse — returned when a key is created or rotated. */
export interface CreatedM2MKeyResponse {
  id?: string;
  clientName?: string;
  key?: string;
  createdBy?: string;
  userProfileCreatedBy?: UserProfileDTO;
}

/** KeySummary — returned by GET /m2m-keys. */
export interface M2MKeySummary extends AuditMetadata {
  id?: string;
  clientName?: string;
  keyPrefix?: string;
  permissions?: string;
  email?: string;
  active?: boolean;
  expiresAt?: string;
  lastUsedAt?: string;
  revokedAt?: string;
  revokedBy?: string;
  userProfileRevokedBy?: UserProfileDTO;
}

// OpenAPI schema-name aliases.
export type CreateRequest = CreateM2MKeyRequest;
export type CreatedResponse = CreatedM2MKeyResponse;
export type KeySummary = M2MKeySummary;
