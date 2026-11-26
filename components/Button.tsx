import Link from "next/link";
import clsx from "clsx";
import Icon from "@/components/Icon";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "fill" | "ghost" | "quiet";
  className?: string;
  icon?: "arrow" | "arrow-up-right" | "arrow-down";
  /** A hand-built static page outside the Next app (e.g. /creative-lab/): a plain <a>, so Next does not try to fetch an RSC payload for it. */
  native?: boolean;
};

const base = "press group inline-flex min-h-[48px] items-center justify-center gap-2.5 px-4 text-[0.9375rem] font-semibold leading-none sm:gap-3 sm:px-5";
export const fillClass = `${base} bg-signal text-stock hover:bg-ink`;
export const ghostClass = `${base} border border-ink text-ink hover:bg-ink hover:text-stock`;

/**
 * Three weights. fill = the one action on the page, printed solid in the second ink. ghost = a ruled box.
 * quiet = a text link with an arrow. Square, like everything else on the card; pressing one moves it a pixel.
 */
export default function Button({ href, children, variant = "fill", className, icon = "arrow", native = false }: Props) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const arrow = <Icon name={icon} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />;
  const cls =
    variant === "quiet"
      ? clsx("press group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink underline decoration-1 underline-offset-4 hover:text-signal", className)
      : clsx(variant === "fill" ? fillClass : ghostClass, className);
  const inner = <>{children}{arrow}</>;
  if (native) return <a href={href} className={cls}>{inner}</a>;
  return external
    ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls}>{inner}</a>
    : <Link href={href} className={cls}>{inner}</Link>;
}
