import clsx from "clsx";
import { logos, marquee } from "@/lib/content";

/** The one loop the site allows — now carrying the client marks between the places and industries.
 *  On ink the marks are flattened to paper-coloured silhouettes so eighteen brand palettes read as one row.
 *  Slower than the old text loop: a mark needs a beat to be recognised. */
export default function LogoMarquee({ className }: { className?: string }) {
  const marks = [...logos.primary, ...logos.more].filter((m) => !m.noSilhouette);
  // interleave: mark, word, mark, word… (marks and words wrap independently so the pairing drifts each loop)
  const n = Math.max(marks.length, marquee.length);
  const items: Array<{ kind: "mark"; file: string; name: string; wide?: boolean } | { kind: "word"; text: string }> = [];
  for (let i = 0; i < n; i++) {
    items.push({ kind: "mark", ...marks[i % marks.length] });
    items.push({ kind: "word", text: marquee[i % marquee.length] });
  }
  const row = [...items, ...items];
  return (
    <div className={clsx("overflow-hidden border-y hairline", className)} aria-hidden>
      <div className="marquee-track marquee-track--slow items-center py-5">
        {row.map((it, i) =>
          it.kind === "mark" ? (
            <span key={i} className="flex items-center pr-10 md:pr-14">
              <img src={`/img/logos/${it.file}.png`} alt="" loading="lazy" decoding="async"
                className="logo-mark-ink w-auto" style={{ height: it.wide ? 22 : 34, maxWidth: it.wide ? 150 : 72 }} />
            </span>
          ) : (
            <span key={i} className="label flex items-center gap-6 pr-10 whitespace-nowrap !text-[var(--paper-45)] md:pr-14">
              {it.text}
              <span className="inline-block h-1 w-1 rounded-full bg-paper/30" />
            </span>
          ),
        )}
      </div>
    </div>
  );
}
