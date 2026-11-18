/*
 * Numbered rows ported from webTemplates/sequenceone: the works index
 * lists "01–NN" items whose hover micro-interaction is an ink-invert
 * sweep — a solid fill layer (the template page's dark ink, opacity 0)
 * fades in and every text layer flips to the page background.
 * Retokenized for the dark-first site: the fill is Bone and the text
 * inverts to Void. Rows are content-only <div>s (not links), focusable
 * for keyboard parity; styles live in app/globals.css (.numbered-rows-*).
 */

export interface NumberedRowItem {
  num: string;
  title: string;
  body: string;
}

export function NumberedRows({ items }: { items: NumberedRowItem[] }) {
  return (
    <div className="numbered-rows">
      {items.map((item) => (
        <div key={item.num} className="numbered-rows__row" tabIndex={0}>
          <span className="numbered-rows__fill" aria-hidden="true" />
          <span className="numbered-rows__num">{item.num}</span>
          <div className="numbered-rows__main">
            <h3 className="numbered-rows__title">{item.title}</h3>
            <p className="numbered-rows__body">{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
