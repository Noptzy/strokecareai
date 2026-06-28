import type { AuthedContext } from "@api/application/shared/context"
import type { Cache } from "@api/domain/ports/cache"
import { RISK_FACTORS } from "@api/domain/profile/profile"
import type { ProfileRepository, ProfileUpdate } from "@api/domain/profile/profile-repository"
import { z } from "zod"

const profileKey = (userId: string) => `profile:${userId}`

export const upsertProfileInput = z.object({
	age: z.number().int().min(0).max(130).nullable().optional(),
	riskFactors: z.array(z.enum(RISK_FACTORS)).optional(),
	gender: z.string().optional(),
	height: z.number().optional(),
	weight: z.number().optional(),
	dailyFoodPattern: z.string().optional(),
	sleepPattern: z.string().optional(),
	stressLevel: z.string().optional(),
	smokingStatus: z.string().optional(),
	exercisePattern: z.string().optional(),
	priorIllnesses: z.string().optional(),
	familyMedicalHistory: z.string().optional(),
	notes: z.string().optional(),
	onboardingCompleted: z.boolean().optional(),
})

export type UpsertProfileInput = z.infer<typeof upsertProfileInput>

export interface ProfileUseCases {
	getProfile(ctx: AuthedContext): Promise<Awaited<ReturnType<ProfileRepository["findByUserId"]>>>
	upsertProfile(
		input: UpsertProfileInput,
		ctx: AuthedContext,
	): Promise<Awaited<ReturnType<ProfileRepository["upsert"]>>>
}

export function makeProfile(deps: { repo: ProfileRepository; cache: Cache }): ProfileUseCases {
	const { repo, cache } = deps
	return {
		async getProfile(ctx) {
			const key = profileKey(ctx.session.userId)
			const cached = await cache.get<Awaited<ReturnType<ProfileRepository["findByUserId"]>>>(key)
			if (cached) return cached
			const profile = await repo.findByUserId(ctx.session.userId)
			if (!profile) return null
			await cache.set(key, profile, 300)
			return profile
		},
		async upsertProfile(input, ctx) {
			const update: ProfileUpdate = {
				...(input.age !== undefined ? { age: input.age } : {}),
				...(input.riskFactors !== undefined ? { riskFactors: input.riskFactors } : {}),
				...(input.gender !== undefined ? { gender: input.gender } : {}),
				...(input.height !== undefined ? { height: input.height } : {}),
				...(input.weight !== undefined ? { weight: input.weight } : {}),
				...(input.dailyFoodPattern !== undefined ? { dailyFoodPattern: input.dailyFoodPattern } : {}),
				...(input.sleepPattern !== undefined ? { sleepPattern: input.sleepPattern } : {}),
				...(input.stressLevel !== undefined ? { stressLevel: input.stressLevel } : {}),
				...(input.smokingStatus !== undefined ? { smokingStatus: input.smokingStatus } : {}),
				...(input.exercisePattern !== undefined ? { exercisePattern: input.exercisePattern } : {}),
				...(input.priorIllnesses !== undefined ? { priorIllnesses: input.priorIllnesses } : {}),
				...(input.familyMedicalHistory !== undefined ? { familyMedicalHistory: input.familyMedicalHistory } : {}),
				...(input.notes !== undefined ? { notes: input.notes } : {}),
				...(input.onboardingCompleted !== undefined ? { onboardingCompleted: input.onboardingCompleted } : {}),
			}
			const updated = await repo.upsert(ctx.session.userId, update)
			await cache.del(profileKey(ctx.session.userId))
			return updated
		},
	}
}
