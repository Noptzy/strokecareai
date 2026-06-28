import { readFileSync } from "node:fs"
import { join } from "node:path"
import { buildUseCases } from "@api/application/use-cases"
import type { Session } from "@api/domain/session/session"
import { buildAuth, getEnabledAuthProviders } from "@api/infrastructure/auth/better-auth"
import { createRedisCache } from "@api/infrastructure/cache/redis"
import { env } from "@api/infrastructure/config/env"
import { createDb } from "@api/infrastructure/db/client"
import { DrizzleCompanionRepository } from "@api/infrastructure/db/repos/companion-repo-drizzle"
import { DrizzleProfileRepository } from "@api/infrastructure/db/repos/profile-repo-drizzle"
import { DrizzleSettingsRepository } from "@api/infrastructure/db/repos/settings-repo-drizzle"
import { DrizzleUserRepository } from "@api/infrastructure/db/repos/user-repo-drizzle"
import { createOpenRouterClient } from "@api/infrastructure/openrouter/client"
import { buildRouter } from "@api/presentation/routers/index"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { RPCHandler } from "@orpc/server/fetch"
import { Hono } from "hono"
import { cors } from "hono/cors"

async function main() {
	const db = createDb(env.DATABASE_URL)
	const cache = createRedisCache(env.REDIS_URL)
	const authProviders = {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	}

	const auth = buildAuth({
		db,
		secret: env.BETTER_AUTH_SECRET,
		url: env.BETTER_AUTH_URL,
		trustedOrigins: [env.WEB_ORIGIN, env.BETTER_AUTH_URL],
		providers: authProviders,
	})

	const authService = {
		async createUser(input: { name: string; email: string; password: string }) {
			const result = await auth.api.signUpEmail({
				body: input,
			})
			return { id: result.user.id }
		},
		async banUser(userId: string, banReason?: string, ctx?: { headers: Headers }) {
			await auth.api.banUser({ body: { userId, banReason }, headers: ctx?.headers })
		},
	}

	const profileRepo = new DrizzleProfileRepository(db)
	const companionRepo = new DrizzleCompanionRepository(db)
	const settingsRepo = new DrizzleSettingsRepository(db)
	const userRepo = new DrizzleUserRepository(db)
	const openRouter = createOpenRouterClient(env.OPENROUTER_API_KEY)

	const useCases = buildUseCases({
		auth: authService,
		cache,
		userRepo,
		profileRepo,
		companionRepo,
		settingsRepo,
		openRouter,
	})
	const appRouter = buildRouter(useCases)

	const app = new Hono()

	app.use("*", cors({ origin: env.WEB_ORIGIN, credentials: true }))

	app.get("/healthz", (c) => c.text("ok"))
	app.get("/api/auth/providers", (c) => c.json({ providers: getEnabledAuthProviders(authProviders) }))

	app.all("/api/auth/*", (c) => auth.handler(c.req.raw))

	const rpcHandler = new RPCHandler(appRouter)
	app.all("/rpc/*", async (c) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers })
		const rpcSession: Session | null = session
			? {
					id: session.session.id,
					userId: session.session.userId,
					expiresAt: session.session.expiresAt,
					user: {
						id: session.user.id,
						name: session.user.name,
						email: session.user.email,
						role: (session.user.role ?? "user") as "admin" | "user",
						banned: Boolean(session.user.banned),
						createdAt: session.user.createdAt,
					},
				}
			: null
		const result = await rpcHandler.handle(c.req.raw, {
			prefix: "/rpc",
			context: {
				headers: c.req.raw.headers,
				session: rpcSession,
				useCases,
			},
		})
		if (result.matched) {
			return new Response(result.response.body, {
				status: result.response.status,
				headers: result.response.headers,
			})
		}
		return c.notFound()
	})

	if (env.WEB_DIST_PATH) {
		app.use("/*", serveStatic({ root: env.WEB_DIST_PATH }))
		app.get("*", (c) => {
			try {
				const indexHtml = readFileSync(join(env.WEB_DIST_PATH!, "index.html"), "utf-8")
				return c.html(indexHtml)
			} catch {
				return c.notFound()
			}
		})
	}

	serve(
		{
			fetch: app.fetch,
			port: env.PORT,
		},
		(info) => {
			console.log(`Server is running on http://localhost:${info.port}`)
		},
	)
}

main().catch(console.error)
