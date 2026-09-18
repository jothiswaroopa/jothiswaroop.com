import BackLink from "@/components/BackLink";
import AuditForm from "@/components/AuditForm";
import { audit } from "@/lib/content";

export const metadata = { title: "The Bottleneck Audit — Jothi Swaroop", description: "Seven questions, an instant diagnosis of where your marketing is leaking, and a recorded teardown of your setup within 48 hours. Free.", alternates: { canonical: "/audit/" }, openGraph: { title: "The Bottleneck Audit — Jothi Swaroop", url: "/audit/" } };

export default function AuditPage() {
  return (
    <section className="theme-paper min-h-[100svh] pt-[96px]">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <BackLink className="mb-8" />
        <p className="label">{audit.label}</p>
          <h1 className="mt-6 text-[clamp(2.5rem,5.5vw,5rem)]">{audit.headline}</h1>
          <p className="mt-6 max-w-lg text-paper/75">{audit.sub}</p>
        </div>
        <AuditForm />
      </div>
    </section>
  );
}
