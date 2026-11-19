import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroArtPlate } from "@/components/nm/v2/hero-warp";

export const metadata: Metadata = {
  title: "Orbital art plate",
  robots: { index: false, follow: false },
};

export default function ArtPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <HeroArtPlate />;
}
