import Link from "next/link";
import Offers from "@/components/sections/Offers";
import Close from "@/components/sections/Close";
import Accelerator from "@/components/sections/Accelerator";
import { site } from "@/lib/content";

export const metadata = {
  title: "Prices in India — Meta Lead Generation & AI Ads | Jothi Swaroop",
  description: "Meta lead generation and AI video ads for businesses in India, priced in rupees.",
  alternates: { canonical: "/india/" },
  // Rupee prices are for Indian buyers only: kept out of search and the sitemap, and linked only for visitors in India.
  robots: { index: false, follow: false },
  openGraph: { title: "Prices in India — Jothi Swaroop", url: "/india/", images: ["/og.png"] },
};

/** The rupee rate card, for WhatsApp and Indian emails. Never linked from the dollar pages except for visitors in India.
 *  The five-day Accelerator, which only runs in person in India, lives here too. */
export default function IndiaPage() {
  return (
    <div className="min-h-[100svh] pt-[96px]">
      <Offers market="inr" heading="h1" />
      <section>
        <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
          <p className="max-w-3xl text-lg">
            From Chennai, for businesses across India. The same Meta ads that brought one Tirupur manufacturer 4,248 buyer enquiries at ₹16.58 each, and AI video ads made from the product photos you already have. English or Tamil, on WhatsApp at {site.whatsappDisplay}.
          </p>
          <p className="mt-5 max-w-3xl">
            See the proof first: <Link href="/work/nova/" className="font-semibold underline">4,248 leads for Nova Attire</Link> with every Ads Manager screenshot, and{" "}
            <Link href="/films/" className="font-semibold underline">the AI films</Link>.
          </p>
        </div>
      </section>
      <Accelerator />
      <Close market="inr" />
    </div>
  );
}
