export type CompanionRole = "user" | "assistant"

export interface CompanionMessage {
	id: string
	sessionId: string
	role: CompanionRole
	content: string
	createdAt: Date
}
