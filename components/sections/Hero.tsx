import Image from "next/image";
import Link from "next/link";
import { hero, site, story, byTheNumbers } from "@/lib/content";
import { RateCard } from "@/components/sections/Offers";
import HeroActions from "@/components/HeroActions";
import Icon from "@/components/Icon";

/**
 * The opening of the rate card. Left: the one sentence the whole site argues, the line under it, the two
 * actions and who issues the card; on a wide screen it holds its place while the reader scrolls the card.
 * Right: the rate card itself, tall, running on below the first screen, with the reply card's tab at its corner.
 * On a phone the order is sentence, actions, card, then the issuer: the card's head and first price have to
 * land inside the first screen, so the issuer waits under the card.
 */
export default function Hero() {
  const [leads, conversations] = byTheNumbers.stats;
  return (
    <section className="relative pt-[96px]">
      <div className="mx-auto grid max-w-[1440px] gap-x-10 gap-y-8 px-5 pb-16 pt-5 md:px-10 md:pb-24 md:pt-14 lg:grid-cols-12">
        {/* `contents` below lg: its two blocks become grid items, so the card can sit between them */}
        <div className="contents lg:sticky lg:top-[136px] lg:col-span-7 lg:block lg:self-start">
          <div className="order-1">
            <h1 className="tracking-display text-[clamp(2rem,5.6vw,5.5rem)]">
              <span className="mask-line"><span className="word-rise" style={{ "--i": 0 } as React.CSSProperties}>{hero.thesis[0][0]}<br />{hero.thesis[0][1]}</span></span>
              <span className="mask-line"><span className="word-rise text-signal" style={{ "--i": 2 } as React.CSSProperties}>{hero.thesis[1][0]}<br />{hero.thesis[1][1]}</span></span>
            </h1>
            <p className="fade-up mt-5 max-w-[34rem] text-lg leading-relaxed md:mt-7 md:text-xl" style={{ "--i": 2 } as React.CSSProperties}>{hero.lede}</p>
            <div className="fade-up mt-6 md:mt-8" style={{ "--i": 3 } as React.CSSProperties}>
              <HeroActions />
            </div>
          </div>

          <div className="order-3 lg:mt-10">
            <div className="fade-up flex max-w-[34rem] items-center gap-5 border-t border-ink pt-6" style={{ "--i": 4 } as React.CSSProperties}>
              <div className="relative h-[88px] w-[72px] shrink-0 bg-stock-3">
                <Image src="/img/portrait-hero.jpg" alt={`${site.name}, portrait`} fill priority fetchPriority="high" sizes="72px" className="duotone object-cover object-[50%_22%]" />
              </div>
              <div>
                <p className="display text-xl">{site.name}</p>
                <p className="mt-1 text-sm">{story.titles}</p>
                <p className="mt-1 text-sm">{site.base}</p>
              </div>
            </div>
            <p className="fade-up mt-6 max-w-[34rem] text-[0.9375rem]" style={{ "--i": 5 } as React.CSSProperties}>
              <span className="tnum font-semibold">{leads.value.toLocaleString("en-US")} leads</span> and{" "}
              <span className="tnum font-semibold">{conversations.value.toLocaleString("en-US")} conversations</span> across nine ad accounts. Every figure links to its Ads Manager screenshot.{" "}
              <Link href="#figures" className="inline-flex items-center gap-1 font-semibold underline">See the figures <Icon name="arrow-down" size={14} /></Link>
            </p>
          </div>
        </div>

        <div id="offers" className="relative order-2 mt-3 lg:order-none lg:col-span-5 lg:mt-0">
          <span id="services" className="absolute top-0" aria-hidden />
          <Link href="#reply" className="salmon press absolute -top-5 right-4 z-10 inline-flex rotate-3 items-center gap-2 border border-ink px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-transform duration-300 ease-out-expo hover:rotate-0">
            Reply card inside <Icon name="arrow-down" size={14} />
          </Link>
          <RateCard />
        </div>
      </div>
    </section>
  );
}
