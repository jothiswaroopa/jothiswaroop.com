import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Button";
import BackLink from "@/components/BackLink";
import Counter from "@/components/motion/Counter";
import { cases, chain, videoTestimonials, site } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";
import VideoTile from "@/components/VideoTile";
import ClientLogo, { logoFor } from "@/components/ClientLogo";

/** Per-case title/description/canonical so each result is its own page in Google and its own card on LinkedIn. */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug && !x.placeholder);
  if (!c) return {};
  const title = `${c.client} — ${c.result} | Jothi Swaroop`;
  const full = `${c.after} ${c.industry}, ${c.location}.`;
  const description = full.length > 158 ? full.slice(0, 155).replace(/\s+\S*$/, "") + "…" : full;
  return {
    title,
    description,
    alternates: { canonical: `/work/${c.slug}/` },
    openGraph: { title, description, url: `/work/${c.slug}/`, type: "article", images: [{ url: c.image ?? "/og.png", width: 1200, height: 630, alt: `${c.client} — ${c.result}` }] },
    twitter: { title, description },
  };
}

/** Three answers every case page can give honestly, straight from the measured block. */
function faqFor(c: (typeof cases)[number]) {
  const m = c.measured!;
  return [
    { q: `Where does the ${c.result} figure come from?`, a: `${m.source}. ${m.window}.` },
    { q: "What was counted as a lead?", a: m.counted },
    { q: "Can I see the screenshot?", a: `Yes — the Ads Manager screenshot is on this page and every number on it is reproducible from the account export. Anything the client told me, rather than the platform, is marked as client-reported.` },
  ];
}

export function generateStaticParams() {
  return cases.filter((c) => !c.placeholder).map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug && !x.placeholder);
  if (!c) notFound();
  const idx = chain.map((n) => n.slug).lastIndexOf(c.slug);
  const nextNode = idx >= 0 ? chain.slice(idx + 1).find((n) => n.slug !== c.slug) : undefined;
  const next = nextNode ? cases.find((x) => x.slug === nextNode.slug) : undefined;
  const video = videoTestimonials.find((v) => v.caseSlug === c.slug);
  const h = c.headline;
  const others = cases.filter((x) => !x.placeholder && x.slug !== c.slug);
  const relatedPosts = getAllPosts().filter((p) => p.html.includes(`/work/${c.slug}/`)).slice(0, 3);
  const base = "https://jothiswaroop.com";
  const schema = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: base + "/" }, { "@type": "ListItem", position: 2, name: "Work", item: `${base}/#work` }, { "@type": "ListItem", position: 3, name: c.client, item: `${base}/work/${c.slug}/` }] },
    { "@context": "https://schema.org", "@type": "Article", headline: `${c.client} — ${c.result}`, description: c.after, author: { "@type": "Person", name: site.name, url: `${base}/about/` }, image: `${base}${c.image}`, mainEntityOfPage: `${base}/work/${c.slug}/` },
    c.measured ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqFor(c).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) } : null,
  ].filter(Boolean);

  return (
    <article className="pt-[96px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink label="All work" fallback="/#work" />
        <p className="mt-10 flex items-center gap-3 text-paper/72">{logoFor(c.slug) && <ClientLogo mark={logoFor(c.slug)!} h={34} />}<span>{c.client}{c.placeholder ? " · PLACEHOLDER" : ""}</span></p>
        <h1 className="num mt-4 text-[clamp(2.5rem,8vw,8rem)] text-signal">
          <Counter value={h.value} prefix={h.prefix} suffix={h.suffix} decimals={h.decimals} />
        </h1>
        <p className="mono mt-4 text-sm text-paper/65">{c.industry} · {c.location} · {c.year}</p>

        <div className="bezel mt-14"><div className="bezel-core relative aspect-[16/8]"><Image src={c.image} alt={`Ads Manager — ${c.client}`} fill className="object-cover object-left-top" sizes="100vw" priority /></div></div>

        {c.outcome && (
          <div className="mt-14 border-l-2 border-signal pl-6">
            <p className="label">// WHAT IT TURNED INTO</p>
            <p className="display mt-3 text-2xl text-paper md:text-4xl">{c.outcome}</p>
            {c.outcomeSource && <p className="mono mt-3 text-xs text-paper/60">{c.outcomeSource}</p>}
          </div>
        )}

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
            <div className={`bezel mt-5 ${video.vertical ? "max-w-sm" : "max-w-3xl"}`}><div className="bezel-core"><VideoTile youtubeId={video.youtubeId} poster={video.poster} title={`${video.name}, ${video.business}`} vertical={video.vertical} /></div></div>
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
        {/* How this number was made — the questions a sceptical founder asks, answered from the measured block. Also FAQ schema. */}
        {c.measured && (
          <section className="mt-20 border-t hairline pt-10">
            <p className="label">{"// HOW THIS NUMBER WAS MADE"}</p>
            <dl className="mt-6 divide-y hairline">
              {faqFor(c).map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="display text-xl text-paper md:text-2xl">{f.q}</dt>
                  <dd className="mt-2 max-w-2xl text-paper/75">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t hairline pt-10">
            <p className="label">{"// READ THE FULL ACCOUNT"}</p>
            <ul className="mt-4 space-y-2">
              {relatedPosts.map((p) => <li key={p.slug}><Link href={`/blog/${p.slug}/`} className="underline-slide text-lg text-paper hover:text-signal">{p.title} →</Link></li>)}
            </ul>
          </section>
        )}

        <section className="mt-16 border-t hairline pt-10">
          <p className="label">{"// MORE WORK"}</p>
          <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {others.map((o) => <li key={o.slug}><Link href={`/work/${o.slug}/`} className="underline-slide text-paper/80 hover:text-paper">{o.client} <span className="mono text-xs text-paper/50">· {o.result}</span></Link></li>)}
          </ul>
          <p className="mt-6 text-sm text-paper/60">The service behind this account: <Link href="/services/#meta-facebook-instagram-ads" className="underline-slide text-paper/85">Meta ads — Facebook &amp; Instagram</Link>.</p>
        </section>

        <div className="mt-16 flex flex-wrap gap-4"><Button href="/apply">Apply</Button><Button href="/audit" variant="ghost">Free audit</Button></div>
      </div>
    </article>
  );
}
