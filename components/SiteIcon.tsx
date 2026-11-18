const paths = {
  "up-right": "M6 18 18 6M8 6h10v10",
  down: "M12 4v16m-6-6 6 6 6-6",
};

export function SiteIcon({ name }: { name: keyof typeof paths }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
