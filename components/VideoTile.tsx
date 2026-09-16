"use client";

import { useState } from "react";

/** Poster first, iframe only after a tap — no third-party scripts until the visitor asks for them. */
export default function VideoTile({ youtubeId, title, vertical, className = "" }: { youtubeId: string; title: string; vertical?: boolean; className?: string }) {
  const [play, setPlay] = useState(false);
  const poster = `https://i.ytimg.com/vi/${youtubeId}/${vertical ? "oardefault" : "maxresdefault"}.jpg`;
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`;
  return (
    <div className={`relative bg-ink ${vertical ? "aspect-[9/16]" : "aspect-video"} ${className}`}>
      {play ? (
        <iframe src={src} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button onClick={() => setPlay(true)} className="press group absolute inset-0 grid place-items-center" aria-label={`Play: ${title}`}>
          <img src={poster} alt="" onError={(e) => { const i = e.currentTarget; if (!i.src.includes("hqdefault")) i.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`; }} className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-signal text-ink transition-transform duration-300 ease-out-expo group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
