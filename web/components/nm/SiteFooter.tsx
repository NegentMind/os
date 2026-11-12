import Link from "next/link";

/*
 * Cierre real: wordmark gigante (patrón portado de templates/ox Footer —
 * footer-word a escala de viewport), sitemap centrado y meta row.
 * Sin rutas inventadas; legales marcados como pendientes.
 */
export function SiteFooter() {
  return (
    <footer className="border-linedark border-t pt-16 pb-10">
      <p
        aria-hidden="true"
        className="font-display text-center font-bold tracking-[0.02em] text-bone select-none"
        style={{ fontSize: "clamp(96px, 17vw, 240px)", lineHeight: 0.8 }}
      >
        NEGENT<span className="text-pulse">.</span>
      </p>

      <nav
        aria-label="Mapa del sitio"
        className="font-mono mt-12 mb-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-bold tracking-[0.14em] text-fog uppercase"
      >
        <Link href="#product" className="transition-colors hover:text-pulse">
          Engine
        </Link>
        <Link href="#roadmap" className="transition-colors hover:text-pulse">
          Roadmap
        </Link>
        <a
          href="https://github.com/ness-e/Vantadb"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-pulse"
        >
          VantaDB
        </a>
        <a
          href="https://github.com/NegentMind"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-pulse"
        >
          GitHub
        </a>
        <a
          href="https://github.com/NegentMind/negentmind"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-pulse"
        >
          Specs
        </a>
        <a
          href="mailto:negent@negentmind.com"
          className="transition-colors hover:text-pulse"
        >
          negent@negentmind.com
        </a>
      </nav>

      <div className="font-mono mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 text-[13px] text-fog sm:px-6">
        <span>© 2026 Negent Mind · Apache-2.0</span>
        <span>Privacy and Terms pending publication.</span>
      </div>
    </footer>
  );
}
