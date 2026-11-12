import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Chakra_Petch({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Negent Mind — Order out of chaos",
  description:
    "VantaDB: an embedded memory engine for AI agents. Hybrid retrieval (HNSW + BM25 + RRF), MVCC snapshot isolation, local-first. Apache-2.0.",
  openGraph: {
    title: "Negent Mind — Order out of chaos",
    description:
      "VantaDB: an embedded memory engine for AI agents. Hybrid retrieval, MVCC, local-first. Apache-2.0.",
    type: "website",
    siteName: "Negent Mind",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
