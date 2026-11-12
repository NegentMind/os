import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";

export const display = Chakra_Petch({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
});

export const sans = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable}`;
