import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import CopyText from "@/components/CopyText";

/**
 * The LinkedIn review queue. Reads public/dash/linkedin.json, written each weekday morning by
 * scripts/linkedin/generate.mjs via GitHub Actions. Nothing here posts anything — Jothi reads,
 * edits one line, copies, posts.
 */
export const metadata = {
  title: "LinkedIn queue",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/dash/linkedin/" },
};

type Post = {
  date: string; weekday: string; pillar: string; format: string; angle: string;
  hook: string; body: string; chars: number; avgWords?: number; warnings: string[];
  slides?: { text: string }[]; images?: string[]; isSales?: boolean;
  sources?: { title: string; url: string; publisher: string }[]; status: string;
  autopostSafe?: boolean; heldBecause?: string[] | string | null; postedAt?: string;
  notPosted?: string; tokenExpired?: boolean; videoPrompt?: string | null;
};
type Queue = { generated: string; posts: Post[] };
type Change = { date: string; findings: string[]; applied: { key: string; from: number; to: number; reason: string }[]; forReview: string[]; dropTopics?: string[] };
type Learning = { generated: string; changes: Change[] };

const load = (): Queue | null => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/dash/linkedin.json"), "utf8"));
  } catch {
    return null;
  }
};

const loadLearning = (): Learning | null => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/dash/linkedin-learning.json"), "utf8"));
  } catch {
    return null;
  }
};

const PILLAR: Record<string, string> = {
  trending: "What changed this week, then what to do about it",
  carousel: "Teaching value, built to be swiped",
  framework: "A named method, handed over whole",
  proof: "Your own totals, and what they taught you",
  receipt: "A real number from your own accounts",
  teach: "Give away one complete method",
  teardown: "A live ad, what's wrong with it",
  build: "An automation you actually built",
  contrarian: "A belief your numbers contradict",
  story: "A human moment from the work",
};

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export default function LinkedInQueue() {
  const q = load();
  const learning = loadLearning();
  const posts = q?.posts ?? [];
  const today = posts[0];

  return (
    <section className="min-h-[100svh] pt-[96px]">
      <div className="mx-auto max-w-[900px] px-5 py-16 md:px-10 md:py-20">
        <p className="label">{"// LINKEDIN QUEUE"}</p>
        <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)]">One post a weekday.</h1>
        <p className="mt-4 max-w-2xl text-paper/75">
          Drafted at 06:00 IST, Monday to Friday. Read it, change one line so it&apos;s yours, copy, post.
          Nothing here posts by itself — that is on purpose.
        </p>

        <div className="bezel mt-8">
          <div className="bezel-core border-l-2 border-signal p-5 md:p-6">
            <p className="label text-signal">{"// READ THIS EVERY TIME"}</p>
            <p className="mt-3 text-paper/85">
              The draft invents narrative detail. It cannot know what actually broke, which day it
              happened, or what a client really said &mdash; it only knows the figures it was given.
              <strong className="text-paper"> Every story in the post is a guess until you confirm it.</strong>{" "}
              Rewrite anything that isn&apos;t true from memory. The numbers are checked against your
              receipts automatically; the anecdotes are not, and cannot be.
            </p>
          </div>
        </div>

        <div className="bezel mt-4">
          <div className="bezel-core border-l-2 border-signal p-5 md:p-6">
            <p className="label text-signal">{"// THE HIGHEST-LEVERAGE THING ON THIS PAGE"}</p>
            <p className="mt-3 text-lg text-paper">20 connection requests a day. Founders, not marketers.</p>
            <p className="mt-3 text-paper/80">
              LinkedIn shows a post to your own network first, then decides whether to push it wider.
              So who you are connected to decides who ever sees your work. Right now that is mostly
              other marketers, and other marketers will never pay you.
            </p>
            <p className="mt-3 text-paper/80">
              Search apparel founders, D2C owners, clinic owners, manufacturers &mdash; the people whose
              ad accounts you would want. Twenty a day, no pitch, no note or one line about their business.
              That is 600 a month, and it permanently changes who every future post reaches.
            </p>
            <p className="mt-3 text-sm text-paper/60">
              Boring, unglamorous, and worth more than the content. Do it while your coffee is brewing.
            </p>
          </div>
        </div>

        <div className="bezel mt-4">
          <div className="bezel-core p-5 md:p-6">
            <p className="label">{"// THE WEEK"}</p>
            <ul className="mt-3 grid gap-2 text-sm text-paper/80 sm:grid-cols-2">
              <li><span className="mono text-signal">MON</span> &nbsp;<strong className="text-paper">Text</strong> &mdash; what changed in AI or ads, then what to do about it</li>
              <li><span className="mono text-signal">TUE</span> &nbsp;<strong className="text-paper">Carousel</strong> &mdash; a named framework, handed over whole</li>
              <li><span className="mono text-signal">WED</span> &nbsp;<strong className="text-paper">Text</strong> &mdash; one complete method, given away</li>
              <li><span className="mono text-signal">THU</span> &nbsp;<strong className="text-paper">Carousel</strong> &mdash; your own numbers; the one day a free thing is mentioned</li>
              <li><span className="mono text-signal">FRI</span> &nbsp;<strong className="text-paper">Poster</strong> &mdash; an argument worth having. Every fourth Friday, a film instead.</li>
            </ul>
            <p className="mt-3 text-sm text-paper/60">
              The content never sells &mdash; your profile does. Four days ask for nothing at all. One day
              mentions something free, once, as help. The bot refuses to write a call to action on any
              other day.
            </p>
            <p className="mt-2 text-sm text-paper/60">
              The mix is from 2026 platform benchmarks, not preference. Carousels lead on engagement
              (~7%) and give the best reach for an account under 50,000 followers &mdash; two days a week.
              Text engages least (~4%) but draws the most comments, and comments are what start
              conversations &mdash; two days. One poster (~5%). Polls are excluded entirely: highest reach
              on LinkedIn, lowest engagement, and poll voters rarely look at your profile.
            </p>
            <p className="mt-2 text-sm text-paper/60">
              No client&apos;s ad account is ever discussed &mdash; not their settings, not their campaigns,
              named or not. Only patterns, methods, and your own totals.
            </p>
            <p className="mt-2 text-sm text-paper/60">
              News days never stop at the news. Four hundred accounts post the same announcement within
              a day; being fast is not being expert. Every trending post has to land on what you&apos;d
              actually change in an account you run.
            </p>
          </div>
        </div>

        <div className="bezel mt-4">
          <div className="bezel-core p-5 md:p-6">
            <p className="label">{"// YOUR DAY — ABOUT 30 MINUTES"}</p>
            <p className="mt-3 text-sm text-paper/70">
              The bot writes. This is the half that decides whether anyone sees it.
            </p>

            <p className="mono mt-5 text-[11px] uppercase tracking-[0.14em] text-signal">Before &mdash; 15 min</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-paper/80">
              <li><strong className="text-paper">Read the draft properly.</strong> It goes out under your name. Check every claim about what you did or saw &mdash; the bot cannot verify those, only the numbers.</li>
              <li><strong className="text-paper">Change one line</strong> so the voice is yours.</li>
              <li><strong className="text-paper">Comment on five posts</strong> from founders in your segments. Two useful sentences, no pitch.</li>
              <li><strong className="text-paper">20 connection requests</strong> to founders, not marketers.</li>
            </ol>

            <p className="mono mt-5 text-[11px] uppercase tracking-[0.14em] text-signal">Post &mdash; 10:00 to 11:30 IST</p>
            <p className="mt-2 text-sm text-paper/80">
              Published analyses agree on mid-morning, Tuesday to Thursday &mdash; that window carries
              the bulk of B2B engagement, and weekday posts far outperform weekend ones. Your network is
              mostly Indian today, and early engagement from your own network is what decides whether
              LinkedIn pushes a post wider, so post to India time and let it travel.
            </p>
            <p className="mt-2 text-sm text-paper/60">
              Carousel? Upload the images in order as a multi-image post. Paste the caption. No link in
              the post &mdash; put any link in the first comment instead.
            </p>

            <p className="mono mt-5 text-[11px] uppercase tracking-[0.14em] text-signal">After &mdash; the first 60 minutes</p>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-paper/80">
              <li><strong className="text-paper">Stay on the app and reply to every comment</strong> within the first hour. Reply with a sentence that adds something, never just &ldquo;thanks&rdquo;. Early replies decide reach more than anything else you control.</li>
              <li>Anyone who comments twice, or views your profile: look at what they do. If they fit, message them <strong className="text-paper">about their business</strong> &mdash; never about yours.</li>
              <li>Do not edit the post in the first hour. Editing resets its distribution.</li>
              <li>At the end of the day, note which post got the most profile views. That is the signal worth following, not likes.</li>
            </ol>
          </div>
        </div>

        {!q && (
          <p className="mono mt-10 text-sm text-paper/60">
            No queue yet. The first draft lands on the next weekday morning, or trigger the{" "}
            <span className="text-paper">LinkedIn draft</span> workflow by hand.
          </p>
        )}

        {today && (
          <>
            <p className="label mt-14">{"// TODAY"}</p>
            <PostCard p={today} lead />
          </>
        )}

        {posts.length > 1 && (
          <>
            <p className="label mt-14">{"// EARLIER"}</p>
            <div className="mt-4 space-y-4">
              {posts.slice(1).map((p) => (
                <PostCard key={p.date} p={p} />
              ))}
            </div>
          </>
        )}

        {learning && learning.changes.length > 0 && (
          <>
            <p className="label mt-14">{"// WHAT IT CHANGED ABOUT ITSELF"}</p>
            <p className="mt-2 max-w-2xl text-sm text-paper/65">
              On the 1st of each month the engine reads its own failure record, researches what has
              changed on LinkedIn, and adjusts. It may move its own limits within fixed bounds.
              Anything touching your facts, your voice or the fabrication rules is listed for you to
              approve &mdash; it cannot change those by itself.
            </p>
            {learning.changes.map((c) => (
              <div key={c.date} className="bezel mt-4">
                <div className="bezel-core p-5 md:p-6">
                  <p className="label">{c.date}</p>
                  {c.findings?.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-paper/80">
                      {c.findings.map((f, i) => <li key={i}>&middot; {f}</li>)}
                    </ul>
                  )}
                  {c.applied?.length > 0 && (
                    <div className="mt-4 border-t hairline pt-3">
                      <p className="label">{"// APPLIED"}</p>
                      <ul className="mt-2 space-y-1 text-sm text-paper/75">
                        {c.applied.map((a, i) => (
                          <li key={i}>
                            <span className="mono text-signal">{a.key}</span> {a.from} &rarr; {a.to} &mdash; {a.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {c.forReview?.length > 0 && (
                    <div className="mt-4 border-t hairline pt-3">
                      <p className="label text-signal">{"// NEEDS YOUR APPROVAL"}</p>
                      <ul className="mt-2 space-y-1 text-sm text-paper/75">
                        {c.forReview.map((r, i) => <li key={i}>&middot; {r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        <p className="mono mt-14 text-xs text-paper/45">
          <Link href="/dash/" className="underline-slide">&larr; Back to the dashboard</Link>
          {q && <span className="ml-4">Queue written {new Date(q.generated).toLocaleString("en-GB", { timeZone: "Asia/Kolkata" })} IST</span>}
        </p>
      </div>
    </section>
  );
}

function PostCard({ p, lead = false }: { p: Post; lead?: boolean }) {
  return (
    <div className="bezel mt-4">
      <div className="bezel-core p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="label">{fmtDate(p.date)} &middot; {p.weekday}</span>
          <span className="mono border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-signal">{p.pillar}</span>
          {p.format === "carousel" && (
            <span className="mono border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-paper/70">carousel</span>
          )}
          {p.status === "posted" ? (
            <span className="mono border border-signal px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-signal">posted</span>
          ) : p.tokenExpired ? (
            <span className="mono border border-signal px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-signal">token expired</span>
          ) : p.autopostSafe === false ? (
            <span className="mono border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-paper/70">waiting for you</span>
          ) : p.autopostSafe === true ? (
            <span className="mono border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-paper/50">clean</span>
          ) : null}
          {p.isSales && (
            <span className="mono border border-signal px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-signal">may mention the free audit</span>
          )}
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-paper/45">{p.chars} chars</span>
        </div>

        <p className="mono mt-2 text-[11px] text-paper/50">{PILLAR[p.pillar] ?? p.pillar}</p>

        <p
          className={`mt-4 whitespace-pre-wrap ${lead ? "text-[1.05rem] text-paper" : "text-sm text-paper/85"}`}
        >
          {p.body}
        </p>

        {p.images && p.images.length > 0 && (
          <div className="mt-5 border-t hairline pt-4">
            <p className="label">
              {p.images.length > 1 ? `// ${p.images.length} SLIDES — READY TO UPLOAD` : "// POSTER — READY TO UPLOAD"}
            </p>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {p.images.map((src, i) => (
                <a key={src} href={src} target="_blank" rel="noreferrer" className="press shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Slide ${i + 1}`} width={160} height={200} className="w-[160px] border hairline" />
                </a>
              ))}
            </div>
            <p className="mono mt-2 text-[11px] text-paper/50">
              1080&times;1350 PNG. Tap one to open it full size, then save and upload in order.
            </p>
          </div>
        )}

        {p.sources && p.sources.length > 0 && (
          <div className="mt-5 border-t hairline pt-4">
            <p className="label">{"// SOURCES BEHIND THIS"}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {p.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="underline-slide text-paper/75">
                    {s.publisher}: {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {p.videoPrompt && (
          <div className="mt-5 border-t hairline pt-4">
            <p className="label text-signal">{"// VIDEO WEEK"}</p>
            <p className="mt-2 text-sm text-paper/85">{p.videoPrompt}</p>
          </div>
        )}

        {p.tokenExpired && (
          <div className="mt-5 border-t hairline pt-4">
            <p className="label text-signal">{"// LINKEDIN TOKEN EXPIRED — POST THIS ONE BY HAND"}</p>
            <p className="mt-2 text-sm text-paper/80">
              Tokens last about 60 days. Generate a new one at{" "}
              <a href="https://www.linkedin.com/developers/tools/oauth/token-generator" target="_blank" rel="noreferrer" className="underline-slide">
                linkedin.com/developers &rarr; token generator
              </a>{" "}
              and replace the <span className="mono">LINKEDIN_TOKEN</span> secret in the repo. Nothing is lost
              meanwhile &mdash; the drafts keep arriving here.
            </p>
          </div>
        )}

        {p.notPosted && !p.tokenExpired && (
          <div className="mt-5 border-t hairline pt-4">
            <p className="label">{"// NOT POSTED AUTOMATICALLY"}</p>
            <p className="mt-2 text-sm text-paper/75">{p.notPosted}</p>
          </div>
        )}

        {p.autopostSafe === false && p.heldBecause && (
          <div className="mt-5 border-t hairline pt-4">
            <p className="label text-signal">{"// HELD FOR YOU — WILL NOT AUTO-POST"}</p>
            <ul className="mt-2 space-y-1 text-sm text-paper/75">
              {(Array.isArray(p.heldBecause) ? p.heldBecause : [p.heldBecause]).map((w, i) => <li key={i}>&middot; {w}</li>)}
            </ul>
          </div>
        )}

        {p.warnings?.length > 0 && (
          <div className="mt-5 border-t hairline pt-4">
            <p className="label text-signal">{"// CHECK BEFORE POSTING"}</p>
            <ul className="mt-2 space-y-1 text-sm text-paper/70">
              {p.warnings.map((w, i) => <li key={i}>&middot; {w}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t hairline pt-4">
          <CopyText text={p.body} />
          {p.slides && <CopyText text={p.slides.map((s, i) => `${i + 1}. ${s.text}`).join("\n")} label="Copy slides" />}
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-paper/40">Edit one line so it&apos;s yours</span>
        </div>
      </div>
    </div>
  );
}
