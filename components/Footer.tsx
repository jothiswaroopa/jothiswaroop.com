import Link from "next/link";
import { site, footer } from "@/lib/content";

/** Stillness. No motion here by design. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t hairline bg-ink pb-[calc(6rem+env(safe-area-inset-bottom))] pt-20 md:pb-10">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="display text-3xl italic text-paper/90 md:text-5xl">{footer.line}</p>
        <div className="mt-14 grid gap-8 border-t hairline pt-8 text-sm text-paper/60 md:grid-cols-4">
          <div>
            <p className="text-paper">{site.name}</p>
            <p className="mt-1">{site.role}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/#work" className="underline-slide w-fit hover:text-paper">Results</Link>
            <Link href="/#method" className="underline-slide w-fit hover:text-paper">Method</Link>
            <Link href="/about" className="underline-slide w-fit hover:text-paper">About</Link>
            <Link href="/notes" className="underline-slide w-fit hover:text-paper">Notes</Link>
          </div>
          <div className="flex flex-col gap-2">
            {site.socials.instagram && <a href={site.socials.instagram} className="underline-slide w-fit hover:text-paper" target="_blank" rel="noreferrer">Instagram</a>}
            <a href={`https://wa.me/${site.whatsapp}`} className="underline-slide w-fit hover:text-paper" target="_blank" rel="noreferrer">WhatsApp</a>
            <Link href="/apply" className="underline-slide w-fit hover:text-paper">Apply</Link>
            <Link href="/audit" className="underline-slide w-fit hover:text-paper">Free audit</Link>
          </div>
          <div className="mono text-xs text-paper/45 md:text-right">
            <p>{footer.built}</p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none mt-16 select-none overflow-hidden" aria-hidden>
        <p className="display outline-text whitespace-nowrap text-[22vw] leading-[0.8] tracking-tight">{site.name}</p>
      </div>
    </footer>
  );
}
