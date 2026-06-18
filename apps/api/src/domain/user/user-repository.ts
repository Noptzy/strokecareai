import type { User } from "./user.ts";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  list(): Promise<User[]>;
}
