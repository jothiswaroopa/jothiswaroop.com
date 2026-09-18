"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SplitText from "@/components/motion/SplitText";
import Button from "@/components/Button";
import Scramble from "@/components/motion/Scramble";
import { hero, site, byTheNumbers, story } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const wordCount = hero.headline.join(" ").split(" ").length;
  const settle = 0.2 + wordCount * 0.04;

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-[88px]">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-16 pt-6 md:px-10 lg:grid-cols-[55fr_45fr] lg:items-end lg:gap-12 lg:pb-14 lg:pt-10">
        {/* Video / portrait — first on mobile */}
        <motion.div
          className="hero-media bezel relative order-1 h-[min(28svh,360px)] w-full lg:order-2 lg:h-[min(72vh,760px)]"
          initial={{ clipPath: "inset(6% 6% 6% 6% round 24px)", scale: 1.1 }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: settle * 0.6 }}
        >
         <div className="bezel-core relative h-full w-full">
          {hero.videoSrc ? (
            <video className="h-full w-full object-cover" src={hero.videoSrc} poster={hero.posterSrc} autoPlay muted loop playsInline />
          ) : (
            <div className="duotone relative h-full w-full">
              <Image src={hero.posterSrc} alt={`${site.name}, portrait`} fill priority fetchPriority="high" sizes="(min-width:1024px) 45vw, 70vw" className="object-cover object-[50%_32%]" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <motion.p
            className="label absolute bottom-5 left-5 !text-paper/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: settle + 0.8 }}
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal align-middle" />
            {site.seatsLine} · Q4 2026
          </motion.p>
         </div>
        </motion.div>

        {/* Copy — on desktop the column is as tall as the portrait: eyebrow + counted totals at the top, the pitch at the bottom */}
        <div className="order-2 lg:order-1 lg:flex lg:h-[min(72vh,760px)] lg:flex-col lg:justify-between">
          <div>
            <motion.p className="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Scramble text={hero.eyebrow} />
            </motion.p>
            {/* desktop only: who this is, before the pitch — name, credentials, then the counted proof line */}
            <motion.div
              className="mt-7 hidden lg:block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            >
              <p className="display text-[2.4rem] leading-none tracking-display text-paper">{site.name}</p>
              <p className="mono mt-3 text-[13px] text-paper/70">{story.titles}</p>
            </motion.div>
            <motion.ul
              className="mt-6 hidden gap-x-8 gap-y-3 border-t hairline pt-5 lg:flex lg:flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              aria-label="Counted across every ad account on this page"
            >
              {byTheNumbers.stats.slice(0, 3).map((st) => (
                <li key={st.k} className="flex items-baseline gap-2">
                  <span className="mono text-sm text-signal">{st.prefix ?? ""}{st.value.toLocaleString("en-IN")}{st.suffix ?? ""}</span>
                  <span className="label !normal-case !tracking-normal">{st.k}</span>
                </li>
              ))}
            </motion.ul>
          </div>
          <div>
          <SplitText
            lines={hero.headline}
            className="tracking-display mt-5 text-[clamp(2.5rem,4.6vw,4.5rem)] text-paper lg:mt-0"
            delay={0.2}
          />
          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 md:mt-8 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: settle + 0.2 }}
          >
            {hero.sub}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4 md:mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: settle + 0.4 }}
          >
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            <Button href={hero.ctaSecondary.href} variant="ghost">{hero.ctaSecondary.label}</Button>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
