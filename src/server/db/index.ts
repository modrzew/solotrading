import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "~/env";
import * as schema from "./schema";

function createDb() {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  return drizzle(pool, { schema });
}

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined;
};

export const db = globalForDb.db ?? createDb();
if (env.NODE_ENV !== "production") globalForDb.db = db;
