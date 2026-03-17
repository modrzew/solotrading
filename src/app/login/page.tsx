import { ReceiptText } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-neon-violet/10 absolute top-1/4 -left-32 size-96 rounded-full blur-[128px]" />
        <div className="bg-neon-cyan/10 absolute -right-32 bottom-1/4 size-96 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="animate-fade-up mb-10 flex items-center gap-3">
          <div className="from-neon-violet to-neon-cyan glow-violet flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br">
            <ReceiptText className="size-6 text-white" />
          </div>
          <h1 className="font-display text-gradient text-3xl font-bold tracking-tight">
            Solotrading
          </h1>
        </div>
        <div className="animate-fade-up delay-100">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
