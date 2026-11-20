/*
 * Route-level fallback while a segment streams in.
 * Quiet placeholder: the shell (header/footer) is already there, so the
 * loader only needs a minimal non-layout-shifting block.
 */
export default function Loading() {
  return (
    <section className="nm2-page" data-page="loading" aria-busy="true">
      <div className="nm2-container">
        <p className="nm2-nf-code" aria-hidden>
          ···
        </p>
        <span className="sr-only">Loading… / Cargando…</span>
      </div>
    </section>
  );
}
