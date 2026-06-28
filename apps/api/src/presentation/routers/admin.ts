import type { AuthedContext } from "@api/application/shared/context"
import type { AdminUseCases } from "@api/application/use-cases/admin"
import { createAdminUserInput, deleteAdminUserInput, updateAdminUserInput } from "@api/application/use-cases/admin"
import { adminProcedure } from "@api/presentation/orpc/middleware"

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
			getDashboard: adminProcedure.handler(({ context }) => deps.admin.getDashboard(authed(context))),
			createUser: adminProcedure
				.input(createAdminUserInput)
				.handler(({ input, context }) => deps.admin.createUser(input, authed(context))),
			updateUser: adminProcedure
				.input(updateAdminUserInput)
				.handler(({ input, context }) => deps.admin.updateUser(input, authed(context))),
			deleteUser: adminProcedure
				.input(deleteAdminUserInput)
				.handler(({ input, context }) => deps.admin.deleteUser(input, authed(context))),
		},
	}
}
