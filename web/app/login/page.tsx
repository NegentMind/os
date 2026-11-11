"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/app` },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: "6rem 1.5rem" }}>
      <h1>Sign in</h1>
      {sent ? (
        <p>Check your inbox for the magic link.</p>
      ) : (
        <form onSubmit={signIn} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, fontSize: 16 }}
          />
          <button type="submit">Send magic link</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </main>
  );
}
