import Image from "next/image";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import NewsletterForm from "@/components/NewsletterForm";
import { getAllPosts, fmtDate } from "@/lib/blog";

export const metadata = {
  title: "Blog — Jothi Swaroop",
  description: "Performance marketing, AI systems and what's changing in ads and search, written for founders who run the numbers. Every claim sourced.",
  alternates: { canonical: "/blog/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { title: "Blog — Jothi Swaroop", url: "/blog/", images: ["/og.png"] },
};

const LANE: Record<string, string> = { news: "// NEWS", guide: "// GUIDE", receipt: "// RECEIPT" };
const SEGMENT: Record<string, string> = {
  "dental-uk": "UK dental",
  apparel: "Apparel & manufacturing",
  ecom: "E-commerce",
  automation: "AI automation",
  ads: "Paid ads",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;
  const sources = posts.reduce((n, p) => n + (p.sources?.length ?? 0), 0);
  const words = posts.reduce((n, p) => n + p.words, 0);

  return (
    <section className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <p className="label">{"// BLOG"}</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h1 className="text-[clamp(2.5rem,6vw,5.5rem)]">Thinking in public.</h1>
          <p className="max-w-xl text-paper/75 lg:pb-3">
            What&apos;s changing in ads, AI and search — and what it means if you run a founder-led business. Sources linked. Numbers with receipts.
          </p>
        </div>

        {/* The standard, stated up front — the reason to read these rather than the other thousand posts. */}
        {posts.length > 0 && (
          <dl className="mono mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border hairline bg-line/60 text-xs sm:grid-cols-4">
            {([
              [String(posts.length), posts.length === 1 ? "post" : "posts"],
              [String(sources), "sources cited"],
              [words >= 1000 ? `${(words / 1000).toFixed(1)}k` : String(words), "words, no filler"],
              ["0", "numbers without a receipt"],
            ] as [string, string][]).map(([v, k]) => (
              <div key={k} className="bg-ink px-4 py-5">
                <dd className="display text-2xl text-paper md:text-3xl">{v}</dd>
                <dt className="mt-1 uppercase tracking-[0.16em] text-paper/50">{k}</dt>
              </div>
            ))}
          </dl>
        )}

        {lead && (
          <Link href={`/blog/${lead.slug}/`} className="group bezel press mt-10 block">
            <div className="bezel-core grid items-stretch overflow-hidden md:grid-cols-[1.05fr_1fr]">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b hairline md:aspect-auto md:min-h-[320px] md:border-b-0 md:border-r">
                <Image
                  src={`/blog/cover/${lead.slug}.png`}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
                  priority
                />
              </div>
              <div className="flex flex-col justify-between p-7 md:p-10">
                <div>
                  <p className="label">
                    {LANE[lead.lane]} · {fmtDate(lead.date)} · {lead.minutes} min
                  </p>
                  <p className="display mt-4 text-3xl text-paper transition-colors group-hover:text-signal md:text-[2.6rem] md:leading-[1.08]">{lead.title}</p>
                  <p className="mt-4 text-paper/75">{lead.description}</p>
                </div>
                <p className="mono mt-8 text-xs uppercase tracking-[0.16em] text-paper/50">
                  {SEGMENT[lead.segment] ?? lead.segment} · {lead.sources?.length ?? 0} sources
                  <span className="ml-3 text-signal">Read →</span>
                </p>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}/`} className="group bezel press block h-full">
                  <article className="bezel-core flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b hairline">
                      <Image
                        src={`/blog/cover/${p.slug}.png`}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="label">
                        {LANE[p.lane]} · {fmtDate(p.date)}
                      </p>
                      <p className="display mt-3 text-xl text-paper transition-colors group-hover:text-signal md:text-2xl">{p.title}</p>
                      <p className="mt-3 flex-1 text-sm text-paper/72">{p.description}</p>
                      <p className="mono mt-5 border-t hairline pt-4 text-xs uppercase tracking-[0.16em] text-paper/50">
                        {p.minutes} min · {p.sources?.length ?? 0} sources
                      </p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {posts.length === 0 && <p className="mt-14 text-paper/60">First post lands this week.</p>}

        <div className="bezel mt-16">
          <div className="bezel-core flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <p className="text-lg text-paper/85">One letter every two weeks. A result, a lesson, no fluff.</p>
            <NewsletterForm />
          </div>
        </div>
        <p className="mono mt-6 text-xs text-paper/45">
          <a href="/feed.xml" className="underline-slide">RSS feed</a>
        </p>
      </div>
    </section>
  );
}
