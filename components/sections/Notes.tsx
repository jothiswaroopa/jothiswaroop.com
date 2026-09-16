import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { notes } from "@/lib/content";

export default function Notes() {
  return (
    <section id="notes" className="bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label"><Scramble text={notes.label} /></p>
            <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)]">Thinking in public.</h2></Reveal>
          </div>
          <Reveal delay={0.1}><Link href="/notes" className="underline-slide text-sm text-paper/80 hover:text-paper">Read all →</Link></Reveal>
        </div>
        {notes.posts.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {notes.posts.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <a href={p.href} className="group bezel press block h-full transition-colors duration-300 hover:border-paper/20">
                 <div className="bezel-core h-full p-6">
                  <p className="label">{new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}{p.placeholder ? " · placeholder" : ""}</p>
                  <p className="display mt-4 text-2xl text-paper group-hover:text-signal transition-colors">{p.title}</p>
                  <p className="mt-3 text-sm text-paper/72">{p.hook}</p>
                 </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal delay={0.3} className="bezel mt-12">
         <div className="bezel-core flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="text-lg text-paper/85">{notes.optin}</p>
          <form className="flex w-full gap-2 md:w-auto" action="/audit">
            <input type="email" required placeholder="you@company.com" className="w-full rounded-full border border-line-strong bg-transparent px-5 py-3 text-sm text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none md:w-72" />
            <button className="press shrink-0 rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper">Join</button>
          </form>
         </div>
        </Reveal>
      </div>
    </section>
  );
}
