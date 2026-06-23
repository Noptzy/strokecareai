import type { UseCases } from "@api/application/use-cases"
import type { Session } from "@api/domain/session/session"

export interface ORPCContext {
	headers: Headers
	session: Session | null
	useCases: UseCases
}
