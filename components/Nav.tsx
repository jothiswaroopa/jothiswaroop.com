"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import clsx from "clsx";
import { site, story } from "@/lib/content";
import { useDetectedMarket } from "@/lib/market";
import { calHref } from "@/lib/submit";
import Clocks from "@/components/Clocks";

const links = [
  { label: "Work", href: "/work/" },
  { label: "Films", href: "/films/" },
  { label: "Rates", href: "/pricing/" },
  { label: "Services", href: "/services/" },
  { label: "About", href: "/about/" },
  { label: "Blog", href: "/blog/" },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const small = "press inline-flex min-h-[40px] items-center px-4 text-sm font-semibold";
const bar = "press inline-flex min-h-[48px] items-center justify-center px-3 text-center text-[0.9375rem] font-semibold";

/**
 * The masthead of the rate card: a dateline (the reader's hour beside Chennai's), then the name and the
 * sections, closed by a heavy rule. Leaves on scroll-down, returns on scroll-up.
 * Mobile: name + menu button, a full-screen menu printed on the emerald field, and a bottom bar with the
 * page's two exits once the opening has scrolled away.
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Visitors in India get the rupee list and WhatsApp; everyone else only ever sees dollars.
  const india = useDetectedMarket() === "inr";
  const navLinks = india ? links.map((l) => (l.href === "/pricing/" ? { ...l, href: "/india/" } : l)) : links;
  // First path segment, not startsWith("/apply"): a bare "/apply" in the shipped code reads to Google as a link
  // to the slash-less address, which only redirects (Search Console, 26 Nov 2026: "Page with redirect").
  const section = pathname?.split("/")[1];
  const onApply = section === "apply";
  const onAiAds = section === "ai-ads";
  const onPricing = section === "pricing";
  const wa = `https://wa.me/${site.whatsapp}`;
  const issued = new Date().toLocaleString("en-GB", { month: "long", year: "numeric" });

  useEffect(() => {
    let last = window.scrollY, ticking = false, h = false, p = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const nh = y > last && y > 160 && !open;
        const np = y > 40;
        if (nh !== h) { h = nh; setHidden(nh); }
        if (np !== p) { p = np; setPastHero(np); }
        last = y; ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
  }, [open]);

  const credential = story.titles.split(" · ")[0]; // "Certified Performance Marketer": on every screen size, always
  const primary = india
    ? <a href={wa} target="_blank" rel="noreferrer" className={`${small} bg-signal text-stock hover:bg-ink`}>WhatsApp</a>
    : <Link href="/#reply" className={`${small} bg-signal text-stock hover:bg-ink`}>Free AI ad</Link>;

  return (
    <>
      <header className={clsx("fixed inset-x-0 top-0 z-50 bg-stock transition-transform duration-500 ease-out-expo", hidden ? "-translate-y-full" : "translate-y-0")}>
        <div className="border-b border-ink">
          <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-center gap-6 px-5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] sm:justify-between md:px-10">
            <span className="hidden sm:inline" suppressHydrationWarning>Rate card · {issued}</span>
            <Clocks />
            <span className="hidden md:inline">{credential}</span>
          </div>
        </div>
        <div className="border-b-4 border-ink">
          <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10">
            <Link href="/" className="-my-3 py-3 text-ink" aria-label="Jothi Swaroop, home" onClick={() => setOpen(false)}>
              <span className="display block text-[1.5rem] leading-none">{site.name}</span>
              {/* On a phone the dateline has room for the clocks only, so the credential sits under the name, letterhead-style. */}
              <span className="mt-1.5 block text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.08em] md:hidden">{credential}</span>
            </Link>
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Sections">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className={clsx("underline-slide text-[0.9375rem] font-medium text-ink", pathname?.startsWith(l.href.replace(/\/$/, "")) && "underline decoration-2 underline-offset-[6px]")}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/audit/" className={`${small} border border-ink text-ink hover:bg-ink hover:text-stock`}>Free audit</Link>
              {!onApply && primary}
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="press relative grid h-11 w-11 place-items-center border border-ink md:hidden"
            >
              <span className={clsx("absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ease-out-expo", open ? "rotate-45" : "-translate-y-[4px]")} />
              <span className={clsx("absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ease-out-expo", open ? "-rotate-45" : "translate-y-[4px]")} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: the sections, printed large on the field */}
      <AnimatePresence>
        {open && (
          <m.div
            className="field fixed inset-0 z-40 flex flex-col justify-end px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.3, ease: EASE } }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav className="flex flex-col" aria-label="Sections">
              {navLinks.map((l, i) => (
                <span key={l.href} className="mask-line border-b border-line">
                  <m.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%", transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.05 }}
                  >
                    <Link href={l.href} onClick={() => setOpen(false)} className="display block py-3 text-[2.5rem] text-ink">
                      {l.label}
                    </Link>
                  </m.span>
                </span>
              ))}
            </nav>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link href="/audit/" onClick={() => setOpen(false)} className={`${bar} border border-ink text-ink`}>Free audit</Link>
              {india
                ? <a href={wa} target="_blank" rel="noreferrer" className={`${bar} bg-signal text-stock`}>WhatsApp</a>
                : <Link href="/#reply" onClick={() => setOpen(false)} className={`${bar} bg-signal text-stock`}>Free AI ad</Link>}
            </div>
            <p className="mt-6 text-sm text-ink">{site.base} <span aria-hidden>·</span> {site.whatsappDisplay}</p>
          </m.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom bar: the page's two exits, once the opening has scrolled away */}
      <div
        className={clsx(
          "fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t-4 border-ink bg-stock p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-out-expo md:hidden",
          pastHero && !open && !onApply ? "translate-y-0" : "translate-y-full"
        )}
      >
        {onAiAds ? (
          <>
            {/* The cold-email landing page: its two exits are the price and the free ad. */}
            <a href="#price" className={`${bar} border border-ink text-ink`}>See the price</a>
            <a href="#free-ad" className={`${bar} bg-signal text-stock`}>Free AI ad</a>
          </>
        ) : onPricing ? (
          <>
            {/* The price list's exits are its two offers: the free ad, and a call about lead generation. */}
            <a href="#reply" className={`${bar} border border-ink text-ink`}>Free AI ad</a>
            <a href={calHref(site.calendar, { notes: "From the pricing page" })} target="_blank" rel="noreferrer" className={`${bar} bg-signal text-stock`}>Book a call</a>
          </>
        ) : (
          <>
            <Link href="/audit/" className={`${bar} border border-ink text-ink`}>Free audit</Link>
            {india
              ? <a href={wa} target="_blank" rel="noreferrer" className={`${bar} bg-signal text-stock`}>WhatsApp</a>
              : <Link href="/#reply" className={`${bar} bg-signal text-stock`}>Free AI ad</Link>}
          </>
        )}
      </div>
    </>
  );
}
