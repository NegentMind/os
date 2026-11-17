import {
  Chakra_Petch,
  DM_Sans,
  Inter,
  JetBrains_Mono,
  Outfit,
} from "next/font/google";

/*
 * v1 fonts (Void/Bone site). The product surface still imports `fontVars`
 * from its own layout and globals.css resolves the literal family names;
 * keep these instances so the frozen pages keep their real typefaces.
 */
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

/*
 * v2 (Orbital) fonts. Unique variable names so both systems can coexist;
 * app/orbital.css aliases them into its own @theme.
 */
export const heading = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const body = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const code = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const fontVarsV2 = `${heading.variable} ${body.variable} ${code.variable}`;
