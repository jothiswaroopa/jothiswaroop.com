import clsx from "clsx";

/** The one loop the site allows. Slow, ambient. */
export default function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={clsx("overflow-hidden border-y hairline", className)} aria-hidden>
      <div className="marquee-track py-4">
        {row.map((t, i) => (
          <span key={i} className="label flex items-center gap-6 pr-6 whitespace-nowrap !text-[var(--paper-45)]">
            {t}
            <span className="inline-block h-1 w-1 rounded-full bg-signal/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
