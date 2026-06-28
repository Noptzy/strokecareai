import type { UseCases } from "@api/application/use-cases"
import { publicProcedure } from "@api/presentation/orpc/middleware"
import { adminRouter } from "@api/presentation/routers/admin"
import { companionRouter } from "@api/presentation/routers/companion"
import { profileRouter } from "@api/presentation/routers/profile"
import { riskRouter } from "@api/presentation/routers/risk"
import { settingsRouter } from "@api/presentation/routers/settings"

export function buildRouter(useCases: UseCases) {
	return {
		health: publicProcedure.handler(() => ({ status: "ok" as const })),
		...profileRouter({ profile: useCases.profile }),
		...companionRouter({ companion: useCases.companion }),
		...settingsRouter({ settings: useCases.settings }),
		...adminRouter({ admin: useCases.admin }),
		...riskRouter({ risk: useCases.risk }),
	}
}

export type AppRouter = ReturnType<typeof buildRouter>
