import Link from "next/link";

/** Cierre real: sitemap, org, contacto, legales como texto. Sin rutas inventadas. */
export function SiteFooter() {
  return (
    <footer className="border-linedark border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-display text-lg font-bold tracking-[0.12em] text-bone uppercase">
            NEGENT&nbsp;MIND<span className="text-pulse">.</span>
          </p>
          <nav
            aria-label="Mapa del sitio"
            className="font-mono mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-[0.14em] text-fog uppercase"
          >
            <Link href="/" className="transition-colors hover:text-bone">
              Home
            </Link>
            <Link href="/login" className="transition-colors hover:text-bone">
              Login
            </Link>
            <Link href="/app" className="transition-colors hover:text-bone">
              App
            </Link>
            <a
              href="https://github.com/NegentMind"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bone"
            >
              GitHub
            </a>
            <a
              href="mailto:negent@negentmind.com"
              className="transition-colors hover:text-bone"
            >
              negent@negentmind.com
            </a>
          </nav>
          <p className="font-mono mt-6 text-[11px] tracking-[0.08em] text-fog">
            © 2026 NegentMind · Privacy and Terms pending publication.
          </p>
        </div>
        <p
          aria-hidden="true"
          className="font-display text-6xl font-bold tracking-[0.04em] text-bone select-none sm:text-7xl"
        >
          NM<span className="text-pulse">.</span>
        </p>
      </div>
    </footer>
  );
}
