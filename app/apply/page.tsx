import ApplyForm from "@/components/ApplyForm";
import { apply } from "@/lib/content";

export const metadata = { title: "Apply — Jothi Swaroop" };

export default function ApplyPage() {
  return (
    <section className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <p className="label">// APPLY</p>
        <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)]">{apply.headline}</h1>
        <p className="mt-6 max-w-xl text-paper/65">{apply.sub}</p>
        <div className="mt-16"><ApplyForm /></div>
      </div>
    </section>
  );
}
