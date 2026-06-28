import { makeAdmin } from "@api/application/use-cases/admin"
import { makeCompanion } from "@api/application/use-cases/companion"
import { makeProfile } from "@api/application/use-cases/profile"
import { makeRisk } from "@api/application/use-cases/risk"
import { makeSettings } from "@api/application/use-cases/settings"
import type { CompanionRepository } from "@api/domain/companion/companion-repository"
import type { AuthService } from "@api/domain/ports/auth-service"
import type { Cache } from "@api/domain/ports/cache"
import type { OpenRouterService } from "@api/domain/ports/openrouter-service"
import type { ProfileRepository } from "@api/domain/profile/profile-repository"
import type { SettingsRepository } from "@api/domain/settings/settings-repository"
import type { UserRepository } from "@api/domain/user/user-repository"

export interface Dependencies {
	auth: AuthService
	cache: Cache
	userRepo: UserRepository
	profileRepo: ProfileRepository
	companionRepo: CompanionRepository
	settingsRepo: SettingsRepository
	openRouter: OpenRouterService
}

export function buildUseCases(deps: Dependencies) {
	return {
		profile: makeProfile({ repo: deps.profileRepo, cache: deps.cache }),
		companion: makeCompanion({
			repo: deps.companionRepo,
			profileRepo: deps.profileRepo,
			settingsRepo: deps.settingsRepo,
			openRouter: deps.openRouter,
			cache: deps.cache,
		}),
		settings: makeSettings({ repo: deps.settingsRepo }),
		admin: makeAdmin({ auth: deps.auth, userRepo: deps.userRepo, profileRepo: deps.profileRepo }),
		risk: makeRisk({ profileRepo: deps.profileRepo }),
	}
}

export type UseCases = ReturnType<typeof buildUseCases>
