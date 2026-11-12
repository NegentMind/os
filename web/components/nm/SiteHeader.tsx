import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Barra fija: fondo sólido void + hairline. Sin vidrios ni decoración. */
export function SiteHeader() {
  return (
    <header className="border-linedark fixed inset-x-0 top-0 z-50 border-b bg-void">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-sm font-bold tracking-[0.12em] text-bone uppercase"
          aria-label="Negent Mind, inicio"
        >
          NEGENT&nbsp;MIND<span className="text-pulse">.</span>
        </Link>
        <nav
          aria-label="Secciones"
          className="font-mono hidden items-center gap-6 text-xs tracking-[0.14em] text-fog uppercase md:flex"
        >
          <Link href="#mechanism" className="transition-colors hover:text-bone">
            Mechanism
          </Link>
          <Link href="#product" className="transition-colors hover:text-bone">
            Engine
          </Link>
          <Link href="#roadmap" className="transition-colors hover:text-bone">
            Roadmap
          </Link>
          <Link href="#faq" className="transition-colors hover:text-bone">
            FAQ
          </Link>
        </nav>
        <Button asChild size="sm" className="font-mono tracking-[0.08em]">
          <a
            href="https://github.com/ness-e/Vantadb"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </header>
  );
}
