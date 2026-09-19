import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { logos, type ClientLogo } from "@/lib/content";

/** Two rows of client marks on paper: the accounts with a case on this page, then the other brands.
 *  Every mark sits in the same box (contain-fit) so a wide wordmark and a square badge read at one
 *  optical size. Greyscale at rest; hover brings the colour back (see .logo-row in globals.css). */
const BOX_H = "clamp(48px, 4.8vw, 68px)"; // one box for every mark; width is 2× that
const BOX_W = "clamp(96px, 9.4vw, 136px)";
const BOX_W_WIDE = "clamp(140px, 13.5vw, 196px)"; // wordmarks: same height, more room, so they weigh the same as a badge

function Row({ items }: { items: ClientLogo[] }) {
  return (
    <ul className="logo-row mt-6 flex flex-wrap items-center gap-x-6 gap-y-6 md:gap-x-10">
      {items.map((l) => {
        const img = (
          <span className="flex items-center justify-center" style={{ height: BOX_H, width: l.wide ? BOX_W_WIDE : BOX_W }}>
            <img src={`/img/logos/${l.file}.png`} alt={l.name} loading="lazy" decoding="async"
              className="logo-mark max-h-full max-w-full object-contain" />
          </span>
        );
        const href = l.caseSlug ? `/work/${l.caseSlug}` : l.href;
        return (
          <li key={l.file} className="flex items-center py-1">
            {href ? <Link href={href} title={l.name} className="block press">{img}</Link> : <span title={l.name}>{img}</span>}
          </li>
        );
      })}
    </ul>
  );
}

export default function LogoStrip() {
  return (
    <Reveal className="mt-12 border-t hairline pt-8">
      <p className="label"><Scramble text={`// CLIENTS ON THIS PAGE · ${logos.primary.length}`} /></p>
      <Row items={logos.primary} />
      <p className="label mt-10">{`// SMALLER BRIEFS, SAME STANDARD · ${logos.more.length} BRANDS`}</p>
      <Row items={logos.more} />
    </Reveal>
  );
}
