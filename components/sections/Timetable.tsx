import { method } from "@/lib/content";

/** How an engagement runs, set as a timetable: when, what happens, what the client gets, what is needed. */
export default function Timetable() {
  return (
    <section id="method" className="theme-alt relative">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="scotch" aria-hidden />
        <h2 className="mt-8 max-w-4xl text-[clamp(1.75rem,4.6vw,4.25rem)]">Three moves. One engine. A weekly number you can trust.</h2>

        <div className="mt-12">
          <div className="hidden grid-cols-12 gap-x-8 border-b-2 border-ink pb-2 md:grid">
            <p className="label col-span-2">When</p>
            <p className="label col-span-4">What happens</p>
            <p className="label col-span-3">You get</p>
            <p className="label col-span-3">I need from you</p>
          </div>
          <ol>
            {method.filter((m) => !m.placeholder).map((m) => (
              <li key={m.n} className="grid gap-x-8 gap-y-3 border-b border-ink py-6 md:grid-cols-12 md:py-8">
                <p className="display text-[1.5rem] md:col-span-2">{m.duration}</p>
                <div className="md:col-span-4">
                  <h3 className="display text-[1.5rem]">{m.title}</h3>
                  <p className="mt-2">{m.what}</p>
                </div>
                <p className="md:col-span-3"><span className="label mb-1 block md:hidden">You get</span>{m.gets}</p>
                <p className="md:col-span-3"><span className="label mb-1 block md:hidden">I need from you</span>{m.need}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
