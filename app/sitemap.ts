import type { MetadataRoute } from "next";
import { cases } from "@/lib/content";

export const dynamic = "force-static";

const BASE = "https://jothiswaroop.com";

/** Every public route, so Google indexes the whole site in one crawl instead of discovering pages one by one. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/apply/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/audit/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/notes/`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];
  for (const c of cases.filter((c) => !c.placeholder)) {
    pages.push({ url: `${BASE}/work/${c.slug}/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  }
  return pages;
}
