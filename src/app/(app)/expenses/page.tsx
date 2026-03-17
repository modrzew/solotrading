import { api, HydrateClient } from "~/trpc/server";
import { ExpensesTable } from "./expenses-table";

export default async function ExpensesPage() {
  void api.expenses.list.prefetch();
  void api.settings.get.prefetch();

  return (
    <HydrateClient>
      <div className="animate-fade-up">
        <h1 className="font-display mb-8 text-3xl font-bold tracking-tight">
          Expenses
        </h1>
      </div>
      <div className="animate-fade-up delay-100">
        <ExpensesTable />
      </div>
    </HydrateClient>
  );
}
