import type { User } from "../user/user.ts";

export interface Session {
  id: string;
  userId: string;
  user: User;
  expiresAt: Date;
}
