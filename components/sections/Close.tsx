import { apply } from "@/lib/content";
import ReplyCard from "@/components/ReplyCard";
import Button from "@/components/Button";
import type { Market } from "@/lib/market";

/** The close of the card: the reply card, lying on the field. The footer carries on from it. */
export default function Close({ id = "reply", market = "auto" }: { id?: string; market?: Market | "auto" }) {
  return (
    <section id={id} className="field relative">
      <div className="mx-auto grid max-w-[1440px] gap-x-10 gap-y-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <h2 className="text-[clamp(1.75rem,4.6vw,4.25rem)]">{apply.headline}</h2>
          <p className="mt-6 max-w-[32rem] text-lg">{apply.followup}</p>
          <div className="mt-8"><Button href="/apply" variant="quiet">Apply in full</Button></div>
        </div>
        <div className="lg:col-span-6 lg:pl-8">
          <ReplyCard ground="field" market={market} className="mx-auto max-w-[540px] transition-transform duration-500 ease-out-expo lg:-rotate-1 lg:hover:rotate-0" />
        </div>
      </div>
    </section>
  );
}
