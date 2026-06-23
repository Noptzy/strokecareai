import { badRequest, notFound } from "@api/application/shared/errors"
import type { Profile, RiskFactor } from "@api/domain/profile/profile"
import type { ProfileRepository, ProfileUpdate } from "@api/domain/profile/profile-repository"
import type { Database } from "@api/infrastructure/db/client"
import { profile } from "@api/infrastructure/db/schema"
import { eq } from "drizzle-orm"

function toProfile(row: typeof profile.$inferSelect): Profile {
	return {
		userId: row.userId,
		age: row.age === null ? null : Number.parseInt(row.age, 10),
		riskFactors: (row.riskFactors ?? []) as RiskFactor[],
		gender: row.gender ?? undefined,
		height: row.height === null ? undefined : Number.parseFloat(row.height),
		weight: row.weight === null ? undefined : Number.parseFloat(row.weight),
		dailyFoodPattern: row.dailyFoodPattern ?? undefined,
		sleepPattern: row.sleepPattern ?? undefined,
		stressLevel: row.stressLevel ?? undefined,
		smokingStatus: row.smokingStatus ?? undefined,
		exercisePattern: row.exercisePattern ?? undefined,
		priorIllnesses: row.priorIllnesses ?? undefined,
		familyMedicalHistory: row.familyMedicalHistory ?? undefined,
		notes: row.notes ?? undefined,
		onboardingCompleted: row.onboardingCompleted,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	}
}

export class DrizzleProfileRepository implements ProfileRepository {
	constructor(private readonly db: Database) {}

	private mapRowToDomain(row: typeof profile.$inferSelect): Profile {
		return toProfile(row)
	}

	async findByUserId(userId: string): Promise<Profile | null> {
		const [row] = await this.db.select().from(profile).where(eq(profile.userId, userId)).limit(1)
		if (!row) return null
		return this.mapRowToDomain(row)
	}

	async listAllProfiles(): Promise<Profile[]> {
		const rows = await this.db.select().from(profile)
		return rows.map((r) => this.mapRowToDomain(r))
	}

	async upsert(userId: string, data: ProfileUpdate): Promise<Profile> {
		if (data.age !== undefined && data.age !== null && (data.age < 0 || data.age > 130)) {
			throw badRequest("age out of range")
		}
		const insertValues: typeof profile.$inferInsert = {
			userId,
			age: data.age === undefined || data.age === null ? null : String(data.age),
			riskFactors: data.riskFactors ?? [],
			gender: data.gender ?? null,
			height: data.height === undefined ? null : String(data.height),
			weight: data.weight === undefined ? null : String(data.weight),
			dailyFoodPattern: data.dailyFoodPattern ?? null,
			sleepPattern: data.sleepPattern ?? null,
			stressLevel: data.stressLevel ?? null,
			smokingStatus: data.smokingStatus ?? null,
			exercisePattern: data.exercisePattern ?? null,
			priorIllnesses: data.priorIllnesses ?? null,
			familyMedicalHistory: data.familyMedicalHistory ?? null,
			notes: data.notes ?? null,
			onboardingCompleted: data.onboardingCompleted ?? false,
		}
		const patch: Partial<typeof profile.$inferInsert> = { updatedAt: new Date() }
		if (data.age !== undefined) patch.age = data.age === null ? null : String(data.age)
		if (data.riskFactors !== undefined) patch.riskFactors = data.riskFactors
		if (data.gender !== undefined) patch.gender = data.gender
		if (data.height !== undefined) patch.height = String(data.height)
		if (data.weight !== undefined) patch.weight = String(data.weight)
		if (data.dailyFoodPattern !== undefined) patch.dailyFoodPattern = data.dailyFoodPattern
		if (data.sleepPattern !== undefined) patch.sleepPattern = data.sleepPattern
		if (data.stressLevel !== undefined) patch.stressLevel = data.stressLevel
		if (data.smokingStatus !== undefined) patch.smokingStatus = data.smokingStatus
		if (data.exercisePattern !== undefined) patch.exercisePattern = data.exercisePattern
		if (data.priorIllnesses !== undefined) patch.priorIllnesses = data.priorIllnesses
		if (data.familyMedicalHistory !== undefined) patch.familyMedicalHistory = data.familyMedicalHistory
		if (data.notes !== undefined) patch.notes = data.notes
		if (data.onboardingCompleted !== undefined) patch.onboardingCompleted = data.onboardingCompleted
		const [row] = await this.db
			.insert(profile)
			.values(insertValues)
			.onConflictDoUpdate({ target: profile.userId, set: patch })
			.returning()
		if (!row) throw notFound("profile not found after upsert")
		return toProfile(row)
	}
}
