import Link from "next/link";
import Icon from "@/components/Icon";

/** Old route. Static hosting can't 301, so: canonical + meta refresh + a link. Not in the sitemap. */
export const metadata = { title: "Blog — Jothi Swaroop", robots: { index: false, follow: true }, alternates: { canonical: "/blog/" } };

export default function NotesRedirect() {
  return (
    <section className="min-h-[100svh] pt-[96px]">
      <meta httpEquiv="refresh" content="0; url=/blog/" />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <p className="text-ink/75">Notes moved. <Link href="/blog/" className="underline-slide text-ink">Go to the blog <Icon name="arrow" size={14} className="ml-1 inline-block align-[-0.1em]" /></Link></p>
      </div>
    </section>
  );
}
