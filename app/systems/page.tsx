import BackLink from "@/components/BackLink";
import Systems from "@/components/sections/Systems";

export const metadata = {
  title: "AI Automation & Agents Built for Real Businesses | Jothi Swaroop",
  description: "Nine systems running for real businesses: an AI receptionist on a dental clinic's phone, a voice-order to invoice bot, an inventory reorder agent, renewal reminders and more. Built in n8n, wired to the tools the owner already uses.",
  alternates: { canonical: "/systems/" },
  openGraph: { title: "AI automation & agents — Jothi Swaroop", url: "/systems/", images: ["/og.png"] },
};

/**
 * The Systems section on its own URL. Link previews (LinkedIn especially) keep only the canonical URL and drop
 * any #anchor, so /#systems always opened the top of the homepage. External links point here instead.
 */
export default function SystemsPage() {
  const base = "https://jothiswaroop.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: base + "/" }, { "@type": "ListItem", position: 2, name: "Systems", item: `${base}/systems/` }],
  };

  return (
    <div className="min-h-[100svh] pt-[96px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-10 md:px-10 md:pt-14">
        <BackLink />
      </div>
      <Systems heading="h1" />
    </div>
  );
}
