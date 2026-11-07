import Link from "next/link";
import BackLink from "@/components/BackLink";
import Offers from "@/components/sections/Offers";

export const metadata = {
  title: "Prices — AI Ads, AI Commercials & Meta Lead Generation | Jothi Swaroop",
  description: "AI UGC ads and commercials from $150, or 8 a month for $950; a $2,000 creative-strategist pack; Meta lead generation with a $750 pilot, then $1,500 a month. Every offer starts free.",
  alternates: { canonical: "/pricing/" },
  openGraph: { title: "Offers & prices — Jothi Swaroop", url: "/pricing/", images: ["/og.png"] },
};

/** The price list on its own URL, for emails and link previews (they drop #anchors). Dollars, or rupees for a visitor in India. */
export default function PricingPage() {
  return (
    <div className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 md:px-10">
        <BackLink />
      </div>
      <Offers heading="h1" />
      <div className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        <p className="max-w-2xl text-paper/80">
          Before you decide, see the work: <Link href="/films/" className="underline-slide text-paper">the AI films</Link>, the{" "}
          <Link href="/work/nova/" className="underline-slide text-paper">lead-generation receipts</Link> with their Ads Manager screenshots, and{" "}
          <Link href="/systems/" className="underline-slide text-paper">the automations</Link> that follow up every enquiry.
        </p>
      </div>
    </div>
  );
}
