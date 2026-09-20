import Link from "next/link";

/** Old route. Static hosting can't 301, so: canonical + meta refresh + a link. Not in the sitemap. */
export const metadata = { title: "Blog — Jothi Swaroop", robots: { index: false, follow: true }, alternates: { canonical: "/blog/" } };

export default function NotesRedirect() {
  return (
    <section className="min-h-[100svh] pt-[96px]">
      <meta httpEquiv="refresh" content="0; url=/blog/" />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <p className="text-paper/75">Notes moved. <Link href="/blog/" className="underline-slide text-paper">Go to the blog →</Link></p>
      </div>
    </section>
  );
}
