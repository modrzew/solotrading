"use client";

import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Paperclip,
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatCurrency } from "~/lib/format";
import { ExpenseForm } from "./expense-form";
import { DeleteDialog } from "./delete-dialog";
import { ReceiptModal } from "./receipt-modal";

type ExpenseRow = {
  id: number;
  date: Date;
  payeeName: string | null;
  payeeId: number;
  description: string | null;
  amount: string;
  currency: string;
  receiptCount: number;
};

export function ExpensesTable() {
  const [expenses] = api.expenses.list.useSuspenseQuery();
  const [settings] = api.settings.get.useSuspenseQuery();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingExpense, setEditingExpense] = useState<ExpenseRow | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<ExpenseRow | null>(
    null,
  );
  const [viewingReceipts, setViewingReceipts] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const columns: ColumnDef<ExpenseRow>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <button
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ row }) =>
        new Date(row.getValue<Date>("date")).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      accessorKey: "payeeName",
      header: ({ column }) => (
        <button
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("payeeName")}</span>
      ),
    },
    {
      accessorKey: "description",
      header: () => <span className="text-muted-foreground">Description</span>,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue("description") ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <button
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="size-3" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-display text-neon-cyan font-semibold">
          {formatCurrency(
            Number(row.getValue("amount")),
            row.original.currency,
          )}
        </span>
      ),
      sortingFn: (a, b) =>
        Number(a.original.amount) - Number(b.original.amount),
    },
    {
      id: "receipts",
      header: "",
      cell: ({ row }) =>
        row.original.receiptCount > 0 ? (
          <button
            className="text-muted-foreground hover:text-neon-violet rounded-lg p-1.5 transition-colors hover:bg-white/5"
            onClick={() => setViewingReceipts(row.original.id)}
          >
            <Paperclip className="size-4" />
          </button>
        ) : null,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors hover:bg-white/5"
            onClick={() => setEditingExpense(row.original)}
          >
            <Pencil className="size-4" />
          </button>
          <button
            className="text-muted-foreground hover:text-destructive rounded-lg p-1.5 transition-colors hover:bg-white/5"
            onClick={() => setDeletingExpense(row.original)}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: expenses as ExpenseRow[],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase();
      const payee = (row.original.payeeName ?? "").toLowerCase();
      const desc = (row.original.description ?? "").toLowerCase();
      return payee.includes(search) || desc.includes(search);
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search expenses..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="focus:border-neon-violet/50 h-11 rounded-xl border-white/10 bg-white/5 pl-10 text-base transition-colors focus:bg-white/[7%]"
          />
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="from-neon-violet to-neon-cyan h-11 gap-2 rounded-xl bg-gradient-to-r px-5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-[0_0_24px_var(--glow-violet)]"
        >
          <Plus className="size-4" />
          Add Expense
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-white/5 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-white/5 transition-colors hover:bg-white/[3%]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-32 text-center"
                >
                  No expenses yet. Add your first one above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showCreate && (
        <ExpenseForm
          defaultCurrency={settings.currency}
          onClose={() => setShowCreate(false)}
        />
      )}

      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          defaultCurrency={settings.currency}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {deletingExpense && (
        <DeleteDialog
          expenseId={deletingExpense.id}
          onClose={() => setDeletingExpense(null)}
        />
      )}

      {viewingReceipts !== null && (
        <ReceiptModal
          expenseId={viewingReceipts}
          onClose={() => setViewingReceipts(null)}
        />
      )}
    </div>
  );
}
