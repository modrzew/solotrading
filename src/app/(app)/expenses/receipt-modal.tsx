"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function ReceiptModal({
  expenseId,
  onClose,
}: {
  expenseId: number;
  onClose: () => void;
}) {
  const { data: expense } = api.expenses.getById.useQuery({ id: expenseId });
  const [index, setIndex] = useState(0);

  const receiptsList = expense?.receipts ?? [];
  const current = receiptsList[index];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="glass-strong max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Receipt
            {receiptsList.length > 1
              ? ` (${index + 1}/${receiptsList.length})`
              : ""}
          </DialogTitle>
        </DialogHeader>
        {current ? (
          <div className="flex flex-col items-center gap-4">
            {current.mimeType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/uploads/${current.id}`}
                alt={current.filename}
                className="max-h-[60vh] rounded-xl object-contain"
              />
            ) : (
              <iframe
                src={`/api/uploads/${current.id}`}
                className="h-[60vh] w-full rounded-xl"
                title={current.filename}
              />
            )}
            {receiptsList.length > 1 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-xl border-white/10"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-xl border-white/10"
                  onClick={() =>
                    setIndex((i) => Math.min(receiptsList.length - 1, i + 1))
                  }
                  disabled={index === receiptsList.length - 1}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Loading...
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
