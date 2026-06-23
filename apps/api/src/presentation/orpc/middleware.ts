import type { AuthedContext } from "@api/application/shared/context"
import type { ORPCContext } from "@api/presentation/orpc/context"
import { mapAppErrorToORPCError } from "@api/presentation/orpc/error-mapping"
import { os, ORPCError } from "@orpc/server"

export const publicProcedure = os.$context<ORPCContext>().use(async ({ next }) => {
	try {
		return await next()
	} catch (err) {
		if (!(err && typeof err === "object" && "name" in err && err.name === "AppError")) {
			console.error("[ORPC Error]", err)
		}
		throw mapAppErrorToORPCError(err)
	}
})

export const protectedProcedure = publicProcedure.use(({ context, next }) => {
	if (!context.session) {
		throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" })
	}
	return next({
		context: {
			...context,
			session: context.session,
		},
	})
})

export const adminProcedure = protectedProcedure.use(({ context, next }) => {
	if (context.session.user.role !== "admin") {
		throw new ORPCError("FORBIDDEN", { message: "Admin role required" })
	}
	return next()
})

export function toAuthedContext(ctx: ORPCContext & { session: NonNullable<ORPCContext["session"]> }): AuthedContext {
	return {
		headers: ctx.headers,
		session: ctx.session,
	}
}
