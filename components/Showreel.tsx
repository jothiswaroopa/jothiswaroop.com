"use client";

import Reveal from "@/components/motion/Reveal";
import { videos } from "@/lib/content";

import VideoTile from "@/components/VideoTile";

function Tile({ v }: { v: (typeof videos)[number] }) {
  return (
    <div className="bezel">
      <div className="bezel-core">
        <VideoTile youtubeId={v.youtubeId!} title={v.title} vertical={v.vertical} className={v.vertical ? "mx-auto max-h-[560px] w-full" : ""} />
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
