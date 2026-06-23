import type { Database } from "@api/infrastructure/db/client"
import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"

import { drizzleAdapter } from "better-auth/adapters/drizzle"

export function buildAuth({
	db,
	secret,
	url,
	trustedOrigins,
}: { db: Database; secret: string; url: string; trustedOrigins?: string[] }) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
		}),
		secret,
		baseURL: url,
		trustedOrigins: trustedOrigins ?? [],
		emailAndPassword: {
			enabled: true,
		},
		plugins: [admin()],
	})
}

export type Auth = ReturnType<typeof buildAuth>
