"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

export function PayeeCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);

  const { data: payees } = api.payees.search.useQuery(
    { query: search },
    { enabled: search.length > 0 },
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="focus:border-neon-violet/50 flex h-11 w-full items-center rounded-xl border border-white/10 bg-white/5 px-4 text-left text-base transition-colors hover:bg-white/[7%]">
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || "Select payee..."}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search payees..."
            value={search}
            onValueChange={(val) => {
              setSearch(val);
              onChange(val);
            }}
          />
          <CommandList>
            <CommandEmpty>
              {search ? `Use "${search}" as new payee` : "Type to search"}
            </CommandEmpty>
            {payees?.map((payee) => (
              <CommandItem
                key={payee.id}
                onSelect={() => {
                  onChange(payee.name);
                  setSearch(payee.name);
                  setOpen(false);
                }}
              >
                {payee.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
