import "@/app/orbital-gallery.css";
import "@/app/orbital-ext.css";

/*
 * Dev-only gallery styles. Kept out of orbital.css so the public bundle
 * doesn't ship gallery/ext rules; this layout loads them only for
 * /design-system (which 404s outside development anyway).
 */
export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
