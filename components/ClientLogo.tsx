import { logos, type ClientLogo as Mark } from "@/lib/content";

const all = [...logos.primary, ...logos.more];
export const logoFor = (caseSlug: string): Mark | undefined => all.find((l) => l.caseSlug === caseSlug);

/** A client mark on a small paper chip — readable on ink and paper alike. `h` is the chip height in px. */
export default function ClientLogo({ mark, h = 28, className = "" }: { mark: Mark; h?: number; className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-md bg-[#f2ede4] px-2 ${className}`} style={{ height: h }} title={mark.name}>
      <img src={`/img/logos/${mark.file}.webp`} alt={mark.name} height={h - 10} className="w-auto" style={{ height: h - 10, maxWidth: mark.wide ? h * 4.2 : h * 2.6 }} loading="lazy" decoding="async" />
    </span>
  );
}
