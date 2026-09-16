import Link from "next/link";
import clsx from "clsx";
import Magnetic from "@/components/motion/Magnetic";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "fill" | "ghost" | "quiet";
  className?: string;
};

/**
 * Three CTA weights. fill = Apply. ghost = Free audit. quiet = the after-proof nudge.
 * Arrow lives in its own island (button-in-button); press scales to 0.97 for instant feedback.
 */
export default function Button({ href, children, variant = "fill", className }: Props) {
  if (variant === "quiet") {
    return (
      <Link href={href} className={clsx("group inline-flex items-center gap-2 text-sm text-paper/70 transition-colors duration-200 hover:text-signal press", className)}>
        <span className="underline-slide">{children}</span>
        <span className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1" aria-hidden>→</span>
      </Link>
    );
  }

  const fill = variant === "fill";
  return (
    <Magnetic className="inline-block">
      <Link
        href={href}
        className={clsx(
          "group press inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-medium",
          fill ? "bg-signal text-ink hover:bg-paper" : "border border-line-strong text-paper hover:border-paper/40",
          className
        )}
      >
        <span className="relative overflow-hidden py-1.5">
          <span className="block transition-transform duration-350 ease-out-expo group-hover:-translate-y-[120%]">{children}</span>
          <span className="absolute inset-0 block translate-y-[120%] py-1.5 transition-transform duration-350 ease-out-expo group-hover:translate-y-0" aria-hidden>
            {children}
          </span>
        </span>
        <span
          className={clsx(
            "grid h-9 w-9 place-items-center rounded-full transition-transform duration-350 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105",
            fill ? "bg-ink/10" : "bg-paper/10"
          )}
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11L11 3M11 3H5M11 3v6" />
          </svg>
        </span>
      </Link>
    </Magnetic>
  );
}
