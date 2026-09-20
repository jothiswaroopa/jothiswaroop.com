import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Blog posts live as Markdown in content/blog/<slug>.md. This module is the only reader.
 * Build-time only (fs) — every consumer is a server component or a static route.
 *
 * Front-matter contract (validated by scripts/blog/validate.mjs before anything is committed):
 *   title, description, date (YYYY-MM-DD), tags[], lane ("news" | "guide" | "receipt"),
 *   segment ("dental-uk" | "apparel" | "b2b" | "india" | "ai" | "general"), sources[] ({title,url,publisher}),
 *   faq[] ({q,a}), optional: updated, hero, draft
 */
export type Source = { title: string; url: string; publisher: string };
export type Faq = { q: string; a: string };
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  lane: "news" | "guide" | "receipt";
  segment: string;
  sources: Source[];
  faq: Faq[];
  draft?: boolean;
  html: string;
  words: number;
  minutes: number;
  headings: { depth: number; text: string; id: string }[];
};

const DIR = path.join(process.cwd(), "content", "blog");

/** gray-matter turns unquoted YAML dates into Date objects; normalise to YYYY-MM-DD. */
export const iso = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Headings get ids so the table of contents and AI engines can deep-link. */
function renderer() {
  const r = new marked.Renderer();
  const headings: Post["headings"] = [];
  r.heading = ({ text, depth }) => {
    const id = slugify(text);
    if (depth === 2 || depth === 3) headings.push({ depth, text, id });
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };
  // external links open in a new tab; internal stay in-app. Never nofollow official sources — the point is to cite them.
  r.link = ({ href, title, text }) => {
    const ext = /^https?:\/\//.test(href) && !href.includes("jothiswaroop.com");
    const t = title ? ` title="${title}"` : "";
    return ext
      ? `<a href="${href}"${t} target="_blank" rel="noopener">${text}</a>`
      : `<a href="${href}"${t}>${text}</a>`;
  };
  return { r, headings };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => getPost(f.replace(/\.md$/, "")))
    .filter((p): p is Post => !!p && !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const { r, headings } = renderer();
  const html = marked.parse(content, { renderer: r, gfm: true }) as string;
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: iso(data.date),
    updated: data.updated ? iso(data.updated) : undefined,
    tags: data.tags ?? [],
    lane: data.lane ?? "guide",
    segment: data.segment ?? "general",
    sources: data.sources ?? [],
    faq: data.faq ?? [],
    draft: !!data.draft,
    html,
    words,
    minutes: Math.max(1, Math.round(words / 220)),
    headings,
  };
}

export function related(post: Post, n = 3): Post[] {
  const all = getAllPosts().filter((p) => p.slug !== post.slug);
  const score = (p: Post) => (p.segment === post.segment ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length;
  return all.sort((a, b) => score(b) - score(a)).slice(0, n);
}

export const fmtDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
