import type { AuthedContext } from "@api/application/shared/context"
import type { SettingsUseCases } from "@api/application/use-cases/settings"
import { updateSettingsInput } from "@api/application/use-cases/settings"
import { protectedProcedure } from "@api/presentation/orpc/middleware"

function authed(ctx: {
	headers: Headers
	session: import("@api/domain/session/session").Session | null
}): AuthedContext {
	if (!ctx.session) throw new Error("unreachable: protectedProcedure requires session")
	return { headers: ctx.headers, session: ctx.session }
}

export function settingsRouter(deps: { settings: SettingsUseCases }) {
	return {
		settings: {
			getSettings: protectedProcedure.handler(({ context }) => deps.settings.getSettings(authed(context))),
			updateSettings: protectedProcedure
				.input(updateSettingsInput)
				.handler(({ input, context }) => deps.settings.updateSettings(input, authed(context))),
		},
	}
}
