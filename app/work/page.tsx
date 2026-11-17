import MoneyText from "@/components/MoneyText";
import Work from "@/components/sections/Work";
import Testimonials from "@/components/sections/Testimonials";
import Close from "@/components/sections/Close";

export const metadata = {
  title: "Work — Nine Ad Accounts, Every Ads Manager Screenshot | Jothi Swaroop",
  description: "Every case with its Ads Manager screenshot and how the number was counted: 7,341 lead-form submissions, 876 conversations, 1.36M+ people reached across nine ad accounts. Films, client-reported results and video testimonials.",
  alternates: { canonical: "/work/" },
  openGraph: { title: "Work, with every screenshot — Jothi Swaroop", url: "/work/", images: ["/og.png"] },
};

/**
 * The whole file behind the homepage's figures table: every case, every raw Ads Manager screenshot, the reel,
 * the totals, what clients reported, and all six testimonials. Moved off the homepage on 13 Nov 2026 so the
 * rate card stays short; nothing was removed.
 */
export default function WorkPage() {
  return (
    <MoneyText>
    <div className="min-h-[100svh] pt-[96px]">
      <Work />
      <Testimonials />
      <Close />
    </div>
    </MoneyText>
  );
}
