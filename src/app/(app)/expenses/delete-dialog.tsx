"use client";

import { AlertTriangle } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function DeleteDialog({
  expenseId,
  onClose,
}: {
  expenseId: number;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const deleteMutation = api.expenses.delete.useMutation({
    onSuccess: () => {
      void utils.expenses.list.invalidate();
      void utils.expenses.getSummary.invalidate();
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="glass-strong sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-lg">
            <AlertTriangle className="text-destructive size-5" />
            Delete expense?
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          This will permanently delete this expense and any attached receipts.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-white/10"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate({ id: expenseId })}
            disabled={deleteMutation.isPending}
            className="rounded-xl"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
