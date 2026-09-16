import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import BackLink from "@/components/BackLink";
import Counter from "@/components/motion/Counter";
import { cases, chain, videoTestimonials } from "@/lib/content";
import VideoTile from "@/components/VideoTile";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) notFound();
  const idx = chain.map((n) => n.slug).lastIndexOf(c.slug);
  const nextNode = idx >= 0 ? chain.slice(idx + 1).find((n) => n.slug !== c.slug) : undefined;
  const next = nextNode ? cases.find((x) => x.slug === nextNode.slug) : undefined;
  const video = videoTestimonials.find((v) => v.caseSlug === c.slug);
  const h = c.headline;

  return (
    <article className="pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink label="All work" fallback="/#work" />
        <p className="mt-10 text-paper/72">{c.client}{c.placeholder ? " · PLACEHOLDER" : ""}</p>
        <h1 className="num mt-4 text-[clamp(2.5rem,8vw,8rem)] text-signal">
          <Counter value={h.value} prefix={h.prefix} suffix={h.suffix} decimals={h.decimals} />
        </h1>
        <p className="mono mt-4 text-sm text-paper/65">{c.industry} · {c.location} · {c.year}</p>

        <div className="bezel mt-14"><div className="bezel-core relative aspect-[16/8]"><Image src={c.image} alt={`Ads Manager — ${c.client}`} fill className="object-cover object-left-top" sizes="100vw" priority /></div></div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div><p className="label !text-strike">Before</p><p className="mt-4 text-xl text-paper/80">{c.before}</p></div>
          <div><p className="label !text-signal">After</p><p className="mt-4 text-xl text-paper">{c.after}</p></div>
        </div>

        {/* How this was counted — the receipt behind the number. A case without this block is a claim. */}
        {c.measured && (
          <section className="theme-paper card-over mt-16 rounded-3xl px-6 py-10 md:px-10 md:py-12">
            <p className="label">// HOW THIS WAS COUNTED</p>
            <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-12">
              <dl className="space-y-5">
                <div><dt className="label">Source</dt><dd className="mt-1 text-lg text-paper">{c.measured.source}</dd></div>
                <div><dt className="label">Window</dt><dd className="mono mt-1 text-paper">{c.measured.window}</dd></div>
                <div><dt className="label">What counts</dt><dd className="mt-1 text-paper/80">{c.measured.counted}</dd></div>
              </dl>
              {c.measured.screenshot && (
                <div className="bezel"><div className="bezel-core relative aspect-[16/10]">
                  <Image src={c.measured.screenshot} alt={`Screenshot — ${c.measured.source}`} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" />
                </div></div>
              )}
            </div>
            {c.receipts && c.receipts.length > 1 && (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {c.receipts.slice(1).map((src) => (
                  <div key={src} className="bezel"><div className="bezel-core relative aspect-[16/9]"><Image src={src} alt={`Ads Manager — ${c.client}`} fill className="object-cover object-left-top" sizes="50vw" /></div></div>
                ))}
              </div>
            )}
          </section>
        )}

        {video && (
          <section className="mt-16">
            <p className="label">// {video.name.toUpperCase()}, ON CAMERA</p>
            <div className={`bezel mt-5 ${video.vertical ? "max-w-sm" : "max-w-3xl"}`}><div className="bezel-core"><VideoTile youtubeId={video.youtubeId} title={`${video.name}, ${video.business}`} vertical={video.vertical} /></div></div>
            {video.quote ? (
              <blockquote className="display mt-6 max-w-2xl text-2xl italic text-paper/90 md:text-3xl">&ldquo;{video.quote}&rdquo;</blockquote>
            ) : (
              <p className="mt-6 max-w-2xl text-paper/80">{video.context}</p>
            )}
            <p className="mt-3 text-sm text-paper/65">— {video.name}, {video.business}</p>
          </section>
        )}

        {c.quote && !video && (
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
