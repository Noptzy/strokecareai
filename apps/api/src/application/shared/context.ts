import type { Session } from "@api/domain/session/session"

export interface OptionalAuthContext {
	headers: Headers
	session: Session | null
}

export interface AuthedContext {
	headers: Headers
	session: Session
}
