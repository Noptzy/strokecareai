import type { AuthedContext } from "@api/application/shared/context"
import { badRequest, forbidden, notFound } from "@api/application/shared/errors"
import type { CompanionRepository } from "@api/domain/companion/companion-repository"
import type { AuthService } from "@api/domain/ports/auth-service"
import type { ProfileRepository } from "@api/domain/profile/profile-repository"
import { assessRisk } from "@api/domain/risk/risk"
import type { SettingsRepository } from "@api/domain/settings/settings-repository"
import type { UserRepository } from "@api/domain/user/user-repository"
import { z } from "zod"

const USER_ROLE_VALUES = ["admin", "user"] as const
const ADMIN_GROWTH_DAYS = 7
const ADMIN_RECENT_ACTIVITY_LIMIT = 5

export const createAdminUserInput = z.object({
	name: z.string().min(2).max(80),
	email: z.string().email(),
	password: z.string().min(8).max(128),
	role: z.enum(USER_ROLE_VALUES).default("user"),
	banned: z.boolean().default(false),
})

export const updateAdminUserInput = z.object({
	id: z.string().min(1),
	name: z.string().min(2).max(80),
	email: z.string().email(),
	role: z.enum(USER_ROLE_VALUES),
	banned: z.boolean(),
})

export const deleteAdminUserInput = z.object({
	id: z.string().min(1),
})

export type CreateAdminUserInput = z.infer<typeof createAdminUserInput>
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserInput>
export type DeleteAdminUserInput = z.infer<typeof deleteAdminUserInput>

export interface AdminDashboardData {
	totalUsers: number
	totalChatSessions: number
	totalAiMessages: number
	riskTiers: {
		low: number
		medium: number
		high: number
	}
	settings: {
		modelId: string
		hasKnowledgeBase: boolean
		hasSystemPromptOverride: boolean
	}
	weeklyUserGrowth: Array<{
		date: string
		count: number
	}>
	recentActivity: Array<{
		type: "user_registered"
		title: string
		occurredAt: Date
	}>
	users: Array<{
		id: string
		name: string
		email: string
		role: "admin" | "user"
		banned: boolean
		createdAt: Date
		riskFactors: string[]
		riskTier: "low" | "medium" | "high" | "unknown"
	}>
}

export interface AdminUseCases {
	getDashboard(ctx: AuthedContext): Promise<AdminDashboardData>
	createUser(input: CreateAdminUserInput, ctx: AuthedContext): Promise<{ id: string }>
	updateUser(input: UpdateAdminUserInput, ctx: AuthedContext): Promise<{ success: true }>
	deleteUser(input: DeleteAdminUserInput, ctx: AuthedContext): Promise<{ success: true }>
}

export function makeAdmin(deps: {
	auth: AuthService
	userRepo: UserRepository
	profileRepo: ProfileRepository
	companionRepo: CompanionRepository
	settingsRepo: SettingsRepository
}): AdminUseCases {
	const { auth, userRepo, profileRepo, companionRepo, settingsRepo } = deps
	const assertAdmin = (ctx: AuthedContext) => {
		if (ctx.session.user.role !== "admin") {
			throw forbidden("admin only")
		}
	}

	return {
		async getDashboard(ctx) {
			assertAdmin(ctx)

			const [users, profiles, totalChatSessions, totalAiMessages, settings] = await Promise.all([
				userRepo.list(),
				profileRepo.listAllProfiles(),
				companionRepo.countSessions(),
				companionRepo.countMessages(),
				settingsRepo.getSettings(),
			])

			const dashboard: AdminDashboardData = {
				totalUsers: users.length,
				totalChatSessions,
				totalAiMessages,
				riskTiers: { low: 0, medium: 0, high: 0 },
				settings: {
					modelId: settings.modelId,
					hasKnowledgeBase: Boolean(settings.knowledgeBase?.trim()),
					hasSystemPromptOverride: Boolean(settings.systemPromptOverride?.trim()),
				},
				weeklyUserGrowth: getWeeklyUserGrowth(users),
				recentActivity: getRecentActivity(users),
				users: [],
			}

			for (const u of users) {
				const profile = profiles.find((p) => p.userId === u.id)
				const tier = profile ? assessRisk(profile).level : "unknown"

				if (tier === "low") dashboard.riskTiers.low++
				else if (tier === "medium") dashboard.riskTiers.medium++
				else if (tier === "high") dashboard.riskTiers.high++

				dashboard.users.push({
					id: u.id,
					name: u.name,
					email: u.email,
					role: u.role,
					banned: u.banned,
					createdAt: u.createdAt,
					riskFactors: profile?.riskFactors ?? [],
					riskTier: tier,
				})
			}

			return dashboard
		},
		async createUser(input, ctx) {
			assertAdmin(ctx)

			const createdUser = await auth.createUser({
				name: input.name,
				email: input.email,
				password: input.password,
			})

			await userRepo.update(createdUser.id, {
				role: input.role,
				banned: input.banned,
			})

			return createdUser
		},
		async updateUser(input, ctx) {
			assertAdmin(ctx)

			if (input.id === ctx.session.user.id && (input.role !== "admin" || input.banned)) {
				throw badRequest("admin cannot remove own access")
			}

			const existingUser = await userRepo.findById(input.id)
			if (!existingUser) {
				throw notFound("user not found")
			}

			await userRepo.update(input.id, {
				name: input.name,
				email: input.email,
				role: input.role,
				banned: input.banned,
			})

			return { success: true as const }
		},
		async deleteUser(input, ctx) {
			assertAdmin(ctx)

			if (input.id === ctx.session.user.id) {
				throw badRequest("admin cannot delete own account")
			}

			const existingUser = await userRepo.findById(input.id)
			if (!existingUser) {
				throw notFound("user not found")
			}

			await userRepo.delete(input.id)

			return { success: true as const }
		},
	}
}

function getDateKey(date: Date): string {
	return date.toISOString().slice(0, 10)
}

function getWeeklyUserGrowth(
	users: Awaited<ReturnType<UserRepository["list"]>>,
): AdminDashboardData["weeklyUserGrowth"] {
	const today = new Date()
	const days = Array.from({ length: ADMIN_GROWTH_DAYS }, (_, index) => {
		const date = new Date(today)
		date.setUTCHours(0, 0, 0, 0)
		date.setUTCDate(date.getUTCDate() - (ADMIN_GROWTH_DAYS - 1 - index))
		return date
	})

	return days.map((date) => {
		const dateKey = getDateKey(date)
		const count = users.filter((user) => getDateKey(user.createdAt) === dateKey).length
		return { date: dateKey, count }
	})
}

function getRecentActivity(users: Awaited<ReturnType<UserRepository["list"]>>): AdminDashboardData["recentActivity"] {
	return [...users]
		.sort((leftUser, rightUser) => rightUser.createdAt.getTime() - leftUser.createdAt.getTime())
		.slice(0, ADMIN_RECENT_ACTIVITY_LIMIT)
		.map((user) => ({
			type: "user_registered",
			title: `${user.name} terdaftar`,
			occurredAt: user.createdAt,
		}))
}
