import Image from "next/image";
import Link from "next/link";
import { who, site, story, recognition, services, met } from "@/lib/content";
import Button from "@/components/Button";
import IndiaOnly from "@/components/IndiaOnly";

/**
 * Who issues the card: the person and what he carries. The referral chain and the recognition list live on
 * /about (moved there with the rest of the long homepage), so this stays one portrait and three paragraphs.
 */
export default function Issuer() {
  // The fourth line ("Every ad number on this page links to how it was measured…") opens the Figures section already.
  const lines = who.lines.slice(0, 3);
  return (
    <section id="about" className="relative">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="scotch" aria-hidden />
        <div className="mt-8 grid gap-x-10 gap-y-10 lg:grid-cols-12">
          <figure className="lg:col-span-4">
            <div className="relative aspect-[4/5] bg-stock-3">
              <Image src={who.portrait} alt={`${site.name} at the Tamil Nadu Digital Summit award ceremony, 2026`} fill sizes="(min-width:1024px) 30vw, 90vw" className="duotone object-cover" style={{ objectPosition: who.portraitPosition }} />
            </div>
            <figcaption className="mt-3 text-sm">{recognition[0].caption}</figcaption>
          </figure>

          <div className="lg:col-span-8">
            <h2 className="max-w-3xl text-[clamp(1.75rem,4.6vw,4.25rem)]">Every skill in the chain, run by one brain.</h2>
            <p className="mt-4 font-semibold">{site.name}, {story.titles.split(" · ").join(", ")}.</p>
            <div className="mt-8 max-w-[40rem] space-y-4 text-lg">
              {lines.map((l) => <p key={l.slice(0, 24)}>{l}</p>)}
            </div>

            {/* Indian founders a buyer abroad has never heard of read as padding there, so this line is India-only. */}
            <IndiaOnly>
              <p className="mt-6 text-sm"><span className="font-semibold">Rooms I&apos;ve been in:</span> {met.map((m2) => `${m2.name} (${m2.shortRole ?? m2.role})`).join(", ")}.</p>
            </IndiaOnly>

            <p id="systems" className="mt-8 max-w-[40rem] border-t border-ink pt-6 text-[0.9375rem]">
              Also done in-house, on request: {services.more.map((s) => s.name).join("; ")}.{" "}
              <Link href="/services/" className="font-semibold underline">Every service</Link>{" "}and{" "}
              <Link href="/systems/" className="font-semibold underline">the nine automations</Link>.
            </p>

            <div className="mt-8"><Button href="/about/" variant="quiet">The full story, the referral chain and the recognition</Button></div>
          </div>
        </div>
      </div>
    </section>
  );
}
