import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NEGENT MIND",
  description:
    "NEGENT MIND — Applied AI Research & Product Engineering: infrastructure for persistent, controllable, efficient and trustworthy agentic AI.",
  robots: { index: false, follow: false },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
