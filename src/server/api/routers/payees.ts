import { and, eq, like } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { payees } from "~/server/db/schema";

export const payeesRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(payees)
        .where(
          and(
            eq(payees.userId, ctx.session.user.id),
            like(payees.name, `%${input.query}%`),
          ),
        )
        .limit(10);
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(payees)
        .where(
          and(
            eq(payees.userId, ctx.session.user.id),
            eq(payees.name, input.name),
          ),
        );

      if (existing) return existing;

      const [result] = await ctx.db
        .insert(payees)
        .values({
          userId: ctx.session.user.id,
          name: input.name,
        })
        .returning({ id: payees.id });

      return {
        id: result!.id,
        userId: ctx.session.user.id,
        name: input.name,
      };
    }),
});
