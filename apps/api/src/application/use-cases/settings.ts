import type { AuthedContext } from "@api/application/shared/context"
import { forbidden } from "@api/application/shared/errors"
import type { SettingsRepository } from "@api/domain/settings/settings-repository"
import { z } from "zod"

export const updateSettingsInput = z.object({
	openrouterApiKey: z.string().optional(),
	modelId: z.string().optional(),
	knowledgeBase: z.string().optional(),
	systemPromptOverride: z.string().optional(),
})

export type UpdateSettingsInput = z.infer<typeof updateSettingsInput>

export interface SettingsUseCases {
	getSettings(ctx: AuthedContext): Promise<{
		hasOpenrouterApiKey: boolean
		modelId: string
		knowledgeBase: string | null
		systemPromptOverride: string | null
	}>
	updateSettings(input: UpdateSettingsInput, ctx: AuthedContext): Promise<void>
}

export function makeSettings(deps: { repo: SettingsRepository }): SettingsUseCases {
	const { repo } = deps
	return {
		async getSettings(ctx) {
			if (ctx.session.user.role !== "admin") {
				throw forbidden("admin only")
			}
			const s = await repo.getSettings()
			return {
				hasOpenrouterApiKey: Boolean(s.openrouterApiKey),
				modelId: s.modelId,
				knowledgeBase: s.knowledgeBase,
				systemPromptOverride: s.systemPromptOverride,
			}
		},
		async updateSettings(input, ctx) {
			if (ctx.session.user.role !== "admin") {
				throw forbidden("admin only")
			}
			await repo.updateSettings(input)
		},
	}
}
