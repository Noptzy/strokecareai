import type { User } from "@api/domain/user/user"
import type { UserRepository } from "@api/domain/user/user-repository"
import type { Database } from "@api/infrastructure/db/client"
import { user } from "@api/infrastructure/db/schema"
import { eq } from "drizzle-orm"

export class DrizzleUserRepository implements UserRepository {
	constructor(private readonly db: Database) {}

	async findById(id: string): Promise<User | null> {
		const [row] = await this.db.select().from(user).where(eq(user.id, id)).limit(1)
		if (!row) return null
		return {
			id: row.id,
			name: row.name,
			email: row.email,
			role: row.role as "admin" | "user",
			banned: row.banned,
			createdAt: row.createdAt,
		}
	}

	async list(): Promise<User[]> {
		const rows = await this.db.select().from(user)
		return rows.map((row) => ({
			id: row.id,
			name: row.name,
			email: row.email,
			role: row.role as "admin" | "user",
			banned: row.banned,
			createdAt: row.createdAt,
		}))
	}
}
