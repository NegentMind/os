import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";

export default async function AppHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center px-4 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.14em] text-fog uppercase">
        Signed in
      </p>
      <h1 className="font-display mt-4 text-3xl font-bold tracking-[0.04em] text-bone uppercase">
        {user.email}
      </h1>
      <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-fog text-pretty">
        There is nothing behind this door yet. The product lives in the open —
        the engine is on GitHub, not in a dashboard.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline" className="font-mono tracking-[0.08em]">
          <a
            href="https://github.com/ness-e/Vantadb"
            target="_blank"
            rel="noopener noreferrer"
          >
            VantaDB on GitHub
          </a>
        </Button>
        <Button asChild variant="ghost" className="font-mono tracking-[0.08em]">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
