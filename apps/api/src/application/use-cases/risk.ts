import type { AuthedContext } from "@api/application/shared/context"
import { notFound } from "@api/application/shared/errors"
import { assessRisk } from "@api/domain/risk/risk"
import type { RiskAssessment } from "@api/domain/risk/risk"
import type { ProfileRepository } from "@api/domain/profile/profile-repository"

export interface RiskUseCases {
	getAssessment(ctx: AuthedContext): Promise<RiskAssessment>
}

export function makeRisk(deps: { profileRepo: ProfileRepository }): RiskUseCases {
	return {
		async getAssessment(ctx) {
			const profile = await deps.profileRepo.findByUserId(ctx.session.userId)
			if (!profile) throw notFound("profile not found")
			return assessRisk(profile)
		},
	}
}
