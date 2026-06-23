import type { Settings } from "@api/domain/settings/settings"
import type { SettingsRepository } from "@api/domain/settings/settings-repository"
import type { Database } from "@api/infrastructure/db/client"
import { appSettings } from "@api/infrastructure/db/schema"
import { eq } from "drizzle-orm"

export class DrizzleSettingsRepository implements SettingsRepository {
	constructor(private db: Database) {}

	private async getSetting(key: string): Promise<string | null> {
		const row = await this.db.select().from(appSettings).where(eq(appSettings.key, key)).limit(1)
		return row[0]?.value ?? null
	}

	private async upsertSetting(key: string, value: string): Promise<void> {
		await this.db
			.insert(appSettings)
			.values({ key, value })
			.onConflictDoUpdate({
				target: appSettings.key,
				set: { value, updatedAt: new Date() },
			})
	}

	async getSettings(): Promise<Settings> {
		const openrouterApiKey = await this.getSetting("openrouterApiKey")
		const modelId = await this.getSetting("modelId")
		const knowledgeBase = await this.getSetting("knowledgeBase")
		const systemPromptOverride = await this.getSetting("systemPromptOverride")

		return {
			openrouterApiKey,
			modelId: modelId || "google/gemini-2.5-flash", // default model
			knowledgeBase,
			systemPromptOverride,
		}
	}

	async updateSettings(settings: Partial<Settings>): Promise<Settings> {
		if (settings.openrouterApiKey !== undefined) {
			await this.upsertSetting("openrouterApiKey", settings.openrouterApiKey ?? "")
		}
		if (settings.modelId !== undefined) {
			await this.upsertSetting("modelId", settings.modelId ?? "google/gemini-2.5-flash")
		}
		if (settings.knowledgeBase !== undefined) {
			await this.upsertSetting("knowledgeBase", settings.knowledgeBase ?? "")
		}
		if (settings.systemPromptOverride !== undefined) {
			await this.upsertSetting("systemPromptOverride", settings.systemPromptOverride ?? "")
		}
		return this.getSettings()
	}
}
