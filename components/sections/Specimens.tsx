import { aiAds, videos, type Video } from "@/lib/content";
import VideoTile from "@/components/VideoTile";
import CropMarks from "@/components/CropMarks";
import HScroller from "@/components/HScroller";
import Button from "@/components/Button";

/** Films as a test strip: each inside printer's crop marks, numbered against the size of the strip. */
export function SpecimenStrip({ films, className = "" }: { films: Video[]; className?: string }) {
  return (
    <HScroller hint={`${films.length} films`} className={className}>
      {films.map((v, i) => (
        <figure key={v.title} className="w-[68vw] shrink-0 snap-start px-[22px] pt-[26px] sm:w-[280px]">
          <div className="crop">
            <CropMarks />
            <div className="border border-ink">
              <VideoTile youtubeId={v.youtubeId!} poster={v.poster} title={v.title} vertical={v.vertical} />
            </div>
          </div>
          <figcaption className="mt-8">
            <p className="font-semibold">{v.title}</p>
            <p className="text-sm">{v.client}</p>
            <p className="mt-1 text-sm">{v.kind}, {i + 1} of {films.length}</p>
          </figcaption>
        </figure>
      ))}
    </HScroller>
  );
}

/**
 * The specimens: eight films set as a test strip, each inside printer's crop marks. Eight is the size of
 * one month's Growth plan, so the strip is also what the reader would be buying. Client films come first.
 */
export default function Specimens() {
  const films = aiAds.films.map((t) => videos.find((v) => v.title === t)).filter((v): v is Video => !!v);
  return (
    <section id="films" className="relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="scotch" aria-hidden />
        <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <h2 className="text-[clamp(1.75rem,4.6vw,4.25rem)] lg:col-span-7">AI commercials and UGC-style ads.</h2>
          <p className="max-w-[34rem] text-lg lg:col-span-5 lg:pt-3">{aiAds.sub}</p>
        </div>

        <span id="showreel-row" className="block" aria-hidden />
        <SpecimenStrip films={films} className="mt-8" />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-ink pt-6">
          <p className="max-w-2xl text-[0.9375rem]">Eight films, the size of one month&apos;s Growth plan. Tiles marked concept were made to show the craft, not for a client brief. Video plays from YouTube only after you tap.</p>
          <Button href="/films/" variant="quiet">The full reel, {videos.length} films</Button>
        </div>
      </div>
    </section>
  );
}
