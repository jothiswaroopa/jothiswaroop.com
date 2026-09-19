import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { logos, type ClientLogo } from "@/lib/content";

/** Two rows of client marks on paper: the accounts with a case on this page, then everyone else who said yes.
 *  Greyscale at rest, colour on hover (fine pointers only). Marks are pre-keyed PNGs, so no chips needed here. */
/** `px` at ≥1440px, scaling down to ~58% on a 375px phone */
const fluid = (px: number) => `clamp(${Math.round(px * 0.58)}px, ${(px / 14.4).toFixed(2)}vw, ${Math.round(px)}px)`;

function Row({ items, size, muted }: { items: ClientLogo[]; size: number; muted?: boolean }) {
  return (
    <ul className={`logo-row mt-6 flex flex-wrap items-center gap-x-6 gap-y-5 md:gap-x-14 md:gap-y-6 ${muted ? "opacity-80" : ""}`}>
      {items.map((l) => {
        const img = (
          <img src={`/img/logos/${l.file}.png`} alt={l.name} loading="lazy" decoding="async"
            className="logo-mark w-auto" style={{ height: fluid(l.wide ? size * 0.62 : size), maxWidth: fluid(l.wide ? size * 3.6 : size * 1.6) }} />
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
      <Row items={logos.primary} size={68} />
      <p className="label mt-10">{`// ALSO WORKED WITH · ${logos.more.length} BRANDS`}</p>
      <Row items={logos.more} size={46} muted />
    </Reveal>
  );
}
