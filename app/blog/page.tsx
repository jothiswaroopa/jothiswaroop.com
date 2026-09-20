import Link from "next/link";
import BackLink from "@/components/BackLink";
import NewsletterForm from "@/components/NewsletterForm";
import { getAllPosts, fmtDate } from "@/lib/blog";

export const metadata = {
  title: "Blog — Jothi Swaroop",
  description: "Performance marketing, AI systems and what's changing in ads and search — written for founders who run the numbers. Every claim sourced, every result screenshot-backed.",
  alternates: { canonical: "/blog/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { title: "Blog — Jothi Swaroop", url: "/blog/" },
};

const LANE: Record<string, string> = { news: "// NEWS", guide: "// GUIDE", receipt: "// RECEIPT" };

export default function BlogIndex() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;
  return (
    <section className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <p className="label">{"// BLOG"}</p>
        <h1 className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)]">Thinking in public.</h1>
        <p className="mt-6 max-w-xl text-paper/75">What&apos;s changing in ads, AI and search — and what it means if you run a founder-led business. Sources linked. Numbers with receipts.</p>

        {lead && (
          <Link href={`/blog/${lead.slug}/`} className="group bezel press mt-14 block">
            <div className="bezel-core grid gap-6 p-7 md:grid-cols-[1fr_2fr] md:p-10">
              <div>
                <p className="label">{LANE[lead.lane]} · {fmtDate(lead.date)}</p>
                <p className="mono mt-3 text-xs text-paper/55">{lead.minutes} min read</p>
              </div>
              <div>
                <p className="display text-3xl text-paper transition-colors group-hover:text-signal md:text-5xl">{lead.title}</p>
                <p className="mt-4 max-w-2xl text-paper/75">{lead.description}</p>
              </div>
            </div>
          </Link>
        )}

        <ul className="mt-10 border-t hairline">
          {rest.map((p) => (
            <li key={p.slug} className="border-b hairline">
              <Link href={`/blog/${p.slug}/`} className="group grid gap-2 py-6 md:grid-cols-[200px_1fr_auto] md:items-baseline md:gap-10">
                <span className="label">{LANE[p.lane]} · {fmtDate(p.date)}</span>
                <span>
                  <span className="display text-2xl text-paper transition-colors group-hover:text-signal md:text-3xl">{p.title}</span>
                  <span className="mt-2 block text-paper/72">{p.description}</span>
                </span>
                <span className="mono text-xs text-paper/50">{p.minutes} min</span>
              </Link>
            </li>
          ))}
        </ul>

        {posts.length === 0 && <p className="mt-14 text-paper/60">First post lands this week.</p>}

        <div className="bezel mt-16">
          <div className="bezel-core flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <p className="text-lg text-paper/85">One letter every two weeks. A result, a lesson, no fluff.</p>
            <NewsletterForm />
          </div>
        </div>
        <p className="mono mt-6 text-xs text-paper/45"><a href="/feed.xml" className="underline-slide">RSS feed</a></p>
      </div>
    </section>
  );
}
