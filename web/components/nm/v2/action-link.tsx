import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  external?: boolean;
  className?: string;
};

export function ActionLink({
  href,
  children,
  variant = "primary",
  external,
  className,
}: ActionLinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const inner = (
    <Button
      asChild
      variant={variant === "text" ? "link" : variant === "secondary" ? "outline" : "default"}
      className={["nm2-action", className].filter(Boolean).join(" ")}
      data-variant={variant}
    >
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href}>{children}</Link>
      )}
    </Button>
  );
  return inner;
}
