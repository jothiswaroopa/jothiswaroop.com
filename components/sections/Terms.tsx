import { faq, filter } from "@/lib/content";
import Icon from "@/components/Icon";

/** The terms of the card: the questions a buyer asks before replying, and who the card is and is not for. */
export default function Terms() {
  return (
    <section id="terms" className="theme-alt relative">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="scotch" aria-hidden />
        <div className="mt-8 grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-[clamp(1.75rem,4.6vw,4.25rem)]">Before you ask.</h2>
            <div className="mt-8 border-t-2 border-ink">
              {faq.map((f, i) => (
                <details key={f.q} className="group border-b border-ink" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="display text-[1.375rem] leading-[1.18] md:text-[1.625rem]">{f.q}</h3>
                    <Icon name="plus" size={20} className="shrink-0 transition-transform duration-300 ease-out-expo group-open:rotate-45" />
                  </summary>
                  <p className="max-w-[40rem] pb-6">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)]">I&apos;m not for everyone. That&apos;s the point.</h2>
            <h3 className="label mt-8 border-b-2 border-ink pb-2">For</h3>
            <ul>
              {filter.forList.map((x) => (
                <li key={x} className="flex gap-3 border-b border-line py-3"><Icon name="check" className="mt-1.5 shrink-0 text-signal" />{x}</li>
              ))}
            </ul>
            <h3 className="label mt-8 border-b-2 border-ink pb-2">Not for</h3>
            <ul>
              {filter.notList.map((x) => (
                <li key={x} className="flex gap-3 border-b border-line py-3"><Icon name="x" className="mt-1.5 shrink-0" />{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
