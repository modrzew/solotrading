import { api, HydrateClient } from "~/trpc/server";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
  void api.expenses.getSummary.prefetch();

  return (
    <HydrateClient>
      <div className="animate-fade-up">
        <h1 className="font-display mb-8 text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
      </div>
      <DashboardContent />
    </HydrateClient>
  );
}
