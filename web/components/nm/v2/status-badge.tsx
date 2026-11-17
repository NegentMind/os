import type { ProjectState } from "@/lib/marketing-types";

/**
 * The label carries the state; the dot is supporting art only, so status
 * never depends on color alone.
 */
export function StatusBadge({
  status,
  label,
}: {
  status: ProjectState;
  label: string;
}) {
  return (
    <span className="nm2-status" data-status={status}>
      {label}
    </span>
  );
}
