import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "./schema.ts";
const { Pool } = pkg;

export function createDb(url: string) {
  const pool = new Pool({ connectionString: url });
  return drizzle(pool, { schema });
}

export type Database = ReturnType<typeof createDb>;
