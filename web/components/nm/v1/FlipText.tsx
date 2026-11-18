/** Letter-by-letter roll-up hover text (ported from webTemplates/mondragon2). */
export function FlipText({ text }: { text: string }) {
  return (
    <span className="flip" aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          className="ch"
          key={i}
          style={{ ["--i" as string]: i } as React.CSSProperties}
        >
          <span>{c === " " ? " " : c}</span>
          <span aria-hidden>{c === " " ? " " : c}</span>
        </span>
      ))}
    </span>
  );
}
