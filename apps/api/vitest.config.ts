import { resolve } from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
		globals: true,
	},
	resolve: {
		alias: {
			"@api": resolve(import.meta.dirname, "src"),
			"@web": resolve(import.meta.dirname, "../web/src"),
		},
	},
})
