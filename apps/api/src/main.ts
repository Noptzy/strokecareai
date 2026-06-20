import { serve } from "@hono/node-server"
import { RPCHandler } from "@orpc/server/fetch"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { buildUseCases } from "./application/use-cases.ts"
import { buildAuth, getEnabledAuthProviders } from "./infrastructure/auth/better-auth.ts"
import { createRedisCache } from "./infrastructure/cache/redis.ts"
import { env } from "./infrastructure/config/env.ts"
import { createDb } from "./infrastructure/db/client.ts"
import { buildRouter } from "./presentation/routers/index.ts"

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
		webOrigin: env.WEB_ORIGIN,
		providers: authProviders,
	})

	const authService = {
		async banUser(userId: string, banReason?: string, ctx?: { headers: Headers }) {
			await auth.api.banUser({ body: { userId, banReason }, headers: ctx?.headers })
		},
	}

	const useCases = buildUseCases({ auth: authService, cache, userRepo: {} as any }) // mock userRepo for now
	const appRouter = buildRouter(useCases)

	const app = new Hono()

	app.use("*", cors({ origin: env.WEB_ORIGIN, credentials: true }))

	app.get("/healthz", (c) => c.text("ok"))
	app.get("/api/auth/providers", (c) => c.json({ providers: getEnabledAuthProviders(authProviders) }))

	app.all("/api/auth/*", (c) => auth.handler(c.req.raw))

	const rpcHandler = new RPCHandler(appRouter)
	app.all("/rpc/*", async (c) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers })
		const { response } = await rpcHandler.handle(c.req.raw, {
			context: {
				headers: c.req.raw.headers,
				session: session ? { ...session.session, user: session.user as any } : null,
				useCases,
			},
		})

		return response ?? c.notFound()
	})

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
