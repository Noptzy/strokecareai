import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import type { Database } from "../db/client.ts";

export function buildAuth({ db, secret, url }: { db: Database; secret: string; url: string }) {
  return betterAuth({
    database: {
      provider: "drizzle",
      dialect: "postgresql",
      db,
    },
    secret,
    baseURL: url,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      admin()
    ]
  });
}

export type Auth = ReturnType<typeof buildAuth>;
