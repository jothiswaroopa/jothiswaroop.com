import BackLink from "@/components/BackLink";
import { notes } from "@/lib/content";

export const metadata = { title: "Notes — Jothi Swaroop", description: "Short notes on performance marketing and AI automation for founder-led manufacturers and brands.", alternates: { canonical: "/notes/" } };

export default function NotesPage() {
  return (
    <section className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <p className="label">{notes.label}</p>
        <h1 className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)]">Thinking in public.</h1>
        <p className="mt-6 max-w-lg text-paper/75">{notes.optin}</p>
        <ul className="mt-14 border-t hairline">
          {notes.posts.map((p) => (
            <li key={p.title} className="border-b hairline">
              <a href={p.href} className="group grid gap-2 py-6 md:grid-cols-[auto_1fr] md:gap-10">
                <span className="label">{p.date}</span>
                <span><span className="display text-2xl text-paper group-hover:text-signal md:text-3xl">{p.title}</span><span className="mt-2 block text-paper/72">{p.hook}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
