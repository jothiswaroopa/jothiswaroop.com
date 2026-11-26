import Link from "next/link";
import Offers from "@/components/sections/Offers";
import Close from "@/components/sections/Close";
import Accelerator from "@/components/sections/Accelerator";

export const metadata = {
  title: "Prices — Meta Ads for Leads & Online Sales, AI Ads & Commercials | Jothi Swaroop",
  description: "Meta ads for leads or online sales, run for you from $1,500 a month, or $2,250 with 8 AI ads included; AI ads & commercials from a $1,000 test batch of 8, then $2,500 a month for 16 and a studio commercial, or $5,000 a month for 30 and 2 studio commercials; one-to-one AI mentorship, remote, $1,500. Every plan starts free.",
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
            Before you decide, see the work: <a href="/creative-lab/" className="font-semibold underline">the AI films</a>, the{" "}
            <Link href="/work/" className="font-semibold underline">lead-generation figures</Link> with their Ads Manager screenshots, and{" "}
            <Link href="/systems/" className="font-semibold underline">the automations</Link> that follow up every enquiry.
          </p>
        </div>
      </section>
      {/* One-to-one AI mentorship: remote for visitors abroad, in person (rupees) for a visitor in India */}
      <Accelerator />
      <Close />
    </div>
  );
}
