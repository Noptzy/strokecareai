import type { AuthedContext } from "@api/application/shared/context"
import type { AdminUseCases } from "@api/application/use-cases/admin"
import { protectedProcedure } from "@api/presentation/orpc/middleware"

function authed(ctx: {
	headers: Headers
	session: import("@api/domain/session/session").Session | null
}): AuthedContext {
	if (!ctx.session) throw new Error("unreachable: protectedProcedure requires session")
	return { headers: ctx.headers, session: ctx.session }
}

export function adminRouter(deps: { admin: AdminUseCases }) {
	return {
		admin: {
			getDashboard: protectedProcedure.handler(({ context }) => deps.admin.getDashboard(authed(context))),
		},
	}
}
