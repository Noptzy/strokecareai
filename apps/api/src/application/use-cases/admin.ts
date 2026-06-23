import type { AuthedContext } from "@api/application/shared/context"
import { forbidden } from "@api/application/shared/errors"
import { assessRisk } from "@api/domain/risk/risk"
import type { ProfileRepository } from "@api/domain/profile/profile-repository"
import type { UserRepository } from "@api/domain/user/user-repository"

export interface AdminDashboardData {
	totalUsers: number
	riskTiers: {
		low: number
		medium: number
		high: number
	}
	users: Array<{
		id: string
		name: string
		email: string
		riskFactors: string[]
		riskTier: "low" | "medium" | "high" | "unknown"
	}>
}

export interface AdminUseCases {
	getDashboard(ctx: AuthedContext): Promise<AdminDashboardData>
}

export function makeAdmin(deps: {
	userRepo: UserRepository
	profileRepo: ProfileRepository
}): AdminUseCases {
	const { userRepo, profileRepo } = deps
	return {
		async getDashboard(ctx) {
			if (ctx.session.user.role !== "admin") {
				throw forbidden("admin only")
			}

			const [users, profiles] = await Promise.all([userRepo.list(), profileRepo.listAllProfiles()])

			const dashboard: AdminDashboardData = {
				totalUsers: users.length,
				riskTiers: { low: 0, medium: 0, high: 0 },
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
					riskFactors: profile?.riskFactors ?? [],
					riskTier: tier,
				})
			}

			return dashboard
		},
	}
}
