import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import Counter from "@/components/motion/Counter";
import { cases } from "@/lib/content";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) notFound();
  const next = cases.find((x) => x.referredBy === c.slug);
  const num = parseFloat(c.result.replace(/[^0-9.]/g, ""));

  return (
    <article className="pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <Link href="/#work" className="label hover:text-paper">← All work</Link>
        <p className="mt-10 text-paper/72">{c.client}{c.placeholder ? " · PLACEHOLDER" : ""}</p>
        <h1 className="num mt-4 text-[clamp(3rem,10vw,10rem)] text-signal">
          {isNaN(num) ? c.result : <Counter value={num} decimals={c.result.includes(".") ? 1 : 0} suffix={c.result.replace(/^[^a-zA-Z%+]*/, "").split(" ")[0]} />}
        </h1>
        <p className="mono mt-4 text-sm text-paper/65">{c.industry} · {c.location} · {c.year}</p>

        <div className="relative mt-14 aspect-[16/8] overflow-hidden rounded-2xl bg-ink-2"><Image src={c.image} alt={c.client} fill className="duotone object-cover" sizes="100vw" priority /></div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div><p className="label !text-strike">Before</p><p className="mt-4 text-xl text-paper/80">{c.before}</p></div>
          <div><p className="label !text-signal">After</p><p className="mt-4 text-xl text-paper">{c.after}</p></div>
        </div>

        {c.quote && (
          <blockquote className="mt-16 border-l-2 border-signal pl-6">
            <p className="display text-2xl italic text-paper/90 md:text-4xl">“{c.quote.text}”</p>
            <p className="mt-4 text-sm text-paper/70">— {c.quote.author}{c.quote.verified ? "" : " · awaiting sign-off"}</p>
          </blockquote>
        )}

        {next && (
          <div className="mt-20 border-t hairline pt-10">
            <p className="label">// THIS CLIENT INTRODUCED</p>
            <Link href={`/work/${next.slug}`} className="display mt-3 block text-3xl text-paper hover:text-signal md:text-5xl">{next.client} →</Link>
          </div>
        )}
        <div className="mt-16 flex flex-wrap gap-4"><Button href="/apply">Apply</Button><Button href="/audit" variant="ghost">Free audit</Button></div>
      </div>
    </article>
  );
}
