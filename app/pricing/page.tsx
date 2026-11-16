import Link from "next/link";
import Offers from "@/components/sections/Offers";
import Close from "@/components/sections/Close";

export const metadata = {
  title: "Prices — Meta Ads for Leads & Online Sales, AI Ads & Commercials | Jothi Swaroop",
  description: "Meta ads for leads or online sales, run for you from $1,500 a month, or $2,250 with 8 AI ads included; AI ads & commercials from $499 for 4 a month, $950 for 8, $2,000 for 12–14 with a monthly review. Every plan starts free.",
  alternates: { canonical: "/pricing/" },
  openGraph: { title: "Offers & prices — Jothi Swaroop", url: "/pricing/", images: ["/og.png"] },
};

/** The rates on their own URL, for emails and link previews (they drop #anchors). Dollars, or rupees for a visitor in India. */
export default function PricingPage() {
  return (
    <div className="min-h-[100svh] pt-[96px]">
      <Offers heading="h1" />
      <section>
        <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
          <p className="max-w-3xl text-lg">
            Before you decide, see the work: <Link href="/films/" className="font-semibold underline">the AI films</Link>, the{" "}
            <Link href="/work/" className="font-semibold underline">lead-generation figures</Link> with their Ads Manager screenshots, and{" "}
            <Link href="/systems/" className="font-semibold underline">the automations</Link> that follow up every enquiry.
          </p>
        </div>
      </section>
      <Close />
    </div>
  );
}
