import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { z } from "zod"

function loadProjectEnvFile() {
	if (process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET) {
		return
	}

	for (const envPath of [resolve(process.cwd(), ".env"), resolve(process.cwd(), "../../.env")]) {
		if (existsSync(envPath)) {
			process.loadEnvFile(envPath)
			return
		}
	}
}

loadProjectEnvFile()

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	REDIS_URL: z.string().min(1).default("redis://127.0.0.1:6379"),
	BETTER_AUTH_SECRET: z.string().min(16, "use `openssl rand -hex 32`"),
	BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
	WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
	PORT: z.coerce.number().int().positive().default(3001),
	WEB_DIST_PATH: z.string().optional(),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	OPENROUTER_API_KEY: z.string().min(1).default("development-openrouter-key"),
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),
})

export function loadEnv() {
	const parsed = envSchema.safeParse(process.env)
	if (!parsed.success) {
		console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
		throw new Error("Invalid environment variables")
	}
	return parsed.data
}

export const env = loadEnv()
