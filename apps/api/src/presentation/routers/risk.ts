import type { AuthedContext } from "@api/application/shared/context"
import type { RiskUseCases } from "@api/application/use-cases/risk"
import { protectedProcedure } from "@api/presentation/orpc/middleware"

function authed(ctx: {
	headers: Headers
	session: import("@api/domain/session/session").Session | null
}): AuthedContext {
	if (!ctx.session) throw new Error("unreachable: protectedProcedure requires session")
	return { headers: ctx.headers, session: ctx.session }
}

export function riskRouter(deps: { risk: RiskUseCases }) {
	return {
		risk: {
			getAssessment: protectedProcedure.handler(({ context }) => deps.risk.getAssessment(authed(context))),
		},
	}
}
