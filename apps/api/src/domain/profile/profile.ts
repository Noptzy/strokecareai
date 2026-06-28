export type RiskFactor = "hypertension" | "diabetes" | "smoking" | "obesity" | "heart_disease" | "family_history"

export interface Profile {
	userId: string
	age: number | null
	riskFactors: RiskFactor[]
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
	onboardingCompleted: boolean
	createdAt: Date
	updatedAt: Date
}

export const RISK_FACTORS = [
	"hypertension",
	"diabetes",
	"smoking",
	"obesity",
	"heart_disease",
	"family_history",
] as const
