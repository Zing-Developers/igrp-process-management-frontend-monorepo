export type VariableParams = Array<{
  name: string;
  operator: string;
  value: string;
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
