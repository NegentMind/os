import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Negent Mind — Verifiable infrastructure for AI agents",
  description: "Order out of chaos for the age of AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
