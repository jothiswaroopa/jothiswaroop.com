import Link from "next/link";
import BackLink from "@/components/BackLink";
import Offers from "@/components/sections/Offers";
import { site } from "@/lib/content";

export const metadata = {
  title: "Admissions, Patients & AI Commercials — Meta Ads in India | Jothi Swaroop",
  description: "Meta ads and AI video ads for colleges, schools, clinics and showrooms in India. A free Enquiry Leak Review, a ₹25,000 30-day sprint credited in full, then ₹50,000 a month. AI commercials from ₹3,500. Chennai.",
  alternates: { canonical: "/india/" },
  openGraph: { title: "Admissions, patients and AI commercials — Jothi Swaroop", url: "/india/", images: ["/og.png"] },
};

/** The rupee side of the price list, for WhatsApp and Indian emails. Always opens in ₹. */
export default function IndiaPage() {
  return (
    <div className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 md:px-10">
        <BackLink />
        <p className="mt-10 max-w-2xl text-xl leading-relaxed text-paper/85">
          From Chennai, for colleges, clinics and showrooms across India. The same Meta ads that brought one Tirupur manufacturer 4,248 buyer enquiries at ₹16.58 each — pointed at admissions, appointments and festival sales. English or Tamil, on WhatsApp at {site.whatsappDisplay}.
        </p>
      </div>
      <Offers initial="inr" detectMarket={false} heading="h1" />
      <div className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        <p className="max-w-2xl text-paper/80">
          See the proof first: <Link href="/work/nova/" className="underline-slide text-paper">4,248 leads for Nova Attire</Link> with every Ads Manager screenshot, and{" "}
          <Link href="/films/" className="underline-slide text-paper">the AI films</Link>.
        </p>
      </div>
    </div>
  );
}
