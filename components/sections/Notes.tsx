import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { notes } from "@/lib/content";
import { getAllPosts, fmtDate } from "@/lib/blog";
import NewsletterForm from "@/components/NewsletterForm";

/** Homepage strip: the three latest blog posts + the newsletter opt-in. Server component — reads Markdown at build. */
export default function Notes() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <section id="notes" className="card-over relative bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label"><Scramble text="// BLOG" /></p>
            <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)]">{posts.length ? "Thinking in public." : "One letter, every two weeks."}</h2></Reveal>
          </div>
          {posts.length > 0 && <Reveal delay={0.1}><Link href="/blog/" className="underline-slide text-sm text-paper/80 hover:text-paper">Read all →</Link></Reveal>}
        </div>
        {posts.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link href={`/blog/${p.slug}/`} className="group bezel press block h-full transition-colors duration-300 hover:border-paper/20">
                  <div className="bezel-core h-full p-6">
                    <p className="label">{fmtDate(p.date)} · {p.minutes} min</p>
                    <p className="display mt-4 text-2xl text-paper transition-colors group-hover:text-signal">{p.title}</p>
                    <p className="mt-3 text-sm text-paper/72">{p.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal delay={0.3} className="bezel mt-12">
          <div className="bezel-core flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <p className="text-lg text-paper/85">{notes.optin}</p>
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
