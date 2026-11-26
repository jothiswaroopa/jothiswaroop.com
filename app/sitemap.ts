import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { cases } from "@/lib/content";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const BASE = "https://jothiswaroop.com";
const ROOT = process.cwd();

/**
 * When each page last really changed, from git: the newest commit touching the page's own file or anything it
 * imports. A page that lists blog posts also counts the posts in content/blog.
 *
 * Why (26 Nov 2026): every page was stamped `new Date()`, the build time, and the site rebuilds at least daily
 * (the dashboard commits every morning), so the sitemap told Google that all of it changed every day. Google
 * uses lastmod only when it is "consistently and verifiably accurate", so it was learning to ignore ours. That
 * mattered with pages waiting to be crawled: Search Console had /pricing/ and /films/ as unknown and /services/,
 * /systems/ and one post as discovered but not crawled, all of them in this sitemap.
 *
 * Shared copy lives in lib/content.ts, so a change there dates every page that reads it. That overstates a few
 * changes but never invents one. app/layout.tsx (the site chrome) is left out on purpose. With no usable history
 * (no git, or a shallow clone) lastmod is omitted rather than guessed. The deploy build checks out one commit, so
 * scripts/git-history.mjs (first in prebuild) fetches the rest before this runs.
 */
function git(args: string[]): string {
  try { return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
  catch { return ""; }
}
const usable = git(["rev-parse", "--is-shallow-repository"]) === "false";

function resolve(spec: string, from: string): string | null {
  const base = spec.startsWith("@/") ? path.join(ROOT, spec.slice(2)) : spec.startsWith(".") ? path.resolve(path.dirname(from), spec) : null;
  if (!base) return null;
  for (const ext of ["", ".tsx", ".ts", ".mjs", ".js", ".json", "/index.tsx", "/index.ts"]) {
    const f = base + ext;
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return null;
}

/** The page file and every local module it imports, all the way down. */
function sources(entry: string): string[] {
  const seen = new Set<string>();
  const stack = [path.join(ROOT, entry)];
  while (stack.length) {
    const f = stack.pop()!;
    if (seen.has(f)) continue;
    seen.add(f);
    if (!/\.(tsx?|mjs|js)$/.test(f)) continue;
    for (const m of readFileSync(f, "utf8").matchAll(/(?:\bfrom|\bimport)\s*\(?\s*["']([^"']+)["']/g)) {
      const r = resolve(m[1], f);
      if (r) stack.push(r);
    }
  }
  const rel = [...seen].map((f) => path.relative(ROOT, f));
  if (rel.includes(path.join("lib", "blog.ts"))) rel.push(path.join("content", "blog"));
  return rel;
}

function changed(entry: string): Date | undefined {
  if (!usable) return undefined;
  const iso = git(["log", "-1", "--format=%cI", "--", ...sources(entry)]);
  return iso ? new Date(iso) : undefined;
}

/** Every public route, so Google indexes the whole site in one crawl instead of discovering pages one by one. */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (p: string, file: string, changeFrequency: "daily" | "weekly" | "monthly", priority: number) =>
    ({ url: `${BASE}${p}`, lastModified: changed(file), changeFrequency, priority });
  const pages: MetadataRoute.Sitemap = [
    page("/", "app/page.tsx", "weekly", 1),
    page("/about/", "app/about/page.tsx", "monthly", 0.9),
    page("/work/", "app/work/page.tsx", "monthly", 0.9),
    page("/services/", "app/services/page.tsx", "monthly", 0.9),
    page("/pricing/", "app/pricing/page.tsx", "monthly", 0.9),
    page("/ai-ads/", "app/ai-ads/page.tsx", "monthly", 0.9),
    page("/films/", "app/films/page.tsx", "monthly", 0.8),
    page("/systems/", "app/systems/page.tsx", "monthly", 0.8),
    page("/apply/", "app/apply/page.tsx", "monthly", 0.8),
    page("/audit/", "app/audit/page.tsx", "monthly", 0.8),
    page("/blog/", "app/blog/page.tsx", "daily", 0.8),
    // A hand-built static page (public/creative-lab/), indexed since 26 Nov 2026. /creative-lab/india/ is its rupee-only
    // copy for Indian links and stays noindex: the main page already switches to rupees for Indian visitors.
    page("/creative-lab/", "public/creative-lab/index.html", "monthly", 0.8),
  ];
  const caseChanged = changed("app/work/[slug]/page.tsx");
  for (const c of cases.filter((c) => !c.placeholder)) {
    pages.push({ url: `${BASE}/work/${c.slug}/`, lastModified: caseChanged, changeFrequency: "monthly", priority: 0.7 });
  }
  for (const p of getAllPosts()) {
    pages.push({ url: `${BASE}/blog/${p.slug}/`, lastModified: new Date((p.updated ?? p.date) + "T00:00:00Z"), changeFrequency: "monthly", priority: 0.6 });
  }
  return pages;
}
