"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const CURRENCIES = [
  "AUD",
  "USD",
  "EUR",
  "GBP",
  "NZD",
  "CAD",
  "JPY",
  "CHF",
  "SGD",
  "HKD",
];

const FY_TYPES = [
  { value: "jan-dec" as const, label: "January - December" },
  { value: "jul-jun" as const, label: "July - June" },
];

const selectClass =
  "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-base outline-none transition-colors focus:border-neon-violet/50 focus:bg-white/[7%]";

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { data: settings } = api.settings.get.useQuery();
  const [currency, setCurrency] = useState(settings?.currency ?? "AUD");
  const [fyType, setFyType] = useState<"jan-dec" | "jul-jun">(
    (settings?.financialYearType as "jan-dec" | "jul-jun") ?? "jul-jun",
  );

  const utils = api.useUtils();
  const update = api.settings.update.useMutation({
    onSuccess: () => {
      void utils.settings.get.invalidate();
      void utils.expenses.getSummary.invalidate();
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="glass-strong sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-muted-foreground text-sm">
              Currency
            </Label>
            <select
              id="currency"
              className={selectClass}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fy-type" className="text-muted-foreground text-sm">
              Financial year
            </Label>
            <select
              id="fy-type"
              className={selectClass}
              value={fyType}
              onChange={(e) =>
                setFyType(e.target.value as "jan-dec" | "jul-jun")
              }
            >
              {FY_TYPES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              update.mutate({ currency, financialYearType: fyType })
            }
            disabled={update.isPending}
            className="from-neon-violet to-neon-cyan rounded-xl bg-gradient-to-r font-semibold text-white hover:opacity-90"
          >
            {update.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
