import Link from "next/link";
import BackLink from "@/components/BackLink";
import NewsletterForm from "@/components/NewsletterForm";
import { getAllPosts, fmtDate } from "@/lib/blog";
import Icon from "@/components/Icon";

export const metadata = {
  title: "Blog — Jothi Swaroop",
  description: "Performance marketing, AI systems and what's changing in ads and search, written for founders who run the numbers. Every claim sourced.",
  alternates: { canonical: "/blog/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { title: "Blog — Jothi Swaroop", url: "/blog/", images: ["/og.png"] },
};

const LANE: Record<string, string> = { news: "NEWS", guide: "GUIDE", receipt: "RECEIPT" };
const SEGMENT: Record<string, string> = {
  "dental-uk": "UK dental",
  apparel: "Apparel & manufacturing",
  ecom: "E-commerce",
  automation: "AI automation",
  ads: "Paid ads",
};

const TONES = ["field", "salmon", "theme-alt"] as const;

/** A post's cover, set in type instead of shipped as a picture: the number the post is about, at size, on one of
 *  the card's three stocks. (The PNG covers in public/blog/cover/ are no longer used by this page.) */
function Cover({ p, i }: { p: ReturnType<typeof getAllPosts>[number]; i: number }) {
  return (
    <div className={`${TONES[i % TONES.length]} absolute inset-0 flex flex-col justify-between p-6 md:p-8`}>
      <p className="label">{LANE[p.lane]}</p>
      <div>
        {/* the number the post is about; a post without one is dated instead */}
        <p className="num break-words text-[clamp(2.75rem,6vw,5.5rem)] text-signal">{p.cover?.value ?? fmtDate(p.date).slice(0, 6)}</p>
        <p className="label mt-3">{p.cover?.label ?? fmtDate(p.date).slice(7)}</p>
      </div>
    </div>
  );
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;

  return (
    <section className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h1 className="text-[clamp(2.5rem,6vw,5.5rem)]">What worked, what didn&apos;t.</h1>
          <p className="max-w-xl text-ink lg:pb-3">
            Ads, AI systems and search, written from real accounts and real builds — including the parts that failed. For founders who read their own numbers.
          </p>
        </div>

        <p className="mt-8 text-sm">New post every two days. Every number linked to its source.</p>

        {lead && (
          <Link href={`/blog/${lead.slug}/`} className="group bezel press mt-10 block">
            <div className="bezel-core grid items-stretch overflow-hidden md:grid-cols-[1.05fr_1fr]">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b hairline md:aspect-auto md:min-h-[320px] md:border-b-0 md:border-r">
                <Cover p={lead} i={0} />
              </div>
              <div className="flex flex-col justify-between p-7 md:p-10">
                <div>
                  <p className="label">
                    {LANE[lead.lane]} · {fmtDate(lead.date)} · {lead.minutes} min
                  </p>
                  <p className="display mt-4 text-3xl text-ink transition-colors group-hover:text-signal md:text-[2.6rem] md:leading-[1.08]">{lead.title}</p>
                  <p className="mt-4 text-ink">{lead.description}</p>
                </div>
                <p className="mono mt-8 text-xs uppercase tracking-[0.16em] text-ink">
                  {SEGMENT[lead.segment] ?? lead.segment} · {lead.sources?.length ?? 0} sources
                  <span className="ml-3 text-signal">Read <Icon name="arrow" size={14} className="ml-1 inline-block align-[-0.1em]" /></span>
                </p>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((p, idx) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}/`} className="group bezel press block h-full">
                  <article className="bezel-core flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b hairline">
                      <Cover p={p} i={idx + 1} />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="label">
                        {LANE[p.lane]} · {fmtDate(p.date)}
                      </p>
                      <p className="display mt-3 text-xl text-ink transition-colors group-hover:text-signal md:text-2xl">{p.title}</p>
                      <p className="mt-3 flex-1 text-sm text-ink">{p.description}</p>
                      <p className="mono mt-5 border-t hairline pt-4 text-xs uppercase tracking-[0.16em] text-ink">
                        {p.minutes} min · {p.sources?.length ?? 0} sources
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {posts.length === 0 && <p className="mt-14 text-ink">First post lands this week.</p>}

        <div className="bezel mt-16">
          <div className="bezel-core flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <p className="text-lg text-ink">One letter every two weeks. A result, a lesson, no fluff.</p>
            <NewsletterForm />
          </div>
        </div>
        <p className="mono mt-6 text-xs text-ink">
          <a href="/feed.xml" className="underline-slide">RSS feed</a>
        </p>
      </div>
    </section>
  );
}
