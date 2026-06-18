import { publicProcedure } from "../orpc/middleware.ts";
import type { UseCases } from "../../application/use-cases.ts";

export function buildRouter(useCases: UseCases) {
  return {
    health: publicProcedure.handler(() => ({ status: "ok" })),
  };
}

export type AppRouter = ReturnType<typeof buildRouter>;
