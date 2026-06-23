import type { User } from "@api/domain/user/user"

export interface UserRepository {
	findById(id: string): Promise<User | null>
	list(): Promise<User[]>
}
