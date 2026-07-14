export type UserRole = "admin" | "juri" | "panitia";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}
