"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authClient.signUp.email({ name, email, password });

    if (result.error) {
      setError(result.error.message ?? "Sign up failed");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="glass w-full max-w-sm rounded-2xl p-8">
      <h2 className="font-display mb-6 text-xl font-bold">Create account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2.5 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-muted-foreground text-sm">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="focus:border-neon-violet/50 h-11 rounded-xl border-white/10 bg-white/8 text-base transition-colors focus:bg-white/12"
          />
        </div>
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
            className="focus:border-neon-violet/50 h-11 rounded-xl border-white/10 bg-white/8 text-base transition-colors focus:bg-white/12"
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
            minLength={8}
            className="focus:border-neon-violet/50 h-11 rounded-xl border-white/10 bg-white/8 text-base transition-colors focus:bg-white/12"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="from-neon-violet to-neon-cyan h-11 w-full rounded-xl bg-gradient-to-r text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-[0_0_24px_var(--glow-violet)]"
        >
          {loading ? "Creating account..." : "Sign up"}
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-neon-cyan hover:text-neon-violet font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
