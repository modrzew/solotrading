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
import { CurrencyPicker } from "./currency-picker";
import { getCurrency } from "~/lib/currencies";

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
  "h-11 rounded-xl border-white/10 bg-white/8 text-base transition-colors focus:border-neon-violet/50 focus:bg-white/12";

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
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = api.useUtils();
  const currencyInfo = getCurrency(currency);

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
            <textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="focus:border-neon-violet/50 w-full resize-none rounded-xl border border-white/10 bg-white/8 px-3 py-2.5 text-base transition-colors outline-none focus:bg-white/12"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Amount</Label>
            <div className="flex items-center gap-2">
              <CurrencyPicker value={currency} onChange={setCurrency} />
              <div className="focus-within:border-neon-violet/50 flex flex-1 items-center gap-0 rounded-xl border border-white/10 bg-white/8 transition-colors focus-within:bg-white/12">
                <span className="text-muted-foreground shrink-0 pl-3 font-serif text-lg">
                  {currencyInfo.symbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  className="h-11 w-full bg-transparent pr-3 pl-1 font-serif text-2xl font-medium outline-none"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Receipt</Label>
            <label className="text-muted-foreground hover:border-neon-violet/30 flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[3%] px-4 text-sm transition-colors hover:bg-white/5">
              <Upload className="size-4" />
              {fileName ?? "Upload PDF, PNG, or JPG"}
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                ref={fileInputRef}
                className="hidden"
                onChange={() => {
                  setFileName(fileInputRef.current?.files?.[0]?.name ?? null);
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
