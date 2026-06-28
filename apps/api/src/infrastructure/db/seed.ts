import { eq } from "drizzle-orm"
import { buildAuth } from "../auth/better-auth"
import { env } from "../config/env"
import { createDb } from "./client"
import { user } from "./schema"

async function seed() {
	console.log("Seeding database...")
	const db = createDb(env.DATABASE_URL)
	const auth = buildAuth({
		db,
		secret: env.BETTER_AUTH_SECRET,
		url: env.BETTER_AUTH_URL,
	})

	const email = "admin@gmail.com"
	const password = "admin#123"
	const name = "Admin User"

	const existing = await db.query.user.findFirst({
		where: eq(user.email, email),
	})

	if (existing) {
		console.log("Admin user already exists. Updating role to admin...")
		await db.update(user).set({ role: "admin" }).where(eq(user.id, existing.id))
	} else {
		console.log("Creating admin user...")
		try {
			const res = await auth.api.signUpEmail({
				body: {
					email,
					password,
					name,
				},
			})
			if (res?.user) {
				console.log("User created:", res.user.id)
				console.log("Promoting to admin...")
				await db.update(user).set({ role: "admin" }).where(eq(user.id, res.user.id))
			} else {
				console.log("Unexpected response:", res)
			}
		} catch (error) {
			console.error("Failed to create admin user:", error)
		}
	}

	console.log("Seed complete.")
	process.exit(0)
}

seed().catch((err) => {
	console.error(err)
	process.exit(1)
})
