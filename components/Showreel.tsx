"use client";

import Reveal from "@/components/motion/Reveal";
import SwipeCue from "@/components/SwipeCue";
import { videos } from "@/lib/content";

import VideoTile from "@/components/VideoTile";

function Tile({ v }: { v: (typeof videos)[number] }) {
  return (
    <div className="bezel">
      <div className="bezel-core">
        <VideoTile youtubeId={v.youtubeId!} title={v.title} vertical={v.vertical} className={v.vertical ? "mx-auto max-h-[420px] w-full md:max-h-[560px]" : ""} />
        <div className={v.vertical ? "flex flex-col gap-2 p-4" : "flex items-baseline justify-between gap-4 p-4"}>
          {v.vertical && <span className="label">{v.kind}</span>}
          <div>
            <p className="text-paper">{v.title}</p>
            <p className="mt-0.5 text-sm text-paper/70">{v.client}</p>
          </div>
          {!v.vertical && <span className="label shrink-0">{v.kind}</span>}
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
      <SwipeCue target="showreel-row" count={videos.length} noun="films" className="mt-4" />
      <div id="showreel-row" className="m-scroller mt-3 grid gap-4 md:mt-5 md:grid-cols-3 lg:grid-cols-5">
        {videos.map((v) => (
          <div key={v.title} className={v.vertical ? "md:col-span-1" : "md:col-span-2"}><Tile v={v} /></div>
        ))}
      </div>
      <p className="mt-4 text-sm text-paper/60">AI-generated commercials and films, produced end to end — script, visuals, sound and cut. Tiles marked “Concept film” were made to show the craft, not for a client brief. Video plays from YouTube only after you tap.</p>
    </Reveal>
  );
}
