"use client";

import { useShowIndiaOnly } from "@/lib/market";

/** Renders its children for India and in the static HTML; hides them once the client sees a visitor from abroad.
 *  For blocks a US or UK buyer would read as noise: an in-person programme in Chennai, founders they have never heard of. */
export default function IndiaOnly({ children }: { children: React.ReactNode }) {
  return useShowIndiaOnly() ? <>{children}</> : null;
}
