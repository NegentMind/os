import { notFound } from "next/navigation";
import { APP_ENABLED } from "@/lib/site";
import { LoginForm } from "./login-form";

/*
 * Server gate for /login. The product surface is disabled at launch
 * (NEXT_PUBLIC_APP_ENABLED !== "true") and the route 404s; the client
 * form stays intact in login-form.tsx.
 */
export default function LoginPage() {
  if (!APP_ENABLED) notFound();
  return <LoginForm />;
}
