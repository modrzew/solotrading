"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Sign in failed");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="glass w-full max-w-sm rounded-2xl p-8">
      <h2 className="font-display mb-6 text-xl font-bold">Sign in</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2.5 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus:border-neon-violet/50 h-11 rounded-xl border-white/10 bg-white/5 text-base transition-colors focus:bg-white/[7%]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-muted-foreground text-sm">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="focus:border-neon-violet/50 h-11 rounded-xl border-white/10 bg-white/5 text-base transition-colors focus:bg-white/[7%]"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="from-neon-violet to-neon-cyan h-11 w-full rounded-xl bg-gradient-to-r text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-[0_0_24px_var(--glow-violet)]"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          No account?{" "}
          <Link
            href="/signup"
            className="text-neon-cyan hover:text-neon-violet font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
