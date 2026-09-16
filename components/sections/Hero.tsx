"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SplitText from "@/components/motion/SplitText";
import Button from "@/components/Button";
import Scramble from "@/components/motion/Scramble";
import { hero, site } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const wordCount = hero.headline.join(" ").split(" ").length;
  const settle = 0.2 + wordCount * 0.04;

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-[72px]">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 pb-16 pt-6 md:px-10 lg:grid-cols-[55fr_45fr] lg:items-end lg:gap-12 lg:pb-14 lg:pt-10">
        {/* Video / portrait — first on mobile */}
        <motion.div
          className="relative order-1 h-[min(48svh,520px)] w-full overflow-hidden rounded-2xl bg-ink-2 lg:order-2 lg:h-[min(72vh,760px)]"
          initial={{ clipPath: "inset(6% 6% 6% 6% round 16px)", scale: 1.15 }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 16px)", scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: settle * 0.6 }}
        >
          {hero.videoSrc ? (
            <video className="h-full w-full object-cover" src={hero.videoSrc} poster={hero.posterSrc} autoPlay muted loop playsInline />
          ) : (
            <div className="duotone relative h-full w-full">
              <Image src={hero.posterSrc} alt={`${site.name}, portrait`} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
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
        </motion.div>

        {/* Copy */}
        <div className="order-2 lg:order-1">
          <motion.p className="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Scramble text={hero.eyebrow} />
          </motion.p>
          <SplitText
            lines={hero.headline}
            className="mt-6 text-[clamp(2.75rem,7vw,6.75rem)] text-paper"
            delay={0.2}
          />
          <motion.p
            className="mt-8 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: settle + 0.2 }}
          >
            {hero.sub}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: settle + 0.4 }}
          >
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            <Button href={hero.ctaSecondary.href} variant="ghost">{hero.ctaSecondary.label}</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
