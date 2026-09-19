"use client";
import { usePathname } from "next/navigation";

/** Hides the site chrome (nav, footer, section labels) on self-contained pages like /card. */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/card")) return null;
  return <>{children}</>;
}
