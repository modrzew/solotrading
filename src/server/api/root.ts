import { settingsRouter } from "~/server/api/routers/settings";
import { expensesRouter } from "~/server/api/routers/expenses";
import { payeesRouter } from "~/server/api/routers/payees";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  settings: settingsRouter,
  expenses: expensesRouter,
  payees: payeesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
