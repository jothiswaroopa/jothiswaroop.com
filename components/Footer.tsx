import Link from "next/link";
import { site, footer, notes } from "@/lib/content";
import NewsletterForm from "@/components/NewsletterForm";

const link = "underline-slide w-fit";

/** The back of the card: one line, the index, and the colophon. Printed on the field; no motion here by design. */
export default function Footer() {
  return (
    <footer className="field relative -mt-px pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-16 md:pb-12 md:pt-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="display max-w-4xl text-[clamp(2rem,4.2vw,3.5rem)]">{footer.line}</p>
        <div className="scotch mt-12 md:mt-16" aria-hidden />
        <div className="mt-8 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-2xl">{site.name}</p>
            <p className="mt-1">{site.role}</p>
            <p className="mt-8 max-w-sm">{notes.optin}</p>
            <div className="mt-3 max-w-sm"><NewsletterForm /></div>
          </div>
          <nav className="flex flex-col gap-2.5 md:col-span-2" aria-label="Site">
            <Link href="/work/" className={link}>Work</Link>
            <Link href="/films/" className={link}>Films</Link>
            <Link href="/pricing/" className={link}>Rates</Link>
            <Link href="/services/" className={link}>Services</Link>
            <Link href="/systems/" className={link}>Systems</Link>
            <Link href="/about" className={link}>About</Link>
            <Link href="/blog/" className={link}>Blog</Link>
          </nav>
          <nav className="flex flex-col gap-2.5 md:col-span-2" aria-label="Contact">
            {site.calendar && <a href={site.calendar} className={link} target="_blank" rel="noreferrer">Book a call</a>}
            {site.email && <a href={`mailto:${site.email}`} className={link}>{site.email}</a>}
            <a href={`https://wa.me/${site.whatsapp}`} className={link} target="_blank" rel="noreferrer">WhatsApp</a>
            {site.socials.linkedin && <a href={site.socials.linkedin} className={link} target="_blank" rel="noreferrer">LinkedIn</a>}
            {site.socials.instagram && <a href={site.socials.instagram} className={link} target="_blank" rel="noreferrer">Instagram</a>}
            <Link href="/audit" className={link}>Free audit</Link>
            <Link href="/apply" className={link}>Apply</Link>
          </nav>
          <div className="text-sm md:col-span-3 md:text-right">
            <p>{footer.built}</p>
            <p className="mt-1">Set in Besley and Libre Franklin.</p>
            <p className="mt-1">© {new Date().getFullYear()} Jothi Swaroop</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
