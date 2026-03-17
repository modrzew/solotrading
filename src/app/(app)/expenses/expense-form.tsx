"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { PayeeCombobox } from "./payee-combobox";

type ExpenseData = {
  id: number;
  date: Date;
  payeeName: string | null;
  payeeId: number;
  description: string | null;
  amount: string;
  currency: string;
};

const inputClass =
  "h-11 rounded-xl border-white/10 bg-white/5 text-base transition-colors focus:border-neon-violet/50 focus:bg-white/[7%]";

export function ExpenseForm({
  expense,
  defaultCurrency,
  onClose,
}: {
  expense?: ExpenseData;
  defaultCurrency: string;
  onClose: () => void;
}) {
  const isEditing = !!expense;
  const [payeeName, setPayeeName] = useState(expense?.payeeName ?? "");
  const [date, setDate] = useState(
    expense
      ? new Date(expense.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [description, setDescription] = useState(expense?.description ?? "");
  const [amount, setAmount] = useState(expense?.amount ?? "");
  const [currency, setCurrency] = useState(
    expense?.currency ?? defaultCurrency,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();

  const create = api.expenses.create.useMutation({
    onSuccess: async (data) => {
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("expenseId", String(data.id));
        await fetch("/api/uploads", { method: "POST", body: formData });
      }
      void utils.expenses.list.invalidate();
      void utils.expenses.getSummary.invalidate();
      onClose();
    },
  });

  const update = api.expenses.update.useMutation({
    onSuccess: async () => {
      const file = fileInputRef.current?.files?.[0];
      if (file && expense) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("expenseId", String(expense.id));
        await fetch("/api/uploads", { method: "POST", body: formData });
      }
      void utils.expenses.list.invalidate();
      void utils.expenses.getSummary.invalidate();
      onClose();
    },
  });

  const isPending = create.isPending || update.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      payeeName,
      date: new Date(date),
      description: description || undefined,
      amount,
      currency,
    };

    if (isEditing) {
      update.mutate({ id: expense.id, ...data });
    } else {
      create.mutate(data);
    }
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {isEditing ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Payee</Label>
            <PayeeCombobox value={payeeName} onChange={setPayeeName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-muted-foreground text-sm">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-muted-foreground text-sm"
            >
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="amount" className="text-muted-foreground text-sm">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="currency"
                className="text-muted-foreground text-sm"
              >
                Currency
              </Label>
              <select
                id="currency"
                className="focus:border-neon-violet/50 flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-base transition-colors outline-none focus:bg-white/[7%]"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {["AUD", "USD", "EUR", "GBP", "NZD", "CAD", "JPY"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Receipt</Label>
            <label className="text-muted-foreground hover:border-neon-violet/30 flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[3%] px-4 text-sm transition-colors hover:bg-white/5">
              <Upload className="size-4" />
              {fileInputRef.current?.files?.[0]?.name ??
                "Upload PDF, PNG, or JPG"}
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                ref={fileInputRef}
                className="hidden"
                onChange={() => {
                  // Force re-render to show filename
                  setAmount(amount);
                }}
              />
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !payeeName || !amount}
              className="from-neon-violet to-neon-cyan rounded-xl bg-gradient-to-r font-semibold text-white hover:opacity-90"
            >
              {isPending ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
