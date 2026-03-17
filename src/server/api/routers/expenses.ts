import { and, between, count, eq, like, or, sql, sum } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { expenses, payees, receipts, userSettings } from "~/server/db/schema";
import { getFYRange, type FYType } from "~/lib/financial-year";
import fs from "fs/promises";
import path from "path";

export const expensesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          sortBy: z
            .enum(["date", "amount", "payee"])
            .optional()
            .default("date"),
          sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          id: expenses.id,
          date: expenses.date,
          description: expenses.description,
          amount: expenses.amount,
          currency: expenses.currency,
          payeeName: payees.name,
          payeeId: expenses.payeeId,
          receiptCount: count(receipts.id),
        })
        .from(expenses)
        .leftJoin(payees, eq(expenses.payeeId, payees.id))
        .leftJoin(receipts, eq(expenses.id, receipts.expenseId))
        .where(
          and(
            eq(expenses.userId, ctx.session.user.id),
            input?.search
              ? or(
                  like(payees.name, `%${input.search}%`),
                  like(expenses.description, `%${input.search}%`),
                )
              : undefined,
          ),
        )
        .groupBy(expenses.id, payees.name)
        .orderBy(
          input?.sortOrder === "asc"
            ? sql`${input?.sortBy === "amount" ? expenses.amount : input?.sortBy === "payee" ? payees.name : expenses.date} asc`
            : sql`${input?.sortBy === "amount" ? expenses.amount : input?.sortBy === "payee" ? payees.name : expenses.date} desc`,
          sql`${expenses.id} desc`,
        );

      return rows;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [expense] = await ctx.db
        .select({
          id: expenses.id,
          date: expenses.date,
          description: expenses.description,
          amount: expenses.amount,
          currency: expenses.currency,
          payeeName: payees.name,
          payeeId: expenses.payeeId,
        })
        .from(expenses)
        .leftJoin(payees, eq(expenses.payeeId, payees.id))
        .where(
          and(
            eq(expenses.id, input.id),
            eq(expenses.userId, ctx.session.user.id),
          ),
        );

      if (!expense) return null;

      const expenseReceipts = await ctx.db
        .select()
        .from(receipts)
        .where(eq(receipts.expenseId, input.id));

      return { ...expense, receipts: expenseReceipts };
    }),

  create: protectedProcedure
    .input(
      z.object({
        payeeName: z.string().min(1).max(255),
        date: z.date(),
        description: z.string().optional(),
        amount: z.string(),
        currency: z.string().length(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find or create payee
      let [payee] = await ctx.db
        .select()
        .from(payees)
        .where(
          and(
            eq(payees.userId, ctx.session.user.id),
            eq(payees.name, input.payeeName),
          ),
        );

      if (!payee) {
        const [result] = await ctx.db
          .insert(payees)
          .values({
            userId: ctx.session.user.id,
            name: input.payeeName,
          })
          .returning({ id: payees.id });
        payee = {
          id: result!.id,
          userId: ctx.session.user.id,
          name: input.payeeName,
          createdAt: new Date(),
        };
      }

      const [result] = await ctx.db
        .insert(expenses)
        .values({
          userId: ctx.session.user.id,
          payeeId: payee.id,
          date: input.date,
          description: input.description ?? null,
          amount: input.amount,
          currency: input.currency,
        })
        .returning({ id: expenses.id });

      return { id: result!.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        payeeName: z.string().min(1).max(255),
        date: z.date(),
        description: z.string().optional(),
        amount: z.string(),
        currency: z.string().length(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find or create payee
      let [payee] = await ctx.db
        .select()
        .from(payees)
        .where(
          and(
            eq(payees.userId, ctx.session.user.id),
            eq(payees.name, input.payeeName),
          ),
        );

      if (!payee) {
        const [result] = await ctx.db
          .insert(payees)
          .values({
            userId: ctx.session.user.id,
            name: input.payeeName,
          })
          .returning({ id: payees.id });
        payee = {
          id: result!.id,
          userId: ctx.session.user.id,
          name: input.payeeName,
          createdAt: new Date(),
        };
      }

      await ctx.db
        .update(expenses)
        .set({
          payeeId: payee.id,
          date: input.date,
          description: input.description ?? null,
          amount: input.amount,
          currency: input.currency,
        })
        .where(
          and(
            eq(expenses.id, input.id),
            eq(expenses.userId, ctx.session.user.id),
          ),
        );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Delete receipt files from disk
      const expenseReceipts = await ctx.db
        .select()
        .from(receipts)
        .where(eq(receipts.expenseId, input.id));

      for (const receipt of expenseReceipts) {
        const filePath = path.join(
          process.cwd(),
          "uploads",
          receipt.storedFilename,
        );
        await fs.unlink(filePath).catch(() => undefined);
      }

      await ctx.db
        .delete(expenses)
        .where(
          and(
            eq(expenses.id, input.id),
            eq(expenses.userId, ctx.session.user.id),
          ),
        );
    }),

  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const [settings] = await ctx.db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, ctx.session.user.id));

    const fyType = (settings?.financialYearType ?? "jul-jun") as FYType;
    const currency = settings?.currency ?? "AUD";
    const { start, end } = getFYRange(fyType);

    const [result] = await ctx.db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, ctx.session.user.id),
          between(expenses.date, start, end),
        ),
      );

    return {
      total: result?.total ?? "0",
      currency,
      fyType,
    };
  }),
});
