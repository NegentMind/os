type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Native disclosure: every answer is reachable without JS and without a
 * primitive dependency, matching the reduced-motion/no-script contract.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="nm2-faq">
      {items.map((item) => (
        <details key={item.question} className="nm2-faq__item">
          <summary className="nm2-faq__question">{item.question}</summary>
          <div className="nm2-faq__answer">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
