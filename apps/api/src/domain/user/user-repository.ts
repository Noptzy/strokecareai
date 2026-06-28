import type { User } from "@api/domain/user/user"

export interface UserRepository {
	findById(id: string): Promise<User | null>
	list(): Promise<User[]>
	update(id: string, input: Partial<Pick<User, "name" | "email" | "role" | "banned">>): Promise<User>
	delete(id: string): Promise<void>
}
