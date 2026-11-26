"use client";

import { useEffect, useRef, useState } from "react";
import posters from "@/lib/posters.json";

// Widths made by scripts/posters.mjs for each film (our own WebP copies of the YouTube still).
const POSTERS = posters as Record<string, number[]>;

// Touch devices: no YouTube player until the visitor has moved the page — a scroll, a swipe, a wheel or a key.
// On /ai-ads/ and /films/ the films sit just under the headline, so "on screen" alone mounted two players the
// moment the page opened: 1.9MB and 2.1s of main thread before the visitor had done anything (PageSpeed,
// 18 Nov 2026: /ai-ads/ 78, TBT 760ms; /films/ 84, TBT 480ms). A tap is deliberately not on the list. A tap on a
// poster goes to the poster's own button below, and waking on it would swap that button for the player
// between the touch and its click, so the click would land on nothing.
// One set of listeners for every tile; once woken it stays woken for the rest of the visit.
const WAKE_EVENTS = ["scroll", "touchmove", "wheel", "keydown"] as const;
let woken = false;
let listening = false;
const waiting = new Set<() => void>();
function wake() {
  woken = true;
  WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake));
  waiting.forEach((f) => f());
  waiting.clear();
}
function afterFirstMove(cb: () => void): () => void {
  if (woken) { cb(); return () => {}; }
  waiting.add(cb);
  if (!listening) { listening = true; WAKE_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true })); }
  return () => { waiting.delete(cb); };
}

/** Poster first, iframe only after a tap — no third-party scripts until the visitor asks for them. */
export default function VideoTile({ youtubeId, title, vertical, poster: posterOverride, className = "" }: { youtubeId: string; title: string; vertical?: boolean; poster?: string; className?: string }) {
  const [play, setPlay] = useState(false);
  // Touch devices: a tap on the poster cannot start sound inside an iframe created by that tap (iOS Safari
  // needs the gesture inside the player), so the visitor had to tap twice. There, mount YouTube's own player
  // lazily (it loads only near the viewport) and let its play button take the one tap.
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(window.matchMedia("(pointer: coarse)").matches); }, []);
  // ...but only once the tile is actually on screen, or about to be. The iframe's own loading="lazy" was not
  // enough: Chrome widens its "near" distance on slow connections (to 3,000-4,000px), so on Indian mobile data
  // — and on PageSpeed's slow-4G phone — the homepage film carousel, ~2,500px down, mounted all eight players
  // at page open: 9.2MB of the page's 10MB and 3.8s of main thread (PageSpeed, 18 Nov 2026: mobile 59-61,
  // TBT 1,980ms). An observer measures against the real viewport and respects the carousel's clipping, so a
  // visitor loads a player only for a tile they can see. Once mounted it stays mounted, or playback would stop.
  const boxRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [moved, setMoved] = useState(false);
  useEffect(() => (touch ? afterFirstMove(() => setMoved(true)) : undefined), [touch]);
  // A poster tapped before any of that: mount the player at once, asking it to start. Android plays with sound;
  // iOS shows YouTube's player and wants its play button — the old two taps, only in this one case.
  const [tapped, setTapped] = useState(false);
  useEffect(() => {
    if (!touch || !moved || near) return;
    const el = boxRef.current;
    if (!el || !("IntersectionObserver" in window)) { setNear(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin: "300px 0px", scrollMargin: "0px 200px" } as IntersectionObserverInit);
    io.observe(el);
    return () => io.disconnect();
  }, [touch, moved, near]);
  // YouTube returns a 120px grey placeholder (HTTP 200, so onError never fires) when a size isn't ready; walk the chain on load.
  const chain = vertical ? ["oardefault", "oar2", "hq720", "hqdefault"] : ["maxresdefault", "hq720", "sddefault", "hqdefault"];
  const [pi, setPi] = useState(0);
  // A burned-in caption or a bad auto-frame can make YouTube's own still unusable; posterOverride wins.
  // Our own copy wins when scripts/posters.mjs has made one (it already honours posterOverride); the chain
  // below is the fallback for a film added since, until the next build makes its copy.
  const own = POSTERS[youtubeId];
  const poster = own ? `/img/posters/${youtubeId}-${own[0]}.webp` : posterOverride || `https://i.ytimg.com/vi/${youtubeId}/${chain[pi]}.jpg`;
  const srcSet = own?.map((w) => `/img/posters/${youtubeId}-${w}.webp ${w}w`).join(", ");
  // Drawn widths: vertical tiles are ~74vw in phone carousels and at most ~320px elsewhere; wide films span the column.
  const sizes = own ? (vertical ? "(min-width: 640px) 320px, 74vw" : "(min-width: 768px) 768px, 100vw") : undefined;
  const imgRef = useRef<HTMLImageElement>(null);
  const advance = () => { if (pi < chain.length - 1) setPi((n) => n + 1); };
  const onPoster = (e: React.SyntheticEvent<HTMLImageElement>) => { if (!own && !posterOverride && e.currentTarget.naturalWidth < 200) advance(); };
  // Static HTML: the image may be complete before React attaches onLoad — check once on mount / after each swap.
  useEffect(() => {
    const i = imgRef.current;
    if (!own && !posterOverride && i && i.complete && i.naturalWidth > 0 && i.naturalWidth < 200) advance();
  }, [pi]); // eslint-disable-line react-hooks/exhaustive-deps
  const base = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&cc_load_policy=1&playsinline=1`;
  return (
    <div ref={boxRef} className={`relative bg-stock ${vertical ? "aspect-[9/16]" : "aspect-video"} ${className}`}>
      {touch ? (
        <>
          <img src={poster} srcSet={srcSet} sizes={sizes} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          {near ? (
            <iframe src={tapped ? `${base}&autoplay=1` : base} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
          ) : (
            <button onClick={() => { setTapped(true); setNear(true); }} className="absolute inset-0 grid place-items-center" aria-label={`Play: ${title}`}>
              <span className="salmon relative grid h-14 w-14 place-items-center border border-ink">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M4 2.5v11l9-5.5z" /></svg>
              </span>
            </button>
          )}
        </>
      ) : play ? (
        <iframe src={`${base}&autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button onClick={() => setPlay(true)} className="press group absolute inset-0 grid place-items-center" aria-label={`Play: ${title}`}>
          <img ref={imgRef} src={poster} srcSet={srcSet} sizes={sizes} alt="" loading="lazy" decoding="async" onLoad={onPoster} onError={onPoster} className="absolute inset-0 h-full w-full object-cover" />
          <span className="salmon relative grid h-14 w-14 place-items-center border border-ink transition-transform duration-300 ease-out-expo group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M4 2.5v11l9-5.5z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
