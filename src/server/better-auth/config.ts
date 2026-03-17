import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "~/server/db";

const isPg = (process.env.DATABASE_URL ?? "").startsWith("postgres");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: isPg ? "pg" : "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {},
});

export type Session = typeof auth.$Infer.Session;
