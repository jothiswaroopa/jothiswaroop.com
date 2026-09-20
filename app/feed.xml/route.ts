import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const base = "https://jothiswaroop.com";
  const posts = getAllPosts();
  const items = posts
    .map(
      (p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${base}/blog/${p.slug}/</link>
    <guid isPermaLink="true">${base}/blog/${p.slug}/</guid>
    <pubDate>${new Date(p.date + "T06:30:00+05:30").toUTCString()}</pubDate>
    <description>${esc(p.description)}</description>
    ${p.tags.map((t) => `<category>${esc(t)}</category>`).join("")}
  </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Jothi Swaroop — Blog</title>
  <link>${base}/blog/</link>
  <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Performance marketing, AI systems and what's changing in ads and search — for founders who run the numbers.</description>
  <language>en-GB</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
