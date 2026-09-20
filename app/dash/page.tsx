import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

/**
 * SEO + GEO in one window. Reads public/dash/data.json (written daily by scripts/dash/collect.mjs via GitHub Actions)
 * at build time, so the page is static and needs no keys in the browser. Not indexed, not in the sitemap, not in the nav.
 */
export const metadata = { title: "Dashboard — SEO & GEO", robots: { index: false, follow: false, nocache: true }, alternates: { canonical: "/dash/" } };

type Row = { key: string; clicks?: number; impressions?: number; ctr?: number; position?: number; views?: number; visits?: number | null };
type Data = {
  generatedAt: string | null;
  gsc?: any; cloudflare?: any; bing?: any; geo?: any; coverage?: any;
  blog: { count: number; last: string | null; posts: { slug: string; title: string; date: string; lane: string; segment: string; words: number; sources: number }[] };
};

const load = (): Data => JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/dash/data.json"), "utf8"));
const n = (v?: number) => (v == null ? "—" : Math.round(v).toLocaleString("en-GB"));
const pct = (v?: number) => (v == null ? "—" : (v * 100).toFixed(1) + "%");
const pos = (v?: number) => (v == null || v === 0 ? "—" : v.toFixed(1));
const delta = (cur?: number, prev?: number, invert = false) => {
  if (cur == null || prev == null || prev === 0) return null;
  const d = ((cur - prev) / prev) * 100;
  const good = invert ? d < 0 : d > 0;
  return <span className={`mono ml-2 text-xs ${good ? "text-signal" : "text-paper/50"}`}>{d > 0 ? "+" : ""}{d.toFixed(0)}%</span>;
};

function Spark({ values, h = 44 }: { values: number[]; h?: number }) {
  if (!values.length) return null;
  const w = 240, max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-11 w-full" preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke="var(--signal)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Tile({ label, value, sub, spark, children }: { label: string; value: string; sub?: string; spark?: number[]; children?: React.ReactNode }) {
  return (
    <div className="bezel"><div className="bezel-core p-5">
      <p className="label">{label}</p>
      <p className="display mt-3 text-4xl text-paper tabular-nums">{value}{children}</p>
      {sub && <p className="mono mt-1 text-xs text-paper/50">{sub}</p>}
      {spark && <Spark values={spark} />}
    </div></div>
  );
}

function Table({ title, rows, cols }: { title: string; rows: Row[]; cols: { k: keyof Row; label: string; fmt?: (v: any) => string }[] }) {
  return (
    <section className="bezel"><div className="bezel-core p-5">
      <p className="label">{title}</p>
      {rows?.length ? (
        <table className="mt-4 w-full text-sm">
          <thead><tr className="mono text-left text-[10px] uppercase tracking-[0.12em] text-paper/45"><th className="pb-2 font-normal">{cols[0].label}</th>{cols.slice(1).map((c) => <th key={String(c.k)} className="pb-2 text-right font-normal">{c.label}</th>)}</tr></thead>
          <tbody className="divide-y hairline">
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="max-w-[260px] truncate py-2 pr-4 text-paper/85" title={r.key}>{r.key?.replace("https://jothiswaroop.com", "") || "(direct)"}</td>
                {cols.slice(1).map((c) => <td key={String(c.k)} className="py-2 text-right tabular-nums text-paper/70">{(c.fmt ?? n)(r[c.k] as any)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="mt-4 text-sm text-paper/50">No data yet.</p>}
    </div></section>
  );
}

function Err({ block, err }: { block: string; err?: string }) {
  if (!err) return null;
  return <p className="mono mt-2 text-xs text-strike">{block}: {err}</p>;
}

export default function Dash() {
  const d = load();
  const g = d.gsc && !d.gsc.error ? d.gsc : d.gsc?.stale;
  const cf = d.cloudflare && !d.cloudflare.error ? d.cloudflare : d.cloudflare?.stale;
  const geo = d.geo && !d.geo.error ? d.geo : d.geo?.stale;
  const cov = d.coverage && !d.coverage.error ? d.coverage : null;
  const clicksByPage: Record<string, number> = Object.fromEntries((g?.pages ?? []).map((r: Row) => [r.key.replace("https://jothiswaroop.com", ""), r.clicks]));

  return (
    <section className="min-h-[100svh] bg-ink pt-[96px] text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">// SEO & GEO · ONE WINDOW</p>
            <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)]">How the site is being found.</h1>
          </div>
          <p className="mono text-xs text-paper/50">{d.generatedAt ? `data as of ${new Date(d.generatedAt).toLocaleString("en-GB", { timeZone: "Asia/Kolkata" })} IST · refreshes daily 05:00` : "no collection yet — add the secrets and run the workflow"}</p>
        </div>
        <Err block="Search Console" err={d.gsc?.error} /><Err block="Cloudflare" err={d.cloudflare?.error} /><Err block="GEO" err={d.geo?.error} /><Err block="Bing" err={d.bing?.error} />

        {/* overview */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="// GOOGLE CLICKS · 28D" value={n(g?.totals?.clicks)} sub={`vs previous 28d`} spark={g?.daily?.slice(-28).map((r: Row) => r.clicks ?? 0)}>{delta(g?.totals?.clicks, g?.previous?.clicks)}</Tile>
          <Tile label="// IMPRESSIONS · 28D" value={n(g?.totals?.impressions)} sub={`CTR ${pct(g?.totals?.ctr)}`} spark={g?.daily?.slice(-28).map((r: Row) => r.impressions ?? 0)}>{delta(g?.totals?.impressions, g?.previous?.impressions)}</Tile>
          <Tile label="// AVG POSITION" value={pos(g?.totals?.position)} sub="lower is better">{delta(g?.totals?.position, g?.previous?.position, true)}</Tile>
          <Tile label="// VISITS · 30D (CLOUDFLARE)" value={n(cf?.totals?.visits)} sub={`${n(cf?.totals?.views)} page views · LCP p75 ${cf?.perf?.lcpP75 ? Math.round(cf.perf.lcpP75) + " ms" : "—"}`} spark={cf?.daily?.map((r: Row) => r.visits ?? 0)} />
        </div>

        {/* GEO */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_2fr]">
          <Tile label="// AI MENTION RATE" value={geo ? pct(geo.rate) : "—"} sub={geo ? `${geo.results.filter((r: any) => r.mentioned).length} of ${geo.results.length} tracked prompts name jothiswaroop.com` : "runs with the daily collection"} spark={geo?.history?.map((h: any) => h.rate)} />
          <section className="bezel"><div className="bezel-core p-5">
            <p className="label">// GEO TRACKER · WHAT AI ENGINES SAY</p>
            {geo?.results?.length ? (
              <ul className="mt-4 divide-y hairline text-sm">
                {geo.results.map((r: any) => (
                  <li key={r.id} className="grid gap-1 py-3 md:grid-cols-[24px_1fr_auto] md:gap-4">
                    <span className={`mono text-xs ${r.mentioned ? "text-signal" : "text-paper/35"}`}>{r.error ? "!" : r.mentioned ? "●" : "○"}</span>
                    <span><span className="text-paper/85">{r.prompt}</span>{r.competitors?.length ? <span className="mono mt-1 block text-[11px] text-paper/45">cited instead: {r.competitors.join(" · ")}</span> : null}</span>
                    <span className="mono text-[10px] uppercase tracking-[0.1em] text-paper/45">{r.segment}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4 text-sm text-paper/50">No checks yet.</p>}
          </div></section>
        </div>

        {/* search detail */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Table title="// TOP QUERIES · GOOGLE · 28D" rows={g?.queries?.slice(0, 20) ?? []} cols={[{ k: "key", label: "query" }, { k: "clicks", label: "clicks" }, { k: "impressions", label: "impr." }, { k: "position", label: "pos", fmt: pos }]} />
          <Table title="// TOP PAGES · GOOGLE · 28D" rows={g?.pages?.slice(0, 20) ?? []} cols={[{ k: "key", label: "page" }, { k: "clicks", label: "clicks" }, { k: "impressions", label: "impr." }, { k: "ctr", label: "ctr", fmt: pct }]} />
          <Table title="// REFERRERS · CLOUDFLARE · 30D" rows={cf?.referrers ?? []} cols={[{ k: "key", label: "source" }, { k: "visits", label: "visits" }, { k: "views", label: "views" }]} />
          <Table title="// COUNTRIES · GOOGLE · 28D" rows={g?.countries ?? []} cols={[{ k: "key", label: "country" }, { k: "clicks", label: "clicks" }, { k: "impressions", label: "impr." }]} />
          {d.bing && !d.bing.error && <Table title="// TOP QUERIES · BING" rows={d.bing.queries ?? []} cols={[{ k: "key", label: "query" }, { k: "clicks", label: "clicks" }, { k: "impressions", label: "impr." }, { k: "position", label: "pos", fmt: pos }]} />}
          <section className="bezel"><div className="bezel-core p-5">
            <p className="label">// INDEX COVERAGE</p>
            <p className="display mt-3 text-4xl tabular-nums">{cov ? `${cov.ok}/${cov.total}` : "—"}</p>
            <p className="mono mt-1 text-xs text-paper/50">sitemap URLs returning 200</p>
            {cov?.broken?.length ? <ul className="mono mt-3 text-xs text-strike">{cov.broken.map((b: any) => <li key={b.url}>{b.status} {b.url}</li>)}</ul> : null}
          </div></section>
        </div>

        {/* blog */}
        <section className="bezel mt-4"><div className="bezel-core p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="label">// BLOG · {d.blog.count} POSTS{d.blog.last ? ` · LAST ${d.blog.last}` : ""}</p>
            <Link href="/blog/" className="underline-slide text-sm text-paper/70">Open blog →</Link>
          </div>
          {d.blog.posts.length ? (
            <table className="mt-4 w-full text-sm">
              <thead><tr className="mono text-left text-[10px] uppercase tracking-[0.12em] text-paper/45"><th className="pb-2 font-normal">post</th><th className="pb-2 font-normal">lane</th><th className="pb-2 text-right font-normal">words</th><th className="pb-2 text-right font-normal">sources</th><th className="pb-2 text-right font-normal">google clicks 28d</th></tr></thead>
              <tbody className="divide-y hairline">
                {d.blog.posts.map((p) => (
                  <tr key={p.slug}>
                    <td className="py-2 pr-4"><Link href={`/blog/${p.slug}/`} className="text-paper/85 hover:text-signal">{p.title}</Link><span className="mono ml-2 text-[10px] text-paper/40">{p.date}</span></td>
                    <td className="mono py-2 text-[10px] uppercase tracking-[0.1em] text-paper/50">{p.lane} · {p.segment}</td>
                    <td className="py-2 text-right tabular-nums text-paper/70">{n(p.words)}</td>
                    <td className="py-2 text-right tabular-nums text-paper/70">{p.sources}</td>
                    <td className="py-2 text-right tabular-nums text-paper/70">{n(clicksByPage[`/blog/${p.slug}/`] ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="mt-4 text-sm text-paper/50">No posts yet. The generator runs every two days at 06:30 IST.</p>}
        </div></section>

        <p className="mono mt-10 text-xs text-paper/40">Sources: Google Search Console API · Cloudflare Web Analytics GraphQL · Bing Webmaster API · GEO checks via Claude + web search · sitemap HEAD checks. Collected by .github/workflows/dash.yml.</p>
      </div>
    </section>
  );
}
