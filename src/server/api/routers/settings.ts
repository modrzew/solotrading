import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { userSettings } from "~/server/db/schema";

export const settingsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [settings] = await ctx.db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, ctx.session.user.id));

    return settings ?? { currency: "AUD", financialYearType: "jul-jun" };
  }),

  update: protectedProcedure
    .input(
      z.object({
        currency: z.string().length(3),
        financialYearType: z.enum(["jan-dec", "jul-jun"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.session.user.id));

      if (existing) {
        await ctx.db
          .update(userSettings)
          .set({
            currency: input.currency,
            financialYearType: input.financialYearType,
          })
          .where(eq(userSettings.userId, ctx.session.user.id));
      } else {
        await ctx.db.insert(userSettings).values({
          userId: ctx.session.user.id,
          currency: input.currency,
          financialYearType: input.financialYearType,
        });
      }
    }),
});
