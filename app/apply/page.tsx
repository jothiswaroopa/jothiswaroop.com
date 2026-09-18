import BackLink from "@/components/BackLink";
import ApplyForm from "@/components/ApplyForm";
import { apply } from "@/lib/content";

export const metadata = { title: "Apply — Jothi Swaroop", description: "Four founders a quarter, India, UK and US. A two-minute application; introductions go to the top of the pile, everyone else is still read personally.", alternates: { canonical: "/apply/" }, openGraph: { title: "Apply — Jothi Swaroop", url: "/apply/" } };

export default function ApplyPage() {
  return (
    <section className="theme-paper min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <p className="label">// APPLY</p>
        <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)]">{apply.standaloneHeadline}</h1>
        <p className="mt-6 max-w-xl text-paper/75">{apply.sub}</p>
        <div className="mt-16"><ApplyForm /></div>
      </div>
    </section>
  );
}
