import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { env } from "@api/infrastructure/config/env"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import pkg from "pg"

const { Pool } = pkg

async function main() {
	const __dirname = dirname(fileURLToPath(import.meta.url))
	const migrationsFolder = resolve(__dirname, "..", "drizzle")

	const pool = new Pool({ connectionString: env.DATABASE_URL })
	const db = drizzle(pool)

	console.log(`[migrate] applying SQL from ${migrationsFolder}`)
	await migrate(db, { migrationsFolder })
	console.log("[migrate] done")

	await pool.end()
}

main().catch((err) => {
	console.error("[migrate] failed:", err)
	process.exit(1)
})
