"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { authClient } from "~/server/better-auth/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SettingsModal } from "./settings-modal";

export function UserNav({ userName }: { userName: string }) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5 focus:outline-none">
          <div className="from-neon-violet to-neon-cyan flex size-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline">{userName}</span>
          <ChevronDown className="size-3.5 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut();
              router.push("/login");
            }}
          >
            <LogOut className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
