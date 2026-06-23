import type { AuthedContext } from "@api/application/shared/context"
import type { ProfileUseCases } from "@api/application/use-cases/profile"
import { upsertProfileInput } from "@api/application/use-cases/profile"
import { protectedProcedure } from "@api/presentation/orpc/middleware"

function authed(ctx: {
	headers: Headers
	session: import("@api/domain/session/session").Session | null
}): AuthedContext {
	if (!ctx.session) throw new Error("unreachable: protectedProcedure requires session")
	return { headers: ctx.headers, session: ctx.session }
}

export function profileRouter(deps: { profile: ProfileUseCases }) {
	return {
		profile: {
			get: protectedProcedure.handler(({ context }) => deps.profile.getProfile(authed(context))),
			upsert: protectedProcedure
				.input(upsertProfileInput)
				.handler(({ input, context }) => deps.profile.upsertProfile(input, authed(context))),
		},
	}
}
