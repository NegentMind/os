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
  title: "Negent Mind — Verifiable infrastructure for AI agents",
  description: "Order out of chaos for the age of AI agents.",
};

const CONTRACT = `THESIS: This home owns noise-into-signal. No terminal costume, no hero-metric strip, no card grid. OWN-WORLD: Void ground, bone figures, mono measurement; chaos accents (magenta/cyan/acid) only inside chaos moments; Pulse closes. STORY: Visitor sees chaos resolve by their own scroll and pointer, believes verification is demonstrable, acts via login. FIRST VIEWPORT: live 3D point field resolving noise to reticle behind one Chakra headline and a single Enter action. FORM: fractal descent, dealt lead, code-led. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.`;

/* FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. */

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
      <body>
        <span
          aria-hidden="true"
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: `<!-- ${CONTRACT} -->` }}
        />
        {children}
      </body>
    </html>
  );
}
