"use client";

import { useEffect } from "react";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { Button } from "@/components/ui/button";

/*
 * Branded runtime-error boundary inside the locale shell.
 * Bilingual copy: the boundary renders outside the copy pipeline.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="nm2-page nm2-editorial" data-page="error">
      <div className="nm2-container">
        <p className="nm2-nf-code">500</p>
        <SectionHeading
          title="Something failed while rendering. / Algo falló al renderizar."
          description="Try again — if it persists, report it on GitHub. / Inténtalo de nuevo — si persiste, repórtalo en GitHub."
        />
        <div className="nm2-actions">
          <Button className="nm2-action" onClick={() => reset()}>
            Try again · Reintentar
          </Button>
        </div>
      </div>
    </section>
  );
}
