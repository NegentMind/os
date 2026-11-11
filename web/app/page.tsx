import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "6rem 1.5rem" }}>
      <p style={{ letterSpacing: ".2em", fontSize: 12, color: "var(--fog)" }}>
        NEGENT MIND.
      </p>
      <h1 style={{ fontSize: "3rem", margin: "1rem 0" }}>
        Order out of chaos for the age of AI agents.
      </h1>
      <p style={{ color: "var(--fog)", lineHeight: 1.6 }}>
        Verifiable infrastructure for LLM ecosystems: memory, context,
        verification, execution.
      </p>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/login" style={{ color: "var(--pulse)" }}>
          Sign in →
        </Link>
      </p>
    </main>
  );
}
