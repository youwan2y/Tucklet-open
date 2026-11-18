/** Minimal glyph adapter: the public controls do not depend on the app icon registry. */
export function ControlIcon({ name }: { name: "font-size" | "minus" | "plus" }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "font-size" ? <path d="M3 5h12M9 5v14M6 19h6M16 11h6M19 11v8" /> : <><path d="M5 12h14" />{name === "plus" && <path d="M12 5v14" />}</>}
    </svg>
  );
}
