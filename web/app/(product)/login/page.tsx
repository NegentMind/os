"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/app` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-4 sm:px-6">
      <Link
        href="/"
        className="font-display text-sm font-bold tracking-[0.12em] text-bone uppercase"
      >
        NEGENT&nbsp;MIND<span className="text-pulse">.</span>
      </Link>

      <h1 className="font-display mt-10 text-3xl font-bold tracking-[0.04em] text-bone uppercase">
        Sign in
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-fog text-pretty">
        Magic link, no password. The link lands you back here.
      </p>

      {sent ? (
        <div className="border-linedark mt-8 border p-5">
          <p className="font-mono text-xs tracking-[0.1em] text-pulse uppercase">
            Link sent
          </p>
          <p className="mt-2 text-sm text-fog">
            Check your inbox for the magic link.
          </p>
        </div>
      ) : (
        <form onSubmit={signIn} className="mt-8 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-mono text-xs tracking-[0.14em] text-fog uppercase">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="font-mono tracking-[0.08em]">
            {loading ? "Sending…" : "Send magic link"}
          </Button>
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </main>
  );
}
