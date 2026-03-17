import { type Config } from "drizzle-kit";

import { env } from "~/env";

const isPg = env.DATABASE_URL.startsWith("postgres");

export default {
  schema: isPg
    ? "./src/server/db/schema.pg.ts"
    : "./src/server/db/schema.sqlite.ts",
  dialect: isPg ? "postgresql" : "sqlite",
  dbCredentials: isPg
    ? { url: env.DATABASE_URL }
    : { url: env.DATABASE_URL.replace(/^file:/, "") },
  tablesFilter: ["solotrading_*"],
} satisfies Config;
