import { z } from "zod"

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	REDIS_URL: z.string().min(1).default("redis://127.0.0.1:6379"),
	BETTER_AUTH_SECRET: z.string().min(16, "use `openssl rand -hex 32`"),
	BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
	WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
	PORT: z.coerce.number().int().positive().default(3001),
	WEB_DIST_PATH: z.string().optional(),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	OPENROUTER_API_KEY: z.string().min(1),
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
