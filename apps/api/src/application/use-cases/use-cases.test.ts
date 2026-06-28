import type { AuthedContext } from "@api/application/shared/context"
import { badRequest, forbidden, notFound } from "@api/application/shared/errors"
import { makeAdmin } from "@api/application/use-cases/admin"
import { makeCompanion } from "@api/application/use-cases/companion"
import { makeProfile } from "@api/application/use-cases/profile"
import { makeSettings } from "@api/application/use-cases/settings"
import type { CompanionMessage } from "@api/domain/companion/companion-message"
import type { CompanionSession } from "@api/domain/companion/companion-session"
import type { Cache } from "@api/domain/ports/cache"
import type { Profile, ProfileUpdate, RiskFactor } from "@api/domain/profile/profile"
import { describe, expect, it } from "vitest"

const mockCache: Cache = {
	get: async <T>() => null as T | null,
	set: async () => {},
	del: async () => {},
	delPattern: async () => {},
	ping: async () => true,
}

function authed(userId = "u1"): AuthedContext {
	return {
		headers: new Headers(),
		session: {
			id: "s1",
			userId,
			expiresAt: new Date(Date.now() + 3600_000),
			user: { id: userId, name: "Test", email: "t@e.com", role: "user", banned: false, createdAt: new Date() },
		},
	}
}

describe("makeProfile", () => {
	it("throws notFound when profile missing", async () => {
		const errCtor = notFound("x").constructor
		const repo = { findByUserId: async () => null, upsert: async () => ({}) as Profile }
		const profile = makeProfile({ repo, cache: mockCache })
		await expect(profile.getProfile(authed())).rejects.toBeInstanceOf(errCtor)
	})

	it("returns cached profile without hitting repo", async () => {
		const cached: Profile = {
			userId: "u1",
			age: 50,
			riskFactors: ["hypertension"] as RiskFactor[],
			onboardingCompleted: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		const cache: Cache = { ...mockCache, get: async <T>() => cached as T | null }
		const repo = {
			findByUserId: async () => {
				throw new Error("should not call")
			},
			upsert: async () => ({}) as Profile,
		}
		const profile = makeProfile({ repo, cache })
		const got = await profile.getProfile(authed())
		expect(got?.userId).toBe("u1")
	})

	it("upsert invalidates cache after update", async () => {
		const upserted: Profile = {
			userId: "u1",
			age: 60,
			riskFactors: [],
			onboardingCompleted: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		let cacheDeleted = false
		const cache: Cache = {
			...mockCache,
			del: async () => {
				cacheDeleted = true
			},
		}
		const repo = {
			findByUserId: async () => upserted,
			upsert: async (_uid: string, _d: ProfileUpdate) => upserted,
		}
		const profile = makeProfile({ repo, cache })
		await profile.upsertProfile({ age: 60 }, authed())
		expect(cacheDeleted).toBe(true)
	})
})

describe("makeCompanion", () => {
	it("sendMessage calls openRouter and persists both messages", async () => {
		const session: CompanionSession = { id: "ses1", userId: "u1", title: "T", createdAt: new Date() }
		const userMsg: CompanionMessage = {
			id: "m1",
			sessionId: "ses1",
			role: "user",
			content: "hi",
			createdAt: new Date(),
		}
		const asstMsg: CompanionMessage = {
			id: "m2",
			sessionId: "ses1",
			role: "assistant",
			content: "halo",
			createdAt: new Date(),
		}
		let chatCalled = false
		const repo = {
			listByUserId: async () => [session],
			createSession: async () => session,
			getSession: async () => session,
			addMessage: async (_sid: string, role: "user" | "assistant") => (role === "user" ? userMsg : asstMsg),
			getMessages: async () => [userMsg],
			requireOwned: async () => session,
		}
		const openRouter = {
			chat: async () => {
				chatCalled = true
				return "halo"
			},
		}
		const settingsRepo = {
			getSettings: async () => ({
				id: 1,
				openrouterApiKey: null,
				modelId: "gpt-4",
				knowledgeBase: null,
				systemPromptOverride: null,
			}),
			updateSettings: async () => ({}) as any,
		}
		const companion = makeCompanion({
			repo: repo as never,
			openRouter,
			settingsRepo: settingsRepo as never,
			cache: mockCache,
			profileRepo: { findByUserId: async () => null, upsert: async () => null as any, listAllProfiles: async () => [] },
		})
		const res = await companion.sendMessage({ sessionId: "ses1", content: "hi" }, authed())
		expect(chatCalled).toBe(true)
		expect(res.userMessage.role).toBe("user")
		expect(res.assistantMessage.content).toBe("halo")
	})

	it("sendMessage rejects overly long content", async () => {
		const errCtor = badRequest("x").constructor
		const session: CompanionSession = { id: "x", userId: "u1", title: "T", createdAt: new Date() }
		const companion = makeCompanion({
			repo: {
				listByUserId: async () => [],
				createSession: async () => session,
				getSession: async () => session,
				addMessage: async () => ({}) as CompanionMessage,
				getMessages: async () => [],
				requireOwned: async () => session,
			},
			openRouter: { chat: async () => "" },
			settingsRepo: { getSettings: async () => ({}), updateSettings: async () => ({}) } as any,
			profileRepo: { findByUserId: async () => null, upsert: async () => null as any, listAllProfiles: async () => [] },
			cache: mockCache,
		})
		await expect(companion.sendMessage({ sessionId: "x", content: "x".repeat(4001) }, authed())).rejects.toBeInstanceOf(
			errCtor,
		)
	})
})

describe("makeSettings", () => {
	it("returns empty knowledge base initially", async () => {
		const repo = {
			getSettings: async () => ({
				id: 1,
				openrouterApiKey: null,
				modelId: "gpt-4",
				knowledgeBase: null,
				systemPromptOverride: null,
				updatedAt: new Date(),
			}),
			updateSettings: async (s: any) => ({
				id: 1,
				openrouterApiKey: null,
				modelId: "gpt-4",
				knowledgeBase: null,
				systemPromptOverride: null,
				...s,
				updatedAt: new Date(),
			}),
		}
		const settings = makeSettings({ repo })
		const adminAuth = authed()
		adminAuth.session!.user.role = "admin"
		const result = await settings.getSettings(adminAuth)
		expect(result.knowledgeBase).toBeNull()
	})

	it("updates settings successfully", async () => {
		let updatedSettings: any = null
		const repo = {
			getSettings: async () => ({ id: 1 }),
			updateSettings: async (s: any) => {
				updatedSettings = s
				return s
			},
		}
		const settings = makeSettings({ repo: repo as any })
		const adminAuth = authed()
		adminAuth.session!.user.role = "admin"
		await settings.updateSettings({ knowledgeBase: "test kb", modelId: "claude-3" }, adminAuth)
		expect(updatedSettings?.knowledgeBase).toBe("test kb")
		expect(updatedSettings?.modelId).toBe("claude-3")
	})

	it("throws forbidden if non-admin tries to update settings", async () => {
		const errCtor = forbidden("x").constructor
		const repo = {
			getSettings: async () => ({ id: 1 }),
			updateSettings: async (s: any) => s,
		}
		const settings = makeSettings({ repo: repo as any })
		const normalUserAuth = authed()
		normalUserAuth.session!.user.role = "user"

		await expect(settings.updateSettings({ modelId: "test" }, normalUserAuth)).rejects.toBeInstanceOf(errCtor)
	})
})

describe("makeAdmin", () => {
	it("lists users and calculates risk metrics correctly", async () => {
		const userRepo = {
			list: async () => [
				{ id: "u1", name: "Admin", role: "admin" },
				{ id: "u2", name: "User1", role: "user" },
				{ id: "u3", name: "User2", role: "user" },
			],
			findById: async () => null,
		}
		const profileRepo = {
			findByUserId: async (uid: string) => {
				if (uid === "u2") return { userId: "u2", age: 60, riskFactors: ["hypertension", "diabetes", "smoking"] }
				if (uid === "u3") return { userId: "u3", age: 30, riskFactors: ["obesity"] }
				return null
			},
			listAllProfiles: async () => [
				{ userId: "u2", age: 60, riskFactors: ["hypertension", "diabetes", "smoking"] },
				{ userId: "u3", age: 30, riskFactors: ["obesity"] },
			],
			upsert: async () => null as any,
		}

		const adminAuth = authed()
		adminAuth.session!.user.role = "admin"

		const admin = makeAdmin({ userRepo: userRepo as any, profileRepo: profileRepo as any })
		const dashboard = await admin.getDashboard(adminAuth)

		expect(dashboard.totalUsers).toBe(3)
		// User1 has 3 risks (high), User2 has 1 risk (low)
		expect(dashboard.riskTiers.high).toBe(1)
		expect(dashboard.riskTiers.low).toBe(1)
		expect(dashboard.users.find((u) => u.id === "u2")?.riskTier).toBe("high")
		expect(dashboard.users.find((u) => u.id === "u3")?.riskTier).toBe("low")
	})

	it("throws forbidden if non-admin accesses dashboard", async () => {
		const errCtor = forbidden("x").constructor
		const admin = makeAdmin({ userRepo: {} as any, profileRepo: {} as any })
		const normalUserAuth = authed()
		normalUserAuth.session!.user.role = "user"

		await expect(admin.getDashboard(normalUserAuth)).rejects.toBeInstanceOf(errCtor)
	})
})
