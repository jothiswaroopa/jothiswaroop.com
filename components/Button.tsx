import Link from "next/link";
import clsx from "clsx";
import Magnetic from "@/components/motion/Magnetic";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "fill" | "ghost" | "quiet";
  className?: string;
};

/** Three CTA weights. fill = Apply. ghost = Free audit. quiet = the after-proof nudge. */
export default function Button({ href, children, variant = "fill", className }: Props) {
  const base = "group inline-flex items-center gap-3 rounded-full text-sm font-medium transition-colors duration-300";
  const styles = {
    fill: "bg-signal text-ink px-6 py-3.5 hover:bg-paper",
    ghost: "border border-line-strong text-paper px-6 py-3.5 hover:border-signal hover:text-signal",
    quiet: "label !text-[var(--paper-70)] hover:!text-signal !normal-case !tracking-normal !text-sm",
  }[variant];

  const inner = (
    <Link href={href} className={clsx(base, styles, className)}>
      <span className="relative overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0" aria-hidden>
          {children}
        </span>
      </span>
      <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </Link>
  );

  return variant === "quiet" ? inner : <Magnetic className="inline-block">{inner}</Magnetic>;
}
