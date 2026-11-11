import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

export default async function AppHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 1.5rem" }}>
      <h1>Dashboard</h1>
      <p>Signed in as {user.email}.</p>
      {/* Futuro: comunidad, proyectos, holones */}
    </main>
  );
}
