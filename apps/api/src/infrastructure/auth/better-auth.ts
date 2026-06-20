import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import type { Database } from "../db/client.ts"
import * as schema from "../db/schema.ts"

export interface OAuthProviderCredentials {
	clientId?: string
	clientSecret?: string
}

export interface AuthOptions {
	db: Database
	secret: string
	url: string
	webOrigin: string
	providers: {
		google?: OAuthProviderCredentials
		github?: OAuthProviderCredentials
	}
}

export type EnabledAuthProvider = "google" | "github"

export function getEnabledAuthProviders(providers: AuthOptions["providers"]): EnabledAuthProvider[] {
	return (Object.entries(providers) as [EnabledAuthProvider, OAuthProviderCredentials | undefined][])
		.filter(([, credentials]) => Boolean(credentials?.clientId && credentials.clientSecret))
		.map(([provider]) => provider)
}

function buildSocialProviders(providers: AuthOptions["providers"]) {
	const socialProviders: {
		google?: { clientId: string; clientSecret: string }
		github?: { clientId: string; clientSecret: string }
	} = {}

	if (providers.google?.clientId && providers.google.clientSecret) {
		socialProviders.google = {
			clientId: providers.google.clientId,
			clientSecret: providers.google.clientSecret,
		}
	}

	if (providers.github?.clientId && providers.github.clientSecret) {
		socialProviders.github = {
			clientId: providers.github.clientId,
			clientSecret: providers.github.clientSecret,
		}
	}

	return socialProviders
}

export function buildAuth({ db, secret, url, webOrigin, providers }: AuthOptions) {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema,
		}),
		secret,
		baseURL: url,
		trustedOrigins: [webOrigin, url],
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 8,
			autoSignIn: true,
		},
		socialProviders: buildSocialProviders(providers),
		plugins: [
			admin({
				defaultRole: "user",
				adminRoles: ["admin"],
			}),
		],
	})
}

export type Auth = ReturnType<typeof buildAuth>
