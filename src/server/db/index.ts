/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { env } from "~/env";
import * as schema from "./schema";

const isPg = env.DATABASE_URL.startsWith("postgres");

/**
 * Creates the Drizzle instance for the configured dialect.
 *
 * TypeScript sees everything as the SQLite dialect (the default). When
 * Postgres is active, the runtime objects come from drizzle-orm/node-postgres
 * but are cast to the SQLite type — the actual SQL generation is driven by
 * the runtime metadata, not the TS types.
 */
function createDb(): BetterSQLite3Database<typeof schema> {
  if (isPg) {
    const { drizzle } = require("drizzle-orm/node-postgres");
    const { Pool } = require("pg");
    const pgSchema = require("./schema.pg");
    const pool = new Pool({ connectionString: env.DATABASE_URL });
    return drizzle(pool, {
      schema: pgSchema,
    }) as unknown as BetterSQLite3Database<typeof schema>;
  }

  const { drizzle } = require("drizzle-orm/better-sqlite3");
  const Database = require("better-sqlite3");

  const dbPath = env.DATABASE_URL.replace(/^file:/, "");
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("busy_timeout = 5000");
  return drizzle(sqlite, { schema });
}

const globalForDb = globalThis as unknown as {
  db: BetterSQLite3Database<typeof schema> | undefined;
};

export const db = globalForDb.db ?? createDb();
if (env.NODE_ENV !== "production") globalForDb.db = db;
