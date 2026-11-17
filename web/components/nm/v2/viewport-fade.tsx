/** Shallow optical edge only; never an interactive or semantic overlay. */
export function ViewportFade() {
  return (
    <div className="nm2-viewport-fade" aria-hidden="true">
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
    </div>
  );
}
