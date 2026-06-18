import { defineConfig } from "drizzle-kit";
import { env } from "@api/infrastructure/config/env.ts";

export default defineConfig({
  schema: "./src/infrastructure/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
