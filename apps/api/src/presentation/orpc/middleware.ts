import { os } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import type { ORPCContext } from "./context.ts";
import { mapAppErrorToORPCError } from "./error-mapping.ts";
import type { AuthedContext } from "../../application/shared/context.ts";

export const publicProcedure = os.context<ORPCContext>().use(async (ctx, next) => {
  try {
    return await next({});
  } catch (err) {
    throw mapAppErrorToORPCError(err);
  }
});

export const protectedProcedure = publicProcedure.use(async ({ context }, next) => {
  if (!context.session) {
    throw new ORPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return await next({ context: { ...context, session: context.session } });
});

export const adminProcedure = protectedProcedure.use(async ({ context }, next) => {
  if (context.session.user.role !== "admin") {
    throw new ORPCError({ code: "FORBIDDEN", message: "Admin role required" });
  }
  return await next({});
});

export function toAuthedContext(ctx: ORPCContext & { session: NonNullable<ORPCContext["session"]> }): AuthedContext {
  return {
    headers: ctx.headers,
    session: ctx.session,
  };
}
