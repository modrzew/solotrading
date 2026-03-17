"use client";

import { useState } from "react";
import { CURRENCIES, getCurrency } from "~/lib/currencies";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function CurrencyPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = getCurrency(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="focus:border-neon-violet/50 flex h-11 items-center gap-1.5 rounded-xl border border-white/10 bg-white/8 px-3 text-base transition-colors hover:bg-white/12 focus:outline-none">
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="text-muted-foreground text-sm">{selected.code}</span>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start" side="bottom">
        <div className="flex flex-col">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                c.code === value
                  ? "text-foreground bg-white/5"
                  : "text-muted-foreground"
              }`}
            >
              <span className="text-lg leading-none">{c.flag}</span>
              <span className="font-medium">{c.code}</span>
              <span className="ml-auto text-xs opacity-60">{c.symbol}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
