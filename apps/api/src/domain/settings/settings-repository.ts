import type { Settings } from "@api/domain/settings/settings"

export interface SettingsRepository {
	getSettings(): Promise<Settings>
	updateSettings(settings: Partial<Settings>): Promise<Settings>
}
