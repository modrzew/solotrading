/**
 * Schema re-export layer.
 *
 * Both schema.sqlite.ts and schema.pg.ts export identical table names with
 * matching column names. At runtime the correct dialect's tables are used
 * based on DATABASE_URL. TypeScript sees the SQLite types (the default
 * dialect), but a type assertion lets the Postgres Drizzle instance accept
 * them too — the actual SQL generation is driven by the runtime table
 * metadata, not the TS types.
 */
import * as sqliteSchema from "./schema.sqlite";
import * as pgSchema from "./schema.pg";

const isPg = (process.env.DATABASE_URL ?? "").startsWith("postgres");

// Pick the right runtime implementation, typed as SQLite (default).
// When using Postgres, the db/index.ts casts appropriately.
const s = isPg ? (pgSchema as unknown as typeof sqliteSchema) : sqliteSchema;

export const createTable = s.createTable;

export const user = s.user;
export const session = s.session;
export const account = s.account;
export const verification = s.verification;

export const userSettings = s.userSettings;
export const payees = s.payees;
export const expenses = s.expenses;
export const receipts = s.receipts;

export const usersRelations = s.usersRelations;
export const accountsRelations = s.accountsRelations;
export const sessionsRelations = s.sessionsRelations;
export const expensesRelations = s.expensesRelations;
export const payeesRelations = s.payeesRelations;
export const receiptsRelations = s.receiptsRelations;
