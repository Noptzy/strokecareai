import type { Session } from "@api/domain/session/session"
import type { AppRouter } from "@api/presentation/routers/index"
import type { RouterClient } from "@orpc/server"

export type { AppRouter, Session }
export type AppRouterClient = RouterClient<AppRouter>
