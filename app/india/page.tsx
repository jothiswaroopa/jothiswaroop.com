import Link from "next/link";
import BackLink from "@/components/BackLink";
import Offers from "@/components/sections/Offers";
import { site } from "@/lib/content";

export const metadata = {
  title: "Prices in India — Meta Lead Generation & AI Ads | Jothi Swaroop",
  description: "Meta lead generation and AI video ads for businesses in India, priced in rupees.",
  alternates: { canonical: "/india/" },
  // Rupee prices are for Indian buyers only: kept out of search and the sitemap, and linked only for visitors in India.
  robots: { index: false, follow: false },
  openGraph: { title: "Prices in India — Jothi Swaroop", url: "/india/", images: ["/og.png"] },
};

/** The rupee price list, for WhatsApp and Indian emails. Never linked from the dollar pages except for visitors in India. */
export default function IndiaPage() {
  return (
    <div className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 md:px-10">
        <BackLink />
        <p className="mt-10 max-w-2xl text-xl leading-relaxed text-paper/85">
          From Chennai, for businesses across India. The same Meta ads that brought one Tirupur manufacturer 4,248 buyer enquiries at ₹16.58 each, and AI video ads made from the product photos you already have. English or Tamil, on WhatsApp at {site.whatsappDisplay}.
        </p>
      </div>
      <Offers market="inr" heading="h1" />
      <div className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        <p className="max-w-2xl text-paper/80">
          See the proof first: <Link href="/work/nova/" className="underline-slide text-paper">4,248 leads for Nova Attire</Link> with every Ads Manager screenshot, and{" "}
          <Link href="/films/" className="underline-slide text-paper">the AI films</Link>.
        </p>
      </div>
    </div>
  );
}
