"use client";

import { site } from "@/lib/content";
import { calHref } from "@/lib/submit";
import { useDetectedMarket } from "@/lib/market";
import Button from "@/components/Button";

/** The opening's two actions. Abroad: the free ad and a call. India: WhatsApp and the figures. */
export default function HeroActions() {
  const india = useDetectedMarket() === "inr";
  return (
    <div className="flex flex-wrap gap-3">
      {india ? (
        <>
          <Button href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Jothi, I saw your site and would like the free first step.")}`} icon="arrow-up-right">Ask on WhatsApp</Button>
          <Button href="#reply" variant="ghost" icon="arrow-down">The free first step</Button>
        </>
      ) : (
        <>
          <Button href="#reply" icon="arrow-down">Get your free AI ad</Button>
          <Button href={calHref(site.calendar, { notes: "From the homepage" })} variant="ghost" icon="arrow-up-right">Book a call</Button>
        </>
      )}
    </div>
  );
}
