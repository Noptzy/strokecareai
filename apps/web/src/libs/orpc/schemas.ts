import { z } from "zod"

export const RISK_FACTORS = [
	"hypertension",
	"diabetes",
	"smoking",
	"obesity",
	"heart_disease",
	"family_history",
] as const

export const RiskFactorSchema = z.enum(RISK_FACTORS)

export const ProfileSchema = z.object({
	userId: z.string(),
	age: z.number().int().min(0).max(130).nullable(),
	riskFactors: z.array(RiskFactorSchema),
	onboardingCompleted: z.boolean(),
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date()),
})

export type Profile = z.infer<typeof ProfileSchema>

export const ProfileUpsertSchema = z.object({
	age: z.number().int().min(0).max(130).nullable().optional(),
	riskFactors: z.array(RiskFactorSchema).optional(),
	onboardingCompleted: z.boolean().optional(),
})

export type ProfileUpsert = z.infer<typeof ProfileUpsertSchema>

export const OnboardingInputSchema = z.object({
	age: z.number().int().min(1).max(120),
	riskFactors: z.array(RiskFactorSchema).min(1),
})

export type OnboardingInput = z.infer<typeof OnboardingInputSchema>

export const CompanionSessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	title: z.string(),
	createdAt: z.string().or(z.date()),
})

export type CompanionSession = z.infer<typeof CompanionSessionSchema>

export const CompanionMessageSchema = z.object({
	id: z.string(),
	sessionId: z.string(),
	role: z.enum(["user", "assistant"]),
	content: z.string(),
	createdAt: z.string().or(z.date()),
})

export type CompanionMessage = z.infer<typeof CompanionMessageSchema>

export const SendMessageSchema = z.object({
	sessionId: z.string().min(1),
	content: z.string().min(1).max(4000),
})

export type SendMessage = z.infer<typeof SendMessageSchema>

export const CreateSessionSchema = z.object({
	title: z.string().min(1).max(120).optional(),
})

export type CreateSession = z.infer<typeof CreateSessionSchema>
