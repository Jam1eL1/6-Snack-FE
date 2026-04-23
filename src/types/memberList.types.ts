export type UserRole = "USER" | "ADMIN";

export type TMemberItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
