"use client";

import { api } from "~/trpc/react";
import { formatCurrency } from "~/lib/format";
import { getFYLabel } from "~/lib/financial-year";

export function DashboardContent() {
  const [summary] = api.expenses.getSummary.useSuspenseQuery();

  return (
    <div className="animate-fade-up flex flex-col items-center justify-center py-24 delay-100">
      <p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
        Total Expenses &middot; {getFYLabel(summary.fyType)}
      </p>
      <p
        className="font-display text-7xl font-extrabold tracking-tight sm:text-8xl"
        style={{
          background:
            "linear-gradient(135deg, #ff6b6b, #ee5a24, #f0932b, #ff4757)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 40px rgba(238, 90, 36, 0.35))",
        }}
      >
        {formatCurrency(Number(summary.total), summary.currency)}
      </p>
    </div>
  );
}
