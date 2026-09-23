import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import { getAllPosts, getPost, related, fmtDate } from "@/lib/blog";
import { site } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  const og = `/blog/og/${p.slug}.png`;
  return {
    title: `${p.seoTitle ?? p.title} — Jothi Swaroop`,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}/` },
    openGraph: { type: "article", title: p.title, description: p.description, url: `/blog/${p.slug}/`, publishedTime: p.date, modifiedTime: p.updated ?? p.date, authors: [site.name], tags: p.tags, images: [{ url: og, width: 1200, height: 630, alt: p.title }] },
    twitter: { card: "summary_large_image", images: [og] },
  };
}

const LANE: Record<string, string> = { news: "// NEWS", guide: "// GUIDE", receipt: "// RECEIPT" };

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p || p.draft) notFound();
  const rel = related(p);
  const base = "https://jothiswaroop.com";

  // Article + FAQ schema: the FAQ block is what AI answer engines lift verbatim; the Article ties it to the author entity.
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      author: { "@type": "Person", name: site.name, url: `${base}/about/` },
      publisher: { "@type": "Person", name: site.name, url: base },
      mainEntityOfPage: `${base}/blog/${p.slug}/`,
      image: `${base}/blog/og/${p.slug}.png`,
      keywords: p.tags.join(", "),
      citation: p.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url, publisher: s.publisher })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base + "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog/` },
        { "@type": "ListItem", position: 3, name: p.title, item: `${base}/blog/${p.slug}/` },
      ],
    },
    p.faq.length
      ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
      : null,
  ].filter(Boolean);

  return (
    <article className="min-h-[100svh] pt-[96px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink fallback="/blog/" label="All posts" className="mb-8" />
        <header className="max-w-3xl">
          <p className="label">{LANE[p.lane]} · {fmtDate(p.date)}{p.updated && p.updated !== p.date ? ` · updated ${fmtDate(p.updated)}` : ""} · {p.minutes} min read</p>
          <h1 className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02]">{p.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-paper/80">{p.description}</p>
          <p className="mono mt-6 text-xs text-paper/55">By <Link href="/about/" className="underline-slide text-paper/80">{site.name}</Link> · Chennai → UK · US · India</p>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />

            {p.faq.length > 0 && (
              <section className="mt-14 border-t hairline pt-10" aria-labelledby="faq">
                <p className="label" id="faq">{"// QUESTIONS FOUNDERS ASK"}</p>
                <dl className="mt-6 divide-y hairline">
                  {p.faq.map((f) => (
                    <div key={f.q} className="py-5">
                      <dt className="display text-xl text-paper md:text-2xl">{f.q}</dt>
                      <dd className="mt-2 max-w-2xl text-paper/75">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {p.sources.length > 0 && (
              <section className="mt-14 border-t hairline pt-10">
                <p className="label">{"// SOURCES"}</p>
                <ol className="mt-6 space-y-2 text-sm">
                  {p.sources.map((s, i) => (
                    <li key={s.url} className="grid grid-cols-[28px_1fr] gap-2">
                      <span className="mono text-xs text-paper/45">0{i + 1}</span>
                      <span><a href={s.url} target="_blank" rel="noopener" className="underline-slide text-paper">{s.title}</a> <span className="text-paper/55">— {s.publisher}</span></span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* One pointer, deliberately quiet. A banner here makes every post read like a pitch. */}
            <aside className="mt-14 border-t hairline pt-6">
              <p className="text-sm text-paper/70">
                I run Meta and Google accounts for founder-led businesses, and write these from what the accounts actually show.
                If you want a second pair of eyes on yours, <Link href={`/audit/?s=blog&c=${p.slug}`} className="text-paper underline-slide">the 10-minute audit</Link> is free and there is no deck at the end of it.
              </p>
            </aside>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              {p.headings.length > 0 && (
                <>
                  <p className="label">{"// IN THIS POST"}</p>
                  <ol className="mt-4 space-y-2 border-l hairline text-sm">
                    {p.headings.map((h) => (
                      <li key={h.id} className={h.depth === 3 ? "pl-6" : "pl-4"}>
                        <a href={`#${h.id}`} className="text-paper/60 transition-colors hover:text-paper">{h.text}</a>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              <p className="label mt-10">{"// TAGS"}</p>
              <p className="mono mt-3 flex flex-wrap gap-2 text-xs text-paper/60">{p.tags.map((t) => <span key={t} className="rounded-full border hairline px-2 py-0.5">{t}</span>)}</p>
            </div>
          </aside>
        </div>

        {rel.length > 0 && (
          <section className="mt-20 border-t hairline pt-10">
            <p className="label">{"// KEEP READING"}</p>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {rel.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}/`} className="group bezel press block h-full">
                    <div className="bezel-core h-full p-6">
                      <p className="label">{LANE[r.lane]} · {fmtDate(r.date)}</p>
                      <p className="display mt-4 text-2xl text-paper transition-colors group-hover:text-signal">{r.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
