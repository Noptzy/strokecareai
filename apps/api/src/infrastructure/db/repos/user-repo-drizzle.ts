import type { User } from "@api/domain/user/user"
import type { UserRepository } from "@api/domain/user/user-repository"
import type { Database } from "@api/infrastructure/db/client"
import { user } from "@api/infrastructure/db/schema"
import { eq } from "drizzle-orm"

function toUser(row: typeof user.$inferSelect): User {
	return {
		id: row.id,
		name: row.name,
		email: row.email,
		role: row.role as "admin" | "user",
		banned: row.banned,
		createdAt: row.createdAt,
	}
}

export class DrizzleUserRepository implements UserRepository {
	constructor(private readonly db: Database) {}

	async findById(id: string): Promise<User | null> {
		const [row] = await this.db.select().from(user).where(eq(user.id, id)).limit(1)
		if (!row) return null
		return toUser(row)
	}

	async list(): Promise<User[]> {
		const rows = await this.db.select().from(user)
		return rows.map(toUser)
	}

	async update(id: string, input: Partial<Pick<User, "name" | "email" | "role" | "banned">>): Promise<User> {
		const patch: Partial<typeof user.$inferInsert> = {
			updatedAt: new Date(),
		}
		if (input.name !== undefined) patch.name = input.name
		if (input.email !== undefined) patch.email = input.email
		if (input.role !== undefined) patch.role = input.role
		if (input.banned !== undefined) patch.banned = input.banned

		const [row] = await this.db.update(user).set(patch).where(eq(user.id, id)).returning()
		if (!row) {
			throw new Error("user not found")
		}
		return toUser(row)
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(user).where(eq(user.id, id))
	}
}
