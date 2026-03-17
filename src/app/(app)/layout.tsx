import Link from "next/link";
import { redirect } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { getSession } from "~/server/better-auth/server";
import { UserNav } from "./user-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="glass-strong sticky top-0 z-50 border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link
            href="/dashboard"
            className="font-display flex items-center gap-2.5 text-lg font-bold tracking-tight"
          >
            <div className="from-neon-violet to-neon-cyan flex size-8 items-center justify-center rounded-lg bg-gradient-to-br">
              <ReceiptText className="size-4 text-white" />
            </div>
            <span className="text-gradient">Solotrading</span>
          </Link>
          <nav className="ml-10 flex gap-1">
            <Link
              href="/expenses"
              className="text-muted-foreground hover:text-foreground rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-white/5"
            >
              Expenses
            </Link>
          </nav>
          <div className="ml-auto">
            <UserNav userName={session.user.name} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
