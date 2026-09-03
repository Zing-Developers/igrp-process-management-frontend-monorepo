export type VariableOperator =
  | "EQUALS"
  | "EQUALS_IGNORE_CASE"
  | "NOT_EQUALS"
  | "NOT_EQUALS_IGNORE_CASE"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "LIKE"
  | "LIKE_IGNORE_CASE";

/** VariablesExpressionDTO — filter expression used in search bodies. */
export interface VariablesExpressionDTO {
  name: string;
  operator: VariableOperator;
  value: unknown;
}

export type VariableParams = VariablesExpressionDTO[];

export interface VariablesFilterDTO {
  variables?: VariableParams;
}

export type UserProfileDTO = {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  sub?: string;
};

export type UserProfile = UserProfileDTO;

/**
 * Audit metadata carried by most persisted DTOs in the process-runtime API
 * (`createdAt` / `updatedAt` / `createdBy` / `updatedBy` plus the resolved
 * user profiles). Every field is optional — list projections and lightweight
 * responses frequently omit them.
 */
export interface AuditMetadata {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  userProfileCreatedBy?: UserProfile;
  userProfileUpdatedBy?: UserProfile;
}

/** ConfigParameterDTO — status / event_type option lists. */
export type ConfigParameter = {
  label: string;
  value: string;
};

export type ConfigParameterDTO = ConfigParameter;
