import { forbidden, notFound } from "@api/application/shared/errors"
import type { CompanionMessage, CompanionRole } from "@api/domain/companion/companion-message"
import type { CompanionRepository } from "@api/domain/companion/companion-repository"
import type { CompanionSession } from "@api/domain/companion/companion-session"
import type { Database } from "@api/infrastructure/db/client"
import { companionMessage, companionSession } from "@api/infrastructure/db/schema"
import { and, count, desc, eq } from "drizzle-orm"

function toSession(row: typeof companionSession.$inferSelect): CompanionSession {
	return {
		id: row.id,
		userId: row.userId,
		title: row.title,
		createdAt: row.createdAt,
	}
}

function toMessage(row: typeof companionMessage.$inferSelect): CompanionMessage {
	return {
		id: row.id,
		sessionId: row.sessionId,
		role: row.role,
		content: row.content,
		createdAt: row.createdAt,
	}
}

export class DrizzleCompanionRepository implements CompanionRepository {
	constructor(private readonly db: Database) {}

	async listByUserId(userId: string, limit: number): Promise<CompanionSession[]> {
		const rows = await this.db
			.select()
			.from(companionSession)
			.where(eq(companionSession.userId, userId))
			.orderBy(desc(companionSession.createdAt))
			.limit(limit)
		return rows.map(toSession)
	}

	async countSessions(): Promise<number> {
		const [row] = await this.db.select({ value: count() }).from(companionSession)
		return row?.value ?? 0
	}

	async countMessages(): Promise<number> {
		const [row] = await this.db.select({ value: count() }).from(companionMessage)
		return row?.value ?? 0
	}

	async createSession(userId: string, title: string): Promise<CompanionSession> {
		const id = crypto.randomUUID()
		const [row] = await this.db.insert(companionSession).values({ id, userId, title }).returning()
		if (!row) throw new Error("failed to insert companion_session")
		return toSession(row)
	}

	async getSession(sessionId: string, userId: string): Promise<CompanionSession | null> {
		const [row] = await this.db
			.select()
			.from(companionSession)
			.where(and(eq(companionSession.id, sessionId), eq(companionSession.userId, userId)))
			.limit(1)
		return row ? toSession(row) : null
	}

	async updateTitle(sessionId: string, userId: string, title: string): Promise<CompanionSession> {
		const [row] = await this.db
			.update(companionSession)
			.set({ title })
			.where(and(eq(companionSession.id, sessionId), eq(companionSession.userId, userId)))
			.returning()
		if (!row) throw notFound("session not found")
		return toSession(row)
	}

	async deleteSession(sessionId: string, userId: string): Promise<void> {
		await this.db
			.delete(companionSession)
			.where(and(eq(companionSession.id, sessionId), eq(companionSession.userId, userId)))
	}

	async addMessage(sessionId: string, role: CompanionRole, content: string): Promise<CompanionMessage> {
		const id = crypto.randomUUID()
		const [row] = await this.db.insert(companionMessage).values({ id, sessionId, role, content }).returning()
		if (!row) throw new Error("failed to insert companion_message")
		return toMessage(row)
	}

	async getMessages(sessionId: string, limit: number): Promise<CompanionMessage[]> {
		const rows = await this.db
			.select()
			.from(companionMessage)
			.where(eq(companionMessage.sessionId, sessionId))
			.orderBy(desc(companionMessage.createdAt))
			.limit(limit)
		return rows.reverse().map(toMessage)
	}

	async assertOwned(sessionId: string, userId: string): Promise<void> {
		const session = await this.getSession(sessionId, userId)
		if (!session) throw forbidden("session not owned by user")
	}

	async requireOwned(sessionId: string, userId: string): Promise<CompanionSession> {
		const session = await this.getSession(sessionId, userId)
		if (!session) throw notFound("session not found")
		return session
	}
}
