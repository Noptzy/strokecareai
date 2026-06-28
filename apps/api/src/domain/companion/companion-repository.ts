import type { CompanionMessage, CompanionRole } from "@api/domain/companion/companion-message"
import type { CompanionSession } from "@api/domain/companion/companion-session"

export interface CompanionRepository {
	listByUserId(userId: string, limit: number): Promise<CompanionSession[]>
	createSession(userId: string, title: string): Promise<CompanionSession>
	getSession(sessionId: string, userId: string): Promise<CompanionSession | null>
	updateTitle(sessionId: string, userId: string, title: string): Promise<CompanionSession>
	deleteSession(sessionId: string, userId: string): Promise<void>
	addMessage(sessionId: string, role: CompanionRole, content: string): Promise<CompanionMessage>
	getMessages(sessionId: string, limit: number): Promise<CompanionMessage[]>
	requireOwned(sessionId: string, userId: string): Promise<CompanionSession>
}
