FROM oven/bun:1 AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV SKIP_ENV_VALIDATION=1
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN useradd --system --uid 1001 nextjs

# Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:bun /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/.next/static ./.next/static

# Files needed for drizzle-kit db:push at startup
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/env.js ./src/env.js
COPY --from=builder /app/src/server/db/schema.ts ./src/server/db/schema.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Startup script
COPY docker/start.sh ./start.sh
RUN chmod +x ./start.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]
