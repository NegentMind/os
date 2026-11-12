"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FlipText } from "@/components/nm/FlipText";

/*
 * Floating nav ported from webTemplates/mondragon2 (Nav.tsx): transparent
 * over the hero — bone ink that reads over the silk — collapsing into a
 * light pill after 60px of scroll. Links use letter-by-letter FlipText.
 */
const LINKS = [
  { href: "#system", label: "System" },
  { href: "#modules", label: "Modules" },
  { href: "#engine", label: "Engine" },
  { href: "#proof", label: "Proof" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nm-nav${scrolled ? " pill" : ""}`}>
      <div className="nm-nav-inner">
        <Link
          href="/"
          className="nm-nav-word font-display uppercase"
          aria-label="Negent Mind, inicio"
        >
          NEGENT&nbsp;MIND<span className="text-pulse">.</span>
        </Link>
        <nav aria-label="Secciones" className="nm-nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              <FlipText text={l.label} />
            </Link>
          ))}
        </nav>
        <a
          href="https://github.com/NegentMind"
          target="_blank"
          rel="noopener noreferrer"
          className="nm-nav-cta font-mono"
        >
          GitHub
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
