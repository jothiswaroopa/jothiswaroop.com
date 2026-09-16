"use client";

import { useState } from "react";
import Reveal from "@/components/motion/Reveal";
import { videos } from "@/lib/content";

/** Poster first, iframe only after a tap — no third-party scripts until the visitor asks for them. */
function Tile({ v }: { v: (typeof videos)[number] }) {
  const [play, setPlay] = useState(false);
  const yt = v.youtubeId;
  const poster = yt ? `https://i.ytimg.com/vi/${yt}/${v.vertical ? "oardefault" : "maxresdefault"}.jpg` : undefined;
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1` : v.vimeoId ? `https://player.vimeo.com/video/${v.vimeoId}?autoplay=1&title=0&byline=0` : "";
  return (
    <div className="bezel">
      <div className="bezel-core">
        <div className={`relative bg-ink ${v.vertical ? "aspect-[9/16] max-h-[560px] mx-auto w-full" : "aspect-video"}`}>
          {play ? (
            <iframe src={src} title={v.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
          ) : (
            <button onClick={() => setPlay(true)} className="press group absolute inset-0 grid place-items-center" aria-label={`Play ${v.title}`}>
              {poster && <img src={poster} alt="" onError={(e) => { const img = e.currentTarget; if (!img.src.includes("hqdefault")) img.src = `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`; }} className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100" />}
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-signal text-ink transition-transform duration-300 ease-out-expo group-hover:scale-105">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z" /></svg>
              </span>
            </button>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-4 p-4">
          <div>
            <p className="text-paper">{v.title}</p>
            <p className="mt-0.5 text-sm text-paper/70">{v.client}</p>
          </div>
          <span className="label shrink-0">{v.kind}</span>
        </div>
      </div>
    </div>
  );
}

export default function Showreel() {
  if (!videos.length) return null;
  return (
    <Reveal className="mt-16">
      <p className="label">// VIDEO & COMMERCIALS</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {videos.map((v) => (
          <div key={v.title} className={v.vertical ? "md:col-span-1" : "md:col-span-2"}><Tile v={v} /></div>
        ))}
      </div>
      <p className="mt-4 text-sm text-paper/60">AI-generated video and commercials, produced end to end. Video plays from YouTube only after you tap.</p>
    </Reveal>
  );
}
