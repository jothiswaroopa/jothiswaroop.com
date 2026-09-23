"use client";

import { useEffect, useRef, useState } from "react";

/** Poster first, iframe only after a tap — no third-party scripts until the visitor asks for them. */
export default function VideoTile({ youtubeId, title, vertical, poster: posterOverride, className = "" }: { youtubeId: string; title: string; vertical?: boolean; poster?: string; className?: string }) {
  const [play, setPlay] = useState(false);
  // Touch devices: a tap on the poster cannot start sound inside an iframe created by that tap (iOS Safari
  // needs the gesture inside the player), so the visitor had to tap twice. There, mount YouTube's own player
  // lazily (it loads only near the viewport) and let its play button take the one tap.
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(window.matchMedia("(pointer: coarse)").matches); }, []);
  // YouTube returns a 120px grey placeholder (HTTP 200, so onError never fires) when a size isn't ready; walk the chain on load.
  const chain = vertical ? ["oardefault", "oar2", "hq720", "hqdefault"] : ["maxresdefault", "hq720", "sddefault", "hqdefault"];
  const [pi, setPi] = useState(0);
  // A burned-in caption or a bad auto-frame can make YouTube's own still unusable; posterOverride wins.
  const poster = posterOverride || `https://i.ytimg.com/vi/${youtubeId}/${chain[pi]}.jpg`;
  const imgRef = useRef<HTMLImageElement>(null);
  const advance = () => { if (pi < chain.length - 1) setPi((n) => n + 1); };
  const onPoster = (e: React.SyntheticEvent<HTMLImageElement>) => { if (!posterOverride && e.currentTarget.naturalWidth < 200) advance(); };
  // Static HTML: the image may be complete before React attaches onLoad — check once on mount / after each swap.
  useEffect(() => {
    const i = imgRef.current;
    if (!posterOverride && i && i.complete && i.naturalWidth > 0 && i.naturalWidth < 200) advance();
  }, [pi]); // eslint-disable-line react-hooks/exhaustive-deps
  const base = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&cc_load_policy=1&playsinline=1`;
  return (
    <div className={`relative bg-ink ${vertical ? "aspect-[9/16]" : "aspect-video"} ${className}`}>
      {touch ? (
        <>
          <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-85" />
          <iframe src={base} title={title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
        </>
      ) : play ? (
        <iframe src={`${base}&autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button onClick={() => setPlay(true)} className="press group absolute inset-0 grid place-items-center" aria-label={`Play: ${title}`}>
          <img ref={imgRef} src={poster} alt="" loading="lazy" decoding="async" onLoad={onPoster} onError={onPoster} className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-signal text-ink transition-transform duration-300 ease-out-expo group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
