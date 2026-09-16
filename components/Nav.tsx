"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { site } from "@/lib/content";

const links = [
  { label: "Results", href: "/#work" },
  { label: "Method", href: "/#method" },
  { label: "Notes", href: "/#notes" },
  { label: "About", href: "/about" },
];

/** Hides on scroll-down, returns on scroll-up. Both exits always visible. */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 120);
      setScrolled(y > 24);
      setPastHero(y > window.innerHeight * 0.8);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
          hidden ? "-translate-y-full" : "translate-y-0",
          scrolled ? "bg-ink/70 backdrop-blur-md border-b hairline" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link href="/" className="display text-xl tracking-tight">
            {site.name}
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="underline-slide text-sm text-paper/70 hover:text-paper transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/audit" className="rounded-full border border-line-strong px-4 py-2 text-sm text-paper/80 hover:border-signal hover:text-signal transition-colors">
              Free audit
            </Link>
            <Link href="/apply" className="rounded-full bg-signal px-4 py-2 text-sm font-medium text-ink hover:bg-paper transition-colors">
              Apply
            </Link>
          </div>
          <Link href="/apply" className="md:hidden rounded-full bg-signal px-4 py-2 text-sm font-medium text-ink">
            Apply
          </Link>
        </div>
      </header>

      {/* Mobile sticky bar — both exits, appears after hero */}
      <div
        className={clsx(
          "fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t hairline bg-ink/85 p-3 backdrop-blur-md transition-transform duration-500 ease-out-expo md:hidden",
          pastHero ? "translate-y-0" : "translate-y-full"
        )}
      >
        <Link href="/audit" className="rounded-full border border-line-strong py-3 text-center text-sm">
          Free audit
        </Link>
        <Link href="/apply" className="rounded-full bg-signal py-3 text-center text-sm font-medium text-ink">
          Apply
        </Link>
      </div>
    </>
  );
}
