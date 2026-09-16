"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { site } from "@/lib/content";

const links = [
  { label: "Results", href: "/#work" },
  { label: "Method", href: "/#method" },
  { label: "Notes", href: "/#notes" },
  { label: "About", href: "/about" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Floating glass island, detached from the top edge. Hides on scroll-down, returns on scroll-up.
 * Mobile: name + hamburger that morphs to ×, full-screen glass menu with staggered mask reveal,
 * plus a sticky bottom bar with both exits once the hero is gone.
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 160 && !open);
      setPastHero(y > window.innerHeight * 0.8);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
  }, [open]);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] transition-transform duration-500 ease-out-expo",
          hidden ? "-translate-y-[130%]" : "translate-y-0"
        )}
      >
        <div className="glass flex w-full max-w-[1200px] items-center justify-between gap-6 rounded-full border border-paper/10 py-2 pl-5 pr-2">
          <Link href="/" className="display text-xl tracking-tight text-paper" onClick={() => setOpen(false)}>
            {site.name}
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="underline-slide text-sm text-paper/70 transition-colors duration-200 hover:text-paper">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/audit" className="press rounded-full border border-paper/15 px-4 py-2 text-sm text-paper/85 hover:border-paper/40">
              Free audit
            </Link>
            <Link href="/apply" className="press rounded-full bg-signal px-4 py-2 text-sm font-medium text-ink hover:bg-paper">
              Apply
            </Link>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="press relative grid h-10 w-10 place-items-center rounded-full bg-paper/5 md:hidden"
          >
            <span className={clsx("absolute h-px w-4 bg-paper transition-transform duration-400 ease-out-expo", open ? "rotate-45" : "-translate-y-[3px]")} />
            <span className={clsx("absolute h-px w-4 bg-paper transition-transform duration-400 ease-out-expo", open ? "-rotate-45" : "translate-y-[3px]")} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass-strong fixed inset-0 z-40 flex flex-col justify-end bg-ink/85 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 md:hidden"
            style={{ transformOrigin: "top right" }}
            initial={{ opacity: 0, scale: 0.98, backdropFilter: "blur(0px) saturate(100%)" }}
            animate={{ opacity: 1, scale: 1, backdropFilter: "blur(24px) saturate(160%)" }}
            exit={{ opacity: 0, scale: 0.98, backdropFilter: "blur(0px) saturate(100%)", transition: { duration: 0.25, ease: EASE } }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <nav className="flex flex-col gap-2">
              {links.map((l, i) => (
                <span key={l.href} className="mask-line">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%", transition: { duration: 0.25 } }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.06 }}
                  >
                    <Link href={l.href} onClick={() => setOpen(false)} className="display block py-2 text-5xl text-paper">
                      {l.label}
                    </Link>
                  </motion.span>
                </span>
              ))}
            </nav>
            <motion.div
              className="mt-10 grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            >
              <Link href="/audit" onClick={() => setOpen(false)} className="press rounded-full border border-paper/20 py-3.5 text-center text-sm">Free audit</Link>
              <Link href="/apply" onClick={() => setOpen(false)} className="press rounded-full bg-signal py-3.5 text-center text-sm font-medium text-ink">Apply</Link>
            </motion.div>
            <p className="label mt-8 !text-paper/40">{site.base} · {site.whatsappDisplay}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky bar — both exits, appears after hero */}
      <div
        className={clsx(
          "glass scroll-edge-top fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-out-expo md:hidden",
          pastHero && !open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <Link href="/audit" className="press rounded-full border border-paper/20 py-3 text-center text-sm">Free audit</Link>
        <Link href="/apply" className="press rounded-full bg-signal py-3 text-center text-sm font-medium text-ink">Apply</Link>
      </div>
    </>
  );
}
