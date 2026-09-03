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
export type VariableParams = Array<{
  name: string;
  operator: VariableOperator | string;
  value: unknown;
}>;

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  sub: string;
};

/** ConfigParameterDTO — status / event_type option lists. */
export type ConfigParameter = {
  label: string;
  value: string;
};
