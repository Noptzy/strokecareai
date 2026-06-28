import type { User } from "@api/domain/user/user"

export interface Session {
	id: string
	userId: string
	user: User
	expiresAt: Date
}
