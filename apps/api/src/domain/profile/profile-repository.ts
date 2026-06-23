import type { Profile, RiskFactor } from "@api/domain/profile/profile"

export interface ProfileUpdate {
	age?: number | null
	riskFactors?: RiskFactor[]
	gender?: string
	height?: number
	weight?: number
	dailyFoodPattern?: string
	sleepPattern?: string
	stressLevel?: string
	smokingStatus?: string
	exercisePattern?: string
	priorIllnesses?: string
	familyMedicalHistory?: string
	notes?: string
	onboardingCompleted?: boolean
}

export interface ProfileRepository {
	findByUserId(userId: string): Promise<Profile | null>
	listAllProfiles(): Promise<Profile[]>
	upsert(userId: string, data: ProfileUpdate): Promise<Profile>
}
