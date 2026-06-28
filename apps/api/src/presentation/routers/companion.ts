import type { AuthedContext } from "@api/application/shared/context"
import type { CompanionUseCases } from "@api/application/use-cases/companion"
import {
	createSessionInput,
	deleteSessionInput,
	listMessagesInput,
	sendMessageInput,
	updateSessionTitleInput,
} from "@api/application/use-cases/companion"
import { protectedProcedure } from "@api/presentation/orpc/middleware"

function authed(ctx: {
	headers: Headers
	session: import("@api/domain/session/session").Session | null
}): AuthedContext {
	if (!ctx.session) throw new Error("unreachable: protectedProcedure requires session")
	return { headers: ctx.headers, session: ctx.session }
}

export function companionRouter(deps: { companion: CompanionUseCases }) {
	return {
		companion: {
			listSessions: protectedProcedure.handler(({ context }) => deps.companion.listSessions(authed(context))),
			createSession: protectedProcedure
				.input(createSessionInput)
				.handler(({ input, context }) => deps.companion.createSession(input, authed(context))),
			listMessages: protectedProcedure
				.input(listMessagesInput)
				.handler(({ input, context }) => deps.companion.listMessages(input, authed(context))),
			sendMessage: protectedProcedure
				.input(sendMessageInput)
				.handler(({ input, context }) => deps.companion.sendMessage(input, authed(context))),
			updateSessionTitle: protectedProcedure
				.input(updateSessionTitleInput)
				.handler(({ input, context }) => deps.companion.updateSessionTitle(input, authed(context))),
			deleteSession: protectedProcedure
				.input(deleteSessionInput)
				.handler(({ input, context }) => deps.companion.deleteSession(input, authed(context))),
		},
	}
}
