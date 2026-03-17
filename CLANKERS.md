# CLANKERS.md

This file provides guidance to AI agents when working with code in this repository.

## Commands

Use `bun` for all commands (not npm/npx).

```bash
bun run dev          # Start dev server (Turbo)
bun run build        # Production build
bun run check        # ESLint + TypeScript type checking
bun run lint         # ESLint only
bun run typecheck    # tsc --noEmit only

bun run db:generate  # Generate Drizzle migrations
bun run db:push      # Push schema directly to database
bun run db:studio    # Open Drizzle Studio GUI
```

## Architecture

### Dual-dialect database

The app supports both SQLite (default, for local dev) and Postgres (for production). The dialect is determined by `DATABASE_URL`:
- `file:db.sqlite` → SQLite via `better-sqlite3`
- `postgresql://...` → Postgres via `pg`

Three schema files work together:
- `src/server/db/schema.sqlite.ts` — SQLite table definitions
- `src/server/db/schema.pg.ts` — Postgres table definitions
- `src/server/db/schema.ts` — Barrel that re-exports from the correct dialect at runtime

`src/server/db/index.ts` creates the Drizzle instance. TypeScript types are pinned to SQLite (`BetterSQLite3Database`); the Postgres path casts through `unknown`. This is intentional — runtime SQL generation uses actual object metadata, not TS types.

App tables are prefixed with `solotrading_` via `createTable`. Auth tables (user, session, account, verification) are unprefixed and managed by Better Auth.

### tRPC

- `src/server/api/trpc.ts` — Context (db + session), `publicProcedure`, `protectedProcedure`
- `src/server/api/root.ts` — Router aggregation (settings, expenses, payees)
- `src/server/api/routers/` — Individual routers
- `src/trpc/server.ts` — Server-side caller + `HydrateClient` for RSC prefetching
- `src/trpc/react.tsx` — Client-side hooks

### Auth

Better Auth with email/password. Server-side session via `getSession()` from `src/server/better-auth/server.ts` (React `cache()`-wrapped). Client-side via `authClient` from `src/server/better-auth/client.ts`.

Middleware at `src/middleware.ts` checks for `better-auth.session_token` cookie and redirects unauthenticated users to `/login`.

### Route structure

- `/login`, `/signup` — Public auth pages
- `/(app)/` — Protected route group (layout checks session, renders nav)
  - `/dashboard` — FY expense summary
  - `/expenses` — CRUD table with receipt upload
- `/api/uploads` — File upload/serve routes (not tRPC, uses FormData)

### UI theme

Dark neon theme defined in `src/styles/globals.css`. Key custom utilities: `.glass`, `.glass-strong` (glassmorphism), `.text-gradient`, `.glow-violet`, `.glow-cyan`, `.animate-fade-up`. Colors use OKLch. Fonts: Syne (display, `--font-display-ref`) and Plus Jakarta Sans (body, `--font-body`).

shadcn/ui components use the base-nova style with `@base-ui/react` primitives (not Radix). No `asChild` prop — components render their own elements.

### Constants

Currency definitions (code, symbol, flag emoji, name) live in `src/lib/currencies.ts`. Financial year utilities in `src/lib/financial-year.ts`.
